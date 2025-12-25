import express from 'express';
import { uploadMedia, getMediaList, deleteMedia } from '../controllers/media.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', authenticate, getMediaList);
router.post('/', authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), upload.single('file'), uploadMedia);
router.delete('/:id', authenticate, deleteMedia);

export default router;
