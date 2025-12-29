import { z } from 'zod';

export const createBatchSchema = z.object({
    body: z.object({
        courseId: z.string().uuid(),
        tutorId: z.string().uuid(),
        name: z.string(),
        scheduleConfig: z.object({
            days: z.array(z.string()), // e.g., ["Mon", "Wed"]
            time: z.string(), // e.g., "16:00"
        }),
        startDate: z.string().datetime(), // ISO Date string
        endDate: z.string().datetime().optional(),
    }),
});
