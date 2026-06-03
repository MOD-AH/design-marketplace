-- Migration: 00003_marketplace_rls
-- Row Level Security policies for all marketplace tables.
--
-- Security model summary:
--   · Public (anon + authenticated) — read published products, categories, profiles, reviews
--   · Authenticated buyer           — place orders, read own orders/items, write reviews after purchase
--   · Authenticated seller          — CRUD own products, read own payout records
--   · Admin role                    — full access to every table
--   · Service role (server key)     — bypasses RLS entirely; use for webhooks and background jobs
--
-- Depends on: public.get_firebase_uid(), public.is_admin(), public.has_purchased()
--   defined in 00002_marketplace_schema.sql

-- ─── profiles ────────────────────────────────────────────────────────────────

alter table public.profiles enable row level security;

-- Public profiles are readable by everyone (username, avatar, bio, is_seller)
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- A user may only insert a profile for themselves
create policy "profiles: insert own"
  on public.profiles for insert
  with check (user_id = public.get_firebase_uid());

-- A user may update their own profile; admins may update any
create policy "profiles: update own or admin"
  on public.profiles for update
  using (
    user_id = public.get_firebase_uid()
    or public.is_admin()
  );

-- Only admins may hard-delete profiles
create policy "profiles: admin delete"
  on public.profiles for delete
  using (public.is_admin());

-- ─── categories ──────────────────────────────────────────────────────────────

alter table public.categories enable row level security;

-- Categories are publicly readable
create policy "categories: public read"
  on public.categories for select
  using (true);

-- Only admins may create, update, or delete categories
create policy "categories: admin write"
  on public.categories for insert
  with check (public.is_admin());

create policy "categories: admin update"
  on public.categories for update
  using (public.is_admin());

create policy "categories: admin delete"
  on public.categories for delete
  using (public.is_admin());

-- ─── products ────────────────────────────────────────────────────────────────

alter table public.products enable row level security;

-- Anyone can read published products
create policy "products: public read published"
  on public.products for select
  using (status = 'published');

-- Sellers can read all their own products regardless of status (drafts, rejected, etc.)
create policy "products: seller read own"
  on public.products for select
  using (seller_id = public.get_firebase_uid());

-- Admins can read every product
create policy "products: admin read all"
  on public.products for select
  using (public.is_admin());

-- Only verified sellers can create products for themselves
create policy "products: seller insert"
  on public.products for insert
  with check (
    seller_id = public.get_firebase_uid()
    and exists (
      select 1 from public.profiles
      where user_id   = public.get_firebase_uid()
        and is_seller = true
    )
  );

-- Only the owning seller or an admin may update a product
-- (status transitions like publish/reject are done by admin or service role)
create policy "products: seller update own or admin"
  on public.products for update
  using (
    seller_id = public.get_firebase_uid()
    or public.is_admin()
  );

-- Only the owning seller or an admin may delete a product
create policy "products: seller delete own or admin"
  on public.products for delete
  using (
    seller_id = public.get_firebase_uid()
    or public.is_admin()
  );

-- ─── orders ──────────────────────────────────────────────────────────────────

alter table public.orders enable row level security;

-- Buyers can only see their own orders
create policy "orders: buyer read own"
  on public.orders for select
  using (buyer_id = public.get_firebase_uid());

-- Admins can read all orders
create policy "orders: admin read all"
  on public.orders for select
  using (public.is_admin());

-- Authenticated buyers may create an order for themselves
create policy "orders: buyer insert"
  on public.orders for insert
  with check (buyer_id = public.get_firebase_uid());

-- Status updates (pending → paid, etc.) come from the Razorpay webhook via
-- the service role key — that bypasses RLS. This policy lets admins do it too.
create policy "orders: admin update"
  on public.orders for update
  using (public.is_admin());

-- Orders are never deleted (use status = 'refunded' instead)
-- No delete policy intentionally.

-- ─── order_items ─────────────────────────────────────────────────────────────

alter table public.order_items enable row level security;

-- Buyers can read line items that belong to their own orders
create policy "order_items: buyer read own"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where  id       = order_id
        and  buyer_id = public.get_firebase_uid()
    )
  );

-- Sellers can see order items that contain their products
-- (useful for fulfilment dashboards)
create policy "order_items: seller read own products"
  on public.order_items for select
  using (
    exists (
      select 1 from public.products
      where  id        = product_id
        and  seller_id = public.get_firebase_uid()
    )
  );

-- Admins can read all order items
create policy "order_items: admin read all"
  on public.order_items for select
  using (public.is_admin());

-- Inserts happen server-side via the service role during checkout.
-- Admins may also insert (e.g. manual order creation).
create policy "order_items: admin insert"
  on public.order_items for insert
  with check (public.is_admin());

-- No update or delete policies — order items are immutable once created.

-- ─── reviews ─────────────────────────────────────────────────────────────────

alter table public.reviews enable row level security;

-- Anyone can read reviews on published products
create policy "reviews: public read on published products"
  on public.reviews for select
  using (
    exists (
      select 1 from public.products
      where  id     = product_id
        and  status = 'published'
    )
  );

-- Only buyers who have purchased the product may submit a review
create policy "reviews: buyer insert after purchase"
  on public.reviews for insert
  with check (
    reviewer_id = public.get_firebase_uid()
    and public.has_purchased(product_id)
  );

-- Reviewers may edit their own review; admins may edit any
create policy "reviews: reviewer update own or admin"
  on public.reviews for update
  using (
    reviewer_id = public.get_firebase_uid()
    or public.is_admin()
  );

-- Reviewers may delete their own review; admins may delete any
create policy "reviews: reviewer delete own or admin"
  on public.reviews for delete
  using (
    reviewer_id = public.get_firebase_uid()
    or public.is_admin()
  );

-- ─── payouts ─────────────────────────────────────────────────────────────────

alter table public.payouts enable row level security;

-- Sellers can view their own payout history
create policy "payouts: seller read own"
  on public.payouts for select
  using (seller_id = public.get_firebase_uid());

-- Admins can read all payouts
create policy "payouts: admin read all"
  on public.payouts for select
  using (public.is_admin());

-- Only admins may request / create a payout record
create policy "payouts: admin insert"
  on public.payouts for insert
  with check (public.is_admin());

-- Only admins (or service role via Stripe webhook) may update payout status
create policy "payouts: admin update"
  on public.payouts for update
  using (public.is_admin());

-- ─── product_embeddings ──────────────────────────────────────────────────────

alter table public.product_embeddings enable row level security;

-- Embeddings are publicly readable — they power the recommendation endpoint
-- which is called by anyone browsing the marketplace.
create policy "product_embeddings: public read"
  on public.product_embeddings for select
  using (true);

-- Embedding generation runs server-side (Edge Function with service key).
-- Only admins may upsert from the client.
create policy "product_embeddings: admin insert"
  on public.product_embeddings for insert
  with check (public.is_admin());

create policy "product_embeddings: admin update"
  on public.product_embeddings for update
  using (public.is_admin());

create policy "product_embeddings: admin delete"
  on public.product_embeddings for delete
  using (public.is_admin());
