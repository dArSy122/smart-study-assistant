import express from 'express';
import aiRoutes from './aiRoutes.js';
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';
import folderRoutes from './folderRoutes.js';
import healthRoutes from './healthRoutes.js';
import quizRoutes from './quizRoutes.js';
import statsRoutes from './statsRoutes.js';
import topicRoutes from './topicRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/files', fileRoutes);
router.use('/folders', folderRoutes);
router.use('/ai', aiRoutes);
router.use('/quiz', quizRoutes);
router.use('/stats', statsRoutes);

export default router;