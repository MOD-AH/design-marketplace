-- Migration: 00002_marketplace_schema
-- Full multi-vendor design marketplace schema.
-- Note: supersedes the tables in 00001_initial_schema.sql — run this instead if starting fresh.
--
-- Prerequisite: Supabase Third-Party Auth must be configured with Firebase.
--   JWKS URI: https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com
--   Issuer:   https://securetoken.google.com/<your-firebase-project-id>
-- After setup, Firebase ID tokens are accepted and auth.uid() / JWT sub = Firebase UID.

-- ─── Extensions ──────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";
create extension if not exists "vector";           -- pgvector — enable in Supabase dashboard first

-- ─── Enum Types ──────────────────────────────────────────────────────────────

create type public.user_role as enum (
  'buyer',
  'seller',
  'admin'
);

create type public.product_status as enum (
  'draft',           -- not yet submitted
  'pending_review',  -- submitted, awaiting moderation
  'published',       -- live and purchasable
  'rejected',        -- failed moderation
  'archived'         -- removed from listing by seller
);

create type public.license_type as enum (
  'personal',    -- single end product, not for resale
  'commercial',  -- unlimited client projects
  'extended'     -- includes SaaS / OEM / redistribution
);

create type public.order_status as enum (
  'pending',   -- created, awaiting payment
  'paid',      -- payment captured by Razorpay
  'failed',    -- payment failed or expired
  'refunded'   -- refunded to buyer
);

create type public.payout_status as enum (
  'pending',
  'processing',
  'completed',
  'failed'
);

-- ─── Shared Trigger: set updated_at ──────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─── Helper: Firebase UID from JWT ───────────────────────────────────────────
-- Returns the Firebase UID of the currently authenticated user.
-- Works with both Supabase Third-Party Auth (preferred) and the legacy
-- custom-JWT approach (passes UID in request.jwt.claim.sub header).
create or replace function public.get_firebase_uid()
returns text
language sql stable
as $$
  select nullif(
    coalesce(
      current_setting('request.jwt.claim.sub', true),
      (current_setting('request.jwt.claims', true)::jsonb) ->> 'sub'
    ),
    ''
  )
$$;

-- ─── Helper: Admin check ─────────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1
    from   public.profiles
    where  user_id = public.get_firebase_uid()
      and  role    = 'admin'
  )
$$;

-- ─── Helper: Purchase check ──────────────────────────────────────────────────
-- Returns true if the current user has a paid order containing this product.
create or replace function public.has_purchased(p_product_id uuid)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1
    from   public.order_items oi
    join   public.orders      o  on o.id = oi.order_id
    where  oi.product_id = p_product_id
      and  o.buyer_id    = public.get_firebase_uid()
      and  o.status      = 'paid'
  )
$$;

-- ─── Categories ──────────────────────────────────────────────────────────────

create table public.categories (
  id         uuid        primary key default uuid_generate_v4(),
  name       text        not null,
  slug       text        not null unique,
  icon       text        not null default '',   -- emoji or Lucide icon name
  created_at timestamptz not null default now()
);

insert into public.categories (name, slug, icon) values
  ('UI Kits',       'ui-kits',       '🧩'),
  ('Templates',     'templates',     '📄'),
  ('Icon Sets',     'icon-sets',     '✦'),
  ('Illustrations', 'illustrations', '🎨'),
  ('Fonts',         'fonts',         '🔤'),
  ('Mockups',       'mockups',       '📱'),
  ('Motion',        'motion',        '🎬'),
  ('3D Assets',     '3d-assets',     '🧊');

-- ─── Profiles ────────────────────────────────────────────────────────────────

create table public.profiles (
  user_id           text             primary key,     -- Firebase UID (string, not UUID)
  username          text             not null unique,
  avatar_url        text,
  bio               text,
  is_seller         boolean          not null default false,
  stripe_account_id text,                             -- Stripe Connect express account ID
  role              public.user_role not null default 'buyer',
  created_at        timestamptz      not null default now(),
  updated_at        timestamptz      not null default now(),

  constraint username_length check (char_length(username) between 3 and 30),
  constraint username_format check (username ~ '^[a-z0-9_]+$')
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create index idx_profiles_username on public.profiles (username);
create index idx_profiles_role     on public.profiles (role);

-- ─── Products ────────────────────────────────────────────────────────────────

create table public.products (
  id           uuid                   primary key default uuid_generate_v4(),
  seller_id    text                   not null references public.profiles   (user_id)     on delete cascade,
  category_id  uuid                   not null references public.categories (id),
  title        text                   not null,
  slug         text                   not null unique,
  description  text,
  price        numeric(10, 2)         not null default 0   check (price >= 0),
  file_url     text,                  -- Supabase Storage path in private bucket (e.g. products/{id}/file.zip)
  preview_url  text,                  -- Supabase Storage path in public bucket  (e.g. previews/{id}/cover.webp)
  tags         text[]                 not null default '{}',
  license_type public.license_type    not null default 'personal',
  status       public.product_status  not null default 'draft',
  sales_count  integer                not null default 0,
  created_at   timestamptz            not null default now(),
  updated_at   timestamptz            not null default now()
);

create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index idx_products_seller_id   on public.products (seller_id);
create index idx_products_category_id on public.products (category_id);
create index idx_products_status      on public.products (status);
create index idx_products_price       on public.products (price);
create index idx_products_sales_count on public.products (sales_count desc);
create index idx_products_created_at  on public.products (created_at desc);
create index idx_products_tags        on public.products using gin (tags);

-- Full-text search over title + description (English stemming)
create index idx_products_fts on public.products
  using gin (
    to_tsvector('english',
      coalesce(title, '') || ' ' || coalesce(description, '')
    )
  );

-- ─── Orders ──────────────────────────────────────────────────────────────────

create table public.orders (
  id                  uuid                 primary key default uuid_generate_v4(),
  buyer_id            text                 not null references public.profiles (user_id) on delete restrict,
  total_amount        numeric(10, 2)       not null check (total_amount >= 0),
  status              public.order_status  not null default 'pending',
  razorpay_order_id   text                 unique,   -- from Razorpay Orders API
  razorpay_payment_id text                 unique,   -- from Razorpay webhook on capture
  created_at          timestamptz          not null default now()
);

create index idx_orders_buyer_id   on public.orders (buyer_id);
create index idx_orders_status     on public.orders (status);
create index idx_orders_created_at on public.orders (created_at desc);

-- Auto-increment sales_count on products when an order transitions to 'paid'
create or replace function public.handle_order_paid()
returns trigger
language plpgsql
as $$
begin
  if new.status = 'paid' and old.status <> 'paid' then
    update public.products
    set    sales_count = sales_count + 1
    where  id in (
      select product_id from public.order_items where order_id = new.id
    );
  end if;
  return new;
end;
$$;

create trigger trg_order_paid
  after update on public.orders
  for each row execute function public.handle_order_paid();

-- ─── Order Items ─────────────────────────────────────────────────────────────

create table public.order_items (
  id                uuid           primary key default uuid_generate_v4(),
  order_id          uuid           not null references public.orders   (id) on delete cascade,
  product_id        uuid           not null references public.products (id) on delete restrict,
  price_at_purchase numeric(10, 2) not null check (price_at_purchase >= 0),
  download_url      text,          -- Storage path; generate signed URL server-side on each access

  unique (order_id, product_id)    -- prevent duplicate line items
);

create index idx_order_items_order_id   on public.order_items (order_id);
create index idx_order_items_product_id on public.order_items (product_id);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

create table public.reviews (
  id          uuid        primary key default uuid_generate_v4(),
  product_id  uuid        not null references public.products (id) on delete cascade,
  reviewer_id text        not null references public.profiles (user_id) on delete cascade,
  rating      smallint    not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),

  unique (product_id, reviewer_id)   -- one review per product per user
);

create index idx_reviews_product_id  on public.reviews (product_id);
create index idx_reviews_reviewer_id on public.reviews (reviewer_id);
create index idx_reviews_rating      on public.reviews (rating);

-- ─── Payouts ─────────────────────────────────────────────────────────────────

create table public.payouts (
  id                 uuid                 primary key default uuid_generate_v4(),
  seller_id          text                 not null references public.profiles (user_id) on delete restrict,
  amount             numeric(10, 2)       not null check (amount > 0),
  status             public.payout_status not null default 'pending',
  stripe_transfer_id text                 unique,   -- populated once Stripe transfer is created
  processed_at       timestamptz,
  created_at         timestamptz          not null default now()
);

create index idx_payouts_seller_id on public.payouts (seller_id);
create index idx_payouts_status    on public.payouts (status);

-- ─── Product Embeddings ──────────────────────────────────────────────────────
-- Stores dense vector embeddings for semantic / AI-powered recommendations.
-- Recommended model: all-MiniLM-L6-v2 (384 dims) via Supabase Edge Function.

create table public.product_embeddings (
  id         uuid          primary key default uuid_generate_v4(),
  product_id uuid          not null unique references public.products (id) on delete cascade,
  embedding  vector(384)   not null,
  updated_at timestamptz   not null default now()
);

create trigger trg_product_embeddings_updated_at
  before update on public.product_embeddings
  for each row execute function public.set_updated_at();

-- IVFFlat approximate nearest-neighbour index using cosine similarity.
-- Re-run VACUUM ANALYZE + DROP/CREATE index after bulk-inserting > 10k rows
-- to choose an optimal `lists` value (~sqrt of row count).
create index idx_product_embeddings_ivfflat
  on public.product_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);
