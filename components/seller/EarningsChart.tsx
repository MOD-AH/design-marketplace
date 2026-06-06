"use client"

interface EarningsChartProps {
  data: { month: string; amount: number }[]
}

export function EarningsChart({ data }: EarningsChartProps) {
  const maxAmount = Math.max(...data.map(d => d.amount), 1);
  const chartHeight = 200;
  const chartWidth = 600;
  
  // Create path for the line
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2;
    const y = chartHeight - (d.amount / maxAmount) * chartHeight;
    return `${x},${y}`;
  }).join(" ");

  // Create area path
  const areaPoints = `0,${chartHeight} ${points} ${chartWidth},${chartHeight}`;

  return (
    <div className="p-8 rounded-3xl bg-[#111318] border border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Monthly Earnings</h3>
          <p className="text-xs text-white/40">Revenue trends for the last 6 months</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-xs text-white/60">Payouts</span>
          </div>
        </div>
      </div>

      <div className="relative h-[200px] w-full">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 1, 2, 3].map(i => (
            <line
              key={i}
              x1="0"
              y1={(i / 3) * chartHeight}
              x2={chartWidth}
              y2={(i / 3) * chartHeight}
              stroke="white"
              strokeOpacity="0.03"
              strokeDasharray="4"
            />
          ))}

          {/* Area under the line */}
          <polyline
            fill="url(#chartGradient)"
            points={areaPoints}
            className="opacity-20"
          />

          {/* Line */}
          <polyline
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="animate-in fade-in duration-1000"
          />

          {/* Points */}
          {data.map((d, i) => {
            const x = data.length > 1 ? (i / (data.length - 1)) * chartWidth : chartWidth / 2;
            const y = chartHeight - (d.amount / maxAmount) * chartHeight;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#fbbf24"
                className="hover:r-6 cursor-pointer transition-all"
              >
                <title>{`${d.month}: ₹${d.amount}`}</title>
              </circle>
            )
          })}

        </svg>

        {/* X-Axis Labels */}
        <div className="flex justify-between mt-4">
          {data.map((d, i) => (
            <span key={i} className="text-[10px] font-medium text-white/20 uppercase tracking-widest leading-none">
              {d.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
