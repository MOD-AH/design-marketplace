"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  DollarSign, 
  Settings,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Overview", href: "/seller", icon: LayoutDashboard },
  { name: "My Products", href: "/seller/products", icon: Package },
  { name: "Upload New", href: "/seller/upload", icon: PlusCircle },
  { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
  { name: "Earnings", href: "/seller/earnings", icon: DollarSign },
  { name: "Settings", href: "/seller/settings", icon: Settings },
]

export function SellerSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r border-white/5 bg-[#0a0b0e] flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6 px-3">
          Seller Console
        </h2>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xl transition-all",
                  isActive 
                    ? "bg-amber-400/10 text-amber-400" 
                    : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(isActive ? "text-amber-400" : "text-white/30 group-hover:text-white/60")} />
                  {item.name}
                </div>
                {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-1 duration-200" />}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-auto p-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/10 to-orange-600/5 border border-amber-400/10">
          <p className="text-xs font-bold text-amber-400 mb-1">PRO SELLER</p>
          <p className="text-[10px] text-white/40 leading-relaxed">
            You're in the top 5% of designers this month. Keep it up!
          </p>
        </div>
      </div>
    </aside>
  )
}
