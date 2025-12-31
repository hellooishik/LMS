import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import curriculumRoutes from './routes/curriculumRoutes';
import batchRoutes from './routes/batchRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import parentRoutes from './routes/parentRoutes';
import tutorRoutes from './routes/tutorRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to XNetwork Kids LMS API', status: 'Running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/tutor', tutorRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler Stub
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

export default app;
