"use client"

import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-serif text-5xl font-medium leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-balance">Designs that sell themselves</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Discover premium design assets from world-class creators. Elevate your projects with logos, templates, fonts, and more.
          </p>

          <div className="mx-auto mt-10 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search for logos, posters, fonts..."
                className="h-14 w-full rounded-full border border-border bg-secondary pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 rounded-full px-8 text-base">
              Explore marketplace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base">
              Start selling
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle gradient accent */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
    </section>
  )
}
