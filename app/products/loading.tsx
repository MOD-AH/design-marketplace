export default function ProductsLoading() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 h-8 w-48 animate-pulse rounded-lg bg-white/5" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] animate-pulse rounded-xl bg-white/5" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
              <div className="h-4 w-16 animate-pulse rounded bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
