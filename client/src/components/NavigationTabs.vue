<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ name: 'Home' }">
        <img alt="Vue logo" src="@/assets/logo.png" />
        <span>-Cart</span>
      </b-navbar-item>
    </template>
    <template #start>
      <!-- Generate list of routes to navigate to -->
      <b-navbar-item
        v-for="navItem in navItems"
        :key="navItem.route"
        tag="router-link"
        :to="{ name: navItem.route }"
      >
        {{ navItem.label }}
      </b-navbar-item>

      <b-navbar-item tag="router-link" :to="{ name: 'About' }">
        About
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {
  name: "NavigationTabs",
  data() {
    return {
      navItems: [
        {
          label: "Checkout",
          route: "Checkout",
        },
        {
          label: "Customers",
          route: "Customers",
        },
        {
          label: "Payments",
          route: "Payments",
        },
        {
          label: "Subscriptions",
          route: "Subscriptions",
        },
      ],
    };
  },
};
</script>
