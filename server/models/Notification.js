// server/models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who viewed
  type: { type: String, enum: ['view','custom'], default: 'view' },
  message: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
