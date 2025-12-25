import express from 'express';
import {
  createCheckout,
  verifyPaystackPayment,
  verifyPayPalSubscription,
  getSupportedCurrencies
} from '../controllers/payments.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-checkout', authenticate, createCheckout);
router.get('/verify/paystack/:reference', authenticate, verifyPaystackPayment);
router.get('/verify/paypal/:subscriptionId', authenticate, verifyPayPalSubscription);
router.get('/supported-currencies', getSupportedCurrencies);

export default router;
