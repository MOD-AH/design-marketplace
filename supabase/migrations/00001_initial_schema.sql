-- Migration: 00001_initial_schema
-- Creates core tables for the design marketplace.

create extension if not exists "uuid-ossp";

-- ─── Users ───────────────────────────────────────────────────────────────────

create table public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null unique,
  display_name text,
  avatar_url  text,
  role        text not null default 'buyer' check (role in ('buyer', 'seller', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.users enable row level security;

create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- ─── Assets ──────────────────────────────────────────────────────────────────

create table public.assets (
  id               uuid primary key default uuid_generate_v4(),
  seller_id        uuid not null references public.users (id) on delete cascade,
  title            text not null,
  slug             text not null unique,
  description      text,
  category         text not null check (category in ('ui-kit','template','icon-set','illustration','font','mockup','other')),
  status           text not null default 'draft' check (status in ('draft','pending_review','published','rejected')),
  price_in_cents   integer not null default 0 check (price_in_cents >= 0),
  preview_image_url text,
  download_url     text,
  tags             text[] not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

alter table public.assets enable row level security;

create policy "Anyone can view published assets"
  on public.assets for select
  using (status = 'published');

create policy "Sellers manage their own assets"
  on public.assets for all
  using (auth.uid() = seller_id);

-- ─── Purchases ───────────────────────────────────────────────────────────────

create table public.purchases (
  id          uuid primary key default uuid_generate_v4(),
  buyer_id    uuid not null references public.users (id) on delete cascade,
  asset_id    uuid not null references public.assets (id) on delete restrict,
  amount_paid integer not null,
  created_at  timestamptz not null default now(),
  unique (buyer_id, asset_id)
);

alter table public.purchases enable row level security;

create policy "Buyers see their own purchases"
  on public.purchases for select
  using (auth.uid() = buyer_id);

-- ─── Helpers ─────────────────────────────────────────────────────────────────

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger set_assets_updated_at
  before update on public.assets
  for each row execute procedure public.handle_updated_at();
