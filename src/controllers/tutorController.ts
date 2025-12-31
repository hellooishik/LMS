import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const getTodaySessions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        // Get Tutor Profile
        const tutor = await prisma.tutorProfile.findUnique({ where: { userId } });
        if (!tutor) return res.status(404).json({ error: 'Tutor not found' });

        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const sessions = await prisma.session.findMany({
            where: {
                batch: { tutorId: tutor.id },
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                batch: {
                    include: {
                        course: true
                    }
                },
                lessonPlan: true,
                attendances: true
            },
            orderBy: { date: 'asc' }
        });

        res.json(sessions);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
};

export const submitSessionFeedback = async (req: AuthRequest, res: Response) => {
    try {
        const { id: sessionId } = req.params;
        const { studentId, strengths, improvements, homeworkAssigned } = req.body;

        // Use logic to create feedback
        const feedback = await prisma.feedback.create({
            data: {
                sessionId,
                studentId,
                strengths,
                improvements,
                homeworkAssigned
            }
        });

        res.status(201).json(feedback);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};
