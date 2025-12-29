import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/authService';
import { Role } from '@prisma/client';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role, ...profileData } = req.body;
        const result = await registerUser(email, password, role, profileData);
        res.status(201).json({
            message: 'User registered successfully',
            token: result.token,
            user: { id: result.user.id, email: result.user.email, role: result.user.role }
        });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'User already exists') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await loginUser(email, password);
        res.json({
            message: 'Login successful',
            token: result.token,
            user: { id: result.user.id, email: result.user.email, role: result.user.role }
        });
    } catch (error: any) {
        console.error(error);
        if (error.message === 'Invalid credentials') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Login failed' });
    }
};
