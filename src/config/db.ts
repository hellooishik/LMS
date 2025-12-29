import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

import fs from 'fs';
const envPath = path.join(process.cwd(), '.env');
console.log('Loading .env from', envPath);
try {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} catch (e) {
    console.error('Failed to load .env', e);
}

console.log('DB Config: DATABASE_URL is', process.env.DATABASE_URL ? 'SET' : 'UNSET');
const prisma = new PrismaClient();

export default prisma;
