<template>
  <q-page padding class="column items-center">
    <span class="text-h4">Customer Payment Details</span>

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

    <div v-else class="column items-center justify-center q-mt-md">
      <span>Welcome, {{ currentUser.email }}</span>

      <!-- Space for showing cards (?) -->
      <div class="q-mt-md">
        <q-btn
          label="Sign Out"
          unelevated
          color="primary"
          @click="handleSignOut"
        />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import useSupabase from 'src/composables/useSupabase';

export default defineComponent({
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
    };
  },
});
</script>

<style scoped></style>
