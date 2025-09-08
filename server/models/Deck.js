import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
  founder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  filename: String,
  originalname: String,
  requiresNDA: { type: Boolean, default: true },
  allowedInvestors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  views: { type: Number, default: 0 },
  feedbacks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Deck', deckSchema);
