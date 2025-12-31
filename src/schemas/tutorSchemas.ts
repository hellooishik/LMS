import { z } from 'zod';

export const feedbackSchema = z.object({
    studentId: z.string().uuid({ message: "Invalid student ID" }),
    strengths: z.string().optional(),
    improvements: z.string().optional(),
    homeworkAssigned: z.boolean().optional(),
});
