"use client"

import { Search, ShoppingBag, User } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">D</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">DesignMarket</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Browse
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Collections
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Designers
          </Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <ShoppingBag className="h-5 w-5" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
