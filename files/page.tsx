import { createServerClient } from "@/lib/supabase"
import ProductsClient from "./ProductsClient"

type SearchParams = {
  category?: string
  license?: string
  format?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  q?: string
  page?: string
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = createServerClient()

  // ── Fetch categories for sidebar ──────────────────────────
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order")

  // ── Build products query ───────────────────────────────────
  let query = supabase
    .from("products")
    .select(`
      id, title, price, preview_urls, license_type,
      product_type, file_formats, total_sales,
      seller:profiles!seller_id ( username, avatar_url ),
      reviews ( rating )
    `, { count: "exact" })
    .eq("status", "published")

  // Filters
  if (searchParams.category) {
    const cat = categories?.find((c) => c.slug === searchParams.category)
    if (cat) query = query.eq("category_id", cat.id)
  }
  if (searchParams.license) {
    query = query.eq("license_type", searchParams.license)
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
  if (searchParams.q) {
    query = query.textSearch("fts", searchParams.q, { type: "websearch" })
  }

  // Sort
  const sort = searchParams.sort ?? "newest"
  if (sort === "newest")   query = query.order("created_at", { ascending: false })
  if (sort === "popular")  query = query.order("total_sales", { ascending: false })
  if (sort === "price_asc") query = query.order("price", { ascending: true })
  if (sort === "price_desc") query = query.order("price", { ascending: false })

  // Pagination
  const PAGE_SIZE = 12
  const page = Math.max(1, Number(searchParams.page ?? 1))
  query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const { data: rawProducts, count } = await query

  // Compute average ratings
  const products = (rawProducts ?? []).map((p: any) => {
    const ratings: number[] = (p.reviews ?? []).map((r: any) => r.rating)
    const avg = ratings.length
      ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
      : 0
    return {
      ...p,
      reviews: undefined,
      avg_rating: avg,
      review_count: ratings.length,
    }
  })

  return (
    <ProductsClient
      initialProducts={products}
      totalCount={count ?? 0}
      categories={categories ?? []}
      currentPage={page}
      pageSize={PAGE_SIZE}
    />
  )
}
