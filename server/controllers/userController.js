// server/controllers/userController.js
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Deck from '../models/Deck.js';
import Notification from '../models/Notification.js';

// get current logged-in user
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error('getMe error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// list all investors (founders may want to grant access)
export const listInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: 'investor' }).select('-password');
    res.json(investors);
  } catch (err) {
    console.error('listInvestors error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// list all founders (optional, for investors to discover)
export const listFounders = async (req, res) => {
  try {
    const founders = await User.find({ role: 'founder' }).select('-password');
    res.json(founders);
  } catch (err) {
    console.error('listFounders error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get unread feedback + view notifications for founder's decks (combined)
export const getNotifications = async (req, res) => {
  try {
    // find decks owned by this founder
    const decks = await Deck.find({ founder: req.user._id }).select('_id title');
    const deckIds = decks.map(d => d._id);

    // unread feedbacks
    const feedbacks = await Feedback.find({ deck: { $in: deckIds }, isRead: false })
      .populate('deck', 'title founder')
      .populate('investor', 'name email')
      .sort({ createdAt: -1 });

    // unread view notifications
    const viewNotifs = await Notification.find({ deck: { $in: deckIds }, isRead: false })
      .populate('deck', 'title founder')
      .populate('actor', 'name email') // actor is the investor who viewed
      .sort({ createdAt: -1 });

    // normalize into a common list with a `kind` field for client
    const normalized = [
      ...feedbacks.map(f => ({
        _id: f._id,
        kind: 'feedback',
        deck: f.deck,
        actor: f.investor,
        comment: f.comment,
        createdAt: f.createdAt,
      })),
      ...viewNotifs.map(n => ({
        _id: n._id,
        kind: 'view',
        deck: n.deck,
        actor: n.actor,
        message: n.message,
        createdAt: n.createdAt,
      }))
    ];

    // Sort combined list by createdAt descending
    normalized.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ count: normalized.length, notifications: normalized });
  } catch (err) {
    console.error('getNotifications error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Mark a notification (feedback OR view notification) as read
export const markNotificationRead = async (req, res) => {
  try {
    const { feedbackId } = req.params; // param name kept for backward compatibility

    // Try to find and mark a Feedback first
    let feedback = await Feedback.findById(feedbackId).populate('deck', 'founder');
    if (feedback) {
      if (!feedback.deck.founder.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
      feedback.isRead = true;
      feedback.readAt = new Date();
      await feedback.save();
      return res.json({ message: 'Marked feedback read', id: feedback._id, kind: 'feedback' });
    }

    // Otherwise try Notification
    let notif = await Notification.findById(feedbackId).populate('deck', 'founder');
    if (notif) {
      if (!notif.deck.founder.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
      notif.isRead = true;
      notif.readAt = new Date();
      await notif.save();
      return res.json({ message: 'Marked notification read', id: notif._id, kind: 'notification' });
    }

    return res.status(404).json({ message: 'Not found' });
  } catch (err) {
    console.error('markNotificationRead error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
