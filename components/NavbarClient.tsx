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
          ? "border-[#E8E2D9] bg-white/95 py-3 shadow-sm backdrop-blur-xl"
          : "border-[#E8E2D9] bg-[#FAF7F2]/95 py-4 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1614] text-sm font-black text-white shadow-sm transition-transform group-hover:scale-105">
              D
            </div>
            <span className="text-xl font-black tracking-tighter text-[#1A1614]">
              Designr<span className="text-[#C8873A]">.</span>
            </span>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="group relative hidden flex-1 max-w-md md:block"
          >
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#B5A99A] transition-colors group-focus-within:text-[#C8873A]">
              <Search size={16} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search premium assets..."
              className="w-full rounded-2xl border border-[#E8E2D9] bg-white py-2.5 pl-11 pr-16 text-sm text-[#1A1614] placeholder:text-[#B5A99A] shadow-sm transition-all focus:border-[#C8A882] focus:outline-none focus:ring-2 focus:ring-[#C8873A]/20"
            />
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <span className="rounded border border-[#E8E2D9] bg-[#FAF7F2] px-1.5 py-0.5 font-mono text-[10px] text-[#B5A99A]">
                ⌘K
              </span>
            </div>
          </form>

          {/* Right: desktop nav */}
          <div className="hidden items-center gap-5 md:flex">
            {/* Browse categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsBrowseOpen(true)}
              onMouseLeave={() => setIsBrowseOpen(false)}
            >
              <button className="flex items-center gap-1 py-2 text-sm font-medium text-[#7A6F68] transition-colors hover:text-[#1A1614]">
                Browse
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", isBrowseOpen && "rotate-180")}
                />
              </button>

              {isBrowseOpen && (
                <div className="absolute right-0 top-full w-48 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="overflow-hidden rounded-2xl border border-[#E8E2D9] bg-white p-2 shadow-xl">
                    <Link
                      href="/products"
                      className="block rounded-xl px-4 py-2.5 text-sm text-[#7A6F68] transition-all hover:bg-[#FAF7F2] hover:text-[#1A1614]"
                    >
                      All Categories
                    </Link>
                    <div className="my-1 h-px bg-[#F0EBE4]" />
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.slug}`}
                        className="block rounded-xl px-4 py-2.5 text-sm text-[#7A6F68] transition-all hover:bg-[#FAF7F2] hover:text-[#1A1614]"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/seller"
              className="text-sm font-medium text-[#7A6F68] transition-colors hover:text-[#1A1614]"
            >
              Sell
            </Link>

            <div className="h-4 w-px bg-[#E8E2D9]" />

            {/* Auth section */}
            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-full bg-[#EDE8E1]" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-white py-1 pl-3 pr-1 shadow-sm transition-all hover:border-[#D4C9BE]"
                >
                  <span className="text-xs font-semibold text-[#5C5248]">
                    {displayName}
                  </span>
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[#E8E2D9] bg-[#1A1614]">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-bold text-white text-sm">
                        {initial}
                      </span>
                    )}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-3 w-56 animate-in fade-in slide-in-from-top-2 duration-200 rounded-2xl border border-[#E8E2D9] bg-white p-2 shadow-xl">
                      <div className="mb-2 border-b border-[#F0EBE4] px-3 pb-3 pt-2">
                        <p className="truncate text-sm font-bold text-[#1A1614]">
                          {displayName}
                        </p>
                        <p className="truncate text-xs text-[#B5A99A]">{user.email}</p>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#7A6F68] transition-all hover:bg-[#FAF7F2] hover:text-[#1A1614]"
                      >
                        <User size={15} /> Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#7A6F68] transition-all hover:bg-[#FAF7F2] hover:text-[#1A1614]"
                      >
                        <LayoutDashboard size={15} /> Dashboard
                      </Link>

                      <div className="my-1 h-px bg-[#F0EBE4]" />

                      <button
                        onClick={handleSignOut}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-500 transition-all hover:bg-rose-50"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="h-9 rounded-full border-[#E8E2D9] bg-white px-5 text-sm text-[#5C5248] shadow-sm hover:border-[#D4C9BE] hover:text-[#1A1614]"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="h-9 rounded-full bg-[#1A1614] px-5 text-sm font-bold text-white hover:bg-[#2D2420]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => router.push("/products")}
              className="p-2 text-[#7A6F68] hover:text-[#1A1614]"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#7A6F68] hover:text-[#1A1614]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="animate-in slide-in-from-top-5 absolute left-0 right-0 top-full border-b border-[#E8E2D9] bg-[#FAF7F2] p-6 shadow-lg duration-300 md:hidden">
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B5A99A]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full rounded-2xl border border-[#E8E2D9] bg-white py-3 pl-11 pr-4 text-sm text-[#1A1614] placeholder:text-[#B5A99A] focus:border-[#C8A882] focus:outline-none"
            />
          </form>

          <div className="mb-6 grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-[#E8E2D9] bg-white p-3 text-center text-sm font-medium text-[#7A6F68] transition-colors hover:border-[#D4C9BE] hover:text-[#1A1614]"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-sm text-[#7A6F68]"
                >
                  <User size={16} /> Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-sm text-[#7A6F68]"
                >
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-500"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="h-12 w-full rounded-2xl border-[#E8E2D9]">
                    Log In
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="h-12 w-full rounded-2xl bg-[#1A1614] font-bold text-white">
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
