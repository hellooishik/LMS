import prisma from '../config/db';

export const createSubject = async (name: string, providerId: string) => {
    return await prisma.subject.create({
        data: { name, providerId },
    });
};

export const createLevel = async (name: string, ageGroup: string, subjectId: string) => {
    return await prisma.level.create({
        data: { name, ageGroup, subjectId },
    });
};

export const createCourse = async (levelId: string, providerId: string) => {
    return await prisma.course.create({
        data: { levelId, providerId },
    });
};

export const createModule = async (courseId: string, name: string, sequence: number) => {
    return await prisma.module.create({
        data: { courseId, name, sequence },
    });
};

export const createWeek = async (moduleId: string, number: number, topic?: string) => {
    return await prisma.week.create({
        data: { moduleId, number, topic },
    });
};

export const createLessonPlan = async (data: {
    weekId: string;
    objective: string;
    materials?: string[];
    tutorInstructions: string;
    homeworkTask: string;
    durationBreakdown: any;
}) => {
    return await prisma.lessonPlan.create({
        data: {
            weekId: data.weekId,
            objective: data.objective,
            materials: data.materials || [],
            tutorInstructions: data.tutorInstructions,
            homeworkTask: data.homeworkTask,
            durationBreakdown: data.durationBreakdown,
        },
    });
};

export const getSubjects = async () => {
    return await prisma.subject.findMany({ include: { levels: true } });
};
