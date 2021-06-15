<template>
  <q-page padding class="column items-center q-gutter-y-md">
    <span class="text-h4">Payment Intent Practice</span>

    <!-- PaymentIntent information -->
    <q-card
      flat
      bordered
      class="q-pa-md text-center"
      style="width: 100%; max-width: 700px"
    >
      <div>
        <span v-if="paymentIntent === null"
          >Payment Intent Not Created Yet</span
        >
        <div v-else>
          <div>ID: {{ paymentIntent.id }}</div>
          <div>Client Secret: {{ paymentIntent.client_secret }}</div>
          <div>Amount: {{ paymentIntent.amount }}</div>
          <div>
            Status:
            <q-chip
              :label="paymentIntent.status"
              :color="paymentIntent.status != 'succeeded' ? 'info' : 'positive'"
              dark
              square
            />
          </div>
        </div>
      </div>
    </q-card>

    <!-- Inititate PaymentIntent process -->
    <q-card flat bordered class="q-pa-md" style="width: 100%; max-width: 700px">
      <div class="text-h5 text-center">Step 1: Create a PaymentIntent</div>
      <div class="row justify-center items-center no-wrap q-gutter-x-md">
        <q-input
          v-model="amount"
          type="number"
          :rules="[
            (val) => !!val || 'Amount Required',
            (val) => Number.parseInt(val) >= 50 || 'Amount must be at least 50',
            (val) =>
              Number.parseInt(val) <= 9999999 ||
              'Amount must not exceed 9999999',
          ]"
          lazy-rules
          :disable="paymentIntent !== null"
        />
        <q-btn
          unelevated
          color="primary"
          :label="buttonLabel"
          no-caps
          size="1rem"
          :disable="amount < 50 || amount > 9999999 || paymentIntent !== null"
          @click="createPaymentIntent(amount)"
        />
      </div>
    </q-card>

    <!-- Collect Payment Information -->
    <q-card
      v-if="paymentIntent"
      flat
      bordered
      class="q-pa-md"
      style="width: 100%; max-width: 700px"
    >
      <div class="text-h5 text-center">Step 2: Collect Payment Information</div>
      <q-card-section>
        <div class="column q-gutter-y-md">
          <stripe-card-3 />
          <q-btn
            color="primary"
            label="Pay What You Owe"
            no-caps
            unelevated
            @click="confirmCardPayment"
            :disable="!canPay"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { computed, defineComponent, onUnmounted, ref } from 'vue';

import useStripe from 'src/composables/useStripe';

import StripeCard3 from 'src/components/StripeCard3.vue';

import { convertStripeAmountToPrice } from 'src/api/helpers';
import { PaymentIntent, StripeCardElement } from '@stripe/stripe-js';

export default defineComponent({
  components: { StripeCard3 },
  setup() {
    onUnmounted(() => {
      useStripe().updatePaymentIntent(null);
      useStripe().cardElement.value?.unmount();
    });

    const amount = ref(0);
    const buttonLabel = computed(() => {
      const amountUsd = convertStripeAmountToPrice(amount.value, 'usd');
      return `Ready to Pay ${amountUsd}`;
    });

    const canPay = ref(true);
    const confirmCardPayment = async () => {
      canPay.value = false;

      const stripe = await useStripe().getStripeApi();
      if (stripe && useStripe().readyToPay.value) {
        const clientSecret = useStripe().paymentIntent.value?.client_secret;

        await stripe
          .confirmCardPayment(clientSecret as string, {
            payment_method: {
              card: useStripe().cardElement.value as StripeCardElement,
              billing_details: {
                name: 'Fred Fuchs', // replace with logic to get user's name
              },
            },
          })
          .then((response) => {
            useStripe().updatePaymentIntent(
              response.paymentIntent as PaymentIntent
            );

            if (response.error) {
              // Show error to your customer (e.g., insufficient funds)
              console.error(response.error.message);
            } else {
              // The payment has been processed!
              if (response.paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.Payment
              }
            }
          });
      } else {
        alert('Please have PaymentIntent and card details ready before paying');
      }

      canPay.value = true;
    };

    return {
      amount,
      buttonLabel,
      paymentIntent: useStripe().paymentIntent,
      createPaymentIntent: useStripe().createPaymentIntent,
      confirmCardPayment,
      canPay,
      readyToPay: useStripe().readyToPay,
    };
  },
});
</script>

<style lang="scss" scoped></style>
