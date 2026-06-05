import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase/server"
import { StatsCard } from "@/components/seller/StatsCard"
import { EarningsChart } from "@/components/seller/EarningsChart"
import { RecentOrders } from "@/components/seller/RecentOrders"
import { DollarSign, ShoppingBag, Package, TrendingUp } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function SellerDashboardPage() {
  const cookieStore = cookies()
  const uid = cookieStore.get("firebase-session")?.value

  if (!uid) {
    redirect("/login?from=/seller")
  }

  // 1. Get the seller's profile ID
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("id, is_seller, username")
    .eq("firebase_uid", uid)
    .single()

  if (profileError || !profile) {
    console.error("Profile fetch error:", profileError)
    redirect("/login")
  }

  // Optional: Gatekeep non-sellers
  if (!profile.is_seller) {
    // redirect("/become-seller") // Or some other handling
  }

  const sellerId = profile.id

  // 2. Fetch Aggregated Stats
  const [
    { data: revenueData },
    { count: salesCount },
    { count: listingsCount },
  ] = await Promise.all([
    supabaseAdmin
      .from("order_items")
      .select("seller_payout")
      .eq("seller_id", sellerId),
    supabaseAdmin
      .from("order_items")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", sellerId),
    supabaseAdmin
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .eq("status", "published"),
  ])

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.seller_payout), 0) || 0
  const totalSales = salesCount || 0
  const activeListings = listingsCount || 0

  // 3. Fetch Recent Orders
  // Join order_items -> orders to get status and date
  const { data: recentOrdersData } = await supabaseAdmin
    .from("order_items")
    .select(`
      id,
      created_at,
      seller_payout,
      order:orders (
        id,
        status,
        total_amount
      ),
      product:products (
        title
      )
    `)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(5)

  const recentOrders = (recentOrdersData || []).map(item => ({
    id: item.order.id,
    created_at: item.created_at,
    total_amount: Number(item.seller_payout),
    status: item.order.status,
    items: [{ product: { title: item.product.title } }]
  }))

  // 4. Mock Chart Data (Group by month in a real app, here we mock for the last 6 months)
  const mockChartData = [
    { month: "JAN", amount: 15000 },
    { month: "FEB", amount: 32000 },
    { month: "MAR", amount: 28000 },
    { month: "APR", amount: 45000 },
    { month: "MAY", amount: 38000 },
    { month: "JUN", amount: totalRevenue > 0 ? Math.min(totalRevenue, 60000) : 12000 },
  ]

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Welcome back, {profile.username || "Creator"}<span className="text-amber-400">.</span>
          </h1>
          <p className="text-white/40 font-medium">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Store Live</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          subValue="Life-time earnings"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          label="Total Sales"
          value={totalSales}
          subValue="Successful transactions"
          icon={ShoppingBag}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          label="Active Listings"
          value={activeListings}
          subValue="Products on marketplace"
          icon={Package}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Chart */}
        <div className="lg:col-span-8">
          <EarningsChart data={mockChartData} />
        </div>
        
        {/* Small Progress/Activity Widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-xl shadow-amber-400/10 h-full flex flex-col justify-between group">
            <div className="space-y-2">
              <div className="p-2 w-fit bg-black/20 rounded-lg backdrop-blur-md">
                <TrendingUp size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-black pt-2">Next Payout</h3>
              <p className="text-black/60 text-sm leading-tight">Your scheduled payout of ₹12,450 will be processed on June 15th.</p>
            </div>
            <button className="mt-8 w-full py-3 bg-black text-white text-xs font-bold rounded-xl hover:bg-black/80 transition-colors uppercase tracking-widest">
              View Payout History
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <RecentOrders orders={recentOrders} />
    </div>
  )
}
