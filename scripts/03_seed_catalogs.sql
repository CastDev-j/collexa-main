-- =============================================
-- DATOS INICIALES PARA CATÁLOGOS
-- =============================================

-- Item Types
INSERT INTO public.item_types (name) VALUES
  ('Libro'),
  ('Videojuego'),
  ('Película'),
  ('Serie'),
  ('Cómic'),
  ('Manga'),
  ('Juego de Mesa'),
  ('Figura Coleccionable'),
  ('Vinilo/CD'),
  ('Otro')
ON CONFLICT (name) DO NOTHING;

-- Platforms
INSERT INTO public.platforms (name) VALUES
  ('PlayStation 5'),
  ('PlayStation 4'),
  ('Xbox Series X/S'),
  ('Xbox One'),
  ('Nintendo Switch'),
  ('PC'),
  ('Kindle'),
  ('Físico'),
  ('Blu-ray'),
  ('DVD'),
  ('Netflix'),
  ('Amazon Prime'),
  ('Disney+'),
  ('Otro')
ON CONFLICT (name) DO NOTHING;

-- Conditions
INSERT INTO public.conditions (name, description) VALUES
  ('Nuevo', 'Completamente nuevo, sin usar'),
  ('Como Nuevo', 'Usado muy poco, excelente estado'),
  ('Muy Bueno', 'Usado con desgaste mínimo'),
  ('Bueno', 'Usado con desgaste visible pero funcional'),
  ('Aceptable', 'Usado con desgaste significativo'),
  ('Para Reparar', 'Requiere reparación o mantenimiento')
ON CONFLICT (name) DO NOTHING;

-- Publishers (ejemplos)
INSERT INTO public.publishers (name, website) VALUES
  ('Penguin Random House', 'https://www.penguinrandomhouse.com'),
  ('Sony Interactive Entertainment', 'https://www.playstation.com'),
  ('Nintendo', 'https://www.nintendo.com'),
  ('Marvel Comics', 'https://www.marvel.com'),
  ('DC Comics', 'https://www.dc.com'),
  ('Editorial Planeta', 'https://www.planetadelibros.com')
ON CONFLICT (name) DO NOTHING;

-- Creators (ejemplos)
INSERT INTO public.creators (name, role_default) VALUES
  ('Stephen King', 'Autor'),
  ('Hideo Kojima', 'Director'),
  ('Christopher Nolan', 'Director'),
  ('Hayao Miyazaki', 'Director'),
  ('Stan Lee', 'Escritor')
ON CONFLICT DO NOTHING;

-- Genres
INSERT INTO public.genres (name) VALUES
  ('Acción'),
  ('Aventura'),
  ('Terror'),
  ('Ciencia Ficción'),
  ('Fantasy'),
  ('Drama'),
  ('Comedia'),
  ('Romance'),
  ('Thriller'),
  ('Misterio'),
  ('RPG'),
  ('Estrategia'),
  ('Deportes'),
  ('Simulación'),
  ('Educativo')
ON CONFLICT (name) DO NOTHING;
