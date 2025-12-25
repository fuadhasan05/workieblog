import Paystack from 'paystack-node';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';

if (!PAYSTACK_SECRET_KEY) {
  console.warn('Warning: PAYSTACK_SECRET_KEY is not set. Paystack functionality will not work.');
}

export const paystack = new Paystack(PAYSTACK_SECRET_KEY);

export default paystack;
