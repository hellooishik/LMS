import dotenv from 'dotenv';
import path from 'path';

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

console.log('Setup: DATABASE_URL is', process.env.DATABASE_URL ? 'SET' : 'UNSET');

