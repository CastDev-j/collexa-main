-- Seed sample data for demonstration (not tied to specific users)
-- These items can be used as examples or templates

-- Insert sample items into items table
-- Note: user_id will need to be set when user creates their account
-- For demo purposes, these are generic items that could be copied by any user

-- Sample Books
INSERT INTO items (title, description, item_type_id, platform_id, condition_id, location_id, personal_rating, cover_image_url, isbn, author, publisher, publication_date, pages, language)
VALUES 
  ('Cien Años de Soledad', 'Obra maestra del realismo mágico', 1, NULL, 2, 1, 5, '/placeholder.svg?height=400&width=300', '978-0307474728', 'Gabriel García Márquez', 'Editorial Sudamericana', '1967-06-05', 417, 'Español'),
  ('1984', 'Novela distópica sobre vigilancia totalitaria', 1, NULL, 2, 1, 5, '/placeholder.svg?height=400&width=300', '978-0451524935', 'George Orwell', 'Secker & Warburg', '1949-06-08', 328, 'Español'),
  ('El Principito', 'Clásico de la literatura infantil y filosófica', 1, NULL, 1, 2, 5, '/placeholder.svg?height=400&width=300', '978-0156012195', 'Antoine de Saint-Exupéry', 'Reynal & Hitchcock', '1943-04-06', 96, 'Español');

-- Sample Video Games
INSERT INTO items (title, description, item_type_id, platform_id, condition_id, location_id, personal_rating, cover_image_url, developer, publisher, release_date, genre, multiplayer)
VALUES 
  ('The Legend of Zelda: Breath of the Wild', 'Aventura épica en mundo abierto', 2, 5, 1, 3, 5, '/placeholder.svg?height=400&width=300', 'Nintendo EPD', 'Nintendo', '2017-03-03', 'Aventura/Acción', true),
  ('The Witcher 3: Wild Hunt', 'RPG de mundo abierto con historia profunda', 2, 1, 2, 3, 5, '/placeholder.svg?height=400&width=300', 'CD Projekt Red', 'CD Projekt', '2015-05-19', 'RPG', false),
  ('Minecraft', 'Juego sandbox de construcción y exploración', 2, 2, 1, 3, 4, '/placeholder.svg?height=400&width=300', 'Mojang Studios', 'Mojang Studios', '2011-11-18', 'Sandbox', true);

-- Sample Movies
INSERT INTO items (title, description, item_type_id, platform_id, condition_id, location_id, personal_rating, cover_image_url, director, studio, release_date, duration_minutes, genre)
VALUES 
  ('El Padrino', 'Clásico del cine sobre la mafia italiana', 3, 6, 2, 4, 5, '/placeholder.svg?height=400&width=300', 'Francis Ford Coppola', 'Paramount Pictures', '1972-03-24', 175, 'Drama/Crimen'),
  ('Pulp Fiction', 'Película icónica con narrativa no lineal', 3, 6, 2, 4, 5, '/placeholder.svg?height=400&width=300', 'Quentin Tarantino', 'Miramax', '1994-10-14', 154, 'Crimen/Drama'),
  ('El Viaje de Chihiro', 'Obra maestra de la animación japonesa', 3, 6, 1, 4, 5, '/placeholder.svg?height=400&width=300', 'Hayao Miyazaki', 'Studio Ghibli', '2001-07-20', 125, 'Animación/Fantasía');

-- Sample Music Albums
INSERT INTO items (title, description, item_type_id, platform_id, condition_id, location_id, personal_rating, cover_image_url, artist, record_label, release_date, duration_minutes, genre)
VALUES 
  ('Abbey Road', 'Álbum icónico de The Beatles', 4, 9, 2, 5, 5, '/placeholder.svg?height=400&width=300', 'The Beatles', 'Apple Records', '1969-09-26', 47, 'Rock'),
  ('Thriller', 'Álbum más vendido de Michael Jackson', 4, 8, 2, 5, 5, '/placeholder.svg?height=400&width=300', 'Michael Jackson', 'Epic Records', '1982-11-30', 42, 'Pop'),
  ('Dark Side of the Moon', 'Obra conceptual de Pink Floyd', 4, 9, 1, 5, 5, '/placeholder.svg?height=400&width=300', 'Pink Floyd', 'Harvest Records', '1973-03-01', 43, 'Rock Progresivo');

-- Sample Board Games
INSERT INTO items (title, description, item_type_id, condition_id, location_id, personal_rating, cover_image_url, publisher, release_date, min_players, max_players, recommended_age)
VALUES 
  ('Catan', 'Juego de estrategia sobre colonización de islas', 5, 2, 6, 4, '/placeholder.svg?height=400&width=300', 'Kosmos', '1995-01-01', 3, 4, 10),
  ('Pandemic', 'Juego cooperativo para salvar el mundo', 5, 1, 6, 5, '/placeholder.svg?height=400&width=300', 'Z-Man Games', '2008-01-01', 2, 4, 8),
  ('Carcassonne', 'Juego de construcción de territorios medievales', 5, 2, 6, 4, '/placeholder.svg?height=400&width=300', 'Hans im Glück', '2000-01-01', 2, 5, 7);
