<template>
  <div class="column q-gutter-y-md" style="width: 100%; max-width: 1023px">
    <!-- Step 1: Create SetupIntent for new card -->
    <q-card flat bordered class="column items-center">
      <q-card-section>
        <div class="text-h5 text-center">Step 1: Create a SetupIntent</div>
      </q-card-section>

      <q-card-section>
        <q-btn
          label="Attach New Credit Card"
          unelevated
          color="primary"
          @click="createSetupIntent"
        />
      </q-card-section>
    </q-card>

    <!-- Step 2: Submit a Payment Method -->
    <q-card v-if="setupIntent" flat bordered>
      <q-card-section>
        <div class="text-h5 text-center">Step 2: Submit a Payment Method</div>
      </q-card-section>

      <q-card-section class="column q-gutter-y-md">
        <stripe-card-3 />
        <q-btn
          label="Save New Credit Card"
          unelevated
          color="primary"
          :disable="!readyToSaveCard"
          @click="saveNewPaymentMethod"
        />
      </q-card-section>
    </q-card>

    <q-separator spaced />

    <q-card flat bordered class="row justify-center">
      <q-card-section>
        <div class="text-h5 text-center">Retrieve All Payment Sources</div>

        <q-select
          v-model="selectedCard"
          v-if="wallet && wallet.length > 0"
          :options="wallet"
        />
        <div v-else class="text-h6 text-center">No Payment Methods Saved</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, Ref, ref } from 'vue';
import {
  PaymentMethod,
  SetupIntent,
  StripeCardElement,
} from '@stripe/stripe-js';

import useStripe from 'src/composables/useStripe';
import useSupabase from 'src/composables/useSupabase';

import StripeCard3 from 'src/components/StripeCard3.vue';

import { fetchFromAPI, transformStripeCardToString } from 'src/api/helpers';

export default defineComponent({
  components: { StripeCard3 },
  setup() {
    onBeforeMount(() => void getPaymentMethods());

    const paymentMethods: Ref<PaymentMethod[] | null> = ref(null);
    const getPaymentMethods = async () => {
      if (useSupabase().currentUser.value) {
        paymentMethods.value = (await fetchFromAPI('wallet', {
          method: 'GET',
        })) as PaymentMethod[];

        selectedCard.value = transformStripeCardToString(
          paymentMethods.value[0].card
        );
      }
    };

    const wallet = computed(() =>
      paymentMethods.value?.map((paymentMethod) =>
        transformStripeCardToString(paymentMethod.card)
      )
    );

    const saveNewPaymentMethod = async () => {
      const stripe = await useStripe().getStripeApi();

      if (stripe) {
        const { setupIntent: updatedSetupIntent, error } =
          await stripe.confirmCardSetup(
            useStripe().setupIntent.value?.client_secret as string,
            {
              payment_method: {
                card: useStripe().cardElement.value as StripeCardElement,
              },
            }
          );

        if (error) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          alert(error.message);
          console.error(error);
        } else {
          useStripe().updateSetupIntent(updatedSetupIntent as SetupIntent);
          await getPaymentMethods();
          alert('Card added successfully to wallet');
        }
      }
    };

    const selectedCard = ref('');

    return {
      wallet,
      getPaymentMethods,
      setupIntent: useStripe().setupIntent,
      createSetupIntent: useStripe().createSetupIntent,
      readyToSaveCard: useStripe().readyToSaveCard,
      saveNewPaymentMethod,
      selectedCard,
    };
  },
});
</script>

<style scoped></style>
