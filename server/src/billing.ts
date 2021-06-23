import Stripe from 'stripe';

import { stripe } from './';
import { getOrCreateCustomer } from './customers';
import supabase from './supabase';

export async function createSubscription(
  userId: string,
  plan: string,
  payment_method: string
) {
  const customer = await getOrCreateCustomer(userId);

  // Attach payment method to customer
  await stripe.paymentMethods.attach(payment_method, { customer: customer.id });

  // Set it as the default payment method
  await stripe.customers.update(customer.id, {
    invoice_settings: { default_payment_method: payment_method },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan }],
    expand: ['latest_invoice.payment_intent'],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const payment_intent = invoice.payment_intent as Stripe.PaymentIntent;

  // Update the user's subscription status if payment succeeded
  if (payment_intent.status === 'succeeded') {
    try {
      let { error } = await supabase
        .from('users')
        .update({ active_subscription: plan })
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error(error.message);
    }
  }

  return subscription;
}
