"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Star, Heart, ShoppingCart, ChevronRight,
  Package, ShieldCheck, Download, Tag,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePostHog } from "@/lib/posthog"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Tabs } from "@/components/ui/Tabs"
import { CheckoutButton } from "@/components/CheckoutButton"
import ProductCard, { type Product } from "./ProductCard"

// ── Shared types (imported by page.tsx) ──────────────────────────────────────

export type Seller = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
}

export type Review = {
  id: string
  rating: number
  comment: string | null
  created_at: string
  reviewer: { username: string | null; avatar_url: string | null } | null
}

export type ProductDetailData = {
  id: string
  title: string
  description: string | null
  price: number
  preview_urls: string[]
  license_type: "personal" | "commercial" | "extended"
  product_type: "digital" | "merchandise"
  file_formats: string[]
  file_size_bytes: number | null
  total_sales: number
  tags: string[]
  avg_rating: number
  review_count: number
  seller: Seller | null
}

export type ProductDetailPageProps = {
  product: ProductDetailData
  reviews: Review[]
  relatedProducts: Product[]
  buyerId: string | null
  buyerEmail?: string
  buyerName?: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null): string {
  if (!bytes) return "Not specified"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

function relativeTime(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProductDetailPageClient({
  product,
  reviews,
  relatedProducts,
  buyerId,
  buyerEmail,
  buyerName,
}: ProductDetailPageProps) {
  const posthog = usePostHog()
  const [activeImage, setActiveImage] = useState(0)
  const [isWished, setIsWished] = useState(false)

  useEffect(() => {
    posthog.capture("product_viewed", {
      product_id: product.id,
      title: product.title,
      price: product.price,
      license_type: product.license_type,
      product_type: product.product_type,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  const sellerName = product.seller?.full_name ?? product.seller?.username ?? "Unknown"
  const sellerInitial = sellerName[0]?.toUpperCase() ?? "?"

  const productTabs = [
    {
      id: "description",
      label: "Description",
      content: (
        <div className="prose prose-invert max-w-none">
          {product.description && (
            <p className="mb-6 border-l-2 border-amber-500/50 pl-4 italic leading-relaxed text-white/70">
              {product.description.slice(0, 180)}
              {product.description.length > 180 ? "…" : ""}
            </p>
          )}
          <p className="mb-4 leading-relaxed text-white/80">
            {product.description ?? "No description provided."}
          </p>
          {product.tags.length > 0 && (
            <>
              <h4 className="mb-4 mt-8 font-semibold text-white">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      id: "details",
      label: "File Details",
      content: (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {[
            {
              icon: Package,
              color: "amber",
              label: "FILE SIZE",
              value: formatBytes(product.file_size_bytes),
            },
            {
              icon: Download,
              color: "blue",
              label: "FORMATS",
              value: product.file_formats.join(", ") || "Not specified",
            },
            {
              icon: ShieldCheck,
              color: "emerald",
              label: "PRODUCT TYPE",
              value: product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1),
            },
            {
              icon: Tag,
              color: "purple",
              label: "LICENSE",
              value: product.license_type.charAt(0).toUpperCase() + product.license_type.slice(1),
            },
          ].map(({ icon: Icon, color, label, value }) => (
            <div
              key={label}
              className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 transition-colors hover:border-white/10"
            >
              <div className={`rounded-xl bg-${color}-400/10 p-3 transition-transform group-hover:scale-110`}>
                <Icon size={24} className={`text-${color}-400`} />
              </div>
              <div>
                <p className="text-xs font-medium text-white/40">{label}</p>
                <p className="font-semibold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "reviews",
      label: `Reviews (${product.review_count})`,
      content: (
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="py-12 text-center text-sm text-white/30">No reviews yet.</p>
          ) : (
            reviews.map((review) => {
              const name = review.reviewer?.username ?? "Anonymous"
              return (
                <div key={review.id} className="rounded-2xl border border-white/5 bg-white/5 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/10">
                        {review.reviewer?.avatar_url ? (
                          <Image
                            src={review.reviewer.avatar_url}
                            alt={name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-sm font-bold">
                            {name[0]?.toUpperCase() ?? "?"}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{name}</p>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={11}
                              className={
                                s <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-white/20"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-white/30">
                      {relativeTime(review.created_at)}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="leading-relaxed text-white/70">{review.comment}</p>
                  )}
                </div>
              )
            })
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0b0e] px-4 pb-16 pt-24 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumbs */}
        <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-xs text-white/40">
          <Link href="/" className="transition-colors hover:text-white">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" className="transition-colors hover:text-white">Products</Link>
          <ChevronRight size={12} />
          <span className="truncate text-white/80">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left: Preview Gallery */}
          <div className="space-y-4 lg:col-span-7">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-[#111318]">
              {product.preview_urls[activeImage] ? (
                <Image
                  src={product.preview_urls[activeImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl opacity-10">🎨</div>
              )}
            </div>

            {product.preview_urls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {product.preview_urls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={cn(
                      "relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                      activeImage === idx
                        ? "scale-105 border-amber-400 shadow-xl shadow-amber-900/20"
                        : "border-white/10 grayscale hover:border-white/30 hover:grayscale-0",
                    )}
                  >
                    <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-8 lg:col-span-5">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold leading-tight md:text-4xl">{product.title}</h1>

              {/* Seller & rating row */}
              <div className="flex flex-wrap items-center gap-6 border-y border-white/5 py-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white/20">
                    {product.seller?.avatar_url ? (
                      <Image
                        src={product.seller.avatar_url}
                        alt={sellerName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-orange-600 font-bold text-black">
                        {sellerInitial}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{sellerName}</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/40">
                      {product.total_sales}+ Sales
                    </p>
                  </div>
                </div>

                {product.review_count > 0 && (
                  <div className="flex items-center gap-1.5 border-l border-white/10 px-6">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={
                            s <= Math.round(product.avg_rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-white/20"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white/80">
                      {product.avg_rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-white/40">({product.review_count})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing card */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1c1e26] to-[#111318] p-8 shadow-2xl">
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 bg-amber-400/5 blur-3xl transition-colors group-hover:bg-amber-400/10" />

              <div className="relative z-10 space-y-6">
                <div className="flex flex-col">
                  <span className="mb-1 text-xs font-medium uppercase tracking-widest text-white/40">Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="premium" className="px-3 py-1 uppercase tracking-wide">
                    {product.license_type} License
                  </Badge>
                  {product.file_formats.slice(0, 4).map((fmt) => (
                    <Badge key={fmt} variant="outline" className="border-white/10 bg-white/5 text-white/60">
                      {fmt}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {buyerId ? (
                    <CheckoutButton
                      productIds={[product.id]}
                      buyerId={buyerId}
                      buyerEmail={buyerEmail}
                      buyerName={buyerName}
                      className="col-span-4 h-14 rounded-2xl bg-amber-400 text-lg font-bold text-black shadow-[0_10px_20px_-10px_rgba(251,191,36,0.5)] transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Buy Now
                    </CheckoutButton>
                  ) : (
                    <Link
                      href={`/login?from=/products/${product.id}`}
                      className="col-span-4 h-14 rounded-2xl bg-amber-400 text-lg font-bold text-black shadow-[0_10px_20px_-10px_rgba(251,191,36,0.5)] transition-all hover:scale-[1.02] hover:bg-amber-300 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={20} />
                      Buy Now
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsWished(!isWished)}
                    className={cn(
                      "flex h-14 items-center justify-center rounded-2xl border-white/10 transition-all",
                      isWished
                        ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                        : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <Heart size={24} fill={isWished ? "currentColor" : "none"} />
                  </Button>
                </div>

                <p className="text-center text-[11px] font-medium text-white/30">
                  Instant digital download • Lifetime access • Secure checkout
                </p>
              </div>
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="rounded-lg bg-emerald-500/10 p-2">
                  <ShieldCheck size={18} className="text-emerald-500" />
                </div>
                <span className="text-xs font-medium italic text-white/70">Quality Assured</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="rounded-lg bg-blue-500/10 p-2">
                  <Package size={18} className="text-blue-500" />
                </div>
                <span className="text-xs font-medium italic text-white/70">Verified Seller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-20 border-t border-white/5 py-12">
          <div className="max-w-4xl">
            <Tabs tabs={productTabs} defaultValue="description" />
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">You Might Also Like</h2>
              <Link
                href="/products"
                className="flex items-center gap-1 text-sm font-medium text-amber-400 transition-colors hover:text-amber-300"
              >
                View All <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onQuickView={() => {}} buyerId={null} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
