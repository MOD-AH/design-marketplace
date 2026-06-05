"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search, ChevronDown, User, LogOut, LayoutDashboard, Menu, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/AuthProvider"
import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/Button"

type Category = { id: string; name: string; slug: string }

export function NavbarClient({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isBrowseOpen, setIsBrowseOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q) router.push(`/products?q=${encodeURIComponent(q)}`)
  }

  const handleSignOut = async () => {
    setIsUserMenuOpen(false)
    setIsMobileMenuOpen(false)
    await signOut()
    router.push("/")
  }

  const displayName =
    profile?.full_name ?? profile?.username ?? user?.displayName ?? "User"
  const avatarUrl = profile?.avatar_url ?? user?.photoURL ?? null
  const initial = displayName[0]?.toUpperCase() ?? "U"

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 border-b transition-all duration-300",
        isScrolled
          ? "border-white/10 bg-black/80 py-3 backdrop-blur-xl"
          : "border-transparent bg-transparent py-5",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 text-xl font-black text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-transform group-hover:scale-110">
              D
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              Designr<span className="text-amber-400">.</span>
            </span>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="group relative hidden flex-1 max-w-md md:block"
          >
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-white/40 transition-colors group-focus-within:text-amber-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium assets..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-12 pr-16 text-sm text-white placeholder:text-white/20 transition-all focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/30 group-hover:bg-white/10"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span className="rounded border border-white/5 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-white/40">
                ⌘K
              </span>
            </div>
          </form>

          {/* Right: desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Browse categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsBrowseOpen(true)}
              onMouseLeave={() => setIsBrowseOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
                Browse
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", isBrowseOpen && "rotate-180")}
                />
              </button>

              {isBrowseOpen && (
                <div className="absolute right-0 top-full w-48 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111318] p-2 shadow-2xl">
                    <Link
                      href="/products"
                      className="block rounded-xl px-4 py-2.5 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                    >
                      All Categories
                    </Link>
                    <div className="my-1 h-px bg-white/5" />
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="block rounded-xl px-4 py-2.5 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/sell"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Sell
            </Link>

            <div className="h-4 w-px bg-white/10" />

            {/* Auth section */}
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-full bg-white/5" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-3 pr-1 transition-all hover:border-white/20"
                >
                  <span className="text-xs font-semibold text-white/80">
                    {displayName}
                  </span>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-amber-400 to-orange-600">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-bold text-black text-sm">
                        {initial}
                      </span>
                    )}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <>
                    {/* Click-outside backdrop */}
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200 rounded-3xl border border-white/10 bg-[#111318] p-3 shadow-2xl">
                      <div className="mb-2 border-b border-white/5 px-3 pb-3 pt-1">
                        <p className="truncate text-sm font-bold text-white">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-white/40">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                      >
                        <User size={15} /> Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-all hover:bg-white/5 hover:text-white"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>

                      <div className="my-2 h-px bg-white/5" />

                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-400 transition-all hover:bg-rose-500/5 hover:text-rose-300"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-9 rounded-full border-white/10 px-5 text-white/80 hover:bg-white/5"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="h-9 rounded-full bg-amber-400 px-5 font-bold text-black hover:bg-amber-300">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: search icon + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => router.push("/products")}
              className="p-2 text-white/70 hover:text-white"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white/70 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-5 absolute left-0 right-0 top-full border-b border-white/10 bg-[#0a0b0e] p-6 duration-300 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/20 focus:border-amber-400/50 focus:outline-none"
            />
          </form>

          <div className="mb-6 grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl bg-white/5 p-3 text-center text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white/70"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-xl bg-rose-500/5 px-4 py-3 text-sm text-rose-400"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="h-12 w-full rounded-2xl border-white/10">
                    Log In
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="h-12 w-full rounded-2xl bg-amber-400 font-bold text-black">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
