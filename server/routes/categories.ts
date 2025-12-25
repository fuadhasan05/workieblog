import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categories.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories); // Public endpoint
router.post('/', authenticate, authorize('ADMIN', 'EDITOR'), createCategory);
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateCategory);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteCategory);

export default router;
