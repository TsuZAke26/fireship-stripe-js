<template>
  <q-page padding class="column items-center q-gutter-y-md">
    <span class="text-h4">Customer Payment Details</span>

    <div v-if="!currentUser" class="column items-center">
      <span class="q-mb-md">Please login</span>
      <div class="row items-center q-col-gutter-sm">
        <q-input v-model="email" label="Email" type="email" />
        <q-input v-model="password" label="Password" type="password" />
      </div>
      <div class="q-mt-md">
        <q-btn
          label="Sign In"
          unelevated
          color="primary"
          @click="handleSignIn"
        />
      </div>
    </div>

    <div v-else class="column items-center">
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

    const handleSignUp = async () => {
      await useSupabase().signUp({
        email: email.value,
        password: password.value,
      });
    };

    const handleSignIn = async () => {
      await useSupabase().signIn({
        email: email.value,
        password: password.value,
      });
    };

    const handleSignOut = async () => {
      await useSupabase().signOut();
    };

    return {
      email,
      password,
      handleSignUp,
      handleSignIn,
      handleSignOut,
      currentUser: useSupabase().currentUser,
      currentSession: useSupabase().currentSession,
    };
  },
});
</script>

<style scoped></style>
