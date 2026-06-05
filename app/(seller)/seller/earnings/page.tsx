import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { DollarSign, ShoppingBag, TrendingUp, Banknote } from "lucide-react"
import { supabaseAdmin } from "@/lib/supabase/server"
import { StatsCard } from "@/components/seller/StatsCard"
import { EarningsBarChart, type MonthlyPoint } from "./EarningsBarChart"
import { PayoutButton } from "./PayoutButton"

export const metadata: Metadata = { title: "Earnings | Designr" }
export const dynamic = "force-dynamic"

// ── Types ─────────────────────────────────────────────────────────────────────

type RawItem = {
  id: string
  price_at_purchase: number
  platform_fee: number
  seller_payout: number
  created_at: string
  products: { title: string } | null
  orders: {
    id: string
    status: string
    created_at: string
    profiles: { full_name: string | null; username: string | null } | null
  } | null
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`
}

type BuyerProfile = { full_name: string | null; username: string | null } | null
function buyerFirstName(profiles: BuyerProfile): string {
  if (!profiles) return "Anonymous"
  const name = profiles.full_name ?? profiles.username ?? ""
  return name.split(" ")[0] || "Anonymous"
}

function buildMonthlyData(items: RawItem[]): MonthlyPoint[] {
  const now = new Date()
  const points: MonthlyPoint[] = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    return {
      label: d.toLocaleDateString("en-IN", { month: "short" }),
      earnings: 0,
      isCurrent: i === 11,
    }
  })

  const startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  const startYM = startDate.getFullYear() * 12 + startDate.getMonth()

  for (const item of items) {
    const d = new Date(item.created_at)
    const ym = d.getFullYear() * 12 + d.getMonth()
    const idx = ym - startYM
    const pt = idx >= 0 && idx < 12 ? points[idx] : undefined
    if (pt) pt.earnings += item.seller_payout
  }

  return points
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EarningsPage() {
  const uid = cookies().get("firebase-session")?.value
  if (!uid) redirect("/login?from=/seller/earnings")

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, is_seller")
    .eq("firebase_uid", uid)
    .single()

  if (!profile) redirect("/login")
  if (!profile.is_seller) redirect("/")

  const sellerId = profile.id

  // ── Fetch order items with product title + buyer profile ─────────────────
  const { data: rawItems } = await supabaseAdmin
    .from("order_items")
    .select(`
      id, price_at_purchase, platform_fee, seller_payout, created_at,
      products ( title ),
      orders (
        id, status, created_at,
        profiles!buyer_id ( full_name, username )
      )
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })

  const items = (rawItems ?? []) as unknown as RawItem[]
  const completedItems = items.filter((i) => i.orders?.status === "completed")

  // ── Fetch payouts ─────────────────────────────────────────────────────────
  const { data: payouts } = await supabaseAdmin
    .from("payouts")
    .select("amount, status")
    .eq("seller_id", sellerId)

  const paid = (payouts ?? [])
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0)

  const pendingAmount = (payouts ?? [])
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((s, p) => s + p.amount, 0)

  const hasPendingPayout = pendingAmount > 0

  // ── Derived stats ─────────────────────────────────────────────────────────
  const lifetimeEarnings = completedItems.reduce((s, i) => s + i.seller_payout, 0)
  const availableForPayout = Math.max(0, lifetimeEarnings - paid - pendingAmount)
  const monthlyData = buildMonthlyData(completedItems)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          Earnings
        </h1>
        <p className="mt-1 font-medium text-white/40">
          Your revenue, payouts, and transaction history.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Lifetime Earnings"
          value={formatINR(lifetimeEarnings)}
          subValue="Seller payout from all orders"
          icon={DollarSign}
        />

        {/* Available for payout — custom card with embedded button */}
        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#111318] p-6 transition-colors hover:border-white/10">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-1/2 translate-x-1/2 bg-amber-400/5 blur-3xl" />
          <div className="relative z-10 mb-4 flex items-center justify-between">
            <div className="rounded-xl bg-white/5 p-2.5">
              <Banknote size={20} className="text-amber-400" />
            </div>
          </div>
          <div className="relative z-10 mb-5">
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-white/40">
              Available for Payout
            </p>
            <h3 className="text-3xl font-bold tracking-tight text-white">
              {formatINR(availableForPayout)}
            </h3>
            {hasPendingPayout && (
              <p className="mt-1 text-xs text-amber-400/80">
                {formatINR(pendingAmount)} payout in progress
              </p>
            )}
          </div>
          <PayoutButton
            available={availableForPayout}
            hasPendingPayout={hasPendingPayout}
          />
        </div>

        <StatsCard
          label="Completed Orders"
          value={completedItems.length.toLocaleString()}
          subValue="Successful transactions"
          icon={ShoppingBag}
        />
        <StatsCard
          label="Total Paid Out"
          value={formatINR(paid)}
          subValue="Across all processed payouts"
          icon={TrendingUp}
        />
      </div>

      {/* Bar chart */}
      <EarningsBarChart data={monthlyData} />

      {/* Orders table */}
      <div className="overflow-hidden rounded-2xl border border-white/5">
        <div className="border-b border-white/5 bg-white/[0.02] px-6 py-4">
          <h2 className="text-base font-bold text-white">Transaction History</h2>
          <p className="mt-0.5 text-xs text-white/30">
            {completedItems.length} completed order{completedItems.length !== 1 ? "s" : ""}
          </p>
        </div>

        {completedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <ShoppingBag size={32} className="text-white/10" />
            <p className="text-sm text-white/30">No completed orders yet</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-[1fr_120px_110px_120px_120px_110px] gap-4 border-b border-white/5 bg-white/[0.015] px-6 py-3">
                {[
                  "Product", "Buyer", "Sale Amount",
                  "Platform Fee", "Your Payout", "Date",
                ].map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold uppercase tracking-widest text-white/30"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[1fr_120px_110px_120px_120px_110px] items-center gap-4 border-b border-white/5 px-6 py-4 last:border-0 hover:bg-white/[0.02]"
                >
                  <p className="truncate text-sm font-medium text-white">
                    {item.products?.title ?? "—"}
                  </p>
                  <p className="text-sm text-white/60">
                    {buyerFirstName(item.orders?.profiles ?? null)}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {formatINR(item.price_at_purchase)}
                  </p>
                  <p className="text-sm text-rose-400/80">
                    −{formatINR(item.platform_fee)}
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">
                    +{formatINR(item.seller_payout)}
                  </p>
                  <p className="text-xs text-white/30">
                    {formatDate(item.orders?.created_at ?? item.created_at)}
                  </p>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-white/5 lg:hidden">
              {completedItems.map((item) => (
                <div key={item.id} className="space-y-3 px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 text-sm font-semibold text-white">
                      {item.products?.title ?? "—"}
                    </p>
                    <p className="shrink-0 text-sm font-bold text-emerald-400">
                      +{formatINR(item.seller_payout)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                    <span>Buyer: {buyerFirstName(item.orders?.profiles ?? null)}</span>
                    <span>Sale: {formatINR(item.price_at_purchase)}</span>
                    <span className="text-rose-400/70">Fee: −{formatINR(item.platform_fee)}</span>
                    <span>{formatDate(item.orders?.created_at ?? item.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
