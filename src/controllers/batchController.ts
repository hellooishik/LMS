import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import * as batchService from '../services/batchService';

export const createBatch = async (req: Request, res: Response) => {
    try {
        const batch = await batchService.createBatch(req.body);

        // Future: Logic to generate Sessions based on scheduleConfig

        res.status(201).json(batch);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTutorSchedule = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const sessions = await batchService.getTutorSchedule(userId);
        res.json(sessions);
    } catch (error: any) {
        if (error.message === 'Tutor profile not found') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
};
