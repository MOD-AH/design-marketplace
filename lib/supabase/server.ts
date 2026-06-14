import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type SupabaseAdminClient = ReturnType<typeof createClient<Database>>;

let _adminClient: SupabaseAdminClient | null = null;

function getAdminClient(): SupabaseAdminClient {
  if (!_adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error(
        "Missing Supabase server environment variables. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
      );
    }

    _adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return _adminClient;
}

// Only import in Server Components / Route Handlers — never expose to the client.
export function createServerClient(): SupabaseAdminClient {
  return getAdminClient();
}

export const supabaseAdmin = new Proxy({} as SupabaseAdminClient, {
  get(_target, prop: string | symbol) {
    const client = getAdminClient();
    const value = client[prop as keyof SupabaseAdminClient];
    // eslint-disable-next-line @typescript-eslint/ban-types
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});
