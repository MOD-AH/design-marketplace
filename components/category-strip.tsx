"use client"

import { useRef } from "react"
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
    <section className="border-y border-border bg-secondary/30 py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Browse by category
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.slug] ?? Hexagon
            return (
              <button
                key={cat.id}
                className="group flex shrink-0 items-center gap-3 rounded-full border border-border bg-background px-5 py-3 transition-all hover:border-foreground/30 hover:bg-secondary"
              >
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
