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
}: Props) {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete("page")
      startTransition(() => router.push(`/products?${next.toString()}`))
    },
    [params, router]
  )

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParam("q", value || null)
  }, 350)

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParam("sort", e.target.value)
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search designs…"
              defaultValue={params.get("q") ?? ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-amber-400/40 transition-colors"
            />
            {isPending && (
              <Loader2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 animate-spin" />
            )}
          </div>

          {/* Result count */}
          <span className="text-xs text-white/25 whitespace-nowrap hidden sm:block">
            {totalCount.toLocaleString()} designs
          </span>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown size={13} className="text-white/30 hidden sm:block" />
            <select
              value={params.get("sort") ?? "newest"}
              onChange={handleSort}
              className="bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-amber-400/40 cursor-pointer"
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
            className="lg:hidden flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-xs text-white/60"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <FilterSidebar
          categories={categories}
          isOpen={mobileFiltersOpen}
          onClose={() => setMobileFiltersOpen(false)}
        />

        {/* Product grid */}
        <main className="flex-1 min-w-0">
          {initialProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-5xl mb-4 opacity-30">🎨</span>
              <p className="text-white/40 text-sm">No designs found</p>
              <p className="text-white/20 text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}>
                {initialProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                    buyerId={null}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateParam("page", String(p))}
                      className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                        p === currentPage
                          ? "bg-amber-400 text-black"
                          : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Quick view modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        buyerId={null}
      />
    </div>
  )
}
