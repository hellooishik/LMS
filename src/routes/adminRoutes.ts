import express from 'express';
import { getCourseHealth } from '../controllers/adminController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/course-health', authenticate, authorize([Role.ADMIN]), getCourseHealth);

export default router;
