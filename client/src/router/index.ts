import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Checkout from "src/views/Checkout.vue";
import Customers from "src/views/Customers.vue";
import Payments from "src/views/Payments.vue";
import Subscriptions from "src/views/Subscriptions.vue";

const routes: Array<RouteRecordRaw> = [
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
    path: "/",
    name: "Checkout",
    component: Checkout,
  },
  {
    path: "/",
    name: "Customers",
    component: Customers,
  },
  {
    path: "/",
    name: "Payments",
    component: Payments,
  },
  {
    path: "/",
    name: "Subscriptions",
    component: Subscriptions,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
