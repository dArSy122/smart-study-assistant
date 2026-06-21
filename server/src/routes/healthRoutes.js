import express from 'express';
import { successResponse } from '../utils/apiResponse.js';

const router = express.Router();

router.get('/', (req, res) => {
  return successResponse(res, 'Smart Study Assistant API is running', {
    status: 'OK',
    service: 'Smart Study Assistant Backend',
    version: '1.0.0'
  });
});

export default router;