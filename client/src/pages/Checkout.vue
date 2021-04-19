<template>
  <q-page padding class="column items-center q-gutter-y-md">
    <span class="text-h4">Select Items for Checkout</span>

    <Suspense>
      <template #default>
        <product-catalog />
      </template>

      <template #fallback>
        <q-spinner color="primary" size="xl" />
      </template>
    </Suspense>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ProductCatalog from 'components/ProductCatalog.vue';

export default defineComponent({
  name: 'Checkout',
  components: {
    ProductCatalog,
  },
  setup() {
    const handleStripeCheckout = () => {
      alert('Handing off to Stripe...');
    };

    return { handleStripeCheckout };
  },
});
</script>

<style scoped></style>
