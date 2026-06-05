"use client"

import { useState, useCallback, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ArrowUpDown, Loader2 } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import ProductCard, { type Product } from "@/components/products/ProductCard"
import FilterSidebar from "@/components/products/FilterSidebar"
import QuickViewModal from "@/components/products/QuickViewModal"

type Category = { id: string; name: string; slug: string }

type Props = {
  initialProducts: Product[]
  totalCount: number
  categories: Category[]
  currentPage: number
  pageSize: number
  hasMore: boolean
}

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
]

export default function ProductsClient({
  initialProducts,
  totalCount,
  categories,
  currentPage,
  pageSize,
  hasMore,
}: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  // Replaces a single URL param and resets page to 1
  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete("page")
      startTransition(() => router.push(`/products?${next.toString()}`))
    },
    [params, router],
  )

  // 300 ms debounce on the search input
  const handleSearch = useDebouncedCallback((value: string) => {
    updateParam("q", value || null)
  }, 300)

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParam("sort", e.target.value)
  }

  // Increments page without resetting scroll position; Suspense key is stable
  // across page changes so the existing grid stays visible during the transition.
  const loadMore = useCallback(() => {
    const next = new URLSearchParams(params.toString())
    next.set("page", String(currentPage + 1))
    startTransition(() => router.push(`/products?${next.toString()}`, { scroll: false }))
  }, [params, currentPage, router])

  const showing = Math.min(currentPage * pageSize, totalCount)

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white pt-20">
      {/* Top bar */}
      <div className="sticky top-[64px] z-30 border-b border-white/5 bg-[#0a0b0e]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search designs…"
              defaultValue={params.get("q") ?? ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-white placeholder-white/25 transition-colors focus:border-amber-400/40 focus:outline-none"
            />
            {isPending && (
              <Loader2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-amber-400" />
            )}
          </div>

          {/* Result count */}
          <span className="hidden whitespace-nowrap text-xs text-white/25 sm:block">
            {showing.toLocaleString()} of {totalCount.toLocaleString()} designs
          </span>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown size={13} className="hidden text-white/30 sm:block" />
            <select
              value={params.get("sort") ?? "newest"}
              onChange={handleSort}
              className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 focus:border-amber-400/40 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#111318]">
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 lg:hidden"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <FilterSidebar
          categories={categories}
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        <main className="min-w-0 flex-1">
          {initialProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="mb-4 text-5xl opacity-30">🎨</span>
              <p className="text-sm text-white/40">No designs found</p>
              <p className="mt-1 text-xs text-white/20">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${
                  isPending ? "opacity-50" : "opacity-100"
                }`}
              >
                {initialProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>

              {/* Load more */}
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isPending && <Loader2 size={14} className="animate-spin" />}
                    {isPending ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}

              {/* End-of-results indicator */}
              {!hasMore && totalCount > pageSize && (
                <p className="mt-10 text-center text-xs text-white/20">
                  Showing all {totalCount.toLocaleString()} designs
                </p>
              )}
            </>
          )}
        </main>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  )
}
