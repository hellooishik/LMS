import bcrypt from 'bcryptjs';
import prisma from '../config/db';
import { generateToken } from '../utils/jwt';
import { Role } from '@prisma/client';

export const registerUser = async (email: string, password: string, role: Role, profileData: any) => {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User Transaction
    const user = await prisma.$transaction(async (tx: any) => {
        const newUser = await tx.user.create({
            data: {
                email,
                passwordHash,
                role,
            },
        });

        // Create Profile based on Role
        if (role === Role.STUDENT) {
            if (!profileData.dateOfBirth) {
                throw new Error("Date of Birth is required for students");
            }
            // Check if parentId is provided (optional now at registration, or mandatory?)
            // User requirement: "Parent - Student ownership model".
            // Assuming simplified registration: if parentId is passed, link it.
            const parentRelation = profileData.parentId ? {
                parents: {
                    create: {
                        parentId: profileData.parentId
                    }
                }
            } : {};

            await tx.studentProfile.create({
                data: {
                    userId: newUser.id,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    dateOfBirth: new Date(profileData.dateOfBirth),
                    gradeLevel: profileData.gradeLevel || 'Ungraded',
                    ...parentRelation
                },
            });
        } else if (role === Role.TUTOR) {
            await tx.tutorProfile.create({
                data: {
                    userId: newUser.id,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    bio: profileData.bio,
                    subjects: profileData.subjects || [],
                },
            });
        } else if (role === Role.PARENT) {
            await tx.parentProfile.create({
                data: {
                    userId: newUser.id,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phone: profileData.phone,
                },
            });
        }

        return newUser;
    });

    const token = generateToken({ userId: user.id, role: user.role });
    return { user, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken({ userId: user.id, role: user.role });
    return { user, token };
};
