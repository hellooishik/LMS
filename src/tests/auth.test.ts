import request from 'supertest';
import app from '../app';
import prisma from '../config/db';

describe('Auth Endpoints', () => {
    // Unique email for every test run to avoid collisions
    const timestamp = Date.now();
    const studentUser = {
        email: `student_${timestamp}@test.com`,
        password: 'password123',
        role: 'STUDENT',
        firstName: 'Test',
        lastName: 'Student',
        dateOfBirth: '2010-01-01T00:00:00.000Z',
        parentId: 'some-parent-uuid-placeholder' // In a real test we might need a real parent or loose constraint
    };

    const parentUser = {
        email: `parent_${timestamp}@test.com`,
        password: 'password123',
        role: 'PARENT',
        firstName: 'Test',
        lastName: 'Parent'
    };

    beforeAll(async () => {
        // Connect to DB
        await prisma.$connect();
    });

    afterAll(async () => {
        try {
            // Clean up created users
            await prisma.studentProfile.deleteMany({ where: { user: { email: studentUser.email } } });
            await prisma.parentProfile.deleteMany({ where: { user: { email: parentUser.email } } });
            await prisma.user.deleteMany({ where: { email: { in: [studentUser.email, parentUser.email] } } });
        } catch (e) {
            console.error('Cleanup failed', e);
        }
        await prisma.$disconnect();
    });

    it('should register a new Parent successfully', async () => {
        console.log('Registering parent:', parentUser.email);
        const res = await request(app)
            .post('/api/auth/register')
            .send(parentUser);

        if (res.status !== 201) {
            console.error('Register failed:', res.status, res.body);
        }
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.email).toBe(parentUser.email);

        // Save parentId for student test if needed, though strictly we just used a placeholder
    });

    it('should login the registered Parent', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: parentUser.email,
                password: parentUser.password
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail to login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: parentUser.email,
                password: 'wrongpassword'
            });

        expect(res.status).toBe(400);
    });

    // Add more tests for Student/Tutor registration as needed
});
