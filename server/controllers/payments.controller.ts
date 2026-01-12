import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Member, Payment } from '../models/mongodb.js';
import mongoose from 'mongoose';
import stripe from '../utils/stripe.js';
import paystack from '../utils/paystack.js';
import paypalClient from '../utils/paypal.js';

// Pricing configuration for different gateways
const PRICING = {
  PREMIUM: {
    usd: { amount: 999, currency: 'usd', stripe: process.env.STRIPE_PREMIUM_PRICE_ID },
    ngn: { amount: 8000, currency: 'ngn', paystack: process.env.PAYSTACK_PREMIUM_PLAN_CODE },
    eur: { amount: 949, currency: 'eur' },
    gbp: { amount: 849, currency: 'gbp' },
  },
  VIP: {
    usd: { amount: 1999, currency: 'usd', stripe: process.env.STRIPE_VIP_PRICE_ID },
    ngn: { amount: 16000, currency: 'ngn', paystack: process.env.PAYSTACK_VIP_PLAN_CODE },
    eur: { amount: 1849, currency: 'eur' },
    gbp: { amount: 1649, currency: 'gbp' },
  },
};

// ============================================================================
// STRIPE CHECKOUT
// ============================================================================
export const createStripeCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { tier, currency = 'usd', memberEmail } = req.body;

    if (!memberEmail) {
      return res.status(400).json({ error: 'Member email required' });
    }

    const member = await Member.findOne({ email: memberEmail.toLowerCase() });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const pricing = PRICING[tier as keyof typeof PRICING]?.[currency as keyof typeof PRICING.PREMIUM];
    if (!pricing || !pricing.stripe) {
      return res.status(400).json({ error: 'Invalid tier or currency for Stripe' });
    }

    let customerId = member.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.email,
        name: member.name,
        metadata: { memberId: member._id.toString() }
      });

      customerId = customer.id;
      await Member.findByIdAndUpdate(member._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: pricing.stripe, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/member/dashboard?success=true&gateway=stripe`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: { memberId: member._id.toString(), tier, gateway: 'STRIPE' }
    });

    res.json({ sessionId: session.id, url: session.url, gateway: 'stripe' });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// PAYSTACK CHECKOUT
// ============================================================================
export const createPaystackCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { tier, currency = 'ngn', memberEmail } = req.body;

    if (!memberEmail) {
      return res.status(400).json({ error: 'Member email required' });
    }

    const member = await Member.findOne({ email: memberEmail.toLowerCase() });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const pricing = PRICING[tier as keyof typeof PRICING]?.[currency as keyof typeof PRICING.PREMIUM];
    if (!pricing) {
      return res.status(400).json({ error: 'Invalid tier or currency for Paystack' });
    }

    // Initialize Paystack transaction
    const response = await paystack.transaction.initialize({
      email: member.email,
      amount: pricing.amount * 100, // Paystack uses kobo (smallest unit)
      currency: currency.toUpperCase(),
      callback_url: `${process.env.FRONTEND_URL}/member/dashboard?success=true&gateway=paystack`,
      metadata: {
        memberId: member._id.toString(),
        tier,
        gateway: 'PAYSTACK',
        plan_code: (pricing as any).paystack
      },
      channels: ['card', 'bank', 'ussd', 'mobile_money']
    });

    if (response.status && response.data) {
      res.json({
        authorizationUrl: response.data.authorization_url,
        reference: response.data.reference,
        gateway: 'paystack'
      });
    } else {
      throw new Error('Failed to initialize Paystack transaction');
    }
  } catch (error: any) {
    console.error('Paystack checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// PAYPAL CHECKOUT
// ============================================================================
export const createPayPalCheckout = async (req: AuthRequest, res: Response) => {
  try {
    const { tier, currency = 'usd', memberEmail } = req.body;

    if (!memberEmail) {
      return res.status(400).json({ error: 'Member email required' });
    }

    const member = await Member.findOne({ email: memberEmail.toLowerCase() });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const pricing = PRICING[tier as keyof typeof PRICING]?.[currency as keyof typeof PRICING.PREMIUM];
    if (!pricing) {
      return res.status(400).json({ error: 'Invalid tier or currency for PayPal' });
    }

    // Create PayPal subscription
    const planId = tier === 'PREMIUM'
      ? process.env.PAYPAL_PREMIUM_PLAN_ID
      : process.env.PAYPAL_VIP_PLAN_ID;

    const subscriptionData = {
      plan_id: planId,
      application_context: {
        brand_name: 'CareerBuddy',
        return_url: `${process.env.FRONTEND_URL}/member/dashboard?success=true&gateway=paypal`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
        user_action: 'SUBSCRIBE_NOW'
      },
      subscriber: {
        email_address: member.email,
        name: {
          given_name: member.name.split(' ')[0],
          surname: member.name.split(' ').slice(1).join(' ') || 'User'
        }
      },
      custom_id: member._id.toString()
    };

    const { subscriptionsController } = paypalClient;
    const subscription = await subscriptionsController.subscriptionsCreate({
      body: subscriptionData
    });

    const approvalLink = subscription.result.links?.find((link: any) => link.rel === 'approve');

    res.json({
      subscriptionId: subscription.result.id,
      approvalUrl: approvalLink?.href,
      gateway: 'paypal'
    });
  } catch (error: any) {
    console.error('PayPal checkout error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// UNIFIED CHECKOUT ENDPOINT
// ============================================================================
export const createCheckout = async (req: AuthRequest, res: Response) => {
  const { gateway } = req.body;

  switch (gateway) {
    case 'stripe':
      return createStripeCheckout(req, res);
    case 'paystack':
      return createPaystackCheckout(req, res);
    case 'paypal':
      return createPayPalCheckout(req, res);
    default:
      return res.status(400).json({ error: 'Invalid payment gateway' });
  }
};

// ============================================================================
// VERIFY PAYSTACK PAYMENT
// ============================================================================
export const verifyPaystackPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { reference } = req.params;

    const response = await paystack.transaction.verify({ reference });

    if (response.status && response.data.status === 'success') {
      const { metadata, customer } = response.data;

      if (metadata && metadata.memberId) {
        // Create subscription for the member
        await Member.findByIdAndUpdate(metadata.memberId, {
          membershipTier: metadata.tier,
          membershipStatus: 'ACTIVE',
          paymentGateway: 'PAYSTACK',
          paystackCustomerId: customer.customer_code,
          subscriptionStartDate: new Date()
        });

        // Record payment
        await Payment.create({
          memberId: new mongoose.Types.ObjectId(metadata.memberId),
          gateway: 'PAYSTACK',
          gatewayPaymentId: reference,
          amount: response.data.amount,
          currency: response.data.currency.toLowerCase(),
          status: 'succeeded',
          description: `${metadata.tier} subscription`,
          metadata: JSON.stringify(response.data)
        });

        res.json({ status: 'success', data: response.data });
      } else {
        res.status(400).json({ error: 'Invalid payment metadata' });
      }
    } else {
      res.status(400).json({ error: 'Payment verification failed' });
    }
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// VERIFY PAYPAL SUBSCRIPTION
// ============================================================================
export const verifyPayPalSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { subscriptionId } = req.params;

    const { subscriptionsController } = paypalClient;
    const subscription = await subscriptionsController.subscriptionsGet({ subscriptionId });

    if (subscription.result.status === 'ACTIVE') {
      const customId = subscription.result.custom_id;

      if (customId) {
        const member = await Member.findById(customId);

        if (member) {
          // Determine tier from subscription plan
          const planId = subscription.result.plan_id;
          const tier = planId === process.env.PAYPAL_PREMIUM_PLAN_ID ? 'PREMIUM' : 'VIP';

          await Member.findByIdAndUpdate(customId, {
            membershipTier: tier,
            membershipStatus: 'ACTIVE',
            paymentGateway: 'PAYPAL',
            paypalSubscriptionId: subscriptionId,
            paypalCustomerId: subscription.result.subscriber?.payer_id,
            subscriptionStartDate: new Date()
          });

          res.json({ status: 'success', subscription: subscription.result });
        } else {
          res.status(404).json({ error: 'Member not found' });
        }
      } else {
        res.status(400).json({ error: 'Invalid subscription data' });
      }
    } else {
      res.status(400).json({ error: 'Subscription is not active' });
    }
  } catch (error: any) {
    console.error('PayPal verification error:', error);
    res.status(500).json({ error: error.message });
  }
};

// ============================================================================
// GET SUPPORTED CURRENCIES
// ============================================================================
export const getSupportedCurrencies = async (req: AuthRequest, res: Response) => {
  res.json({
    stripe: ['usd', 'eur', 'gbp'],
    paystack: ['ngn', 'ghs', 'zar', 'kes'],
    paypal: ['usd', 'eur', 'gbp', 'aud', 'cad']
  });
};
