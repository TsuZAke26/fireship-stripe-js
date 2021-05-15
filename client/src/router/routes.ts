import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('pages/Index.vue'),
      },
      {
        path: 'checkout',
        name: 'Checkout',
        component: () => import('pages/Checkout.vue'),
      },
      {
        path: 'checkout/failed',
        name: 'CheckoutFailed',
        component: () => import('pages/CheckoutFailed.vue'),
      },
      {
        path: 'checkout/success',
        name: 'CheckoutSuccess',
        component: () => import('pages/CheckoutSuccess.vue'),
      },
      {
        path: 'payment-intent',
        name: 'PaymentIntent',
        component: () => import('pages/PaymentIntent.vue'),
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('pages/Customers.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
