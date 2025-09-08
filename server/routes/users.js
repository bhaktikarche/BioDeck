import express from 'express';
import { protect, requireRole } from '../middlewares/auth.js';
import { getMe, listInvestors, listFounders,getNotifications, markNotificationRead  } from '../controllers/userController.js';

const router = express.Router();

// current logged-in user
router.get('/me', protect, getMe);

// founders can see list of investors
router.get('/investors', protect, requireRole('founder'), listInvestors);

// investors can see list of founders (optional)
router.get('/founders', protect, requireRole('investor'), listFounders);


// notifications (founder only)
router.get('/notifications', protect, requireRole('founder'), getNotifications);
router.post('/notifications/:feedbackId/mark', protect, requireRole('founder'), markNotificationRead);
export default router;
