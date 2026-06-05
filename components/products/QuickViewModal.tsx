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
}

export default function QuickViewModal({ product, onClose, buyerId, buyerEmail, buyerName }: Props) {
  useEffect(() => {
    if (!product) return
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [product, onClose])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-2xl bg-[#111318] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X size={16} className="text-white" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-[#0d0f13]">
            {product.preview_urls[0] ? (
              <Image
                src={product.preview_urls[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">🎨</div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4 p-6">
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">{product.title}</h2>
              <p className="text-sm text-white/40 mt-1">by {product.seller.username}</p>
            </div>

            {product.avg_rating && (
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={12}
                    className={s <= Math.round(product.avg_rating!) ? "fill-amber-400 text-amber-400" : "text-white/20"}
                  />
                ))}
                <span className="text-xs text-white/40 ml-1">({product.review_count} reviews)</span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded-full capitalize">
                {product.license_type} license
              </span>
              <span className="text-xs bg-white/5 text-white/50 px-2 py-1 rounded-full capitalize">
                {product.product_type}
              </span>
              {product.file_formats.map(f => (
                <span key={f} className="text-xs font-mono bg-white/5 text-white/40 px-2 py-1 rounded-full uppercase">
                  {f}
                </span>
              ))}
            </div>

            <div className="mt-auto space-y-3">
              <div className="text-2xl font-bold text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </div>
              {buyerId ? (
                <CheckoutButton
                  productIds={[product.id]}
                  buyerId={buyerId}
                  buyerEmail={buyerEmail}
                  buyerName={buyerName}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-2xl transition-colors disabled:opacity-50"
                >
                  <ShoppingBag size={16} />
                  Buy Now
                </CheckoutButton>
              ) : (
                <Link
                  href={`/login?from=/products`}
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold py-3 rounded-2xl transition-colors"
                >
                  <ShoppingBag size={16} />
                  Buy Now
                </Link>
              )}
              <a
                href={`/products/${product.id}`}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium py-2.5 rounded-2xl transition-colors"
              >
                <ExternalLink size={14} />
                View Full Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
