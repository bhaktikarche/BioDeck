// server/models/Feedback.js
import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck' },
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  isRead: { type: Boolean, default: false }, // new
  readAt: { type: Date, default: null },     // new
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', feedbackSchema);
