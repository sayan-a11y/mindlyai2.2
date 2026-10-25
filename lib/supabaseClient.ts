import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://olzinesmtjlitmdxnlic.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9semluZXNtdGpsaXRtZHhubGljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4NDc5NTksImV4cCI6MjEwODQyMzk1OX0._8AHe4Lj4DjH6jK4SMFoyxO-MQ1S692zfV7JajWXHOM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
