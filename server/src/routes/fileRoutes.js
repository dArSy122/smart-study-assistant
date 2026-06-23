import express from 'express';
import { extractTextFromFile } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { uploadStudyFile } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/extract-text', uploadStudyFile.single('file'), extractTextFromFile);

export default router;