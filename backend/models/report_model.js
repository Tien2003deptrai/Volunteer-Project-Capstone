import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  duty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Duty',
    default: null
  },
  reason: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  }
}, { timestamps: true });

export const Report = mongoose.model('Report', reportSchema);

