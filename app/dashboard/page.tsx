import { redirect } from "next/navigation"
import { cookies } from "next/headers"

// /dashboard is protected by middleware.
// Authenticated users land here after login — redirect them straight to the
// seller dashboard for now. A buyer-specific dashboard can replace this later.
export default function DashboardPage() {
  const uid = cookies().get("firebase-session")?.value
  if (!uid) redirect("/login")
  redirect("/seller")
}
