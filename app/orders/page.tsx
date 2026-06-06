import type { Metadata } from "next"
import Link from "next/link"
import { Package } from "lucide-react"

export const metadata: Metadata = { title: "My Orders | Designr" }

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-[#0a0b0e] pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">My Orders</h1>
          <p className="mt-1 text-white/40">Your purchase history and downloads.</p>
        </div>

        <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 flex items-center justify-center">
            <Package className="text-amber-400" size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">No orders yet</h2>
          <p className="text-white/40 text-sm max-w-xs">
            Assets you purchase will appear here with instant download links.
          </p>
          <Link
            href="/products"
            className="mt-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors underline underline-offset-4"
          >
            Browse products →
          </Link>
        </div>
      </div>
    </main>
  )
}
