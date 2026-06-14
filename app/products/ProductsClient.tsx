"use client"

import { useState, useCallback, useTransition, useEffect, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ArrowUpDown, Loader2, Sparkles } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"
import ProductCard, { type Product } from "@/components/products/ProductCard"
import FilterSidebar from "@/components/products/FilterSidebar"
import QuickViewModal from "@/components/products/QuickViewModal"
import { usePostHog } from "@/lib/posthog"
import { MOCK_PRODUCTS, MOCK_CATEGORIES, type MockProduct } from "@/lib/mock-products"

type Category = { id: string; name: string; slug: string }

type Props = {
  initialProducts: Product[]
  totalCount: number
  categories: Category[]
  currentPage: number
  pageSize: number
  hasMore: boolean
  buyerId: string | null
  buyerEmail: string | null
  buyerName: string | null
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
  categories: dbCategories,
  currentPage,
  pageSize,
  hasMore,
  buyerId,
  buyerEmail,
  buyerName,
}: Props) {
  const posthog = usePostHog()
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [quickViewSVG, setQuickViewSVG] = useState<React.ReactNode>(null)

  const useMock = initialProducts.length === 0

  // When using mock data: filter + sort client-side
  const activeCategory = params.get("category") ?? ""
  const activeLicense  = params.get("license")  ?? ""
  const activeFormat   = params.get("format")   ?? ""
  const minPrice       = params.get("minPrice")  ?? ""
  const maxPrice       = params.get("maxPrice")  ?? ""
  const activeSort     = params.get("sort")      ?? "newest"
  const searchQuery    = params.get("q")         ?? ""

  const filteredMock = useMemo<MockProduct[]>(() => {
    if (!useMock) return []
    let list = [...MOCK_PRODUCTS]

    if (activeCategory) list = list.filter(p => p.categorySlug === activeCategory)
    if (activeLicense)  list = list.filter(p => p.license_type === activeLicense)
    if (activeFormat)   list = list.filter(p => p.file_formats.includes(activeFormat.toUpperCase()))
    if (minPrice)       list = list.filter(p => p.price >= Number(minPrice))
    if (maxPrice)       list = list.filter(p => p.price <= Number(maxPrice))
    if (searchQuery)    list = list.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.seller.username.toLowerCase().includes(searchQuery.toLowerCase()))

    switch (activeSort) {
      case "popular":    list.sort((a, b) => b.total_sales  - a.total_sales); break
      case "price_asc":  list.sort((a, b) => a.price        - b.price);       break
      case "price_desc": list.sort((a, b) => b.price        - a.price);       break
      default:           break
    }
    return list
  }, [useMock, activeCategory, activeLicense, activeFormat, minPrice, maxPrice, searchQuery, activeSort])

  const categories = dbCategories.length > 0 ? dbCategories : MOCK_CATEGORIES
  const products   = useMock ? filteredMock : initialProducts
  const count      = useMock ? filteredMock.length : totalCount

  const mockMap = useMemo(() => {
    const m = new Map<string, MockProduct>()
    MOCK_PRODUCTS.forEach(p => m.set(p.id, p))
    return m
  }, [])

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete("page")
      if (key !== "q" && key !== "sort" && value) {
        posthog.capture("filter_applied", { filter_type: key, filter_value: value })
      }
      startTransition(() => router.push(`/products?${next.toString()}`))
    },
    [params, router],
  )

  const prevQuery = useRef(params.get("q") ?? "")
  useEffect(() => {
    const q = params.get("q") ?? ""
    if (q && q !== prevQuery.current) {
      posthog.capture("search_performed", { query: q, results_count: count })
    }
    prevQuery.current = q
  }, [params, count])

  const handleSearch = useDebouncedCallback((value: string) => {
    updateParam("q", value || null)
  }, 300)

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParam("sort", e.target.value)
  }

  const loadMore = useCallback(() => {
    const next = new URLSearchParams(params.toString())
    next.set("page", String(currentPage + 1))
    startTransition(() => router.push(`/products?${next.toString()}`, { scroll: false }))
  }, [params, currentPage, router])

  const showing = useMock ? count : Math.min(currentPage * pageSize, totalCount)

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product)
    const mp = mockMap.get(product.id)
    setQuickViewSVG(mp ? mp.svgNode : null)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-[72px]">
      {/* Top bar */}
      <div className="sticky top-[72px] z-30 border-b border-[#E8E2D9] bg-[#FAF7F2]/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B5A99A]" />
            <input
              type="text"
              placeholder="Search designs…"
              defaultValue={params.get("q") ?? ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-full border border-[#E8E2D9] bg-white py-2.5 pl-10 pr-4 text-sm text-[#1A1614] placeholder-[#B5A99A] transition-all focus:border-[#C8A882] focus:outline-none focus:ring-2 focus:ring-[#C8873A]/15 shadow-sm"
            />
            {isPending && (
              <Loader2 size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-[#C8873A]" />
            )}
          </div>

          {/* Result count */}
          <span className="hidden whitespace-nowrap text-xs text-[#B5A99A] sm:block font-medium">
            {showing.toLocaleString()} of {count.toLocaleString()} designs
          </span>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <ArrowUpDown size={13} className="hidden text-[#B5A99A] sm:block" />
            <select
              value={params.get("sort") ?? "newest"}
              onChange={handleSort}
              className="cursor-pointer rounded-full border border-[#E8E2D9] bg-white px-3 py-2.5 text-xs text-[#5C5248] focus:border-[#C8A882] focus:outline-none shadow-sm font-medium"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-[#E8E2D9] bg-white px-3 py-2.5 text-xs text-[#7A6F68] lg:hidden shadow-sm font-medium hover:border-[#D4C9BE]"
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
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E8E2D9] bg-white shadow-sm">
                <Sparkles className="h-7 w-7 text-[#C8873A]" />
              </div>
              <div>
                <p className="font-semibold text-[#5C5248]">No designs found</p>
                <p className="mt-1 text-sm text-[#9A8F88]">Try adjusting your filters or search query</p>
              </div>
              <button
                onClick={() => router.push("/products")}
                className="rounded-full border border-[#E8E2D9] bg-white px-6 py-2.5 text-sm font-semibold text-[#7A6F68] hover:border-[#D4C9BE] hover:text-[#1A1614] transition-all shadow-sm"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 gap-5 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${isPending ? "opacity-50" : "opacity-100"}`}>
                {products.map((product) => {
                  const mp = mockMap.get(product.id) as MockProduct | undefined
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={handleQuickView}
                      buyerId={buyerId}
                      buyerEmail={buyerEmail ?? undefined}
                      buyerName={buyerName ?? undefined}
                      svgPreview={mp?.svgNode}
                    />
                  )
                })}
              </div>

              {/* Load more — only for real paginated results */}
              {!useMock && hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={loadMore}
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-8 py-3 text-sm font-semibold text-[#7A6F68] transition-all hover:border-[#D4C9BE] hover:text-[#1A1614] disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
                  >
                    {isPending && <Loader2 size={14} className="animate-spin" />}
                    {isPending ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}

              {!useMock && !hasMore && totalCount > pageSize && (
                <p className="mt-10 text-center text-xs text-[#B5A99A]">
                  Showing all {totalCount.toLocaleString()} designs
                </p>
              )}
            </>
          )}
        </main>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => { setQuickViewProduct(null); setQuickViewSVG(null) }}
        buyerId={buyerId}
        buyerEmail={buyerEmail ?? undefined}
        buyerName={buyerName ?? undefined}
        svgPreview={quickViewSVG}
      />
    </div>
  )
}
