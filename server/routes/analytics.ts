import express from 'express';
import {
  trackEvent,
  getDashboardStats,
  getPostAnalytics
} from '../controllers/analytics.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/track', trackEvent); // Public endpoint
router.get('/dashboard', authenticate, authorize('ADMIN', 'EDITOR'), getDashboardStats);
router.get('/posts/:postId', authenticate, authorize('ADMIN', 'EDITOR', 'AUTHOR'), getPostAnalytics);

export default router;
