-- Migration: 00004_storage_buckets
-- Creates the 'designs' (private) and 'previews' (public) Storage buckets
-- and applies RLS policies for each.
--
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run

-- ─── Buckets ─────────────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'designs',
    'designs',
    false,                          -- private: no public URL access
    52428800,                       -- 50 MB in bytes
    array[
      'image/png','image/jpeg','image/webp','image/svg+xml',
      'application/pdf','application/zip',
      'application/postscript',     -- .ai / .eps
      'application/octet-stream'    -- .sketch, .fig, .xd, etc.
    ]
  ),
  (
    'previews',
    'previews',
    true,                           -- public: images served without auth
    5242880,                        -- 5 MB in bytes
    array['image/png','image/jpeg','image/webp','image/gif']
  )
on conflict (id) do nothing;       -- safe to re-run

-- ─── designs bucket policies ─────────────────────────────────────────────────
-- Only the service role (used by our Route Handlers) can insert/update/delete.
-- No direct client access — all uploads go through /api/upload/design-url.

create policy "designs: service role full access"
  on storage.objects for all
  using (
    bucket_id = 'designs'
    and auth.role() = 'service_role'
  )
  with check (
    bucket_id = 'designs'
    and auth.role() = 'service_role'
  );

-- Signed download URLs are generated server-side; no SELECT policy needed here
-- (the service role bypasses RLS entirely when creating signed URLs).

-- ─── previews bucket policies ─────────────────────────────────────────────────
-- Public read — anyone can view preview images via their public URL.
-- Write is restricted to the service role (uploads come from /api/upload/preview).

create policy "previews: public read"
  on storage.objects for select
  using (bucket_id = 'previews');

create policy "previews: service role write"
  on storage.objects for insert
  with check (
    bucket_id = 'previews'
    and auth.role() = 'service_role'
  );

create policy "previews: service role update"
  on storage.objects for update
  using (
    bucket_id = 'previews'
    and auth.role() = 'service_role'
  );

create policy "previews: service role delete"
  on storage.objects for delete
  using (
    bucket_id = 'previews'
    and auth.role() = 'service_role'
  );
