import { stripe } from './';
import Stripe from 'stripe';

/**
 * Creates a Stripe Checkout session with line items
 * @param line_items Actual line items that user wants to purchase
 * @returns the Stripe Checkout session
 */
export async function createStripeCheckoutSession(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {
  const url = process.env.CLIENT_BASE_URL;
  // console.log("client base URL: ", url);
  // console.log("line_items: ", line_items);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    success_url: `${url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/checkout/failed`,
  });

  return session;
}
