import express from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  incrementPostViews
} from '../controllers/posts.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);
router.post('/:id/views', incrementPostViews);

// Protected routes
router.post('/', authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), createPost);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
