import { z } from 'zod';

export const createSubjectSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        providerId: z.string().uuid(),
    }),
});

export const createLevelSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        ageGroup: z.string(),
        subjectId: z.string().uuid(),
    }),
});

export const createCourseSchema = z.object({
    body: z.object({
        levelId: z.string().uuid(),
        providerId: z.string().uuid(),
    }),
});

export const createModuleSchema = z.object({
    body: z.object({
        courseId: z.string().uuid(),
        name: z.string(),
        sequence: z.number().int().positive(),
    }),
});

export const createWeekSchema = z.object({
    body: z.object({
        moduleId: z.string().uuid(),
        number: z.number().int().min(1).max(8),
        topic: z.string().optional(),
    }),
});

export const createLessonPlanSchema = z.object({
    body: z.object({
        weekId: z.string().uuid(),
        objective: z.string(),
        materials: z.array(z.string().url()).optional(),
        tutorInstructions: z.string(),
        homeworkTask: z.string(),
        durationBreakdown: z.record(z.string(), z.string()), // JSON object
    }),
});
