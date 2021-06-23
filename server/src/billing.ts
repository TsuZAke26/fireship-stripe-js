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

/**
 * Cancels the given user's subscription that is passed in to this function
 * @param userId Supabase user id
 * @param subscriptionId Stripe subscription id
 */
export async function cancelSubscription(
  userId: string,
  subscriptionId: string
) {
  const customer = await getOrCreateCustomer(userId);

  if (customer.metadata.supabaseUID !== userId) {
    throw Error('Supabase UID does not match Stripe Customer');
  }

  // Method 1: immediate termination
  const subscription = await stripe.subscriptions.del(subscriptionId);

  // Method 2: Cancel at end of period (listen for appropriate webhook to update user in Supabase)
  // const subscription = stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true };

  if (subscription.status === 'canceled') {
    try {
      let { error } = await supabase
        .from('users')
        .update({ active_subscription: null })
        .eq('id', userId);
      if (error) throw error;
    } catch (error) {
      console.error(error.message);
    }
  }
}

/**
 * Gets the active subscriptions for the given user.
 * @param userId Supabase user id
 * @returns List of Stripe.Subscription objects for each active subscription
 */
export async function listSubscriptions(userId: string) {
  const customer = await getOrCreateCustomer(userId);
  const subscriptions = await stripe.subscriptions.list({
    customer: customer.id,
  });

  return subscriptions;
}
