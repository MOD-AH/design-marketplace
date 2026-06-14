import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight, ArrowUpRight, ShoppingBag, TrendingUp, Users,
  DollarSign, Mail, Globe, MessageCircle, Send, Sparkles,
} from "lucide-react"
import { CategoryStrip } from "@/components/category-strip"
import { DesignExamples } from "@/components/design-examples"
import { supabase } from "@/lib/supabase/client"
import type { ProductRow } from "@/types/database"

type ProductWithRelations = ProductRow & {
  profiles: { full_name: string | null; username: string | null } | null
  categories: { name: string } | null
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function CategoryStripSkeleton() {
  return (
    <div className="border-y border-[#E8E2D9] py-5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-9 w-32 shrink-0 animate-pulse rounded-full bg-[#EDE8E1]" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <div className="aspect-[4/3] animate-pulse rounded-2xl bg-[#EDE8E1]" />
      <div className="space-y-2 px-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#EDE8E1]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#EDE8E1]" />
      </div>
    </div>
  )
}

function FeaturedProductsSkeleton() {
  return (
    <section className="px-6 py-24 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-[#EDE8E1]" />
          <div className="h-10 w-72 animate-pulse rounded bg-[#EDE8E1]" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Async data fetchers ───────────────────────────────────────────────────────

async function CategoryStripServer() {
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
  return <CategoryStrip categories={categories ?? []} />
}

async function FeaturedProductsServer() {
  const { data: raw } = await supabase
    .from("products")
    .select("*, profiles!seller_id(full_name, username), categories!category_id(name)")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6)
  const products = (raw ?? []) as unknown as ProductWithRelations[]
  return <FeaturedProducts products={products} />
}

// ── Marquee ───────────────────────────────────────────────────────────────────

function Marquee() {
  const items = [
    "Logo Design", "UI Kits", "Illustrations", "Typefaces", "Icon Sets",
    "Motion Graphics", "Brand Identity", "Mockups", "Presentations", "Patterns",
  ]
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-[#E8E2D9] bg-[#FAF7F2] py-3.5">
      <div className="flex animate-[marquee_30s_linear_infinite] gap-8 whitespace-nowrap will-change-transform">
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B5A99A]">
            {item}
            <span className="h-px w-6 bg-[#D4B896]" />
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#FAF7F2]">
      {/* Soft radial gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,rgba(219,185,148,0.2),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-20">
          {/* Left: text */}
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4B896] bg-[#FDF0E0] px-4 py-2">
              <Sparkles className="h-3.5 w-3.5 text-[#C8873A]" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C8873A]">
                Premium Design Marketplace
              </span>
            </div>

            <h1 className="text-[clamp(3rem,7vw,5.5rem)] font-black leading-[0.92] tracking-tighter text-[#1A1614]">
              Design assets
              <br />
              <em className="not-italic text-[#C8A882]">that</em>{" "}
              <span className="text-[#1A1614]">elevate.</span>
            </h1>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#7A6F68]">
              Discover premium logos, UI kits, fonts, illustrations and more.
              Crafted by world-class designers. Ready to use today.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className="group inline-flex h-14 items-center gap-3 rounded-full bg-[#1A1614] px-8 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#2D2420] hover:shadow-[0_8px_30px_rgba(26,22,20,0.25)]"
              >
                Explore Marketplace
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/seller"
                className="group inline-flex h-14 items-center gap-3 rounded-full border border-[#D4C9BE] bg-white px-8 text-sm font-semibold text-[#5C5248] transition-all hover:border-[#C8A882] hover:text-[#1A1614]"
              >
                Start Selling
                <ArrowUpRight className="h-4 w-4 opacity-50 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-14 flex flex-wrap items-center gap-8 border-t border-[#E8E2D9] pt-10">
              {[
                { value: "12K+", label: "Creators" },
                { value: "48K+", label: "Active buyers" },
                { value: "₹2Cr+", label: "Paid out" },
                { value: "85%", label: "Revenue share" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-[#1A1614]">{s.value}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-wider text-[#B5A99A]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stacked design asset cards */}
          <div className="relative hidden lg:flex lg:shrink-0">
            <div className="relative h-[480px] w-[360px]">
              {/* Back card — sage tint */}
              <div className="absolute left-8 top-8 h-[380px] w-[300px] rotate-[-6deg] overflow-hidden rounded-3xl border border-[#B8D4C4] bg-[#E8F4EE] shadow-sm" />
              {/* Middle card — lavender tint with typeface preview */}
              <div className="absolute left-4 top-4 h-[400px] w-[316px] rotate-[-3deg] overflow-hidden rounded-3xl border border-[#C4BAD8] bg-[#EEE8F8] shadow-md">
                <svg viewBox="0 0 316 400" className="h-full w-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                  <rect width="316" height="400" fill="#EEE8F8"/>
                  <text x="-20" y="300" fill="#7C6BC9" fontSize="260" fontFamily="Georgia, serif" fontWeight="900" opacity="0.12">A</text>
                  <text x="24" y="60" fill="#7C6BC9" fontSize="11" fontFamily="Arial" letterSpacing="5" opacity="0.5">TYPEFACE</text>
                  <text x="24" y="90" fill="#4A3D72" fontSize="28" fontFamily="Georgia, serif" fontWeight="700" opacity="0.7">Planar</text>
                </svg>
              </div>
              {/* Front card — logo design */}
              <div className="relative z-10 h-[420px] w-[332px] overflow-hidden rounded-3xl border border-[#E8E2D9] bg-white shadow-[0_24px_60px_rgba(26,22,20,0.14)]">
                <div className="flex h-full flex-col">
                  {/* Design preview */}
                  <div className="flex-1 overflow-hidden">
                    <svg viewBox="0 0 332 280" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                      <rect width="332" height="280" fill="#111018"/>
                      <defs>
                        <radialGradient id="hGrad" cx="50%" cy="40%" r="60%">
                          <stop offset="0%" stopColor="#2A1F0F"/>
                          <stop offset="100%" stopColor="#0D0B0E"/>
                        </radialGradient>
                      </defs>
                      <rect width="332" height="280" fill="url(#hGrad)"/>
                      <circle cx="166" cy="120" r="64" fill="none" stroke="#C8873A" strokeWidth="1"/>
                      <circle cx="166" cy="120" r="50" fill="none" stroke="#C8873A" strokeWidth="0.4" opacity="0.4"/>
                      <polygon points="166,75 200,120 166,165 132,120" fill="none" stroke="#C8873A" strokeWidth="1.2"/>
                      <polygon points="166,92 184,120 166,148 148,120" fill="#C8873A" fillOpacity="0.15"/>
                      <circle cx="166" cy="120" r="8" fill="#C8873A"/>
                      <text x="166" y="208" textAnchor="middle" fill="white" fontSize="18" fontFamily="Georgia, serif" letterSpacing="12" fontWeight="400">AURUM</text>
                      <text x="166" y="228" textAnchor="middle" fill="#C8873A" fontSize="7" fontFamily="Arial" letterSpacing="7" opacity="0.6">CREATIVE STUDIO</text>
                      <line x1="106" y1="242" x2="226" y2="242" stroke="#C8873A" strokeWidth="0.4" opacity="0.3"/>
                      <rect x="118" y="256" width="18" height="18" rx="4" fill="#111018"/>
                      <rect x="142" y="256" width="18" height="18" rx="4" fill="#C8873A"/>
                      <rect x="166" y="256" width="18" height="18" rx="4" fill="#E8C89A"/>
                      <rect x="190" y="256" width="18" height="18" rx="4" fill="#F5EDD8"/>
                      <rect x="214" y="256" width="18" height="18" rx="4" fill="#6E5E4A"/>
                    </svg>
                  </div>
                  {/* Card info */}
                  <div className="border-t border-[#F0EBE4] px-5 py-4">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="rounded-full bg-[#FEF3E8] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#C8873A]">Logo Design</span>
                      <span className="rounded-full bg-[#1A1614] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">Bestseller</span>
                    </div>
                    <div className="text-sm font-bold text-[#1A1614]">Aurum Brand Identity Kit</div>
                    <div className="mt-0.5 text-xs text-[#9A8F88]">by @arjunmehta</div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-lg font-black text-[#C8873A]">₹2,499</span>
                      <div className="flex items-center gap-1.5 rounded-full bg-[#1A1614] px-4 py-2 text-[11px] font-black text-white">
                        <ShoppingBag size={11} />
                        Buy Now
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Float badge */}
              <div className="absolute -bottom-4 -right-4 z-20 rounded-2xl border border-[#E8E2D9] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(26,22,20,0.10)]">
                <div className="text-[10px] text-[#B5A99A] uppercase tracking-wider">New this week</div>
                <div className="mt-0.5 text-sm font-bold text-[#1A1614]">143 assets</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = product.preview_urls[0] ?? null
  const designer = product.profiles?.full_name ?? product.profiles?.username ?? "Unknown"
  const category = product.categories?.name ?? null

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <article>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F0EBE4]">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#FDEEE4] to-[#EEE8F8]">
              <div className="h-16 w-16 rounded-full bg-[#E8E0D8]" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/70 via-[#1A1614]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          {/* Hover buy bar */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
              <span className="text-base font-black text-[#1A1614]">₹{product.price.toLocaleString("en-IN")}</span>
              <span className="flex items-center gap-1.5 rounded-full bg-[#1A1614] px-3 py-1.5 text-xs font-black text-white">
                <ShoppingBag size={11} />
                Buy
              </span>
            </div>
          </div>

          {/* Category pill */}
          {category && (
            <div className="absolute left-3 top-3">
              <span className="rounded-full border border-white/30 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#5C5248] backdrop-blur-sm">
                {category}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 px-1">
          <h3 className="line-clamp-1 font-semibold text-[#1A1614] transition-colors group-hover:text-[#C8873A]">
            {product.title}
          </h3>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-sm text-[#9A8F88]">by {designer}</span>
            <span className="text-sm font-bold text-[#5C5248]">₹{product.price.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

// ── Featured Products ─────────────────────────────────────────────────────────

function FeaturedProducts({ products }: { products: ProductWithRelations[] }) {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8873A]">
              — Featured this week
            </p>
            <h2 className="text-4xl font-black tracking-tight text-[#1A1614] md:text-5xl">
              Top picks for
              <br />
              <span className="text-[#C8A882] italic">creative pros.</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group hidden items-center gap-2 rounded-full border border-[#E8E2D9] bg-[#FAF7F2] px-5 py-2.5 text-sm font-semibold text-[#7A6F68] transition-all hover:border-[#D4C9BE] hover:text-[#1A1614] md:flex"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-[#D4C9BE] bg-[#FAF7F2] py-28">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E8E2D9] bg-white shadow-sm">
              <Sparkles className="h-7 w-7 text-[#C8873A]" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#5C5248]">No products yet</p>
              <p className="mt-1 text-sm text-[#9A8F88]">Be the first to publish a design</p>
            </div>
            <Link
              href="/seller"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1614] px-6 py-3 text-sm font-black text-white transition-all hover:bg-[#2D2420]"
            >
              Start selling
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-[#FAF7F2] px-8 py-3.5 text-sm font-semibold text-[#7A6F68] transition-all hover:border-[#D4C9BE] hover:text-[#1A1614]"
              >
                Browse all products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

// ── Sell Banner ───────────────────────────────────────────────────────────────

function SellBanner() {
  return (
    <section className="bg-[#FAF7F2] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#1A1614]">
          {/* Warm glow */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#C8873A]/15 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-60 w-60 rounded-full bg-[#C8A882]/10 blur-[80px]" />

          <div className="relative grid gap-0 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="border-b border-white/5 p-10 md:p-14 lg:border-b-0 lg:border-r lg:p-16">
              <span className="inline-block rounded-full border border-[#C8873A]/30 bg-[#C8873A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#D4A06A]">
                For creators
              </span>
              <h2 className="mt-6 text-[clamp(2rem,4vw,3.5rem)] font-black leading-tight tracking-tight text-white">
                Sell your designs.
                <br />
                <span className="text-white/30">Keep your freedom.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/50">
                Join 12,000+ designers earning passive income. Set your own prices,
                keep 85% of every sale, and reach buyers across India and beyond.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/seller"
                  className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#C8873A] px-7 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#D4956A] hover:shadow-[0_0_30px_rgba(200,135,58,0.3)]"
                >
                  Start selling
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-white/10 px-7 text-sm font-semibold text-white/60 transition-all hover:border-white/20 hover:text-white"
                >
                  Browse marketplace
                </Link>
              </div>
            </div>

            {/* Right: stats grid */}
            <div className="grid grid-cols-2 gap-px bg-white/5 p-px">
              {[
                { icon: DollarSign, stat: "₹2Cr+", label: "Paid to creators", tint: "bg-[#E8F4EE]", iconColor: "text-emerald-600" },
                { icon: Users, stat: "48K+", label: "Active buyers", tint: "bg-[#E8F0F8]", iconColor: "text-blue-600" },
                { icon: TrendingUp, stat: "85%", label: "Revenue share", tint: "bg-[#FEF3E8]", iconColor: "text-[#C8873A]" },
                { icon: ShoppingBag, stat: "2.4K+", label: "Assets sold", tint: "bg-[#F0EBF8]", iconColor: "text-purple-600" },
              ].map(({ icon: Icon, stat, label, tint, iconColor }) => (
                <div key={label} className="flex flex-col justify-between bg-[#1E1A17] p-8">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="mt-8">
                    <div className="text-3xl font-black text-white">{stat}</div>
                    <div className="mt-1 text-xs uppercase tracking-wider text-white/30">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

const footerLinks = {
  Marketplace: [
    { name: "Browse All", href: "/products" },
    { name: "New Arrivals", href: "/products?sort=newest" },
    { name: "Top Sellers", href: "/products?sort=popular" },
    { name: "Collections", href: "/products" },
  ],
  Sellers: [
    { name: "Start Selling", href: "/seller" },
    { name: "Dashboard", href: "/seller" },
    { name: "Earnings", href: "/seller/earnings" },
    { name: "Guidelines", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  Support: [
    { name: "Help Center", href: "#" },
    { name: "License", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
}

const socialLinks = [
  { name: "Email", icon: Mail, href: "#" },
  { name: "Website", icon: Globe, href: "#" },
  { name: "Chat", icon: MessageCircle, href: "#" },
  { name: "Newsletter", icon: Send, href: "#" },
]

function Footer() {
  return (
    <footer className="border-t border-[#E8E2D9] bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A1614] text-sm font-black text-white">
                D
              </div>
              <span className="text-lg font-black tracking-tighter text-[#1A1614]">
                Designr<span className="text-[#C8873A]">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-[#9A8F88]">
              The premium marketplace for design assets from India&apos;s top creators.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E2D9] bg-white text-[#9A8F88] transition-all hover:border-[#D4C9BE] hover:text-[#5C5248] shadow-sm"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#B5A99A]">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-[#7A6F68] transition-colors hover:text-[#1A1614]">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#E8E2D9] pt-8 md:flex-row">
          <p className="text-sm text-[#B5A99A]">© 2026 Designr. All rights reserved.</p>
          <p className="text-sm text-[#B5A99A]">Made with craft in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-[72px]">
      <Marquee />
      <main>
        <Hero />
        <Suspense fallback={<CategoryStripSkeleton />}>
          <CategoryStripServer />
        </Suspense>
        <DesignExamples />
        <SellBanner />
      </main>
      <Footer />
    </div>
  )
}
