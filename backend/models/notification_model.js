import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['friend_request', 'friend_accepted', 'message', 'application_accepted', 'application_rejected'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedDuty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Duty'
  },
  relatedFriend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Friend'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);

