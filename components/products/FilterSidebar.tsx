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
          <SlidersHorizontal size={15} className="text-[#C8873A]" />
          <span className="font-bold text-[#1A1614] text-sm">Filters</span>
        </div>
        {hasFilters && (
          <button onClick={clearAll} className="flex items-center gap-1 text-xs font-semibold text-[#C8873A] hover:text-[#A86820] transition-colors">
            <X size={10} /> Clear all
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5A99A] font-semibold mb-3">Category</p>
        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => update("category", null)}
            className={`text-left text-sm px-3 py-2.5 rounded-xl transition-colors font-medium ${
              !activeCategory
                ? "bg-[#1A1614] text-white"
                : "text-[#7A6F68] hover:text-[#1A1614] hover:bg-[#FAF7F2]"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => update("category", cat.slug)}
              className={`text-left text-sm px-3 py-2.5 rounded-xl transition-colors ${
                activeCategory === cat.slug
                  ? "bg-[#FEF3E8] text-[#C8873A] font-semibold"
                  : "text-[#7A6F68] hover:text-[#1A1614] hover:bg-[#FAF7F2]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5A99A] font-semibold mb-3">Price Range (₹)</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => update("minPrice", e.target.value || null)}
            className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1614] placeholder-[#B5A99A] focus:outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8873A]/15 shadow-sm"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => update("maxPrice", e.target.value || null)}
            className="w-full bg-white border border-[#E8E2D9] rounded-xl px-3 py-2 text-sm text-[#1A1614] placeholder-[#B5A99A] focus:outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8873A]/15 shadow-sm"
          />
        </div>
      </div>

      {/* License type */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5A99A] font-semibold mb-3">License Type</p>
        <div className="flex flex-col gap-2.5">
          {LICENSE_TYPES.map((lic) => (
            <label key={lic} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => update("license", activeLicense === lic ? null : lic)}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                  activeLicense === lic
                    ? "border-[#C8873A] bg-[#C8873A]"
                    : "border-[#D4C9BE] group-hover:border-[#C8A882]"
                }`}
              >
                {activeLicense === lic && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-sm capitalize transition-colors ${
                activeLicense === lic ? "text-[#1A1614] font-semibold" : "text-[#7A6F68] group-hover:text-[#1A1614]"
              }`}>
                {lic}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* File format */}
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-[#B5A99A] font-semibold mb-3">File Format</p>
        <div className="grid grid-cols-3 gap-2">
          {FILE_FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => update("format", activeFormat === fmt ? null : fmt)}
              className={`text-xs font-mono py-2 rounded-xl border transition-all font-medium ${
                activeFormat === fmt
                  ? "border-[#C8873A] bg-[#FEF3E8] text-[#C8873A]"
                  : "border-[#E8E2D9] bg-white text-[#9A8F88] hover:border-[#C8A882] hover:text-[#5C5248]"
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
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white border border-[#E8E2D9] rounded-2xl overflow-hidden sticky top-6 max-h-[calc(100vh-3rem)] shadow-sm">
        {sidebarContent}
      </aside>

      {/* Mobile bottom sheet */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div className="absolute inset-0 bg-[#1A1614]/40 backdrop-blur-sm" onClick={onClose} />
          <div className="relative bg-white border-t border-[#E8E2D9] rounded-t-3xl max-h-[80vh] shadow-2xl">
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#E8E2D9]" />
            <div className="pt-6">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
