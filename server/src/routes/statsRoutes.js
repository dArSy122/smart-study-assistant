import express from 'express';
import { getMyStats } from '../controllers/statsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/me', getMyStats);

export default router;