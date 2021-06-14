/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { computed, ref, Ref } from 'vue';
import {
  loadStripe,
  PaymentIntent,
  // SetupIntent,
  Stripe,
  StripeCardElement,
} from '@stripe/stripe-js';

import { fetchFromAPI } from 'src/api/helpers';

// Reactive values
const stripe: Ref<Stripe | null> = ref(null);

// Stripe intents
const paymentIntent: Ref<PaymentIntent | null> = ref(null);
// const setupIntent: Ref<SetupIntent | null> = ref(null);

// Stripe elements
const cardElement: Ref<StripeCardElement | null> = ref(null);

const useStripe = () => {
  const getValidAmount = (amount: number) =>
    Math.min(Math.max(amount, 50), 9999999);

  const initStripeApi = async () => {
    if (stripe.value === null)
      stripe.value = await loadStripe(process.env.STRIPE_SECRET as string);
  };

  const getStripeApi = async () => {
    await initStripeApi();
    return stripe.value;
  };

  const createPaymentIntent = async (amount: number) => {
    if (paymentIntent.value === null) {
      const validAmount: number = getValidAmount(amount);

      paymentIntent.value = await fetchFromAPI('payments', {
        body: { amount: validAmount },
      });
    }
  };

  const updatePaymentIntent = (newPaymentIntent: PaymentIntent | null) => {
    paymentIntent.value = newPaymentIntent;
  };

  const createCardElement = (element: string) => {
    if (stripe.value) {
      cardElement.value = stripe.value.elements().create('card');
      cardElement.value?.mount(element);
    }
  };

  const readyToPay = computed(() => {
    return paymentIntent.value != null && cardElement.value != null;
  });

  return {
    stripe,
    getStripeApi,
    initStripeApi,
    paymentIntent,
    createPaymentIntent,
    updatePaymentIntent,
    cardElement,
    createCardElement,
    readyToPay,
  };
};

export default useStripe;
