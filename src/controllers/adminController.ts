import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCourseHealth = async (req: Request, res: Response) => {
    try {
        // Business Flow: Check active batches, enrollment counts
        const courses = await prisma.course.findMany({
            include: {
                _count: {
                    select: {
                        batches: true,
                        enrollments: true
                    }
                },
                level: true,
                provider: true
            }
        });

        const health = courses.map(c => ({
            id: c.id,
            name: `${c.level.subjectId} ${c.level.name} (${c.provider.name})`, // subjectId is raw, ideally fetch subject name
            activeBatches: c._count.batches,
            totalStudents: c._count.enrollments,
        }));

        res.json(health);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch course health' });
    }
};
