import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const getParentDashboard = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const parentProfile = await prisma.parentProfile.findUnique({
            where: { userId },
            include: {
                students: {
                    include: {
                        student: {
                            include: {
                                enrollments: {
                                    include: {
                                        batch: true,
                                        course: {
                                            include: {
                                                level: true,
                                                provider: true
                                            }
                                        }
                                    }
                                },
                                assessments: {
                                    orderBy: { date: 'desc' },
                                    take: 5
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!parentProfile) {
            return res.status(404).json({ error: 'Parent profile not found' });
        }

        // Transform for frontend
        const dashboardData = {
            parentName: `${parentProfile.firstName} ${parentProfile.lastName}`,
            children: parentProfile.students.map(ps => {
                const s = ps.student;
                return {
                    id: s.id,
                    name: `${s.firstName} ${s.lastName}`,
                    grade: s.gradeLevel,
                    enrollments: s.enrollments.map(e => ({
                        course: `${e.course.level.name} - ${e.course.provider.name}`,
                        batch: e.batch.name,
                        status: e.status
                    })),
                    recentAssessments: s.assessments.map(a => ({
                        type: a.type,
                        skill: a.skillTag,
                        level: a.level,
                        remarks: a.remarks,
                        date: a.date
                    }))
                };
            })
        };

        res.json(dashboardData);

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch dashboard' });
    }
};
