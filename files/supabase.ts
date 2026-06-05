import { createClient } from "@supabase/supabase-js"

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ── Browser client (use inside client components) ──────────
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnon)

// ── Server client (use inside server components & API routes)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: { persistSession: false },
  })
}
