import Deck from '../models/Deck.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';
export const uploadDeck = async (req, res) => {
  try {
    const { title, description, requiresNDA } = req.body;
    if (!req.file) return res.status(400).json({ message: 'File required' });

    const deck = await Deck.create({
      founder: req.user._id,
      title,
      description,
      filename: req.file.filename,
      originalname: req.file.originalname,
      requiresNDA: requiresNDA === 'true' || requiresNDA === true
    });

    res.json(deck);
  } catch (err) {
    console.error('uploadDeck error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listDecks = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === 'founder') {
      const decks = await Deck.find({ founder: user._id }).populate('feedbacks');
      return res.json(decks);
    } else {
      const decks = await Deck.find({
        $or: [
          { requiresNDA: false },
          { allowedInvestors: user._id }
        ]
      }).populate('founder', 'name company');
      return res.json(decks);
    }
  } catch (err) {
    console.error('listDecks error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const viewDeck = async (req, res) => {
//   try {
//     const deck = await Deck.findById(req.params.id).populate('founder', 'name company');
//     if (!deck) return res.status(404).json({ message: 'Not found' });

//     if (deck.requiresNDA && req.user.role === 'investor') {
//       const allowed = deck.allowedInvestors.some(id => id.equals(req.user._id));
//       if (!allowed) return res.status(403).json({ message: 'Access denied: NDA required or not allowed' });
//     }

//     deck.views += 1;
//     await deck.save();

//     res.json(deck);
//   } catch (err) {
//     console.error('viewDeck error', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const viewDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id).populate('founder','name company');
    if (!deck) return res.status(404).json({ message: 'Not found' });

    // If NDA required and investor not allowed and not founder -> forbid
    if (deck.requiresNDA && req.user.role === 'investor') {
      const allowed = deck.allowedInvestors.some(id => id.equals(req.user._id));
      if (!allowed) return res.status(403).json({ message: 'NDA required or not allowed' });
    }

    // increment views
    deck.views += 1;
    await deck.save();

    // Create or update a view notification for the founder when viewed by an investor (not the founder themself)
    if (req.user.role === 'investor') {
      try {
        // find existing unread view notification for same deck + actor
        const existing = await Notification.findOne({
          deck: deck._id,
          actor: req.user._id,
          type: 'view',
          isRead: false
        });

        if (existing) {
          // optionally refresh timestamp instead of creating duplicate
          existing.createdAt = new Date();
          existing.message = `${req.user.name || req.user.email} viewed your deck "${deck.title}".`;
          await existing.save();
        } else {
          // no existing unread notification — create one
          await Notification.create({
            deck: deck._id,
            actor: req.user._id,
            type: 'view',
            message: `${req.user.name || req.user.email} viewed your deck "${deck.title}".`,
            isRead: false
          });
        }
      } catch (err) {
        console.error('Failed to create/update view notification', err);
        // Don't fail the main response if notification logic errors
      }
    }

    res.json(deck);
  } catch (err) {
    console.error('viewDeck error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const grantAccess = async (req, res) => {
  try {
    const { investorId } = req.body;
    if (!investorId) return res.status(400).json({ message: 'investorId is required' });

    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Not found' });
    if (!deck.founder.equals(req.user._id)) return res.status(403).json({ message: 'Not owner' });

    if (!deck.allowedInvestors.includes(investorId)) deck.allowedInvestors.push(investorId);
    await deck.save();

    res.json(deck);
  } catch (err) {
    console.error('grantAccess error', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const addFeedback = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    // ensure deck exists
    const deck = await Deck.findById(req.params.id);
    if (!deck) return res.status(404).json({ message: 'Deck not found' });

    const feedback = await Feedback.create({
      deck: req.params.id,
      investor: req.user._id,
      comment,
      isRead: false
    });

    deck.feedbacks.push(feedback._id);
    await deck.save();

    // respond with created feedback (populated)
    const populated = await Feedback.findById(feedback._id).populate('investor', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    console.error('addFeedback error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
