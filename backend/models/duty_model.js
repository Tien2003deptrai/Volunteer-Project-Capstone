import mongoose from 'mongoose';

const dutySchema = new mongoose.Schema({
  tittle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{ type: String }],
  workDuration: {
    type: Number,
    required: true
  },
  experienceLevel: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  jobType: {
    type: String,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    }
  ],
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  deadline: {
    type: Date,
    default: null
  },
  images: [{
    type: String
  }],
  isOpen: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const Duty = mongoose.model('Duty', dutySchema);
