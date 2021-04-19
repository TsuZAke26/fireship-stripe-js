<template>
  <div class="row justify-start q-col-gutter-sm" style="max-width: 700px">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="col-xs-6 col-sm-4 col-md-3"
    >
      <item-card :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import useProductInventory from 'src/composables/useProductInventory';

import ItemCard from 'src/components/ItemCard.vue';

export default defineComponent({
  name: 'ProductCatalog',
  components: { ItemCard },
  async setup() {
    await useProductInventory().fetchProductCatalog();

    return { items: useProductInventory().productInventory };
  },
});
</script>
