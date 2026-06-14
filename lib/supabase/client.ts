import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type SupabaseBrowserClient = ReturnType<typeof createClient<Database>>;

let _browserClient: SupabaseBrowserClient | null = null;

function getBrowserClient(): SupabaseBrowserClient {
  if (!_browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
    }

    _browserClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return _browserClient;
}

export const supabase = new Proxy({} as SupabaseBrowserClient, {
  get(_target, prop: string | symbol) {
    const client = getBrowserClient();
    const value = client[prop as keyof SupabaseBrowserClient];
    // eslint-disable-next-line @typescript-eslint/ban-types
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});

// Alias kept for components that imported supabaseBrowser from the old lib/supabase.ts
export const supabaseBrowser = supabase;
