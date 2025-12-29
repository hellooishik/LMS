import { Router } from 'express';
import { createBatch, getTutorSchedule } from '../controllers/batchController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { createBatchSchema } from '../schemas/batchSchemas';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', authenticate, authorize([Role.ADMIN]), validate(createBatchSchema), createBatch);
router.get('/schedule', authenticate, authorize([Role.TUTOR]), getTutorSchedule);

export default router;
