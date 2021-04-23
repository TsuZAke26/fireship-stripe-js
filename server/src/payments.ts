import { stripe } from './';

/**
 * Create a Payment Intent with a specific amount
 */
export async function createPaymentIntent(amount: number) {
  // will eventually refer to customers within Stripe as well
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    // receipt_email: "fred.fuchs@avgn.com"
  });

  return paymentIntent;
}
