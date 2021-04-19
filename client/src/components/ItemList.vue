<template>
  <div class="row no-wrap items-center q-gutter-md">
    <img
      :src="item.images[0]"
      class="col-auto"
      style="
        height: 100%;
        max-height: 75px;
        width: 100%;
        max-width: 75px;
        fit: contain;
      "
    />

    <div class="col ellipsis text-subtitle1 text-weight-bold">
      {{ item.name }}
    </div>

    <q-space />

    <span class="col-auto text-body1 text-weight-bold text-black">
      {{ price }}
    </span>

    <div class="col-auto">
      <div class="column items-center q-gutter-xs">
        <q-btn
          size="xs"
          icon="mdi-plus"
          color="primary"
          unelevated
          @click="changeItemQuantity(item, 1)"
          dense
          round
        />

        <span>{{ item.quantity }}</span>

        <q-btn
          size="xs"
          icon="mdi-minus"
          color="primary"
          unelevated
          @click="changeItemQuantity(item, -1)"
          dense
          round
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, toRefs } from 'vue';
import useShoppingCart from 'src/composables/useShoppingCart';

import { CartItem } from 'src/interfaces/ICartItem';

import { convertStripeAmountToPrice } from 'src/api/helpers';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<CartItem>,
      required: true,
    },
  },
  setup(props) {
    const { item } = toRefs(props);

    const price = computed(() =>
      convertStripeAmountToPrice(
        item.value.amount * item.value.quantity,
        item.value.currency
      )
    );

    return { price, changeItemQuantity: useShoppingCart().changeItemQuantity };
  },
});
</script>

<style scoped></style>
