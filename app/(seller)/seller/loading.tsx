export default function SellerLoading() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-6 space-y-3">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-8 w-20 rounded bg-white/10" />
          </div>
        ))}
      </div>
      {/* Chart skeleton */}
      <div className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-6 h-64" />
      {/* Table skeleton */}
      <div className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-6 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-10 w-10 rounded-lg bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-white/10" />
              <div className="h-3 w-1/4 rounded bg-white/10" />
            </div>
            <div className="h-4 w-16 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
