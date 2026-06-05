"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SlidersHorizontal, X } from "lucide-react"

type Category = { id: string; name: string; slug: string }

type Props = {
  categories: Category[]
  isOpen: boolean
  onClose: () => void
}

const LICENSE_TYPES = ["personal", "commercial", "extended"] as const
const FILE_FORMATS  = ["PNG", "SVG", "AI", "PDF", "PSD", "EPS"]

export default function FilterSidebar({ categories, isOpen, onClose }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const update = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(params.toString())
      if (value) next.set(key, value)
      else next.delete(key)
      next.delete("page")
      router.push(`/products?${next.toString()}`)
    },
    [params, router]
  )

  const activeCategory = params.get("category") ?? ""
  const activeLicense  = params.get("license")  ?? ""
  const activeFormat   = params.get("format")   ?? ""
  const minPrice       = params.get("minPrice")  ?? ""
  const maxPrice       = params.get("maxPrice")  ?? ""

  const hasFilters = activeCategory || activeLicense || activeFormat || minPrice || maxPrice

  const clearAll = () => {
    router.push("/products")
    onClose()
  }

  const sidebarContent = (
    <div className="flex flex-col gap-6 h-full overflow-y-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-amber-400" />
          <span className="font-semibold text-white text-sm">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <X size={10} /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">Category</p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => update("category", null)}
            className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
              !activeCategory ? "bg-amber-400/10 text-amber-400 font-medium" : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("category", cat.slug)}
              className={`text-left text-sm px-3 py-2 rounded-xl transition-colors ${
                activeCategory === cat.slug ? "bg-amber-400/10 text-amber-400 font-medium" : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">Price Range (₹)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => update("minPrice", e.target.value || null)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => update("maxPrice", e.target.value || null)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-amber-400/50"
          />
        </div>
      </div>

      {/* License type */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">License Type</p>
        <div className="flex flex-col gap-2">
          {LICENSE_TYPES.map((lic) => (
            <label key={lic} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => update("license", activeLicense === lic ? null : lic)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  activeLicense === lic ? "border-amber-400 bg-amber-400" : "border-white/20 group-hover:border-white/40"
                }`}
              >
                {activeLicense === lic && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
              </div>
              <span className={`text-sm capitalize transition-colors ${activeLicense === lic ? "text-white" : "text-white/50 group-hover:text-white/80"}`}>
                {lic}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* File format */}
      <div>
        <p className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">File Format</p>
        <div className="grid grid-cols-3 gap-2">
          {FILE_FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => update("format", activeFormat === fmt ? null : fmt)}
              className={`text-xs font-mono py-1.5 rounded-lg border transition-all ${
                activeFormat === fmt
                  ? "border-amber-400 bg-amber-400/10 text-amber-400"
                  : "border-white/10 text-white/30 hover:border-white/30 hover:text-white/60"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-[#0d0f13] border border-white/5 rounded-2xl overflow-hidden sticky top-6 max-h-[calc(100vh-3rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile bottom sheet */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-[#111318] border-t border-white/10 rounded-t-3xl max-h-[80vh]">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
            <div className="pt-6">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
