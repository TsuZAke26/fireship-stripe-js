import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabase: SupabaseClient = createClient(
  process.env.SUPABASE_API_URL as string,
  process.env.SUPABASE_API_KEY as string
);

export default supabase;
