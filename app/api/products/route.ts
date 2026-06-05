import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import type { LicenseType, ProductType } from "@/types/database";

interface CreateProductBody {
  title: string;
  description: string;
  categorySlug: string;
  tags: string[];
  price: number;
  licenseType: LicenseType;
  productType: ProductType;
  designFilePath: string;
  previewPaths: string[];
  fileSizeBytes: number;
  fileFormats: string[];
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/, "");
}

// POST /api/products
// Inserts a new product row with status = 'pending_review'.
export async function POST(request: Request) {
  const uid = cookies().get("firebase-session")?.value;
  if (!uid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CreateProductBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const {
    title,
    description,
    categorySlug,
    tags,
    price,
    licenseType,
    productType,
    designFilePath,
    previewPaths,
    fileSizeBytes,
    fileFormats,
  } = body;

  // ── Validate required fields ──────────────────────────────────────────────
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!designFilePath) return NextResponse.json({ error: "Design file is required" }, { status: 400 });
  if (previewPaths.length === 0) return NextResponse.json({ error: "At least one preview is required" }, { status: 400 });
  if (price < 0) return NextResponse.json({ error: "Price must be non-negative" }, { status: 400 });

  const supabase = createServerClient();

  // ── Resolve seller profile UUID ───────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("firebase_uid", uid)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Seller profile not found" }, { status: 403 });
  }

  // ── Resolve category ──────────────────────────────────────────────────────
  let categoryId: string | null = null;
  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();
    categoryId = cat?.id ?? null;
  }

  // ── Generate unique slug ──────────────────────────────────────────────────
  const baseSlug = slugify(title);
  const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

  // ── Insert product ────────────────────────────────────────────────────────
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      seller_id: profile.id,
      category_id: categoryId,
      title: title.trim(),
      slug,
      description: description?.trim() ?? null,
      price,
      file_url: designFilePath,
      preview_urls: previewPaths,
      tags,
      license_type: licenseType,
      product_type: productType,
      file_formats: fileFormats,
      file_size_bytes: fileSizeBytes,
      status: "pending_review",
    })
    .select("id")
    .single();

  if (error || !product) {
    console.error("Product insert error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to create product" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: product.id }, { status: 201 });
}
