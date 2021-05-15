<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- Hamburger Menu button -->
        <q-btn
          flat
          dense
          round
          icon="mdi-menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Fireship Stripe Store </q-toolbar-title>

        <!-- Access Cart -->
        <q-btn
          icon="mdi-cart"
          size="md"
          unelevated
          round
          @click="cartOpen = true"
        >
          <q-badge v-if="cartSize > 0" color="positive" floating>
            {{ cartSize }}
          </q-badge>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      :width="220"
      show-if-above
      bordered
      class="bg-grey-1"
    >
      <q-list separator>
        <q-item-label header class="text-grey-8">Main Menu</q-item-label>

        <q-item
          v-for="nav in navMenu"
          :key="nav.label"
          clickable
          :to="nav.route"
          exact
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>

          <q-item-section>{{ nav.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-dialog v-model="cartOpen">
      <cart-dialog />
    </q-dialog>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useShoppingCart from 'src/composables/useShoppingCart';

import CartDialog from 'src/components/CartDialog.vue';

export default defineComponent({
  name: 'MainLayout',
  components: {
    CartDialog,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const cartOpen = ref(false);

    const navMenu = [
      {
        label: 'Home',
        icon: 'mdi-home',
        route: {
          name: 'Home',
        },
      },
      {
        label: 'Stripe Checkout Demo',
        icon: 'mdi-cart-outline',
        route: {
          name: 'Checkout',
        },
      },
      {
        label: 'Payment Demo',
        icon: 'mdi-cash',
        route: {
          name: 'PaymentIntent',
        },
      },
      {
        label: 'Customers Demo',
        icon: 'mdi-account-circle',
        route: {
          name: 'Customers',
        },
      },
    ];

    return {
      navMenu,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      cartOpen,
      cartSize: useShoppingCart().cartSize,
    };
  },
});
</script>
