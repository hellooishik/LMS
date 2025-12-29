import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const getTutorDashboard = async (req: AuthRequest, res: Response) => {
    // Stub
    res.json({ message: "Tutor Dashboard Stub" });
}

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
    // Stub
    res.json({ message: "Student Dashboard Stub" });
}

export const getParentDashboard = async (req: AuthRequest, res: Response) => {
    // Stub
    res.json({ message: "Parent Dashboard Stub" });
}
