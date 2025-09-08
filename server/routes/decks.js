import express from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import { uploadDeck, listDecks, viewDeck, grantAccess, addFeedback } from '../controllers/deckController.js';

const router = express.Router();

router.post('/upload', protect, requireRole('founder'), upload.single('file'), uploadDeck);
router.get('/', protect, listDecks);
router.get('/:id/view', protect, viewDeck);
router.post('/:id/grant', protect, requireRole('founder'), grantAccess);
router.post('/:id/feedback', protect, addFeedback);

export default router;
