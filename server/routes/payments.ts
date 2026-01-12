import express from 'express';
import {
  createCheckout,
  verifyPaystackPayment,
  verifyPayPalSubscription,
  getSupportedCurrencies
} from '../controllers/payments.controller.js';

const router = express.Router();

router.post('/create-checkout', createCheckout);
router.get('/verify/paystack/:reference', verifyPaystackPayment);
router.get('/verify/paypal/:subscriptionId', verifyPayPalSubscription);
router.get('/supported-currencies', getSupportedCurrencies);

export default router;
