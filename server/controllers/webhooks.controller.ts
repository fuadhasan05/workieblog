import { Response } from 'express';
import crypto from 'crypto';
import prisma from '../utils/prisma.js';
import stripe from '../utils/stripe.js';

// ============================================================================
// STRIPE WEBHOOK (keeping existing implementation)
// ============================================================================
export const handleStripeWebhook = async (req: any, res: Response) => {
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
        await handleStripeCheckoutComplete(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        await handleStripeSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        await handleStripeSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        await handleStripePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        await handleStripePaymentFailed(invoice);
        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: error.message });
  }
};

async function handleStripeCheckoutComplete(session: any) {
  const memberId = session.metadata.memberId;
  const tier = session.metadata.tier;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!memberId) return;

  await prisma.member.update({
    where: { id: memberId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      membershipTier: tier,
      membershipStatus: 'ACTIVE',
      paymentGateway: 'STRIPE',
      subscriptionStartDate: new Date()
    }
  });
}

async function handleStripeSubscriptionUpdate(subscription: any) {
  const member = await prisma.member.findUnique({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!member) return;

  let status: any = 'ACTIVE';
  if (subscription.status === 'canceled') status = 'CANCELED';
  else if (subscription.status === 'past_due') status = 'PAST_DUE';
  else if (subscription.status === 'trialing') status = 'TRIALING';

  await prisma.member.update({
    where: { id: member.id },
    data: {
      membershipStatus: status,
      subscriptionEndDate: subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000)
        : null
    }
  });
}

async function handleStripeSubscriptionDeleted(subscription: any) {
  const member = await prisma.member.findUnique({
    where: { stripeSubscriptionId: subscription.id }
  });

  if (!member) return;

  await prisma.member.update({
    where: { id: member.id },
    data: {
      membershipTier: 'FREE',
      membershipStatus: 'CANCELED',
      stripeSubscriptionId: null,
      subscriptionEndDate: new Date()
    }
  });
}

async function handleStripePaymentSucceeded(invoice: any) {
  const member = await prisma.member.findUnique({
    where: { stripeCustomerId: invoice.customer }
  });

  if (!member) return;

  await prisma.payment.create({
    data: {
      memberId: member.id,
      gateway: 'STRIPE',
      gatewayPaymentId: invoice.payment_intent,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      status: 'succeeded',
      description: invoice.description
    }
  });
}

async function handleStripePaymentFailed(invoice: any) {
  const member = await prisma.member.findUnique({
    where: { stripeCustomerId: invoice.customer }
  });

  if (!member) return;

  await prisma.member.update({
    where: { id: member.id },
    data: {
      membershipStatus: 'PAST_DUE'
    }
  });
}

// ============================================================================
// PAYSTACK WEBHOOK
// ============================================================================
export const handlePaystackWebhook = async (req: any, res: Response) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET || '')
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    switch (event.event) {
      case 'charge.success': {
        await handlePaystackChargeSuccess(event.data);
        break;
      }

      case 'subscription.create': {
        await handlePaystackSubscriptionCreate(event.data);
        break;
      }

      case 'subscription.disable': {
        await handlePaystackSubscriptionDisable(event.data);
        break;
      }

      case 'subscription.enable': {
        await handlePaystackSubscriptionEnable(event.data);
        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

async function handlePaystackChargeSuccess(data: any) {
  const { metadata, customer, reference, amount, currency } = data;

  if (metadata && metadata.memberId) {
    await prisma.payment.create({
      data: {
        memberId: metadata.memberId,
        gateway: 'PAYSTACK',
        gatewayPaymentId: reference,
        amount,
        currency: currency.toLowerCase(),
        status: 'succeeded',
        description: metadata.tier ? `${metadata.tier} subscription` : 'Payment',
        metadata: JSON.stringify(data)
      }
    });
  }
}

async function handlePaystackSubscriptionCreate(data: any) {
  const { customer, subscription_code, email_token } = data;

  // Find member by customer code
  const member = await prisma.member.findUnique({
    where: { paystackCustomerId: customer.customer_code }
  });

  if (member) {
    await prisma.member.update({
      where: { id: member.id },
      data: {
        paystackSubscriptionCode: subscription_code,
        membershipStatus: 'ACTIVE'
      }
    });
  }
}

async function handlePaystackSubscriptionDisable(data: any) {
  const { subscription_code } = data;

  const member = await prisma.member.findUnique({
    where: { paystackSubscriptionCode: subscription_code }
  });

  if (member) {
    await prisma.member.update({
      where: { id: member.id },
      data: {
        membershipStatus: 'CANCELED',
        membershipTier: 'FREE',
        subscriptionEndDate: new Date()
      }
    });
  }
}

async function handlePaystackSubscriptionEnable(data: any) {
  const { subscription_code } = data;

  const member = await prisma.member.findUnique({
    where: { paystackSubscriptionCode: subscription_code }
  });

  if (member) {
    await prisma.member.update({
      where: { id: member.id },
      data: {
        membershipStatus: 'ACTIVE'
      }
    });
  }
}

// ============================================================================
// PAYPAL WEBHOOK
// ============================================================================
export const handlePayPalWebhook = async (req: any, res: Response) => {
  // PayPal webhook verification would go here
  // For now, we'll trust the webhook (implement proper verification in production)

  const event = req.body;

  try {
    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        await handlePayPalSubscriptionActivated(event.resource);
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        await handlePayPalSubscriptionCancelled(event.resource);
        break;
      }

      case 'BILLING.SUBSCRIPTION.SUSPENDED': {
        await handlePayPalSubscriptionSuspended(event.resource);
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        await handlePayPalPaymentCompleted(event.resource);
        break;
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ error: error.message });
  }
};

async function handlePayPalSubscriptionActivated(resource: any) {
  const customId = resource.custom_id;

  if (customId) {
    const planId = resource.plan_id;
    const tier = planId === process.env.PAYPAL_PREMIUM_PLAN_ID ? 'PREMIUM' : 'VIP';

    await prisma.member.update({
      where: { id: customId },
      data: {
        paypalSubscriptionId: resource.id,
        membershipTier: tier,
        membershipStatus: 'ACTIVE',
        paymentGateway: 'PAYPAL',
        subscriptionStartDate: new Date()
      }
    });
  }
}

async function handlePayPalSubscriptionCancelled(resource: any) {
  const member = await prisma.member.findUnique({
    where: { paypalSubscriptionId: resource.id }
  });

  if (member) {
    await prisma.member.update({
      where: { id: member.id },
      data: {
        membershipStatus: 'CANCELED',
        membershipTier: 'FREE',
        subscriptionEndDate: new Date()
      }
    });
  }
}

async function handlePayPalSubscriptionSuspended(resource: any) {
  const member = await prisma.member.findUnique({
    where: { paypalSubscriptionId: resource.id }
  });

  if (member) {
    await prisma.member.update({
      where: { id: member.id },
      data: {
        membershipStatus: 'PAST_DUE'
      }
    });
  }
}

async function handlePayPalPaymentCompleted(resource: any) {
  const billingAgreementId = resource.billing_agreement_id;

  const member = await prisma.member.findUnique({
    where: { paypalSubscriptionId: billingAgreementId }
  });

  if (member) {
    await prisma.payment.create({
      data: {
        memberId: member.id,
        gateway: 'PAYPAL',
        gatewayPaymentId: resource.id,
        amount: Math.round(parseFloat(resource.amount.total) * 100),
        currency: resource.amount.currency.toLowerCase(),
        status: 'succeeded',
        description: 'Subscription payment',
        metadata: JSON.stringify(resource)
      }
    });
  }
}
