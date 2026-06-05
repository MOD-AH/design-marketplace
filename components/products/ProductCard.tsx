"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, Eye, ShoppingBag, Heart } from "lucide-react"
import { CheckoutButton } from "@/components/CheckoutButton"

export type Product = {
  id: string
  title: string
  price: number
  preview_urls: string[]
  license_type: "personal" | "commercial" | "extended"
  product_type: "digital" | "merchandise"
  file_formats: string[]
  total_sales: number
  seller: {
    username: string
    avatar_url: string | null
  }
  avg_rating?: number
  review_count?: number
}

type Props = {
  product: Product
  onQuickView: (product: Product) => void
  buyerId: string | null
  buyerEmail?: string
  buyerName?: string
}

export default function ProductCard({ product, onQuickView, buyerId, buyerEmail, buyerName }: Props) {
  const [wished, setWished] = useState(false)
  const [imgError, setImgError] = useState(false)

  const preview = product.preview_urls[0] ?? "/placeholder.png"
  const rating = product.avg_rating ?? 0
  const reviews = product.review_count ?? 0

  const licenseColor = {
    personal: "bg-slate-700 text-slate-200",
    commercial: "bg-amber-900/60 text-amber-300",
    extended: "bg-emerald-900/60 text-emerald-300",
  }[product.license_type]

  return (
    <article className="group relative flex flex-col bg-[#111318] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40">
      {/* Preview image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0f13]">
        {!imgError ? (
          <Image
            src={preview}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-20">🎨</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/90 transition-colors"
          >
            <Eye size={15} />
            Quick View
          </button>
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => setWished(!wished)}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart
            size={14}
            className={wished ? "fill-rose-500 text-rose-500" : "text-white"}
          />
        </button>

        {/* License badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${licenseColor}`}>
          {product.license_type}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-amber-300 transition-colors">
          {product.title}
        </h3>

        {/* Seller */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-[10px] font-bold text-black flex-shrink-0">
            {product.seller.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-xs text-white/40 truncate">
            {product.seller.username ?? "Unknown"}
          </span>
        </div>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={10}
                className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-white/20"}
              />
            ))}
            <span className="text-[10px] text-white/30 ml-1">({reviews})</span>
          </div>
        )}

        {/* File formats */}
        {product.file_formats.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {product.file_formats.slice(0, 3).map((fmt) => (
              <span key={fmt} className="text-[9px] uppercase tracking-wide font-mono bg-white/5 text-white/30 px-1.5 py-0.5 rounded">
                {fmt}
              </span>
            ))}
          </div>
        )}

        {/* Price + buy */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          <span className="text-base font-bold text-white">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {buyerId ? (
            <CheckoutButton
              productIds={[product.id]}
              buyerId={buyerId}
              buyerEmail={buyerEmail}
              buyerName={buyerName}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              <ShoppingBag size={12} />
              Buy
            </CheckoutButton>
          ) : (
            <Link
              href={`/login?from=/products`}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
            >
              <ShoppingBag size={12} />
              Buy
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
