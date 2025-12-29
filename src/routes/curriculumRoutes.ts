import { Router } from 'express';
import {
    createSubject,
    createLevel,
    createCourse,
    createModule,
    createWeek,
    createLessonPlan,
    getSubjects,
} from '../controllers/curriculumController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
    createSubjectSchema,
    createLevelSchema,
    createCourseSchema,
    createModuleSchema,
    createWeekSchema,
    createLessonPlanSchema,
} from '../schemas/curriculumSchemas';
import { Role } from '@prisma/client';

const router = Router();

// Public or Protected Read
router.get('/subjects', authenticate, getSubjects);

// Admin Only Write
router.post('/subjects', authenticate, authorize([Role.ADMIN]), validate(createSubjectSchema), createSubject);
router.post('/levels', authenticate, authorize([Role.ADMIN]), validate(createLevelSchema), createLevel);
router.post('/courses', authenticate, authorize([Role.ADMIN]), validate(createCourseSchema), createCourse);
router.post('/modules', authenticate, authorize([Role.ADMIN]), validate(createModuleSchema), createModule);
router.post('/weeks', authenticate, authorize([Role.ADMIN]), validate(createWeekSchema), createWeek);
router.post('/lesson-plans', authenticate, authorize([Role.ADMIN]), validate(createLessonPlanSchema), createLessonPlan);

export default router;
