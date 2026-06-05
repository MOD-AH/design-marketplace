import { supabase } from "@/lib/supabase"
import { NavbarClient } from "@/components/NavbarClient"

// Fetches categories server-side so the Browse dropdown is populated instantly,
// with no client waterfall. NavbarClient owns all interactive state.
export async function Navbar() {
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order")

  return <NavbarClient categories={categories ?? []} />
}
