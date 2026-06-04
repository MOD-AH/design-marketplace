import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Returns a Supabase client that authenticates every request with a Firebase
// ID token. Supabase Third-Party Auth verifies the token against Firebase JWKS
// so RLS policies that read current_setting('app.firebase_uid') work correctly.
// Use this client in components/hooks that have access to the current ID token;
// use supabaseAdmin (server.ts) for service-role operations in Route Handlers.
export function createSupabaseAuthClient(firebaseIdToken: string) {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: { Authorization: `Bearer ${firebaseIdToken}` },
      },
      auth: { persistSession: false },
    }
  );
}
