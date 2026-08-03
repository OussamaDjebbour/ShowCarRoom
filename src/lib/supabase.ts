import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client — singleton initialized from Vite env vars.
 *
 * Only the anon public key is used here; the service role key is never
 * imported into client code (it bypasses RLS and must stay server-side).
 *
 * Env vars (pre-populated in .env):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // In dev this surfaces immediately; in a misconfigured build the app
  // will still render but every query will fail visibly.
  console.error(
    "[supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Copy .env.example to .env and fill in the values.",
  );
}

export const supabase = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

/** Storage bucket name for vehicle photos. */
export const CAR_IMAGES_BUCKET = "car-images";
