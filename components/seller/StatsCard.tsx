import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  label: string
  value: string | number
  subValue?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ElementType
}

export function StatsCard({ label, value, subValue, trend, icon: Icon }: StatsCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-[#111318] border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-amber-400/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="p-2.5 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
          <Icon size={20} className="text-amber-400" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
            trend.isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
          )}>
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="relative z-10">
        <p className="text-xs font-medium text-white/40 uppercase tracking-widest mb-1">{label}</p>
        <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
        {subValue && <p className="text-xs text-white/20 mt-1">{subValue}</p>}
      </div>
    </div>
  )
}
