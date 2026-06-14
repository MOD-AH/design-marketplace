export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Image gallery skeleton */}
          <div className="space-y-4">
            <div className="aspect-[4/3] animate-pulse rounded-2xl bg-white/5" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 w-16 animate-pulse rounded-lg bg-white/5" />
              ))}
            </div>
          </div>
          {/* Details skeleton */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="h-8 w-3/4 animate-pulse rounded-lg bg-white/5" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/5" />
            </div>
            <div className="h-12 w-32 animate-pulse rounded-xl bg-white/5" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-white/5" />
              ))}
            </div>
            <div className="h-12 w-full animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>
      </div>
    </main>
  );
}
