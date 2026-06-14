import { notFound } from "next/navigation"
import { cookies } from "next/headers"
import type { Metadata } from "next"
import { createServerClient } from "@/lib/supabase/server"
import {
  ProductDetailPageClient,
  type ProductDetailData,
  type Review,
} from "@/components/products/ProductDetailPageClient"
import type { Product } from "@/components/products/ProductCard"

// Revalidate ISR every hour
export const revalidate = 3600

// ── Static params: pre-render top 100 products by sales ───────────────────────

export async function generateStaticParams() {
  try {
    const supabase = createServerClient()
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("status", "published")
      .order("total_sales", { ascending: false })
      .limit(100)
    return (data ?? []).map(({ id }) => ({ id }))
  } catch {
    return []
  }
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("products")
    .select("title, description, preview_urls, price, profiles!seller_id(username)")
    .eq("id", params.id)
    .single()

  if (!data) return { title: "Product Not Found" }

  const seller = (data.profiles as any)?.username ?? "Design Marketplace"
  const description =
    data.description?.slice(0, 155) ??
    `Buy ${data.title} by ${seller} on Design Marketplace — premium design assets.`
  const ogImage = data.preview_urls[0]

  return {
    title: data.title,
    description,
    openGraph: {
      title: `${data.title} by ${seller}`,
      description,
      type: "website",
      ...(ogImage && {
        images: [{ url: ogImage, width: 1200, height: 630, alt: data.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${data.title} by ${seller}`,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // ── Main product fetch: seller + reviews with reviewer profiles ──────────
  const { data: raw } = await supabase
    .from("products")
    .select(`
      id, title, description, price, preview_urls,
      license_type, product_type, file_formats, file_size_bytes,
      total_sales, tags, category_id,
      profiles!seller_id ( id, username, full_name, avatar_url, bio ),
      reviews (
        id, rating, comment, created_at,
        profiles!reviewer_id ( username, avatar_url )
      )
    `)
    .eq("id", params.id)
    .eq("status", "published")
    .single()

  if (!raw) notFound()

  // Compute avg rating from embedded reviews
  const rawReviews: any[] = (raw as any).reviews ?? []
  const avgRating = rawReviews.length
    ? rawReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / rawReviews.length
    : 0

  const product: ProductDetailData = {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    price: raw.price,
    preview_urls: raw.preview_urls,
    license_type: raw.license_type,
    product_type: raw.product_type,
    file_formats: raw.file_formats,
    file_size_bytes: raw.file_size_bytes,
    total_sales: raw.total_sales,
    tags: raw.tags,
    avg_rating: Math.round(avgRating * 10) / 10,
    review_count: rawReviews.length,
    seller: (raw as any).profiles ?? null,
  }

  const reviews: Review[] = rawReviews.map((r: any) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    created_at: r.created_at,
    reviewer: r.profiles ?? null,
  }))

  // ── Related products from the same category ──────────────────────────────
  const categoryId = (raw as any).category_id as string | null
  const { data: rawRelated } = categoryId
    ? await supabase
        .from("products")
        .select(`
          id, title, price, preview_urls, license_type, product_type,
          file_formats, total_sales,
          profiles!seller_id ( username, avatar_url ),
          reviews ( rating )
        `)
        .eq("status", "published")
        .eq("category_id", categoryId)
        .neq("id", params.id)
        .order("total_sales", { ascending: false })
        .limit(4)
    : { data: [] }

  const relatedProducts: Product[] = (rawRelated ?? []).map((p: any) => {
    const ratings: number[] = (p.reviews ?? []).map((r: any) => r.rating)
    const avg = ratings.length
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      preview_urls: p.preview_urls,
      license_type: p.license_type,
      product_type: p.product_type,
      file_formats: p.file_formats,
      total_sales: p.total_sales,
      avg_rating: avg,
      review_count: ratings.length,
      seller: p.profiles ?? { username: null, avatar_url: null },
    }
  })

  // Resolve the buyer's Supabase profile UUID from the session cookie
  const firebaseUid = cookies().get("firebase-session")?.value ?? null
  let buyerId: string | null = null
  let buyerEmail: string | undefined
  let buyerName: string | undefined

  if (firebaseUid) {
    const { data: buyerProfile } = await supabase
      .from("profiles")
      .select("id, email, full_name, username")
      .eq("firebase_uid", firebaseUid)
      .single()

    if (buyerProfile) {
      buyerId = buyerProfile.id
      buyerEmail = buyerProfile.email
      buyerName = buyerProfile.full_name ?? buyerProfile.username ?? undefined
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://design-marketplace.com"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.preview_urls[0] ?? undefined,
    url: `${appUrl}/products/${product.id}`,
    brand: {
      "@type": "Brand",
      name: product.seller?.full_name ?? product.seller?.username ?? "Design Marketplace",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${appUrl}/products/${product.id}`,
    },
    ...(product.review_count > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.avg_rating,
        reviewCount: product.review_count,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailPageClient
        product={product}
        reviews={reviews}
        relatedProducts={relatedProducts}
        buyerId={buyerId}
        buyerEmail={buyerEmail}
        buyerName={buyerName}
      />
    </>
  )
}
