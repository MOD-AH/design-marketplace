"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight, Palette, Image, Shirt, Type, Grid3X3, Layers, Sparkles, PenTool } from "lucide-react"

const categories = [
  { name: "Logos", icon: Palette, count: "2,340" },
  { name: "Posters", icon: Image, count: "1,856" },
  { name: "Merchandise", icon: Shirt, count: "943" },
  { name: "Fonts", icon: Type, count: "1,247" },
  { name: "Icons", icon: Grid3X3, count: "4,521" },
  { name: "UI Kits", icon: Layers, count: "876" },
  { name: "Illustrations", icon: Sparkles, count: "2,134" },
  { name: "Mockups", icon: PenTool, count: "1,562" },
]

export function CategoryStrip() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
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
          className="flex gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <button
              key={category.name}
              className="group flex shrink-0 items-center gap-3 rounded-full border border-border bg-background px-5 py-3 transition-all hover:border-foreground/30 hover:bg-secondary"
            >
              <category.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              <span className="text-sm font-medium">{category.name}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground group-hover:bg-muted">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
