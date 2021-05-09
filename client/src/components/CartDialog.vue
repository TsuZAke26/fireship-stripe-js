<template>
  <q-card flat bordered style="width: 100%; max-width: 800px">
    <!-- Header -->
    <q-card-section class="row no-wrap items-center">
      <div class="text-h6">Cart</div>

      <q-space />

      <q-btn icon="mdi-close" flat round dense v-close-popup />
    </q-card-section>

    <!-- List of Items in Cart -->
    <q-card-section v-if="cartItems.length" class="column q-col-gutter-y-md">
      <item-list
        v-for="cartItem in cartItems"
        :key="cartItem.id"
        :item="cartItem"
      />
    </q-card-section>

    <!-- Placeholder for empty cart -->
    <q-card-section v-else>
      <div class="flex flex-center text-h6">Cart is Empty</div>
    </q-card-section>

    <q-separator color="grey-6" inset spaced size="0.1rem" />

    <!-- Cart Subtotal -->
    <q-card-section>
      <div class="row no-wrap items-center">
        <span class="text-h6">Subtotal</span>

        <q-space />

        <span class="text-h6 text-weight-bold text-black">
          {{ cartSubtotal }}
        </span>
      </div>
    </q-card-section>

    <!-- Cart actions -->
    <q-card-actions align="right">
      <q-btn
        color="secondary"
        label="Clear Cart"
        no-caps
        unelevated
        size="1rem"
        @click="clearCart"
      />

      <q-btn
        color="primary"
        label="Checkout"
        no-caps
        unelevated
        size="1rem"
        @click="handleCheckout"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { defineComponent } from 'vue';

import useStripe from 'src/composables/useStripe';
import useShoppingCart from 'src/composables/useShoppingCart';

import ItemList from 'src/components/ItemList.vue';

import { fetchFromAPI } from 'src/api/helpers';

export default defineComponent({
  components: {
    ItemList,
  },
  setup() {
    const handleCheckout = async () => {
      const stripe = await useStripe().getStripeApi();

      if (stripe != null) {
        const body = {
          line_items: useShoppingCart().cartItems.map((cartItem) =>
            useShoppingCart().convertCartItemToStripeLineItem(cartItem)
          ),
        };

        const { id: sessionId } = await fetchFromAPI(
          'create-checkout-session',
          { body }
        );

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error(error.message);
        }
      }
    };

    return {
      cartItems: useShoppingCart().cartItems,
      cartSubtotal: useShoppingCart().cartSubtotal,
      clearCart: useShoppingCart().clearCart,
      handleCheckout,
    };
  },
});
</script>

<style scoped></style>
