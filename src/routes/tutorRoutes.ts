import express from 'express';
import { getTodaySessions, submitSessionFeedback } from '../controllers/tutorController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/today-sessions', authenticate, authorize([Role.TUTOR]), getTodaySessions);
router.post('/session/:id/feedback', authenticate, authorize([Role.TUTOR]), submitSessionFeedback);

export default router;
