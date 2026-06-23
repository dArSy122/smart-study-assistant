import express from 'express';
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';
import healthRoutes from './healthRoutes.js';
import topicRoutes from './topicRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/files', fileRoutes);

export default router;