import 'dotenv/config';
import './server.js';
import express from 'express';
import authRoutes from './routes/auth.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);

export default router;
