"use client"

import React, { useState } from "react"
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
  svgPreview?: React.ReactNode
}

const licenseLabel: Record<string, string> = {
  personal: "Personal",
  commercial: "Commercial",
  extended: "Extended",
}

const licenseStyle: Record<string, string> = {
  personal: "bg-[#F0EBE4] text-[#7A6F68]",
  commercial: "bg-[#FEF3E8] text-[#C8873A]",
  extended: "bg-[#E8F4EE] text-[#2D7A4F]",
}

export default function ProductCard({ product, onQuickView, buyerId, buyerEmail, buyerName, svgPreview }: Props) {
  const [wished, setWished] = useState(false)
  const [imgError, setImgError] = useState(false)

  const preview = product.preview_urls[0] ?? null
  const rating = product.avg_rating ?? 0
  const reviews = product.review_count ?? 0

  return (
    <article className="group relative flex flex-col rounded-2xl border border-[#E8E2D9] bg-white overflow-hidden hover:border-[#C8A882] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(26,22,20,0.10)]">
      {/* Preview */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F0EBE4]">
        {svgPreview ? (
          <div className="absolute inset-0">{svgPreview}</div>
        ) : preview && !imgError ? (
          <Image
            src={preview}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5EDD8] to-[#EEE8F8]">
            <div className="h-16 w-16 rounded-full bg-[#E8E2D9]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/70 via-[#1A1614]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end justify-center pb-4">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center gap-2 bg-white text-[#1A1614] text-xs font-bold px-5 py-2.5 rounded-full shadow-lg hover:bg-[#FAF7F2] transition-colors"
          >
            <Eye size={13} />
            Quick View
          </button>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished) }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#E8E2D9] opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-sm"
        >
          <Heart
            size={13}
            className={wished ? "fill-rose-500 text-rose-500" : "text-[#9A8F88]"}
          />
        </button>

        {/* License badge */}
        <span className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${licenseStyle[product.license_type] ?? "bg-[#F0EBE4] text-[#7A6F68]"}`}>
          {licenseLabel[product.license_type]}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-sm font-semibold text-[#1A1614] leading-snug line-clamp-2 group-hover:text-[#C8873A] transition-colors">
          {product.title}
        </h3>

        {/* Seller */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#1A1614] flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">
            {product.seller.username?.[0]?.toUpperCase() ?? "?"}
          </div>
          <span className="text-xs text-[#9A8F88] truncate">
            {product.seller.username ?? "Unknown"}
          </span>
        </div>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map((s) => (
              <Star key={s} size={10}
                className={s <= Math.round(rating) ? "fill-[#C8873A] text-[#C8873A]" : "text-[#E8E2D9]"}
              />
            ))}
            <span className="text-[10px] text-[#B5A99A] ml-1">({reviews})</span>
          </div>
        )}

        {/* File formats */}
        {product.file_formats.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {product.file_formats.slice(0, 3).map((fmt) => (
              <span key={fmt} className="text-[9px] uppercase tracking-wide font-mono bg-[#FAF7F2] text-[#9A8F88] border border-[#E8E2D9] px-1.5 py-0.5 rounded">
                {fmt}
              </span>
            ))}
            {product.file_formats.length > 3 && (
              <span className="text-[9px] text-[#B5A99A]">+{product.file_formats.length - 3}</span>
            )}
          </div>
        )}

        {/* Price + buy */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F0EBE4]">
          <span className="text-base font-black text-[#1A1614]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {buyerId ? (
            <CheckoutButton
              productIds={[product.id]}
              buyerId={buyerId}
              buyerEmail={buyerEmail}
              buyerName={buyerName}
              className="flex items-center gap-1.5 bg-[#1A1614] hover:bg-[#2D2420] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors disabled:opacity-50"
            >
              <ShoppingBag size={11} />
              Buy
            </CheckoutButton>
          ) : (
            <Link
              href={`/login?from=/products`}
              className="flex items-center gap-1.5 bg-[#1A1614] hover:bg-[#2D2420] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              <ShoppingBag size={11} />
              Buy
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
