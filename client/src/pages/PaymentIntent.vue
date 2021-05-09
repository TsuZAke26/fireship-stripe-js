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
        <stripe-card />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { computed, defineComponent, ref } from 'vue';

import useStripe from 'src/composables/useStripe';

import StripeCard from 'src/components/StripeCard.vue';

import { convertStripeAmountToPrice } from 'src/api/helpers';

export default defineComponent({
  components: { StripeCard },
  setup() {
    const amount = ref(0);
    const buttonLabel = computed(() => {
      const amountUsd = convertStripeAmountToPrice(amount.value, 'usd');
      return `Ready to Pay ${amountUsd}`;
    });

    return {
      amount,
      buttonLabel,
      paymentIntent: useStripe().paymentIntent,
      createPaymentIntent: useStripe().createPaymentIntent,
    };
  },
});
</script>

<style lang="scss" scoped></style>
