// Hand-authored from supabase/migrations/00001_initial_schema.sql (FINAL SCHEMA v4).
// Re-generate with: npx supabase gen types typescript --local > types/database.ts
// once your Supabase project is linked.

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProductStatus = "draft" | "pending_review" | "published" | "rejected" | "unpublished";
export type LicenseType = "personal" | "commercial" | "extended";
export type ProductType = "digital" | "merchandise";
export type OrderStatus = "pending" | "completed" | "failed" | "refunded";
export type PayoutStatus = "pending" | "processing" | "paid" | "failed";

// ─── Table: profiles ─────────────────────────────────────────────────────────

export interface ProfileRow {
  id: string;
  firebase_uid: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_seller: boolean;
  is_admin: boolean;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id?: string;
  firebase_uid: string;
  email: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  is_seller?: boolean;
  is_admin?: boolean;
  website_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  id?: string;
  firebase_uid?: string;
  email?: string;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  is_seller?: boolean;
  is_admin?: boolean;
  website_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Table: categories ───────────────────────────────────────────────────────

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  created_at: string;
}

export interface CategoryInsert {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface CategoryUpdate {
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  icon?: string | null;
  sort_order?: number;
  created_at?: string;
}

// ─── Table: products ─────────────────────────────────────────────────────────
// `fts` is a tsvector column managed by trigger — exclude from Insert/Update.

export interface ProductRow {
  id: string;
  seller_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  price: number;
  file_url: string | null;
  preview_urls: string[];
  tags: string[];
  license_type: LicenseType;
  product_type: ProductType;
  file_formats: string[];
  file_size_bytes: number | null;
  status: ProductStatus;
  total_sales: number;
  total_revenue: number;
  fts: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductInsert {
  id?: string;
  seller_id: string;
  category_id?: string | null;
  title: string;
  description?: string | null;
  price: number;
  file_url?: string | null;
  preview_urls?: string[];
  tags?: string[];
  license_type?: LicenseType;
  product_type?: ProductType;
  file_formats?: string[];
  file_size_bytes?: number | null;
  status?: ProductStatus;
  total_sales?: number;
  total_revenue?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductUpdate {
  id?: string;
  seller_id?: string;
  category_id?: string | null;
  title?: string;
  description?: string | null;
  price?: number;
  file_url?: string | null;
  preview_urls?: string[];
  tags?: string[];
  license_type?: LicenseType;
  product_type?: ProductType;
  file_formats?: string[];
  file_size_bytes?: number | null;
  status?: ProductStatus;
  total_sales?: number;
  total_revenue?: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Table: product_embeddings ───────────────────────────────────────────────
// `embedding` is a pgvector vector(384); Supabase returns it as number[].

export interface ProductEmbeddingRow {
  id: string;
  product_id: string;
  embedding: number[] | null;
  created_at: string;
}

export interface ProductEmbeddingInsert {
  id?: string;
  product_id: string;
  embedding?: number[] | null;
  created_at?: string;
}

export interface ProductEmbeddingUpdate {
  id?: string;
  product_id?: string;
  embedding?: number[] | null;
  created_at?: string;
}

// ─── Table: orders ───────────────────────────────────────────────────────────

export interface OrderRow {
  id: string;
  buyer_id: string;
  status: OrderStatus;
  total_amount: number;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderInsert {
  id?: string;
  buyer_id: string;
  status?: OrderStatus;
  total_amount: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface OrderUpdate {
  id?: string;
  buyer_id?: string;
  status?: OrderStatus;
  total_amount?: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Table: order_items ──────────────────────────────────────────────────────

export interface OrderItemRow {
  id: string;
  order_id: string;
  product_id: string;
  seller_id: string;
  price_at_purchase: number;
  platform_fee: number;
  seller_payout: number;
  download_url: string | null;
  download_expires_at: string | null;
  created_at: string;
}

export interface OrderItemInsert {
  id?: string;
  order_id: string;
  product_id: string;
  seller_id: string;
  price_at_purchase: number;
  platform_fee: number;
  seller_payout: number;
  download_url?: string | null;
  download_expires_at?: string | null;
  created_at?: string;
}

export interface OrderItemUpdate {
  id?: string;
  order_id?: string;
  product_id?: string;
  seller_id?: string;
  price_at_purchase?: number;
  platform_fee?: number;
  seller_payout?: number;
  download_url?: string | null;
  download_expires_at?: string | null;
  created_at?: string;
}

// ─── Table: reviews ──────────────────────────────────────────────────────────

export interface ReviewRow {
  id: string;
  product_id: string;
  reviewer_id: string;
  order_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface ReviewInsert {
  id?: string;
  product_id: string;
  reviewer_id: string;
  order_id: string;
  rating: number;
  comment?: string | null;
  created_at?: string;
}

export interface ReviewUpdate {
  id?: string;
  product_id?: string;
  reviewer_id?: string;
  order_id?: string;
  rating?: number;
  comment?: string | null;
  created_at?: string;
}

// ─── Table: payouts ──────────────────────────────────────────────────────────

export interface PayoutRow {
  id: string;
  seller_id: string;
  amount: number;
  status: PayoutStatus;
  processed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface PayoutInsert {
  id?: string;
  seller_id: string;
  amount: number;
  status?: PayoutStatus;
  processed_at?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface PayoutUpdate {
  id?: string;
  seller_id?: string;
  amount?: number;
  status?: PayoutStatus;
  processed_at?: string | null;
  notes?: string | null;
  created_at?: string;
}

// ─── Table: ai_usage ─────────────────────────────────────────────────────────

export interface AiUsageRow {
  id: string;
  user_id: string;
  feature: string;
  used_at: string;
}

export interface AiUsageInsert {
  id?: string;
  user_id: string;
  feature: string;
  used_at?: string;
}

export interface AiUsageUpdate {
  id?: string;
  user_id?: string;
  feature?: string;
  used_at?: string;
}

// ─── Database (Supabase typed client shape) ───────────────────────────────────
// Row/Insert/Update types are intersected with Record<string, unknown> because
// TypeScript interfaces without an explicit index signature don't satisfy
// GenericTable's `Record<string, unknown>` constraint in conditional types.
// The intersection is applied only here — the public interfaces stay clean.

type R = Record<string, unknown>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow & R;
        Insert: ProfileInsert & R;
        Update: ProfileUpdate & R;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow & R;
        Insert: CategoryInsert & R;
        Update: CategoryUpdate & R;
        Relationships: [];
      };
      products: {
        Row: ProductRow & R;
        Insert: ProductInsert & R;
        Update: ProductUpdate & R;
        Relationships: [];
      };
      product_embeddings: {
        Row: ProductEmbeddingRow & R;
        Insert: ProductEmbeddingInsert & R;
        Update: ProductEmbeddingUpdate & R;
        Relationships: [];
      };
      orders: {
        Row: OrderRow & R;
        Insert: OrderInsert & R;
        Update: OrderUpdate & R;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow & R;
        Insert: OrderItemInsert & R;
        Update: OrderItemUpdate & R;
        Relationships: [];
      };
      reviews: {
        Row: ReviewRow & R;
        Insert: ReviewInsert & R;
        Update: ReviewUpdate & R;
        Relationships: [];
      };
      payouts: {
        Row: PayoutRow & R;
        Insert: PayoutInsert & R;
        Update: PayoutUpdate & R;
        Relationships: [];
      };
      ai_usage: {
        Row: AiUsageRow & R;
        Insert: AiUsageInsert & R;
        Update: AiUsageUpdate & R;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_similar_products: {
        Args: {
          query_embedding: number[];
          exclude_id: string;
          match_count?: number;
        };
        Returns: Array<{
          product_id: string;
          similarity: number;
        }>;
      };
    };
    Enums: {
      product_status: ProductStatus;
      license_type: LicenseType;
      product_type: ProductType;
      order_status: OrderStatus;
      payout_status: PayoutStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
