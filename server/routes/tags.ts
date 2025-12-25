import express from 'express';
import {
  getTags,
  getTagBySlug,
  createTag,
  updateTag,
  deleteTag
} from '../controllers/tags.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTags);
router.get('/:slug', getTagBySlug);
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), createTag);
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateTag);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTag);

export default router;
