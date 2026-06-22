import express from 'express';
import authRoutes from './authRoutes.js';
import healthRoutes from './healthRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);

export default router;