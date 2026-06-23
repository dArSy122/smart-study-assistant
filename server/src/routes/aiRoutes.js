import express from 'express';
import { generateAiForTopic } from '../controllers/aiController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/topics/:id/generate', generateAiForTopic);

export default router;