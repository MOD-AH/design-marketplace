"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function requestPayout(
  amount: number,
): Promise<{ error?: string }> {
  const uid = cookies().get("firebase-session")?.value
  if (!uid) return { error: "Not authenticated" }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("firebase_uid", uid)
    .single()

  if (!profile) return { error: "Profile not found" }

  const { error } = await supabaseAdmin.from("payouts").insert({
    seller_id: profile.id,
    amount,
    status: "pending",
  })

  if (error) return { error: error.message }

  revalidatePath("/seller/earnings")
  return {}
}
