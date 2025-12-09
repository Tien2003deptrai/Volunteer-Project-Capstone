import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  duty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Duty',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const Group = mongoose.model('Group', groupSchema);

