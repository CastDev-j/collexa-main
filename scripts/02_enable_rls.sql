-- =============================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own items"
  ON public.items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON public.items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON public.items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON public.items FOR DELETE
  USING (auth.uid() = user_id);

-- Locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own locations"
  ON public.locations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tags
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own tags"
  ON public.tags FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Loans
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage loans for their items"
  ON public.loans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.items
      WHERE items.id = loans.item_id
      AND items.user_id = auth.uid()
    )
  );

-- Wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own wishlist"
  ON public.wishlist FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tablas de catálogo públicas (lectura para todos los autenticados)
ALTER TABLE public.item_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view item_types"
  ON public.item_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view platforms"
  ON public.platforms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view conditions"
  ON public.conditions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view publishers"
  ON public.publishers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view creators"
  ON public.creators FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can view genres"
  ON public.genres FOR SELECT
  TO authenticated
  USING (true);

-- Políticas para tablas de relación
ALTER TABLE public.item_creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.item_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage creators for their items"
  ON public.item_creators FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.items
      WHERE items.id = item_creators.item_id
      AND items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage genres for their items"
  ON public.item_genres FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.items
      WHERE items.id = item_genres.item_id
      AND items.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage tags for their items"
  ON public.item_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.items
      WHERE items.id = item_tags.item_id
      AND items.user_id = auth.uid()
    )
  );
