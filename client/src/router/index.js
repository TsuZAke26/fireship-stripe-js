import Vue from "vue";
import VueRouter from "vue-router";

// View components
import Home from "../views/Home.vue";
import Checkout from "../views/Checkout.vue";
import Customers from "../views/Customers.vue";
import Payments from "../views/Payments.vue";
import Subscriptions from "../views/Subscriptions.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/checkout",
    name: "Checkout",
    component: Checkout,
  },
  {
    path: "/customers",
    name: "Customers",
    component: Customers,
  },
  {
    path: "/payments",
    name: "Payments",
    component: Payments,
  },
  {
    path: "/subscriptions",
    name: "Subscriptions",
    component: Subscriptions,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
