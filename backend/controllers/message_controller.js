import { Message } from "../models/message_model.js";
import { Conversation } from "../models/conversation_model.js";
import { Friend } from "../models/friend_model.js";
import mongoose from "mongoose";

// Get or create conversation
const getOrCreateConversation = async (userId1, userId2) => {
  // Check if users are friends
  const friendship = await Friend.findOne({
    $or: [
      { requester: userId1, recipient: userId2, status: 'accepted' },
      { requester: userId2, recipient: userId1, status: 'accepted' }
    ]
  });

  if (!friendship) {
    throw new Error("Users must be friends to message");
  }

  // Convert to ObjectId - ensure both are ObjectId instances
  const id1 = mongoose.Types.ObjectId.isValid(userId1)
    ? new mongoose.Types.ObjectId(userId1)
    : userId1;
  const id2 = mongoose.Types.ObjectId.isValid(userId2)
    ? new mongoose.Types.ObjectId(userId2)
    : userId2;

  // Ensure both are ObjectId instances for consistent comparison
  const objId1 = id1 instanceof mongoose.Types.ObjectId ? id1 : new mongoose.Types.ObjectId(id1);
  const objId2 = id2 instanceof mongoose.Types.ObjectId ? id2 : new mongoose.Types.ObjectId(id2);

  // Find conversation - participants array contains both users
  let conversation = await Conversation.findOne({
    participants: { $all: [objId1, objId2], $size: 2 }
  });

  // If not found, try reverse order (in case pre-save hook didn't run)
  if (!conversation) {
    conversation = await Conversation.findOne({
      participants: { $all: [objId2, objId1], $size: 2 }
    });
  }

  if (!conversation) {
    // Sort participants to ensure consistent ordering (pre-save hook will also sort)
    const participants = [objId1, objId2].sort((a, b) => {
      const aStr = a.toString();
      const bStr = b.toString();
      return aStr.localeCompare(bStr);
    });

    try {
      // Try to create with sorted participants
      conversation = await Conversation.create({
        participants: participants
      });
    } catch (error) {
      // If duplicate key error (race condition or old unique index), try to find again
      if (error.code === 11000 || error.message?.includes('duplicate')) {
        // Try both orders again
        conversation = await Conversation.findOne({
          participants: { $all: [objId1, objId2], $size: 2 }
        });
        if (!conversation) {
          conversation = await Conversation.findOne({
            participants: { $all: [objId2, objId1], $size: 2 }
          });
        }
        if (!conversation) {
          throw new Error("Failed to create conversation: duplicate key error and conversation not found");
        }
      } else {
        throw error;
      }
    }
  }

  return conversation;
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const { recipientId, content } = req.body;

    if (!recipientId || !content) {
      return res.status(400).json({
        message: "Recipient ID and content are required",
        success: false,
      });
    }

    const conversation = await getOrCreateConversation(senderId, recipientId);

    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      content: content.trim()
    });

    // Update conversation last message
    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'fullname email profile.profilePhoto');

    return res.status(201).json({
      message: populatedMessage,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message || "Failed to send message",
      success: false,
    });
  }
};

// Get conversations list
export const getConversations = async (req, res) => {
  try {
    const userId = req.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'fullname email profile.profilePhoto')
      .populate('lastMessage')
      .sort({ lastMessageAt: -1, updatedAt: -1 });

    // Format conversations
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(p => p._id.toString() !== userId);
      const lastMsg = conv.lastMessage;

      return {
        _id: conv._id,
        user: otherUser,
        lastMessage: lastMsg ? {
          content: lastMsg.content,
          time: lastMsg.createdAt
        } : null,
        unread: 0, // Will be calculated separately
        updatedAt: conv.lastMessageAt || conv.updatedAt
      };
    });

    // Calculate unread messages for each conversation
    for (let conv of formattedConversations) {
      const unreadCount = await Message.countDocuments({
        conversation: conv._id,
        sender: { $ne: userId },
        read: false
      });
      conv.unread = unreadCount;
    }

    return res.status(200).json({
      conversations: formattedConversations,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get conversations",
      success: false,
    });
  }
};

// Get messages for a conversation
export const getMessages = async (req, res) => {
  try {
    const userId = req.id;
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
        success: false,
      });
    }

    // Check if user is part of conversation
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        message: "Access denied",
        success: false,
      });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'fullname email profile.profilePhoto')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    return res.status(200).json({
      messages,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get messages",
      success: false,
    });
  }
};

// SSE endpoint for real-time messages
export const messageSSE = async (req, res) => {
  try {
    const userId = req.id;

    // Get origin from request for CORS
    const origin = req.headers.origin || 'http://localhost:5173';

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', userId })}\n\n`);

    // Track sent message IDs to avoid duplicates
    const sentMessageIds = new Set();

    // Set up interval to check for new messages
    const checkInterval = setInterval(async () => {
      try {
        // Get unread messages for user
        const conversations = await Conversation.find({
          participants: userId
        });

        for (const conv of conversations) {
          const unreadMessages = await Message.find({
            conversation: conv._id,
            sender: { $ne: userId },
            read: false
          })
            .populate('sender', 'fullname email profile.profilePhoto')
            .sort({ createdAt: 1 })
            .limit(10);

          if (unreadMessages.length > 0) {
            for (const msg of unreadMessages) {
              // Only send if not already sent
              if (!sentMessageIds.has(msg._id.toString())) {
                res.write(`data: ${JSON.stringify({ type: 'new_message', message: msg })}\n\n`);

                // Mark as read
                msg.read = true;
                msg.readAt = new Date();
                await msg.save();

                sentMessageIds.add(msg._id.toString());
              }
            }
          }
        }
      } catch (error) {
        console.error('SSE error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      }
    }, 2000); // Check every 2 seconds

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(checkInterval);
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "SSE connection failed",
      success: false,
    });
  }
};


