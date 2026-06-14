export default function EarningsLoading() {
  return (
    <div className="flex flex-1 flex-col gap-8 px-6 py-8">
      <div className="h-7 w-40 animate-pulse rounded-lg bg-white/5" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-6 space-y-3">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-8 w-28 rounded bg-white/10" />
          </div>
        ))}
      </div>
      <div className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-6 h-56" />
      <div className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-6 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 w-1/3 rounded bg-white/10" />
            <div className="h-4 w-16 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
