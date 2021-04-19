<template>
  <q-card flat bordered>
    <!-- Item image -->
    <q-img
      :src="item.images[0]"
      style="max-height: 200px"
      no-spinner
      placeholder-src="~assets/product-img-placeholder.png"
      :ratio="1"
    />

    <q-separator />

    <q-card-section>
      <!-- Item name -->
      <div class="ellipsis text-subtitle1 text-weight-bold">
        {{ item.name }}
      </div>

      <!-- Item price -->
      <div class="text-body1 text-weight-medium">{{ price }}</div>

      <!-- Add to Cart button -->
      <q-btn
        unelevated
        color="primary"
        label="Add to Cart"
        no-caps
        @click="handleAddToCart"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';
import useShoppingCart from 'src/composables/useShoppingCart';

import {
  inventoryItemToCartItem,
  convertStripeAmountToPrice,
} from 'src/api/helpers';

import { InventoryItem } from 'src/interfaces/IInventoryItem';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<InventoryItem>,
      required: true,
    },
  },
  setup(props) {
    const { item } = toRefs(props);

    const price = computed(() =>
      convertStripeAmountToPrice(item.value.amount, item.value.currency)
    );

    const handleAddToCart = () => {
      useShoppingCart().addCartItem(inventoryItemToCartItem(item.value));
    };

    return { price, handleAddToCart };
  },
});
</script>

<style scoped></style>
