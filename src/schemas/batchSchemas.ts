import { z } from 'zod';

export const createBatchSchema = z.object({
    body: z.object({
        courseId: z.string().uuid(),
        tutorId: z.string().uuid(),
        name: z.string(),
        scheduleConfig: z.any(), // Refine later
        startDate: z.string().datetime(), // ISO Date string
        endDate: z.string().datetime().optional(),
    }),
});

export const enrollStudentSchema = z.object({
    batchId: z.string().uuid({ message: "Invalid batch ID" }),
    studentId: z.string().uuid({ message: "Invalid student ID" }),
});

