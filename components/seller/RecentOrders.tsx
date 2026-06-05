import { Badge } from "@/components/ui/Badge"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface Order {
  id: string
  created_at: string
  total_amount: number
  status: string
  items: {
    product: {
      title: string
    }
  }[]
}

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  return (
    <div className="rounded-3xl bg-[#111318] border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Recent Orders</h3>
        <Link href="/seller/orders" className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-widest">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm italic">
                  No orders found yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-white/50 group-hover:text-white transition-colors">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-white truncate max-w-[180px] block">
                      {order.items[0]?.product?.title || "Unknown Product"}
                      {order.items.length > 1 && ` +${order.items.length - 1} more`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-white/40">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-amber-400">
                      ₹{order.total_amount.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge 
                      variant={order.status === "completed" ? "premium" : "secondary"}
                      className="text-[9px] uppercase tracking-tighter"
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
                      <ExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
