import express from 'express';
import aiRoutes from './aiRoutes.js';
import authRoutes from './authRoutes.js';
import fileRoutes from './fileRoutes.js';
import folderRoutes from './folderRoutes.js';
import healthRoutes from './healthRoutes.js';
import topicRoutes from './topicRoutes.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/topics', topicRoutes);
router.use('/files', fileRoutes);
router.use('/folders', folderRoutes);
router.use('/ai', aiRoutes);

export default router;