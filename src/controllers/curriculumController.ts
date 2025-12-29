import { Request, Response } from 'express';
import * as curriculumService from '../services/curriculumService';

export const createSubject = async (req: Request, res: Response) => {
    try {
        const { name, providerId } = req.body;
        const subject = await curriculumService.createSubject(name, providerId);
        res.status(201).json(subject);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createLevel = async (req: Request, res: Response) => {
    try {
        const { name, ageGroup, subjectId } = req.body;
        const level = await curriculumService.createLevel(name, ageGroup, subjectId);
        res.status(201).json(level);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createCourse = async (req: Request, res: Response) => {
    try {
        const { levelId, providerId } = req.body;
        const course = await curriculumService.createCourse(levelId, providerId);
        res.status(201).json(course);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createModule = async (req: Request, res: Response) => {
    try {
        const { courseId, name, sequence } = req.body;
        const module = await curriculumService.createModule(courseId, name, sequence);
        res.status(201).json(module);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createWeek = async (req: Request, res: Response) => {
    try {
        const { moduleId, number, topic } = req.body;
        const week = await curriculumService.createWeek(moduleId, number, topic);
        res.status(201).json(week);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createLessonPlan = async (req: Request, res: Response) => {
    try {
        const lessonPlan = await curriculumService.createLessonPlan(req.body);
        res.status(201).json(lessonPlan);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await curriculumService.getSubjects();
        res.json(subjects);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
