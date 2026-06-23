import express from 'express';
import {
  archiveTopic,
  createTopic,
  deleteTopic,
  getTopicById,
  getTopics,
  updateTopic
} from '../controllers/topicController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getTopics);
router.post('/', createTopic);
router.get('/:id', getTopicById);
router.put('/:id', updateTopic);
router.delete('/:id', deleteTopic);
router.patch('/:id/archive', archiveTopic);

export default router;