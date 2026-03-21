-- ============================================================
-- AgriLearn Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID extension (already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES (extends auth.users 1:1)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         VARCHAR(254) NOT NULL,
  full_name     VARCHAR(100) NOT NULL,
  role          TEXT NOT NULL DEFAULT 'farmer'
                  CHECK (role IN ('farmer', 'buyer', 'retailer', 'admin')),
  phone         VARCHAR(20),
  location      VARCHAR(200),
  language_pref VARCHAR(10)  NOT NULL DEFAULT 'en',
  consent_given BOOLEAN      NOT NULL DEFAULT false,
  consent_at    TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEARNING MODULES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_modules (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          VARCHAR(200) NOT NULL,
  description    TEXT         NOT NULL,
  category       VARCHAR(50)  NOT NULL,
  level          TEXT         NOT NULL DEFAULT 'beginner'
                   CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  content        TEXT         NOT NULL DEFAULT '',
  duration_minutes INTEGER    NOT NULL DEFAULT 10 CHECK (duration_minutes > 0),
  language       VARCHAR(10)  NOT NULL DEFAULT 'en',
  is_active      BOOLEAN      NOT NULL DEFAULT true,
  created_by     UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEARNING PROGRESS (one row per user+module pair)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id      UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  completed      BOOLEAN NOT NULL DEFAULT false,
  progress_pct   INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  last_accessed  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, module_id)
);

-- ============================================================
-- BOOKMARKS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id  UUID NOT NULL REFERENCES public.learning_modules(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, module_id)
);

-- ============================================================
-- PRODUCT LISTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.product_listings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NOT NULL,
  category     VARCHAR(50)  NOT NULL,
  price        DECIMAL(10,2) NOT NULL CHECK (price > 0),
  quantity     INTEGER       NOT NULL CHECK (quantity > 0),
  unit         VARCHAR(20)   NOT NULL,
  location     VARCHAR(200)  NOT NULL,
  image_url    VARCHAR(500),
  status       TEXT NOT NULL DEFAULT 'active'
                 CHECK (status IN ('active', 'pending', 'sold', 'rejected')),
  reviewed_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id  UUID REFERENCES public.product_listings(id) ON DELETE SET NULL,
  content     TEXT NOT NULL,
  read_at     TIMESTAMP WITH TIME ZONE,
  created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOGS (append-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action       VARCHAR(100) NOT NULL,
  entity_type  VARCHAR(50)  NOT NULL,
  entity_id    UUID,
  before_state JSONB,
  after_state  JSONB,
  ip_address   INET,
  created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_modules_updated_at
    BEFORE UPDATE ON public.learning_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_listings_updated_at
    BEFORE UPDATE ON public.product_listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, language_pref)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
    'en'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_modules  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_listings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs        ENABLE ROW LEVEL SECURITY;

-- profiles: users can read all, update own
CREATE POLICY "profiles_read_all"    ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- learning_modules: all can read active; only admin can write
CREATE POLICY "modules_read_active"  ON public.learning_modules FOR SELECT USING (is_active = true);
CREATE POLICY "modules_admin_write"  ON public.learning_modules FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- learning_progress: own rows only
CREATE POLICY "progress_own"         ON public.learning_progress FOR ALL USING (auth.uid() = user_id);

-- bookmarks: own rows only
CREATE POLICY "bookmarks_own"        ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- product_listings: read active; farmers write own; admin write all
CREATE POLICY "listings_read_active" ON public.product_listings FOR SELECT USING (status = 'active');
CREATE POLICY "listings_farmer_insert" ON public.product_listings FOR INSERT
  WITH CHECK (auth.uid() = farmer_id AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('farmer', 'admin'));
CREATE POLICY "listings_farmer_update" ON public.product_listings FOR UPDATE
  USING (auth.uid() = farmer_id OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- messages: sender or receiver
CREATE POLICY "messages_own"         ON public.messages FOR ALL
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- audit_logs: admin read only; no deletes/updates by anyone
CREATE POLICY "audit_read_admin"     ON public.audit_logs FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "audit_insert"         ON public.audit_logs FOR INSERT WITH CHECK (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_modules_category   ON public.learning_modules (category);
CREATE INDEX IF NOT EXISTS idx_modules_level      ON public.learning_modules (level);
CREATE INDEX IF NOT EXISTS idx_modules_language   ON public.learning_modules (language);
CREATE INDEX IF NOT EXISTS idx_progress_user      ON public.learning_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user     ON public.bookmarks (user_id);
CREATE INDEX IF NOT EXISTS idx_listings_farmer    ON public.product_listings (farmer_id);
CREATE INDEX IF NOT EXISTS idx_listings_category  ON public.product_listings (category);
CREATE INDEX IF NOT EXISTS idx_listings_status    ON public.product_listings (status);
CREATE INDEX IF NOT EXISTS idx_messages_receiver  ON public.messages (receiver_id);
CREATE INDEX IF NOT EXISTS idx_audit_user         ON public.audit_logs (user_id);
