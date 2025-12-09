import { Notification } from "../models/notification_model.js";
import { User } from "../models/user_model.js";

// Create notification
export const createNotification = async (userId, type, data) => {
  try {
    let title = '';
    let message = '';

    switch (type) {
      case 'friend_request':
        title = 'New Friend Request';
        message = `${data.requesterName} wants to be your friend`;
        break;
      case 'friend_accepted':
        title = 'Friend Request Accepted';
        message = `${data.accepterName} accepted your friend request`;
        break;
      case 'message':
        title = 'New Message';
        message = `${data.senderName} sent you a message`;
        break;
      case 'application_accepted':
        title = 'Application Accepted';
        message = `Your application for ${data.dutyTitle} has been accepted`;
        break;
      case 'application_rejected':
        title = 'Application Rejected';
        message = `Your application for ${data.dutyTitle} has been rejected`;
        break;
      default:
        return null;
    }

    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      relatedUser: data.relatedUser,
      relatedDuty: data.relatedDuty,
      relatedFriend: data.relatedFriend,
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Get notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.id;
    const { limit = 50, unreadOnly = false } = req.query;

    let query = { user: userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate('relatedUser', 'fullname email profile.profilePhoto')
      .populate('relatedFriend')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false
    });

    return res.status(200).json({
      notifications,
      unreadCount,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to get notifications",
      success: false,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    return res.status(200).json({
      message: "Notification marked as read",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to mark notification as read",
      success: false,
    });
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.id;

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    );

    return res.status(200).json({
      message: "All notifications marked as read",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to mark all as read",
      success: false,
    });
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.id;
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: userId
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Notification deleted",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete notification",
      success: false,
    });
  }
};

// SSE endpoint for real-time notifications
export const notificationSSE = async (req, res) => {
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

    // Track sent notification IDs to avoid duplicates
    const sentNotificationIds = new Set();

    // Set up interval to check for new notifications
    const checkInterval = setInterval(async () => {
      try {
        const unreadNotifications = await Notification.find({
          user: userId,
          read: false
        })
          .populate('relatedUser', 'fullname email profile.profilePhoto')
          .populate('relatedFriend')
          .sort({ createdAt: -1 })
          .limit(10);

        if (unreadNotifications.length > 0) {
          for (const notif of unreadNotifications) {
            // Only send if not already sent
            if (!sentNotificationIds.has(notif._id.toString())) {
              res.write(`data: ${JSON.stringify({ type: 'new_notification', notification: notif })}\n\n`);
              sentNotificationIds.add(notif._id.toString());
            }
          }
        }
      } catch (error) {
        console.error('SSE notification error:', error);
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

