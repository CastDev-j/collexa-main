-- =============================================
-- 1. TABLA DE PERFILES (Antes Users)
-- Se asume que el ID viene del sistema de auth externo
-- =============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL PRIMARY KEY,
  username text,
  full_name text,
  avatar_url text,
  bio text,
  website text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- 2. TABLAS DE CATÁLOGOS (Dropdowns)
-- =============================================

CREATE TABLE IF NOT EXISTS public.item_types (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.platforms (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.locations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conditions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text
);

CREATE TABLE IF NOT EXISTS public.publishers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE,
  website text
);

CREATE TABLE IF NOT EXISTS public.creators (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  role_default text
);

CREATE TABLE IF NOT EXISTS public.genres (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.tags (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  color_hex text DEFAULT '#CCCCCC'
);

-- =============================================
-- 3. TABLA PRINCIPAL (ITEMS)
-- =============================================

CREATE TABLE IF NOT EXISTS public.items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Relaciones básicas
  item_type_id bigint NOT NULL REFERENCES public.item_types(id),
  platform_id bigint REFERENCES public.platforms(id),
  publisher_id bigint REFERENCES public.publishers(id),
  location_id bigint REFERENCES public.locations(id),
  condition_id bigint REFERENCES public.conditions(id),
  
  -- Detalles
  title text NOT NULL,
  description text,
  release_year integer,
  purchase_date date,
  purchase_price numeric(10, 2) CHECK (purchase_price >= 0),
  personal_rating integer CHECK (personal_rating >= 0 AND personal_rating <= 5),
  cover_image_url text,
  
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- =============================================
-- 4. TABLAS DE RELACIÓN (Muchos a Muchos)
-- =============================================

CREATE TABLE IF NOT EXISTS public.item_creators (
  item_id bigint NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  creator_id bigint NOT NULL REFERENCES public.creators(id),
  specific_role text,
  PRIMARY KEY (item_id, creator_id)
);

CREATE TABLE IF NOT EXISTS public.item_genres (
  item_id bigint NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  genre_id bigint NOT NULL REFERENCES public.genres(id),
  PRIMARY KEY (item_id, genre_id)
);

CREATE TABLE IF NOT EXISTS public.item_tags (
  item_id bigint NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  tag_id bigint NOT NULL REFERENCES public.tags(id),
  PRIMARY KEY (item_id, tag_id)
);

-- =============================================
-- 5. FUNCIONALIDADES EXTRA
-- =============================================

CREATE TABLE IF NOT EXISTS public.loans (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  item_id bigint NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  borrower_name text NOT NULL,
  borrower_contact text,
  loan_date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  return_date date,
  is_returned boolean DEFAULT false,
  notes text
);

CREATE TABLE IF NOT EXISTS public.wishlist (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  item_type_id bigint REFERENCES public.item_types(id),
  platform_id bigint REFERENCES public.platforms(id),
  estimated_price numeric(10, 2),
  priority text CHECK (priority IN ('Low', 'Medium', 'High')),
  url_link text,
  created_at timestamp with time zone DEFAULT now()
);
