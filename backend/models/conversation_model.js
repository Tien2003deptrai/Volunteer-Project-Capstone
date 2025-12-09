import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageAt: {
    type: Date
  }
}, { timestamps: true });

// Index for faster queries (non-unique to avoid duplicate key errors)
// We handle uniqueness in application logic
conversationSchema.index({ participants: 1 });

// Pre-save hook to sort participants for consistent indexing
conversationSchema.pre('save', function (next) {
  if (this.participants && this.participants.length === 2) {
    // Sort participants by their string representation to ensure consistency
    this.participants.sort((a, b) => {
      const aId = a.toString ? a.toString() : String(a);
      const bId = b.toString ? b.toString() : String(b);
      return aId.localeCompare(bId);
    });
  }
  next();
});

export const Conversation = mongoose.model('Conversation', conversationSchema);

