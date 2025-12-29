import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
        role: z.nativeEnum(Role),
        firstName: z.string(),
        lastName: z.string(),
        // Optional fields depending on role, kept simple for now
        dateOfBirth: z.string().optional(), // ISO Date string for students
        gradeLevel: z.string().optional(),
        parentId: z.string().optional(), // For students
        bio: z.string().optional(), // For tutors
        subjects: z.array(z.string()).optional(), // For tutors
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});
