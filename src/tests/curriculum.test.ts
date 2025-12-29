import request from 'supertest';
import app from '../app';
import prisma from '../config/db';
import { generateToken } from '../utils/jwt';
import { Role } from '@prisma/client';

describe('Curriculum Endpoints', () => {
    let adminToken: string;
    let providerId: string;
    const timestamp = Date.now();
    const adminEmail = `admin_curr_${timestamp}@test.com`;

    beforeAll(async () => {
        await prisma.$connect();

        // Create an Admin user for testing
        const passwordHash = 'hash_placeholder'; // In real app use bcrypt, here we mock login or generate token directly
        // We can just generate a token for a made-up user if the middleware checks DB, but middleware likely just checks token content?
        // Let's create a real user to be safe if middleware checks DB (authMiddleware usually checks `req.user`).
        // Actually, jwt middleware usually decodes and validates signature. Let's create user in DB.

        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                passwordHash: 'hashedpassword',
                role: Role.ADMIN
            }
        });
        adminToken = generateToken({ userId: admin.id, role: Role.ADMIN });

        // Create a Content Provider (needed for Subject)
        const provider = await prisma.contentProvider.create({
            data: {
                name: 'Test Provider',
                type: 'INTERNAL'
            }
        });
        providerId = provider.id;
    });

    afterAll(async () => {
        // Cleanup hierarchy: LessonPlan -> Week -> Module -> Course -> Level -> Subject
        // Using cascade delete or manual delete
        // For simplicity in test, we might rely on test env reset, but here we try basic cleanup
        await prisma.contentProvider.deleteMany({ where: { id: providerId } });
        await prisma.user.deleteMany({ where: { email: adminEmail } });
        await prisma.$disconnect();
    });

    it('should create a Subject (Admin)', async () => {
        const res = await request(app)
            .post('/api/curriculum/subjects')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                name: 'Math',
                providerId: providerId
            });

        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Math');
    });

    it('should fail to create a Subject without Admin role', async () => {
        const res = await request(app)
            .post('/api/curriculum/subjects')
            .send({
                name: 'History',
                providerId: providerId
            });

        // Expect 401 (No token) or 403 (Forbidden)
        expect([401, 403]).toContain(res.status);
    });

    it('should get all subjects', async () => {
        // Assuming Get Subjects requires authentication
        const res = await request(app)
            .get('/api/curriculum/subjects')
            .set('Authorization', `Bearer ${adminToken}`); // Or any valid token

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.some((s: any) => s.name === 'Math')).toBe(true);
    });
});
