import express from 'express';
import {
  saveArticle,
  unsaveArticle,
  getSavedArticles,
  checkIfSaved
} from '../controllers/saved-articles.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getSavedArticles);
router.post('/', authenticate, saveArticle);
router.delete('/:postId', authenticate, unsaveArticle);
router.get('/check/:postId', checkIfSaved);

export default router;
