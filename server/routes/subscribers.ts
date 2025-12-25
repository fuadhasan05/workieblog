import express from 'express';
import {
  getSubscribers,
  createSubscriber,
  updateSubscriber,
  exportSubscribers
} from '../controllers/subscribers.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN', 'EDITOR'), getSubscribers);
router.post('/', createSubscriber); // Public endpoint for newsletter signup
router.put('/:id', authenticate, authorize('ADMIN', 'EDITOR'), updateSubscriber);
router.get('/export', authenticate, authorize('ADMIN', 'EDITOR'), exportSubscribers);

export default router;
