import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { Member, Payment } from '../models/mongodb.js';
import mongoose from 'mongoose';
import stripe from '../utils/stripe.js';

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { priceId, tier } = req.body;

    const member = await Member.findById(req.user.userId);

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let customerId = member.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: member.email,
        name: member.name,
        metadata: {
          memberId: member._id.toString()
        }
      });

      customerId = customer.id;

      await Member.findByIdAndUpdate(member._id, { stripeCustomerId: customerId });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/member/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        memberId: member._id.toString(),
        tier
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createPortalSession = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const member = await Member.findById(req.user.userId);

    if (!member || !member.stripeCustomerId) {
      return res.status(404).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: member.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/member/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Create portal session error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req: any, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        await handleCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await handlePaymentFailed(invoice);
        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error.message });
  }
};

async function handleCheckoutComplete(session: any) {
  const memberId = session.metadata.memberId;
  const tier = session.metadata.tier;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!memberId) return;

  await Member.findByIdAndUpdate(memberId, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    membershipTier: tier,
    membershipStatus: 'ACTIVE',
    subscriptionStartDate: new Date()
  });
}

async function handleSubscriptionUpdate(subscription: any) {
  const member = await Member.findOne({ stripeSubscriptionId: subscription.id });

  if (!member) return;

  let status: any = 'ACTIVE';
  if (subscription.status === 'canceled') status = 'CANCELED';
  else if (subscription.status === 'past_due') status = 'PAST_DUE';
  else if (subscription.status === 'trialing') status = 'TRIALING';

  await Member.findByIdAndUpdate(member._id, {
    membershipStatus: status,
    subscriptionEndDate: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000)
      : null
  });
}

async function handleSubscriptionDeleted(subscription: any) {
  const member = await Member.findOne({ stripeSubscriptionId: subscription.id });

  if (!member) return;

  await Member.findByIdAndUpdate(member._id, {
    membershipTier: 'FREE',
    membershipStatus: 'CANCELED',
    stripeSubscriptionId: null,
    subscriptionEndDate: new Date()
  });
}

async function handlePaymentSucceeded(invoice: any) {
  const member = await Member.findOne({ stripeCustomerId: invoice.customer });

  if (!member) return;

  await Payment.create({
    memberId: member._id,
    gateway: 'STRIPE',
    gatewayPaymentId: invoice.payment_intent,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    description: invoice.description
  });
}

async function handlePaymentFailed(invoice: any) {
  const member = await Member.findOne({ stripeCustomerId: invoice.customer });

  if (!member) return;

  await Member.findByIdAndUpdate(member._id, {
    membershipStatus: 'PAST_DUE'
  });
}

export const getSubscriptionStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const member = await Member.findById(req.user.userId)
      .select('membershipTier membershipStatus subscriptionStartDate subscriptionEndDate stripeSubscriptionId')
      .lean();

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    let subscription = null;
    if (member.stripeSubscriptionId) {
      try {
        subscription = await stripe.subscriptions.retrieve(member.stripeSubscriptionId);
      } catch (error) {
        console.error('Error fetching subscription from Stripe:', error);
      }
    }

    res.json({
      tier: member.membershipTier,
      status: member.membershipStatus,
      startDate: member.subscriptionStartDate,
      endDate: member.subscriptionEndDate,
      subscription
    });
  } catch (error: any) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: error.message });
  }
};
