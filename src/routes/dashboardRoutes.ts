import { Router } from 'express';
import { getTutorDashboard, getStudentDashboard, getParentDashboard } from '../controllers/dashboardController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/tutor', authenticate, authorize([Role.TUTOR]), getTutorDashboard);
router.get('/student', authenticate, authorize([Role.STUDENT]), getStudentDashboard);
router.get('/parent', authenticate, authorize([Role.PARENT]), getParentDashboard);

export default router;
