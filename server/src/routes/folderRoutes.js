import express from 'express';
import {
  createFolder,
  deleteFolder,
  getFolderById,
  getFolders,
  updateFolder
} from '../controllers/folderController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getFolders);
router.post('/', createFolder);
router.get('/:id', getFolderById);
router.put('/:id', updateFolder);
router.delete('/:id', deleteFolder);

export default router;