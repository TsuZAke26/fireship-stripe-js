<template>
  <q-page padding class="column items-center">
    <span class="text-h4">Customer Payment Details</span>

    <!-- User not signed in -->
    <div
      v-if="!currentUser"
      class="q-mt-md column justify-center q-gutter-y-md"
      style="width: 100%; max-width: 1023px"
    >
      <q-input v-model="email" label="Email" type="email" />
      <q-input v-model="password" label="Password" type="password" />
      <q-btn
        label="Login/Register"
        unelevated
        color="primary"
        @click="handleAuth"
      />
    </div>

    <!-- User signed in  -->
    <div
      v-else
      class="q-mt-md column q-gutter-y-md"
      style="width: 100%; max-width: 1023px"
    >
      <span class="row justify-center">Welcome, {{ currentUser.email }}</span>

      <customer-signed-in />

      <q-card flat bordered class="row justify-center">
        <q-card-section>
          <q-btn
            :label="`Sign Out ${currentUser.email}`"
            unelevated
            color="primary"
            @click="handleSignOut"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import useSupabase from 'src/composables/useSupabase';

import CustomerSignedIn from 'src/components/CustomerSignedIn.vue';

export default defineComponent({
  components: { CustomerSignedIn },
  setup() {
    const email = ref('');
    const password = ref('');

    const handleAuth = async () => {
      const credentials = {
        email: email.value,
        password: password.value,
      };

      const signInResult = await useSupabase().signIn(credentials);

      if (signInResult === 0) {
        const signUpResult = await useSupabase().signUp(credentials);

        if (signUpResult === 0) {
          alert('Unable to sign in or register this user');
        }
      }

      email.value = '';
      password.value = '';
    };

    const handleSignOut = async () => {
      await useSupabase().signOut();
    };

    return {
      email,
      password,
      handleAuth,
      handleSignOut,
      currentUser: useSupabase().currentUser,
      currentUserAuth: useSupabase().currentUserAuth,
    };
  },
});
</script>

<style scoped></style>
