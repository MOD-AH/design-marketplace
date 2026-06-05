"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"

export type MonthlyPoint = { label: string; earnings: number; isCurrent: boolean }

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-[#1c1e26] px-4 py-3 shadow-2xl">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="text-base font-bold text-amber-400">
        ₹{Number(payload[0].value).toLocaleString("en-IN")}
      </p>
    </div>
  )
}

export function EarningsBarChart({ data }: { data: MonthlyPoint[] }) {
  const hasData = data.some((d) => d.earnings > 0)

  return (
    <div className="rounded-3xl border border-white/5 bg-[#111318] p-8">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white">Monthly Earnings</h3>
        <p className="mt-0.5 text-xs text-white/40">
          Seller payout per month — last 12 months
        </p>
      </div>

      {!hasData ? (
        <div className="flex h-52 items-center justify-center text-sm text-white/20">
          No earnings data yet
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barSize={28} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) =>
                v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
              }
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="earnings" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isCurrent ? "#fbbf24" : "rgba(251,191,36,0.35)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
