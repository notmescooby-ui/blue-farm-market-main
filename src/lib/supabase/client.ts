import { createClient } from "@supabase/supabase-js";

/**
 * BlueFarm's existing Supabase project. Only the publishable (anon) key lives
 * here — it is designed to be public and is protected by Row Level Security.
 * The service-role key must never be placed in this file or any client code.
 */
export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  "https://ttipwqpiwqwejvxtzqqn.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  "sb_publishable_2cW0EppUpaTpRhuumLGzMA_0JS00vKw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
