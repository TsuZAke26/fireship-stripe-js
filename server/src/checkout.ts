import { stripe } from "./";
import Stripe from "stripe";

/**
 * Creates a Stripe Checkout session with line items
 * @param line_items Actual line items that user wants to purchase
 * @returns the Stripe Checkout session
 */
export async function createStripeCheckoutSession(
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[]
) {
  const url = process.env.BASE_URL;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    success_url: `${url}/success?sessions_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${url}/failed`,
  });

  return session;
}
