import express from 'express';
import { getParentDashboard } from '../controllers/parentController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = express.Router();

router.get('/dashboard', authenticate, authorize([Role.PARENT]), getParentDashboard);

export default router;
