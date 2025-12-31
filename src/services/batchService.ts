import prisma from '../config/db';

export const createBatch = async (data: {
    courseId: string;
    tutorId: string;
    name: string;
    scheduleConfig: any;
    startDate: string;
    endDate?: string;
}) => {
    return await prisma.batch.create({
        data: {
            courseId: data.courseId,
            tutorId: data.tutorId,
            name: data.name,
            scheduleConfig: data.scheduleConfig,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
        },
    });
};

export const enrollStudent = async (batchId: string, studentId: string) => {
    // Check if batch exists
    const batch = await prisma.batch.findUnique({ where: { id: batchId }, include: { course: true } });
    if (!batch) throw new Error('Batch not found');

    // Create Enrollment
    return await prisma.enrollment.create({
        data: {
            batchId,
            studentId,
            courseId: batch.courseId,
            status: 'ACTIVE',
            startDate: new Date()
        }
    });
};

export const getTutorSchedule = async (userId: string) => {
    // Find Tutor Profile ID
    const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId },
    });

    if (!tutorProfile) {
        throw new Error('Tutor profile not found');
    }

    const sessions = await prisma.session.findMany({
        where: {
            batch: {
                tutorId: tutorProfile.id,
            },
            date: {
                gte: new Date(), // Upcoming
            }
        },
        include: {
            batch: true,
            lessonPlan: true,
        },
        orderBy: {
            date: 'asc',
        }
    });

    return sessions;
};
