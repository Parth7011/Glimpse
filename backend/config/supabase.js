import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !(supabaseAnonKey || supabaseServiceKey)) {
  throw new Error('Supabase URL and Key must be provided in environment variables.');
}

// Default client — uses service role key so the backend can read/write all rows.
// RLS policies scoped to auth.uid() are still active for anon/user calls.
const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

// Admin client — explicitly bypasses ALL RLS.
// Use ONLY for trusted server-side operations (e.g. inserting a photographer row on signup).
export const adminSupabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    headers: { 'x-supabase-auth-token': '' },
  },
});

export default supabase;
