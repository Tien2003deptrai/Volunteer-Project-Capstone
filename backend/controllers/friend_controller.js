import { Friend } from "../models/friend_model.js";
import { User } from "../models/user_model.js";
import { createNotification } from "./notification_controller.js";

// Send friend request or accept
export const followUser = async (req, res) => {
  try {
    const requesterId = req.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        message: "Recipient ID is required",
        success: false,
      });
    }

    if (requesterId === recipientId) {
      return res.status(400).json({
        message: "Cannot follow yourself",
        success: false,
      });
    }

    // Check if relationship already exists
    let friendship = await Friend.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId }
      ]
    });

    if (friendship) {
      if (friendship.status === 'accepted') {
        return res.status(400).json({
          message: "Already friends",
          success: false,
        });
      }
      if (friendship.status === 'pending' && friendship.requester.toString() === requesterId) {
        return res.status(400).json({
          message: "Friend request already sent",
          success: false,
        });
      }
      // If pending and recipient is accepting
      if (friendship.status === 'pending' && friendship.recipient.toString() === requesterId) {
        friendship.status = 'accepted';
        await friendship.save();

        // Create notification for requester
        const recipient = await User.findById(recipientId);
        await createNotification(requesterId, 'friend_accepted', {
          accepterName: recipient.fullname,
          relatedUser: recipientId,
          relatedFriend: friendship._id
        });

        return res.status(200).json({
          message: "Friend request accepted",
          success: true,
          friendship
        });
      }
    }

    // Create new friend request
    friendship = await Friend.create({
      requester: requesterId,
      recipient: recipientId,
      status: 'pending'
    });

    // Create notification for recipient
    const requester = await User.findById(requesterId);
    await createNotification(recipientId, 'friend_request', {
      requesterName: requester.fullname,
      relatedUser: requesterId,
      relatedFriend: friendship._id
    });

    return res.status(201).json({
      message: "Friend request sent",
      success: true,
      friendship
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to send friend request",
      success: false,
    });
  }
};

// Unfollow/Remove friend
export const unfollowUser = async (req, res) => {
  try {
    const userId = req.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({
        message: "Friend ID is required",
        success: false,
      });
    }

    const friendship = await Friend.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId }
      ]
    });

    if (!friendship) {
      return res.status(404).json({
        message: "Friendship not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Unfollowed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to unfollow",
      success: false,
    });
  }
};

// Get friends list
export const getFriends = async (req, res) => {
  try {
    const userId = req.id;

    const friendships = await Friend.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' }
      ]
    })
      .populate('requester', 'fullname email profile.profilePhoto')
      .populate('recipient', 'fullname email profile.profilePhoto')
      .sort({ updatedAt: -1 });

    // Extract friend users
    const friends = friendships.map(friendship => {
      if (friendship.requester._id.toString() === userId) {
        return friendship.recipient;
      } else {
        return friendship.requester;
      }
    });

    return res.status(200).json({
      friends,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get friends",
      success: false,
    });
  }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.id;
    const { friendId } = req.body;

    if (!friendId) {
      return res.status(400).json({
        message: "Friend ID is required",
        success: false,
      });
    }

    const friendship = await Friend.findOne({
      $or: [
        { requester: friendId, recipient: userId, status: 'pending' },
        { requester: userId, recipient: friendId, status: 'pending' }
      ]
    });

    if (!friendship) {
      return res.status(404).json({
        message: "Friend request not found",
        success: false,
      });
    }

    // Check if user is the recipient
    if (friendship.recipient.toString() !== userId) {
      return res.status(403).json({
        message: "You can only accept requests sent to you",
        success: false,
      });
    }

    friendship.status = 'accepted';
    await friendship.save();

    // Create notification for requester
    const accepter = await User.findById(userId);
    await createNotification(friendship.requester, 'friend_accepted', {
      accepterName: accepter.fullname,
      relatedUser: userId,
      relatedFriend: friendship._id
    });

    return res.status(200).json({
      message: "Friend request accepted",
      success: true,
      friendship
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to accept friend request",
      success: false,
    });
  }
};

// Check friendship status
export const getFriendshipStatus = async (req, res) => {
  try {
    const userId = req.id;
    const { otherUserId } = req.params;

    const friendship = await Friend.findOne({
      $or: [
        { requester: userId, recipient: otherUserId },
        { requester: otherUserId, recipient: userId }
      ]
    });

    if (!friendship) {
      return res.status(200).json({
        status: null,
        success: true,
      });
    }

    let relationship = friendship.status;
    if (friendship.status === 'pending') {
      relationship = friendship.requester.toString() === userId ? 'pending_sent' : 'pending_received';
    }

    return res.status(200).json({
      status: relationship,
      friendship,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get friendship status",
      success: false,
    });
  }
};

