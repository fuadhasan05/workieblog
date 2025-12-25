import express from 'express';
import {
  createCheckoutSession,
  createPortalSession,
  handleWebhook,
  getSubscriptionStatus
} from '../controllers/subscriptions.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);
router.post('/create-portal-session', authenticate, createPortalSession);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.get('/status', authenticate, getSubscriptionStatus);

export default router;
