import { computed, ref, Ref } from 'vue';
import {
  createClient,
  Session,
  SupabaseClient,
  UserCredentials,
} from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_API_URL as string,
  process.env.SUPABASE_API_KEY as string
);

supabase.auth.onAuthStateChange((event, session) => {
  console.log('event: ', event);

  if (event === 'SIGNED_IN') {
    currentSession.value = session;
  } else if (event === 'SIGNED_OUT') {
    currentSession.value = null;
  }
});

const currentSession: Ref<Session | null> = ref(null);
const currentUser = computed(() => currentSession.value?.user);
const currentUserAuth = computed(() => currentSession.value?.access_token);

function verifyUserCredentials(credentials: UserCredentials) {
  const { email, password } = credentials;
  return !!email && !!password;
}

const useSupabase = () => {
  const signUp = async (credentials: UserCredentials) => {
    try {
      // Verify user credentials
      if (!verifyUserCredentials(credentials)) {
        alert('Please provide both your email and password.');
        return 0;
      }

      // Attempt to sign up user with given credentials
      const { email, password } = credentials;
      const { user, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        throw error;
      } else {
        // Add user data to 'users' table in public schema after successful sign up
        const { error } = await supabase
          .from('users')
          .insert({ id: user?.id, email: user?.email });

        if (error) {
          throw error;
        }

        alert('Signup successful!');
        return 1;
      }
    } catch (error) {
      console.error('Signup error: ', error);
      return 0;
    }
  };

  const signIn = async (credentials: UserCredentials) => {
    try {
      // Verify user credentials
      if (!verifyUserCredentials(credentials)) {
        alert('Please provide both your email and password.');
        return 0;
      }

      // Attempt to sign in user with given credentials
      const { email, password } = credentials;
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        throw error;
      } else {
        return 1;
      }
    } catch (error) {
      console.error('Log in error: ', error);
      return 0;
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

  return {
    supabase,
    currentUser,
    currentUserAuth,
    currentSession,
    signUp,
    signIn,
    signOut,
  };
};

export default useSupabase;
