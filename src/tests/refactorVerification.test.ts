import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import { Role } from '@prisma/client';
import { generateToken } from '../utils/jwt';

describe('Refactor Verification Tests', () => {
    let parentToken: string;
    let studentToken: string;
    let tutorToken: string;
    let adminToken: string;
    let parentId: string;
    let studentId: string;
    let batchId: string;
    let profileParentId: string;

    beforeAll(async () => {
        // Cleanup - reverse dependency order
        await prisma.homeworkSubmission.deleteMany();
        await prisma.homework.deleteMany();
        await prisma.assessment.deleteMany();
        await prisma.feedback.deleteMany();
        await prisma.attendance.deleteMany();
        await prisma.session.deleteMany(); // Sessions depend on Batch, LessonPlan
        await prisma.enrollment.deleteMany();
        await prisma.parentStudent.deleteMany();

        await prisma.studentProfile.deleteMany();
        await prisma.parentProfile.deleteMany();

        await prisma.batch.deleteMany(); // Users might be tutors here? Batch depends on Course, Tutor

        await prisma.tutorProfile.deleteMany();
        await prisma.lessonPlan.deleteMany();
        await prisma.week.deleteMany();
        await prisma.module.deleteMany();

        await prisma.course.deleteMany();
        await prisma.level.deleteMany();
        await prisma.subject.deleteMany();
        await prisma.contentProvider.deleteMany();

        await prisma.auditLog.deleteMany();
        await prisma.user.deleteMany();
    });

    it('should register a parent', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'parent@test.com',
            password: 'password123',
            role: 'PARENT',
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890'
        });
        expect(res.status).toBe(201);
        parentToken = res.body.token;

        const user = await prisma.user.findUnique({ where: { email: 'parent@test.com' }, include: { parentProfile: true } });
        parentId = user?.id!;
        profileParentId = user?.parentProfile?.id!;
    });

    it('should register a student linked to the parent', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'student@test.com',
            password: 'password123',
            role: 'STUDENT',
            firstName: 'Jane',
            lastName: 'Doe',
            dateOfBirth: '2015-01-01',
            gradeLevel: 'Grade 5',
            parentId: profileParentId // Passing the ParentProfile ID
        });
        expect(res.status).toBe(201);
        studentToken = res.body.token;

        const user = await prisma.user.findUnique({ where: { email: 'student@test.com' } });
        studentId = user?.id!;

        // Verify Link
        const link = await prisma.parentStudent.findFirst({
            where: { parentId: profileParentId }
        });
        expect(link).toBeDefined();
    });

    it('should enroll student in a batch (Admin/Parent)', async () => {
        // Admin setup
        const adminRes = await request(app).post('/api/auth/register').send({
            email: 'admin@test.com',
            password: 'password123',
            role: 'ADMIN'
        });
        adminToken = adminRes.body.token;

        // Tutor setup
        const tutorRes = await request(app).post('/api/auth/register').send({
            email: 'tutor@test.com',
            password: 'password123',
            role: 'TUTOR',
            firstName: 'Mr',
            lastName: 'Smith',
            subjects: ['Math']
        });
        tutorToken = tutorRes.body.token;
        const tutorUser = await prisma.user.findUnique({ where: { email: 'tutor@test.com' }, include: { tutorProfile: true } });

        // Create Course (Prerequisite)
        const provider = await prisma.contentProvider.create({ data: { name: 'TestProvider' } });
        const subject = await prisma.subject.create({ data: { name: 'Math', providerId: provider.id } });
        const level = await prisma.level.create({ data: { name: 'L1', ageGroup: '10', subjectId: subject.id } });
        const course = await prisma.course.create({ data: { levelId: level.id, providerId: provider.id } });

        // Create Batch
        const batchRes = await request(app).post('/api/batches').set('Authorization', `Bearer ${adminToken}`).send({
            courseId: course.id,
            tutorId: tutorUser?.tutorProfile?.id,
            name: 'Math Batch 1',
            scheduleConfig: {},
            startDate: new Date().toISOString()
        });
        batchId = batchRes.body.id;

        // Enroll
        const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: studentId } });
        const enrollRes = await request(app).post('/api/batches/enroll').set('Authorization', `Bearer ${adminToken}`).send({
            batchId: batchId,
            studentId: studentProfile?.id
        });
        expect(enrollRes.status).toBe(201);
    });

    it('should allow parent to view dashboard with child progress', async () => {
        const res = await request(app).get('/api/parent/dashboard').set('Authorization', `Bearer ${parentToken}`);
        expect(res.status).toBe(200);
        expect(res.body.children).toHaveLength(1);
        expect(res.body.children[0].name).toContain('Jane');
        expect(res.body.children[0].enrollments).toHaveLength(1); // Should see the batch
    });
});
