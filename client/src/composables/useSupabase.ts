import { computed } from 'vue';
import {
  createClient,
  SupabaseClient,
  UserCredentials,
} from '@supabase/supabase-js';

let supabase: SupabaseClient;

const useSupabase = () => {
  const initSupabase = () => {
    supabase = createClient(
      process.env.SUPABASE_API_URL as string,
      process.env.SUPABASE_API_KEY as string
    );
  };

  const signUp = async (credentials: UserCredentials) => {
    try {
      const { email, password } = credentials;
      if (!email || !password) {
        alert('Please provide both your email and password.');
        return;
      }

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        console.error(`Error signing up: ${error.message}`);
        return;
      }

      alert('Signup successful!');
    } catch (error) {
      console.error('Signup error: ', error);
    }
  };

  const signIn = async (credentials: UserCredentials) => {
    try {
      const { email, password } = credentials;
      if (!email || !password) {
        alert('Please provide both your email and password.');
        return;
      }

      const { error } = await supabase.auth.signIn({
        email,
        password,
      });
      if (error) {
        console.error(`Error logging in: ${error.message}`);
        return;
      }
    } catch (error) {
      console.error('Log in error: ', error);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Sign out error: ', error);
    }
  };

  const currentUser = computed(() => supabase?.auth.user());
  const currentSession = computed(() => supabase?.auth.session());

  return {
    supabase,
    initSupabase,
    currentUser,
    currentSession,
    signUp,
    signIn,
    signOut,
  };
};

export default useSupabase;
