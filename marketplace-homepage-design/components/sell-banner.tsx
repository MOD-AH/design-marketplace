"use client"

import { ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SellBanner() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-card p-8 md:p-12 lg:p-16">
          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="inline-block rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium uppercase tracking-wider">
                For creators
              </span>
              <h2 className="mt-6 font-serif text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
                <span className="text-balance">Sell your designs to thousands of buyers</span>
              </h2>
              <p className="mt-4 max-w-lg text-lg text-muted-foreground">
                Join our community of 12,000+ designers earning passive income. Set your prices, keep 85% of every sale, and reach a global audience.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button size="lg" className="h-12 rounded-full px-8 text-base">
                  Start selling today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base">
                  Learn more
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-6">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-5 backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="text-2xl font-semibold">$2.4M+</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">Paid to creators</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-5 backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="text-2xl font-semibold">48K+</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">Active buyers</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-5 backdrop-blur-sm">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="text-2xl font-semibold">85%</span>
                  <p className="mt-0.5 text-sm text-muted-foreground">Creator earnings</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
