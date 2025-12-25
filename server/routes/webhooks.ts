import express from 'express';
import {
  handleStripeWebhook,
  handlePaystackWebhook,
  handlePayPalWebhook
} from '../controllers/webhooks.controller.js';

const router = express.Router();

// All webhook routes use raw body
router.post('/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
router.post('/paystack', express.json(), handlePaystackWebhook);
router.post('/paypal', express.json(), handlePayPalWebhook);

export default router;
