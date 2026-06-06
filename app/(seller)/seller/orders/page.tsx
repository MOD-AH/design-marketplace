import type { Metadata } from "next"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = { title: "Orders | Designr" }

export default function SellerOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Orders</h1>
        <p className="mt-1 text-white/40">Track every sale and manage fulfilment.</p>
      </div>

      <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center">
          <ShoppingBag className="text-amber-400" size={28} />
        </div>
        <h2 className="text-xl font-bold text-white">No orders yet</h2>
        <p className="text-white/40 text-sm max-w-xs">
          Orders will appear here as buyers purchase your products.
        </p>
      </div>
    </div>
  )
}
