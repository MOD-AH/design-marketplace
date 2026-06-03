-- ============================================================
-- FINAL SCHEMA v4 — Fully compatible with all Supabase versions
-- No generated columns, no expression indexes
-- Paste entire file → SQL Editor → Run
-- ============================================================
 
 
-- ============================================================
-- BLOCK 1: EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
 
 
-- ============================================================
-- BLOCK 2: DROP EVERYTHING
-- ============================================================
DROP TABLE IF EXISTS ai_usage            CASCADE;
DROP TABLE IF EXISTS payouts             CASCADE;
DROP TABLE IF EXISTS reviews             CASCADE;
DROP TABLE IF EXISTS order_items         CASCADE;
DROP TABLE IF EXISTS orders              CASCADE;
DROP TABLE IF EXISTS product_embeddings  CASCADE;
DROP TABLE IF EXISTS products            CASCADE;
DROP TABLE IF EXISTS categories          CASCADE;
DROP TABLE IF EXISTS profiles            CASCADE;
DROP TABLE IF EXISTS assets              CASCADE;
DROP TABLE IF EXISTS purchases           CASCADE;
DROP TABLE IF EXISTS users               CASCADE;
 
DROP FUNCTION IF EXISTS update_updated_at_column()              CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at()                     CASCADE;
DROP FUNCTION IF EXISTS update_products_fts()                   CASCADE;
DROP FUNCTION IF EXISTS get_similar_products(vector, uuid, int) CASCADE;
 
DROP TYPE IF EXISTS product_status CASCADE;
DROP TYPE IF EXISTS license_type   CASCADE;
DROP TYPE IF EXISTS product_type   CASCADE;
DROP TYPE IF EXISTS order_status   CASCADE;
DROP TYPE IF EXISTS payout_status  CASCADE;
 
 
-- ============================================================
-- BLOCK 3: ENUMS
-- ============================================================
CREATE TYPE product_status AS ENUM ('draft','pending_review','published','rejected','unpublished');
CREATE TYPE license_type   AS ENUM ('personal','commercial','extended');
CREATE TYPE product_type   AS ENUM ('digital','merchandise');
CREATE TYPE order_status   AS ENUM ('pending','completed','failed','refunded');
CREATE TYPE payout_status  AS ENUM ('pending','processing','paid','failed');
 
 
-- ============================================================
-- BLOCK 4: TABLES
-- ============================================================
 
CREATE TABLE profiles (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT        UNIQUE NOT NULL,
  email        TEXT        UNIQUE NOT NULL,
  username     TEXT        UNIQUE,
  full_name    TEXT,
  avatar_url   TEXT,
  bio          TEXT,
  is_seller    BOOLEAN     NOT NULL DEFAULT FALSE,
  is_admin     BOOLEAN     NOT NULL DEFAULT FALSE,
  website_url  TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
 
CREATE TABLE categories (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        UNIQUE NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  icon        TEXT,
  sort_order  INT         NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
 
-- fts column is a plain TSVECTOR — populated by a trigger below
CREATE TABLE products (
  id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id        UUID           NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  category_id      UUID                    REFERENCES categories(id) ON DELETE SET NULL,
  title            TEXT           NOT NULL,
  description      TEXT,
  price            NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  file_url         TEXT,
  preview_urls     TEXT[]         NOT NULL DEFAULT '{}',
  tags             TEXT[]         NOT NULL DEFAULT '{}',
  license_type     license_type   NOT NULL DEFAULT 'personal',
  product_type     product_type   NOT NULL DEFAULT 'digital',
  file_formats     TEXT[]         NOT NULL DEFAULT '{}',
  file_size_bytes  BIGINT,
  status           product_status NOT NULL DEFAULT 'draft',
  total_sales      INT            NOT NULL DEFAULT 0,
  total_revenue    NUMERIC(10,2)  NOT NULL DEFAULT 0,
  fts              TSVECTOR,
  created_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);
 
CREATE TABLE product_embeddings (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID        UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  embedding  vector(384),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
 
CREATE TABLE orders (
  id                  UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id            UUID          NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status              order_status  NOT NULL DEFAULT 'pending',
  total_amount        NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
  razorpay_order_id   TEXT          UNIQUE,
  razorpay_payment_id TEXT          UNIQUE,
  razorpay_signature  TEXT,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
 
CREATE TABLE order_items (
  id                  UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id            UUID          NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  product_id          UUID          NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  seller_id           UUID          NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  price_at_purchase   NUMERIC(10,2) NOT NULL,
  platform_fee        NUMERIC(10,2) NOT NULL,
  seller_payout       NUMERIC(10,2) NOT NULL,
  download_url        TEXT,
  download_expires_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
 
CREATE TABLE reviews (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  reviewer_id UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id    UUID        NOT NULL REFERENCES orders(id)   ON DELETE CASCADE,
  rating      INT         NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, reviewer_id)
);
 
CREATE TABLE payouts (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id    UUID          NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  amount       NUMERIC(10,2) NOT NULL CHECK (amount > 0),
  status       payout_status NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  notes        TEXT,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
 
CREATE TABLE ai_usage (
  id      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  feature TEXT        NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
 
 
-- ============================================================
-- BLOCK 5: PLAIN INDEXES (no expression indexes)
-- ============================================================
CREATE INDEX idx_products_seller_id   ON products(seller_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_status      ON products(status);
CREATE INDEX idx_products_created_at  ON products(created_at DESC);
CREATE INDEX idx_products_tags        ON products USING GIN(tags);
CREATE INDEX idx_products_fts         ON products USING GIN(fts);
 
CREATE INDEX idx_orders_buyer_id       ON orders(buyer_id);
CREATE INDEX idx_order_items_order_id  ON order_items(order_id);
CREATE INDEX idx_order_items_seller_id ON order_items(seller_id);
CREATE INDEX idx_reviews_product_id    ON reviews(product_id);
CREATE INDEX idx_ai_usage_user_feature ON ai_usage(user_id, feature, used_at DESC);
 
CREATE INDEX idx_embeddings_vector
  ON product_embeddings
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
 
 
-- ============================================================
-- BLOCK 6: TRIGGER FUNCTIONS
-- ============================================================
 
-- 6a. updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
 
-- 6b. FTS trigger — updates the fts column on insert or update
--     Uses setweight so title matches rank higher than description/tags
CREATE OR REPLACE FUNCTION update_products_fts()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', array_to_string(NEW.tags, ' ')), 'C');
  RETURN NEW;
END;
$$;
 
 
-- ============================================================
-- BLOCK 7: TRIGGERS
-- ============================================================
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 
CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
 
-- FTS trigger fires on INSERT and UPDATE of relevant columns
CREATE TRIGGER trg_products_fts
  BEFORE INSERT OR UPDATE OF title, description, tags
  ON products
  FOR EACH ROW EXECUTE FUNCTION update_products_fts();
 
 
-- ============================================================
-- BLOCK 8: SIMILARITY FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION get_similar_products(
  query_embedding vector(384),
  exclude_id      UUID,
  match_count     INT DEFAULT 6
)
RETURNS TABLE (product_id UUID, similarity FLOAT)
LANGUAGE sql STABLE AS $$
  SELECT
    pe.product_id,
    1 - (pe.embedding <=> query_embedding) AS similarity
  FROM product_embeddings pe
  JOIN products p ON p.id = pe.product_id
  WHERE pe.product_id != exclude_id
    AND p.status = 'published'
  ORDER BY pe.embedding <=> query_embedding
  LIMIT match_count;
$$;
 
 
-- ============================================================
-- BLOCK 9: ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage           ENABLE ROW LEVEL SECURITY;
 
-- profiles
CREATE POLICY "profiles: public read"
  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles: backend insert"
  ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles: own update"
  ON profiles FOR UPDATE
  USING (firebase_uid = current_setting('app.firebase_uid', true));
 
-- categories
CREATE POLICY "categories: public read"
  ON categories FOR SELECT USING (true);
 
-- products
CREATE POLICY "products: public reads published"
  ON products FOR SELECT USING (status = 'published');
CREATE POLICY "products: seller reads own"
  ON products FOR SELECT
  USING (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "products: seller inserts"
  ON products FOR INSERT
  WITH CHECK (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "products: seller updates"
  ON products FOR UPDATE
  USING (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "products: seller deletes"
  ON products FOR DELETE
  USING (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
 
-- product_embeddings
CREATE POLICY "embeddings: public read"
  ON product_embeddings FOR SELECT USING (true);
CREATE POLICY "embeddings: backend insert"
  ON product_embeddings FOR INSERT WITH CHECK (true);
 
-- orders
CREATE POLICY "orders: buyer reads own"
  ON orders FOR SELECT
  USING (buyer_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "orders: backend insert"
  ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders: backend update"
  ON orders FOR UPDATE USING (true);
 
-- order_items
CREATE POLICY "order_items: buyer reads own"
  ON order_items FOR SELECT
  USING (order_id IN (
    SELECT id FROM orders WHERE buyer_id IN (
      SELECT id FROM profiles
      WHERE firebase_uid = current_setting('app.firebase_uid', true)
    )
  ));
CREATE POLICY "order_items: seller reads own"
  ON order_items FOR SELECT
  USING (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "order_items: backend insert"
  ON order_items FOR INSERT WITH CHECK (true);
 
-- reviews
CREATE POLICY "reviews: public read"
  ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews: buyer insert"
  ON reviews FOR INSERT
  WITH CHECK (reviewer_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "reviews: own delete"
  ON reviews FOR DELETE
  USING (reviewer_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
 
-- payouts
CREATE POLICY "payouts: seller reads own"
  ON payouts FOR SELECT
  USING (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "payouts: seller inserts"
  ON payouts FOR INSERT
  WITH CHECK (seller_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
 
-- ai_usage
CREATE POLICY "ai_usage: own read"
  ON ai_usage FOR SELECT
  USING (user_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
CREATE POLICY "ai_usage: own insert"
  ON ai_usage FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM profiles
    WHERE firebase_uid = current_setting('app.firebase_uid', true)
  ));
 
 
-- ============================================================
-- BLOCK 10: SEED CATEGORIES
-- ============================================================
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
  ('Logo Templates',     'logo-templates',   'Professional logo designs',           'ti-vector-triangle', 1),
  ('Social Media',       'social-media',      'Posts, stories, banners',            'ti-brand-instagram', 2),
  ('Poster & Print',     'poster-print',      'Printable posters and flyers',       'ti-file-text',       3),
  ('Merchandise',        'merchandise',       'T-shirts, hoodies, mugs',            'ti-shirt',           4),
  ('UI Kits',            'ui-kits',           'Figma and design system components', 'ti-layout',          5),
  ('Illustrations',      'illustrations',     'Vector illustration packs',          'ti-pencil',          6),
  ('Icons',              'icons',             'Icon sets in SVG and PNG',           'ti-star',            7),
  ('Fonts & Typography', 'fonts-typography',  'Display and decorative typefaces',   'ti-typography',      8),
  ('Presentation',       'presentation',      'PowerPoint and Keynote templates',   'ti-presentation',    9),
  ('Motion & Video',     'motion-video',      'Animated and video assets',          'ti-player-play',     10);
 
 
-- ============================================================
-- VERIFY — must return exactly 9 rows
-- ============================================================
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;