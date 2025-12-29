import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import { generateToken } from '../utils/jwt';
import { Role } from '@prisma/client';

describe('Batch Endpoints', () => {
    let adminToken: string;
    let tutorToken: string;
    let courseId: string;
    let tutorId: string;

    // Unique emails
    const timestamp = Date.now();
    const adminEmail = `admin_batch_${timestamp}@test.com`;
    const tutorEmail = `tutor_batch_${timestamp}@test.com`;

    beforeAll(async () => {
        await prisma.$connect();

        // Admin Setup
        const admin = await prisma.user.create({
            data: { email: adminEmail, passwordHash: 'hash', role: Role.ADMIN }
        });
        adminToken = generateToken({ userId: admin.id, role: Role.ADMIN });

        // Tutor Setup
        const tutorUser = await prisma.user.create({
            data: { email: tutorEmail, passwordHash: 'hash', role: Role.TUTOR }
        });
        const tutorProfile = await prisma.tutorProfile.create({
            data: { userId: tutorUser.id, firstName: 'Test', lastName: 'Tutor', subjects: ['Math'] }
        });
        tutorId = tutorProfile.id;
        tutorToken = generateToken({ userId: tutorUser.id, role: Role.TUTOR });

        // Course Setup
        const provider = await prisma.contentProvider.create({ data: { name: 'BatchProv', type: 'INTERNAL' } });
        const subject = await prisma.subject.create({ data: { name: 'MathBatch', providerId: provider.id } });
        const level = await prisma.level.create({ data: { name: 'Lvl1', ageGroup: '5-6', subjectId: subject.id } });
        const course = await prisma.course.create({ data: { levelId: level.id, providerId: provider.id } });
        courseId = course.id;
    });

    afterAll(async () => {
        // Cleanup - cascade usually required or manual
        // Skipping exhaustive cleanup for speed, but ideally delete all created records
        await prisma.batch.deleteMany({ where: { courseId: courseId } });
        await prisma.course.deleteMany({ where: { id: courseId } });
        await prisma.tutorProfile.deleteMany({ where: { id: tutorId } });
        await prisma.user.deleteMany({ where: { email: { in: [adminEmail, tutorEmail] } } });
        await prisma.$disconnect();
    });

    it('should create a Batch (Admin)', async () => {
        const res = await request(app)
            .post('/api/batches')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                courseId,
                tutorId,
                name: 'Batch A',
                scheduleConfig: { days: ['Mon'], time: '10:00' },
                startDate: '2025-01-01T00:00:00.000Z'
            });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Batch A');
    });

    it('should get Tutor Schedule', async () => {
        const res = await request(app)
            .get('/api/batches/schedule')
            .set('Authorization', `Bearer ${tutorToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
