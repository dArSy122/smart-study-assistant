import express from 'express';
import {
  getQuizAttemptsForTopic,
  getQuizForTopic,
  submitQuizForTopic
} from '../controllers/quizController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/topics/:id', getQuizForTopic);
router.get('/topics/:id/attempts', getQuizAttemptsForTopic);
router.post('/topics/:id/submit', submitQuizForTopic);

export default router;