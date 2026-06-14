"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Star, ShoppingBag, ExternalLink } from "lucide-react"
import type { Product } from "./ProductCard"
import { CheckoutButton } from "@/components/CheckoutButton"

type Props = {
  product: Product | null
  onClose: () => void
  buyerId: string | null
  buyerEmail?: string
  buyerName?: string
  svgPreview?: React.ReactNode
}

export default function QuickViewModal({ product, onClose, buyerId, buyerEmail, buyerName, svgPreview }: Props) {
  useEffect(() => {
    if (!product) return
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [product, onClose])

  if (!product) return null

  const licenseStyle: Record<string, string> = {
    personal: "bg-[#F0EBE4] text-[#7A6F68]",
    commercial: "bg-[#FEF3E8] text-[#C8873A]",
    extended: "bg-[#E8F4EE] text-[#2D7A4F]",
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1614]/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-white border border-[#E8E2D9] rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(26,22,20,0.2)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[#FAF7F2] border border-[#E8E2D9] hover:bg-[#F0EBE4] transition-colors shadow-sm"
        >
          <X size={16} className="text-[#7A6F68]" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Preview */}
          <div className="relative aspect-square bg-[#F0EBE4] overflow-hidden">
            {svgPreview ? (
              <div className="absolute inset-0">{svgPreview}</div>
            ) : product.preview_urls[0] ? (
              <Image
                src={product.preview_urls[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F5EDD8] to-[#EEE8F8]">
                <div className="h-20 w-20 rounded-full bg-[#E8E2D9]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 p-7">
            <div>
              <h2 className="text-lg font-bold text-[#1A1614] leading-tight">{product.title}</h2>
              <p className="text-sm text-[#9A8F88] mt-1">by {product.seller.username}</p>
            </div>

            {product.avg_rating && product.review_count ? (
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={12}
                    className={s <= Math.round(product.avg_rating!) ? "fill-[#C8873A] text-[#C8873A]" : "text-[#E8E2D9]"}
                  />
                ))}
                <span className="text-xs text-[#9A8F88] ml-1">({product.review_count} reviews)</span>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-1.5">
              <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${licenseStyle[product.license_type] ?? "bg-[#F0EBE4] text-[#7A6F68]"}`}>
                {product.license_type} license
              </span>
              <span className="text-xs bg-[#FAF7F2] border border-[#E8E2D9] text-[#7A6F68] px-2.5 py-1 rounded-full capitalize">
                {product.product_type}
              </span>
              {product.file_formats.map(f => (
                <span key={f} className="text-xs font-mono bg-[#FAF7F2] border border-[#E8E2D9] text-[#9A8F88] px-2.5 py-1 rounded-full uppercase">
                  {f}
                </span>
              ))}
            </div>

            {product.total_sales > 0 && (
              <p className="text-xs text-[#B5A99A]">{product.total_sales.toLocaleString()} sales</p>
            )}

            <div className="mt-auto space-y-3 pt-2 border-t border-[#F0EBE4]">
              <div className="text-2xl font-black text-[#1A1614]">
                ₹{product.price.toLocaleString("en-IN")}
              </div>
              {buyerId ? (
                <CheckoutButton
                  productIds={[product.id]}
                  buyerId={buyerId}
                  buyerEmail={buyerEmail}
                  buyerName={buyerName}
                  className="w-full flex items-center justify-center gap-2 bg-[#1A1614] hover:bg-[#2D2420] text-white font-bold py-3 rounded-2xl transition-colors disabled:opacity-50 shadow-sm"
                >
                  <ShoppingBag size={16} />
                  Buy Now
                </CheckoutButton>
              ) : (
                <Link
                  href="/login?from=/products"
                  className="w-full flex items-center justify-center gap-2 bg-[#1A1614] hover:bg-[#2D2420] text-white font-bold py-3 rounded-2xl transition-colors shadow-sm"
                >
                  <ShoppingBag size={16} />
                  Buy Now
                </Link>
              )}
              <Link
                href={`/products/${product.id}`}
                className="w-full flex items-center justify-center gap-2 bg-[#FAF7F2] border border-[#E8E2D9] hover:bg-[#F0EBE4] text-[#5C5248] text-sm font-semibold py-2.5 rounded-2xl transition-colors"
              >
                <ExternalLink size={14} />
                View Full Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
