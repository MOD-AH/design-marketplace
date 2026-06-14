"use client"

import { useRef } from "react"
import Link from "next/link"
import {
  ChevronLeft, ChevronRight,
  Palette, ImageIcon, Shirt, Type, Grid3X3, Layers, Sparkles, PenTool, Hexagon,
  type LucideIcon,
} from "lucide-react"
import type { CategoryRow } from "@/types/database"

const ICON_MAP: Record<string, LucideIcon> = {
  logos: Palette,
  posters: ImageIcon,
  merchandise: Shirt,
  fonts: Type,
  icons: Grid3X3,
  "ui-kits": Layers,
  illustrations: Sparkles,
  mockups: PenTool,
}

export function CategoryStrip({ categories }: { categories: CategoryRow[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" })
  }

  return (
    <section className="border-y border-[#E8E2D9] bg-[#FAF7F2] py-5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-4">
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B5A99A]">
            Categories
          </span>
          <div className="h-px flex-1 bg-[#E8E2D9]" />
          <div className="flex gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E2D9] bg-white text-[#9A8F88] shadow-sm transition-all hover:border-[#D4C9BE] hover:text-[#5C5248]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#E8E2D9] bg-white text-[#9A8F88] shadow-sm transition-all hover:border-[#D4C9BE] hover:text-[#5C5248]"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="mt-4 flex gap-2 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Hexagon
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex shrink-0 items-center gap-2 rounded-full border border-[#E8E2D9] bg-white px-4 py-2 shadow-sm transition-all hover:border-[#C8A882] hover:bg-[#FEF3E8]"
              >
                <Icon className="h-4 w-4 text-[#B5A99A] transition-colors group-hover:text-[#C8873A]" />
                <span className="text-sm font-medium text-[#7A6F68] transition-colors group-hover:text-[#5C5248]">{cat.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
