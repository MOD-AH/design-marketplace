import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search, ArrowRight, ShoppingBag, User, Heart,
  TrendingUp, Users, DollarSign, Mail, Globe, MessageCircle, Send,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { CategoryStrip } from "@/components/category-strip"
import { supabase } from "@/lib/supabase/client"
import type { ProductRow } from "@/types/database"

type ProductWithRelations = ProductRow & {
  profiles: { full_name: string | null; username: string | null } | null
  categories: { name: string } | null
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function CategoryStripSkeleton() {
  return (
    <section className="border-y border-border bg-secondary/30 py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-secondary" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-11 w-36 shrink-0 animate-pulse rounded-full bg-secondary" />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] animate-pulse rounded-xl bg-secondary" />
      <div className="space-y-2">
        <div className="flex justify-between gap-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-10 animate-pulse rounded bg-secondary" />
        </div>
        <div className="h-3.5 w-1/2 animate-pulse rounded bg-secondary" />
      </div>
    </div>
  )
}

function FeaturedProductsSkeleton() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 space-y-2">
          <div className="h-9 w-60 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-72 animate-pulse rounded bg-secondary" />
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

// ── Header ────────────────────────────────────────────────────────────────────


// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
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
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
    </section>
  )
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: ProductWithRelations }) {
  const image = product.preview_urls[0] ?? null
  const designer = product.profiles?.full_name ?? product.profiles?.username ?? "Unknown designer"
  const category = product.categories?.name ?? null

  return (
    <article className="group relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-secondary to-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 backdrop-blur-sm transition-all hover:bg-background hover:text-foreground group-hover:opacity-100">
          <Heart className="h-4 w-4" />
        </button>
        {category && (
          <div className="absolute bottom-3 left-3 right-3 flex items-end opacity-0 transition-opacity group-hover:opacity-100">
            <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
      </div>
      <div className="mt-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-medium leading-tight text-foreground">{product.title}</h3>
          <span className="shrink-0 font-semibold text-foreground">${product.price}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">by {designer}</span>
          {product.total_sales > 0 && (
            <span className="text-xs text-muted-foreground">{product.total_sales} sales</span>
          )}
        </div>
      </div>
    </article>
  )
}

// ── Featured Products ─────────────────────────────────────────────────────────

function FeaturedProducts({ products }: { products: ProductWithRelations[] }) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">Featured this week</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked designs from our top creators</p>
          </div>
          <Link href="#" className="group hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:flex">
            View all products
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link href="#" className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:hidden">
          View all products
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

// ── Sell Banner ───────────────────────────────────────────────────────────────

function SellBanner() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary to-card p-8 md:p-12 lg:p-16">
          <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <span className="inline-block rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium uppercase tracking-wider">For creators</span>
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
              {[
                { icon: TrendingUp, stat: "$2.4M+", label: "Paid to creators" },
                { icon: Users, stat: "48K+", label: "Active buyers" },
                { icon: DollarSign, stat: "85%", label: "Creator earnings" },
              ].map(({ icon: Icon, stat, label }) => (
                <div key={label} className="flex items-start gap-4 rounded-2xl border border-border bg-background/50 p-5 backdrop-blur-sm">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <span className="text-2xl font-semibold">{stat}</span>
                    <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/5 blur-3xl" />
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────

const footerLinks = {
  marketplace: [
    { name: "Browse All", href: "#" }, { name: "Categories", href: "#" },
    { name: "Collections", href: "#" }, { name: "New Arrivals", href: "#" }, { name: "Top Sellers", href: "#" },
  ],
  sellers: [
    { name: "Start Selling", href: "#" }, { name: "Seller Dashboard", href: "#" },
    { name: "Seller Guidelines", href: "#" }, { name: "Pricing", href: "#" }, { name: "Resources", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" }, { name: "Careers", href: "#" },
    { name: "Blog", href: "#" }, { name: "Press", href: "#" }, { name: "Contact", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" }, { name: "License", href: "#" },
    { name: "Privacy Policy", href: "#" }, { name: "Terms of Service", href: "#" }, { name: "Refund Policy", href: "#" },
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
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">D</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">DesignMarket</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The premier marketplace for premium design assets. Discover unique creations from talented designers worldwide.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold uppercase tracking-wider capitalize">{section}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 DesignMarket. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link key={item} href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0b0e] pt-20">
      <main>
        <Hero />
        <Suspense fallback={<CategoryStripSkeleton />}>
          <CategoryStripServer />
        </Suspense>
        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsServer />
        </Suspense>
        <SellBanner />
      </main>
      <Footer />
    </div>
  )
}
