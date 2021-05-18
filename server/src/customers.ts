import Stripe from 'stripe';
import Supabase from './supabase';

import { stripe } from './';

export async function getOrCreateCustomer(
  userId: string,
  params?: Stripe.CustomerCreateParams
) {
  // Lookup user from 'users' table in Supabase
  const { data, error } = await Supabase.from('users')
    .select('email, stripe_customer_id')
    .eq('id', userId)
    .limit(1);

  // Reject promise if the given user does not exist in Supabase
  if (error) {
    console.error(error.message);
    return Promise.reject();
  }

  console.log(data);

  // Destructure email and stripe_customer_id from returned user
  const userRowData = data[0];
  const { email, stripe_customer_id: stripeCustomerId } = userRowData;

  // If there is no Stripe Customer tied to the application user
  if (!stripeCustomerId) {
    // Create new Stripe Customer
    const customer = await stripe.customers.create({
      email,
      metadata: {
        supabaseUID: userId,
      },
      ...params,
    });

    // Update 'users' table with new Stripe Customer id
    const { error } = await Supabase.from('users')
      .update({ stripeCustomerId: customer.id })
      .match({ id: userId });

    // Rollback creation of Stripe customer if unable to save id to 'users' in Supabase
    if (error) {
      console.error(error.message);

      await stripe.customers.del(customer.id);

      return Promise.reject();
    }

    return customer;
  }
  // Else, return Stripe Customer using the existing Stripe Customer id
  else {
    return (await stripe.customers.retrieve(
      stripeCustomerId
    )) as Stripe.Customer;
  }
}
