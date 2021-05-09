<template>
  <div class="column q-gutter-y-md">
    <div id="stripe-element-card"></div>
    <q-btn
      color="primary"
      label="Pay What You Owe"
      no-caps
      unelevated
      @click="confirmCardPayment"
      :disable="!canPay"
    />
  </div>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue';
import { loadStripe } from '@stripe/stripe-js';

import useStripe from 'src/composables/useStripe';

export default defineComponent({
  data() {
    return {
      stripe: null,
      elements: null,
      card: null,
      canPay: true,
    };
  },
  beforeCreate() {
    void loadStripe(process.env.STRIPE_SECRET).then((response) => {
      // Get Stripe API as data member
      this.stripe = response;

      this.elements = this.stripe.elements();

      // Create Stripe card element and mount to DOM
      this.card = this.elements.create('card', {
        base: {
          color: '#32325d',
        },
      });
      this.card.mount('#stripe-element-card');
    });
  },
  methods: {
    confirmCardPayment() {
      this.canPay = false;

      const { client_secret: clientSecret } = useStripe().paymentIntent.value;
      void this.stripe
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card,
            billing_details: {
              name: 'Fred Fuchs',
            },
          },
        })
        .then((response) => {
          useStripe().updatePaymentIntent(response.paymentIntent);

          if (response.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.error(response.error.message);

            // Re-enable Pay button since payment failed
            this.canPay = true;
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
    },
  },
});
</script>

<style scoped></style>
