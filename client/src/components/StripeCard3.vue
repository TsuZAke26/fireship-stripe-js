<template>
  <div id="stripe-element-card"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import useStripe from 'src/composables/useStripe';

export default defineComponent({
  setup() {
    void useStripe()
      .initStripeApi()
      .then(() => {
        useStripe().createCardElement('#stripe-element-card');
      });

    return { card: useStripe().cardElement };
  },
});
</script>

<style scoped></style>
