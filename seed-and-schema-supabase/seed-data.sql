-- SIVANA Mock Station Data
-- Developer 2: Analysis Engine & AI Lead
-- Run this AFTER schema.sql in Supabase SQL Editor
-- Creates ~90 realistic SPKLU/SPBKLU stations across Indonesia

-- DKI Jakarta: 22 stations (dense coverage, every 2-5km)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  -- Central Jakarta
  ('SPKLU Plaza Indonesia', 'SPKLU', -6.1927, 106.8231, 8, 'PLN'),
  ('SPBKLU Bundaran HI', 'SPBKLU', -6.1951, 106.8230, 12, 'Pertamina'),
  ('SPKLU Menteng', 'SPKLU', -6.1870, 106.8347, 6, 'PLN'),
  ('SPKLU Tanah Abang', 'SPKLU', -6.1867, 106.8125, 4, 'Swasta'),
  
  -- South Jakarta
  ('SPKLU Blok M Plaza', 'SPKLU', -6.2441, 106.7991, 8, 'PLN'),
  ('SPBKLU Senayan City', 'SPBKLU', -6.2253, 106.7994, 10, 'Pertamina'),
  ('SPKLU Kebayoran Baru', 'SPKLU', -6.2427, 106.7973, 6, 'PLN'),
  ('SPKLU Pondok Indah Mall', 'SPKLU', -6.2656, 106.7841, 8, 'PLN'),
  ('SPBKLU Cilandak Town Square', 'SPBKLU', -6.2918, 106.8043, 8, 'Pertamina'),
  ('SPKLU Fatmawati', 'SPKLU', -6.2918, 106.7973, 4, 'Swasta'),
  
  -- North Jakarta
  ('SPKLU Kelapa Gading', 'SPKLU', -6.1572, 106.9038, 8, 'PLN'),
  ('SPBKLU Ancol', 'SPBKLU', -6.1223, 106.8388, 10, 'Pertamina'),
  ('SPKLU Pantai Indah Kapuk', 'SPKLU', -6.1158, 106.7436, 6, 'PLN'),
  
  -- East Jakarta
  ('SPKLU Cakung', 'SPKLU', -6.1694, 106.9469, 6, 'PLN'),
  ('SPBKLU Klender', 'SPBKLU', -6.2132, 106.9180, 8, 'Pertamina'),
  ('SPKLU Jatinegara', 'SPKLU', -6.2207, 106.8678, 4, 'Swasta'),
  ('SPKLU Cibubur Junction', 'SPKLU', -6.3687, 106.8897, 6, 'PLN'),
  
  -- West Jakarta
  ('SPKLU Puri Indah Mall', 'SPKLU', -6.1884, 106.7382, 8, 'PLN'),
  ('SPBKLU Taman Anggrek', 'SPBKLU', -6.1778, 106.7912, 10, 'Pertamina'),
  ('SPKLU Grogol', 'SPKLU', -6.1677, 106.7879, 6, 'PLN'),
  ('SPKLU Kebon Jeruk', 'SPKLU', -6.1814, 106.7667, 4, 'Swasta'),
  ('SPBKLU Cengkareng', 'SPBKLU', -6.1508, 106.7363, 8, 'Pertamina');

-- Surabaya: 11 stations (dense, major city)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  ('SPKLU Tunjungan Plaza', 'SPKLU', -7.2637, 112.7383, 8, 'PLN'),
  ('SPBKLU Galaxy Mall', 'SPBKLU', -7.2698, 112.6773, 10, 'Pertamina'),
  ('SPKLU Pakuwon Mall', 'SPKLU', -7.2889, 112.7373, 6, 'PLN'),
  ('SPKLU Wonokromo', 'SPKLU', -7.3111, 112.7247, 4, 'Swasta'),
  ('SPBKLU Rungkut', 'SPBKLU', -7.3197, 112.7867, 8, 'Pertamina'),
  ('SPKLU Kenjeran', 'SPKLU', -7.2441, 112.7867, 6, 'PLN'),
  ('SPKLU Juanda Airport', 'SPKLU', -7.3798, 112.7869, 8, 'PLN'),
  ('SPBKLU Suramadu', 'SPBKLU', -7.1908, 112.7832, 10, 'Pertamina'),
  ('SPKLU Mulyosari', 'SPKLU', -7.2849, 112.7923, 4, 'Swasta'),
  ('SPKLU Sidoarjo', 'SPKLU', -7.4477, 112.7186, 6, 'PLN'),
  ('SPBKLU Waru', 'SPBKLU', -7.3555, 112.7297, 8, 'Pertamina');

-- Bandung: 9 stations (dense, major city)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  ('SPKLU Paris Van Java', 'SPKLU', -6.8945, 107.6087, 8, 'PLN'),
  ('SPBKLU Cihampelas Walk', 'SPBKLU', -6.8998, 107.6037, 10, 'Pertamina'),
  ('SPKLU Dago', 'SPKLU', -6.8779, 107.6146, 6, 'PLN'),
  ('SPKLU Pasteur', 'SPKLU', -6.9001, 107.5789, 4, 'Swasta'),
  ('SPBKLU Kopo', 'SPBKLU', -6.9473, 107.5859, 8, 'Pertamina'),
  ('SPKLU Husein Sastranegara Airport', 'SPKLU', -6.9006, 107.5763, 8, 'PLN'),
  ('SPKLU Cimahi', 'SPKLU', -6.8722, 107.5422, 6, 'PLN'),
  ('SPBKLU Buah Batu', 'SPBKLU', -6.9430, 107.6349, 8, 'Pertamina'),
  ('SPKLU Gedebage', 'SPKLU', -6.9380, 107.6867, 4, 'Swasta');

-- Medan: 7 stations (moderate density)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  ('SPKLU Sun Plaza', 'SPKLU', 3.5872, 98.6814, 6, 'PLN'),
  ('SPBKLU Kualanamu Airport', 'SPBKLU', 3.6422, 98.8853, 10, 'Pertamina'),
  ('SPKLU Centre Point', 'SPKLU', 3.5896, 98.6927, 6, 'PLN'),
  ('SPKLU Polonia', 'SPKLU', 3.5617, 98.6911, 4, 'Swasta'),
  ('SPBKLU Ringroad', 'SPBKLU', 3.6184, 98.6753, 8, 'Pertamina'),
  ('SPKLU Binjai', 'SPKLU', 3.6001, 98.4851, 4, 'PLN'),
  ('SPKLU Deli Serdang', 'SPKLU', 3.4654, 98.7019, 6, 'PLN');

-- Semarang: 6 stations (moderate density)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  ('SPKLU Paragon Mall', 'SPKLU', -6.9932, 110.4203, 6, 'PLN'),
  ('SPBKLU Ahmad Yani Airport', 'SPBKLU', -6.9739, 110.3747, 8, 'Pertamina'),
  ('SPKLU Simpang Lima', 'SPKLU', -6.9932, 110.4203, 6, 'PLN'),
  ('SPKLU Mijen', 'SPKLU', -7.0498, 110.3166, 4, 'Swasta'),
  ('SPBKLU Tembalang', 'SPBKLU', -7.0508, 110.4399, 8, 'Pertamina'),
  ('SPKLU Ungaran', 'SPKLU', -7.1397, 110.4052, 4, 'PLN');

-- Suburban Jakarta (Bogor, Depok, Tangerang, Bekasi): 18 stations (moderate, every 5-10km)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  -- Tangerang & BSD
  ('SPKLU BSD City', 'SPKLU', -6.3013, 106.6437, 6, 'PLN'),
  ('SPBKLU Alam Sutera', 'SPBKLU', -6.2379, 106.6625, 8, 'Pertamina'),
  ('SPKLU Bintaro', 'SPKLU', -6.2693, 106.7358, 6, 'PLN'),
  ('SPKLU Tangerang City', 'SPKLU', -6.1781, 106.6298, 4, 'Swasta'),
  ('SPBKLU Soekarno-Hatta Airport', 'SPBKLU', -6.1275, 106.6537, 12, 'Pertamina'),
  ('SPKLU Gading Serpong', 'SPKLU', -6.2424, 106.6194, 6, 'PLN'),
  
  -- Bekasi
  ('SPKLU Summarecon Bekasi', 'SPKLU', -6.2254, 107.0011, 6, 'PLN'),
  ('SPBKLU Grand Metropolitan Mall', 'SPBKLU', -6.2491, 106.9938, 8, 'Pertamina'),
  ('SPKLU Bekasi Timur', 'SPKLU', -6.2618, 107.0389, 4, 'Swasta'),
  ('SPKLU Cikarang', 'SPKLU', -6.2615, 107.1525, 6, 'PLN'),
  
  -- Depok
  ('SPKLU Margonda Depok', 'SPKLU', -6.3752, 106.8318, 6, 'PLN'),
  ('SPBKLU Margo City', 'SPBKLU', -6.3915, 106.8193, 8, 'Pertamina'),
  ('SPKLU Universitas Indonesia', 'SPKLU', -6.3616, 106.8263, 4, 'PLN'),
  
  -- Bogor
  ('SPKLU Botani Square', 'SPKLU', -6.5948, 106.7967, 6, 'PLN'),
  ('SPBKLU Bogor Trade Mall', 'SPBKLU', -6.5889, 106.8009, 8, 'Pertamina'),
  ('SPKLU Sentul City', 'SPKLU', -6.5726, 106.8861, 6, 'PLN'),
  ('SPKLU Cibinong', 'SPKLU', -6.4818, 106.8539, 4, 'Swasta'),
  ('SPKLU Puncak', 'SPKLU', -6.6991, 106.9525, 4, 'PLN');

-- Non-metropolitan areas: 12 stations (sparse, every 10-20km)
INSERT INTO existing_stations (name, type, latitude, longitude, capacity, operator) VALUES
  -- Yogyakarta
  ('SPKLU Malioboro Yogyakarta', 'SPKLU', -7.7956, 110.3695, 6, 'PLN'),
  ('SPBKLU Adisucipto Airport', 'SPBKLU', -7.7885, 110.4317, 8, 'Pertamina'),
  
  -- Solo
  ('SPKLU Solo Grand Mall', 'SPKLU', -7.5563, 110.8205, 4, 'PLN'),
  
  -- Bali
  ('SPKLU Ngurah Rai Airport', 'SPKLU', -8.7467, 115.1668, 8, 'PLN'),
  ('SPBKLU Kuta Beach', 'SPBKLU', -8.7184, 115.1698, 10, 'Pertamina'),
  ('SPKLU Ubud', 'SPKLU', -8.5069, 115.2625, 4, 'Swasta'),
  
  -- Makassar
  ('SPKLU Panakkukang Makassar', 'SPKLU', -5.1477, 119.4327, 6, 'PLN'),
  ('SPBKLU Sultan Hasanuddin Airport', 'SPBKLU', -5.0614, 119.5544, 8, 'Pertamina'),
  
  -- Palembang
  ('SPKLU Palembang Icon', 'SPKLU', -2.9761, 104.7754, 6, 'PLN'),
  
  -- Batam
  ('SPKLU Nagoya Hill Batam', 'SPKLU', 1.1307, 104.0305, 6, 'PLN'),
  
  -- Balikpapan
  ('SPKLU Balikpapan Plaza', 'SPKLU', -1.2637, 116.8282, 4, 'PLN'),
  
  -- Manado
  ('SPBKLU Sam Ratulangi Airport', 'SPBKLU', 1.5493, 124.9262, 8, 'Pertamina');

-- Display summary
DO $$
DECLARE
  total_stations INTEGER;
  spklu_count INTEGER;
  spbklu_count INTEGER;
  spklu_pct NUMERIC;
  spbklu_pct NUMERIC;
BEGIN
  SELECT COUNT(*) INTO total_stations FROM existing_stations;
  SELECT COUNT(*) INTO spklu_count FROM existing_stations WHERE type = 'SPKLU';
  SELECT COUNT(*) INTO spbklu_count FROM existing_stations WHERE type = 'SPBKLU';
  
  spklu_pct := ROUND((spklu_count::NUMERIC / total_stations * 100), 1);
  spbklu_pct := ROUND((spbklu_count::NUMERIC / total_stations * 100), 1);
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Mock Station Data Loaded Successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total Stations: %', total_stations;
  RAISE NOTICE 'SPKLU Stations: % (% percent)', spklu_count, spklu_pct;
  RAISE NOTICE 'SPBKLU Stations: % (% percent)', spbklu_count, spbklu_pct;
  RAISE NOTICE '========================================';
END
$$;

