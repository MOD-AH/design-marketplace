import { Suspense } from "react"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"
import type { LicenseType } from "@/types/database"
import ProductsClient from "./ProductsClient"

const PAGE_SIZE = 12

export type SearchParams = {
  category?: string
  license?: string
  format?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  q?: string
  page?: string
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProductsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0b0e] text-white pt-20">
      <div className="sticky top-[64px] z-30 border-b border-white/5 bg-[#0a0b0e]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <div className="h-9 w-full max-w-md animate-pulse rounded-full bg-white/5" />
          <div className="ml-auto h-9 w-28 animate-pulse rounded-full bg-white/5" />
          <div className="h-9 w-20 animate-pulse rounded-full bg-white/5 lg:hidden" />
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <div className="hidden h-[480px] w-64 shrink-0 animate-pulse rounded-2xl bg-white/5 lg:block" />
        <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white/5" style={{ aspectRatio: "3/4" }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Async fetcher (server-side) ───────────────────────────────────────────────

async function ProductsFetcher({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createServerClient()

  // Resolve buyer profile from session cookie (null if not logged in)
  const uid = cookies().get("firebase-session")?.value
  let buyerId: string | null = null
  let buyerEmail: string | null = null
  let buyerName: string | null = null
  if (uid) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("firebase_uid", uid)
      .single()
    buyerId = profile?.id ?? null
    buyerEmail = profile?.email ?? null
    buyerName = profile?.full_name ?? null
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order")

  let query = supabase
    .from("products")
    .select(
      `id, title, price, preview_urls, license_type,
       product_type, file_formats, total_sales,
       seller:profiles!seller_id ( username, avatar_url ),
       reviews ( rating )`,
      { count: "exact" },
    )
    .eq("status", "published")

  // ── Filters ────────────────────────────────────────────────
  if (searchParams.category) {
    const cat = categories?.find((c) => c.slug === searchParams.category)
    if (cat) query = query.eq("category_id", cat.id)
  }
  if (searchParams.license) {
    query = query.eq("license_type", searchParams.license as LicenseType)
  }
  if (searchParams.format) {
    query = query.contains("file_formats", [searchParams.format])
  }
  if (searchParams.minPrice) {
    query = query.gte("price", Number(searchParams.minPrice))
  }
  if (searchParams.maxPrice) {
    query = query.lte("price", Number(searchParams.maxPrice))
  }
  if (searchParams.q?.trim()) {
    query = query.textSearch("fts", searchParams.q.trim(), { type: "websearch" })
  }

  // ── Sort ───────────────────────────────────────────────────
  const sort = searchParams.sort ?? "newest"
  if (sort === "newest")    query = query.order("created_at", { ascending: false })
  if (sort === "popular")   query = query.order("total_sales", { ascending: false })
  if (sort === "price_asc") query = query.order("price",       { ascending: true  })
  if (sort === "price_desc") query = query.order("price",      { ascending: false })

  // ── Accumulative pagination ────────────────────────────────
  // range(0, page*PAGE_SIZE-1) returns all rows up to the current "Load more" depth,
  // so the URL stays the source of truth and the full visible set is always returned.
  const page = Math.max(1, Number(searchParams.page ?? 1))
  query = query.range(0, page * PAGE_SIZE - 1)

  const { data: rawProducts, count } = await query

  const products = (rawProducts ?? []).map((p: any) => {
    const ratings: number[] = (p.reviews ?? []).map((r: any) => r.rating)
    const avg = ratings.length
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0
    return { ...p, reviews: undefined, avg_rating: avg, review_count: ratings.length }
  })

  return (
    <ProductsClient
      initialProducts={products}
      totalCount={count ?? 0}
      categories={categories ?? []}
      currentPage={page}
      pageSize={PAGE_SIZE}
      hasMore={(count ?? 0) > page * PAGE_SIZE}
      buyerId={buyerId}
      buyerEmail={buyerEmail}
      buyerName={buyerName}
    />
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
// Non-async so it renders the shell immediately; ProductsFetcher streams in.
// Suspense key excludes `page` so "Load more" transitions in-place (no skeleton
// flash), while any filter change resets the boundary and shows the skeleton.

function filtersKey(sp: SearchParams): string {
  const { page: _page, ...filters } = sp
  return JSON.stringify(filters)
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  return (
    <Suspense key={filtersKey(searchParams)} fallback={<ProductsPageSkeleton />}>
      <ProductsFetcher searchParams={searchParams} />
    </Suspense>
  )
}
