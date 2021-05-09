/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ref, Ref } from 'vue';
import { loadStripe, PaymentIntent } from '@stripe/stripe-js';

import { fetchFromAPI } from 'src/api/helpers';

// Constants
const stripeApiKey = process.env.STRIPE_SECRET || '';

// Reactive values
// eslint-disable-next-line prefer-const
let paymentIntent: Ref<null> | Ref<PaymentIntent> = ref(null);

const useStripe = () => {
  const getValidAmount = (amount: number) =>
    Math.min(Math.max(amount, 50), 9999999);

  const getStripeApi = async () => await loadStripe(stripeApiKey);

  const createPaymentIntent = async (amount: number) => {
    // Creating a fresh PaymentIntent for the user
    if (paymentIntent.value === null) {
      const validAmount: number = getValidAmount(amount);

      paymentIntent.value = await fetchFromAPI('payments', {
        body: { amount: validAmount },
      });
    }
  };

  const updatePaymentIntent = (newPaymentIntent: PaymentIntent) => {
    paymentIntent.value = newPaymentIntent;
  };

  return {
    getStripeApi,
    paymentIntent,
    createPaymentIntent,
    updatePaymentIntent,
  };
};

export default useStripe;
