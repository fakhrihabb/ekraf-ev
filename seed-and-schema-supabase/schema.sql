-- SIVANA Database Schema
-- Developer 2: Analysis Engine & AI Lead
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql

-- Enable PostGIS extension for spatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Projects table (simplified for MVP - no user_id or status)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Locations table (candidate locations)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Analyses table (stores analysis results for locations)
CREATE TABLE IF NOT EXISTS analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  demand_score INTEGER NOT NULL CHECK (demand_score >= 0 AND demand_score <= 100),
  grid_score INTEGER NOT NULL CHECK (grid_score >= 0 AND grid_score <= 100),
  accessibility_score INTEGER NOT NULL CHECK (accessibility_score >= 0 AND accessibility_score <= 100),
  competition_score INTEGER NOT NULL CHECK (competition_score >= 0 AND competition_score <= 100),
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  insights_text TEXT,
  recommendation TEXT,
  financial_data_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Existing stations table (SPKLU and SPBKLU stations)
CREATE TABLE IF NOT EXISTS existing_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('SPKLU', 'SPBKLU')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  capacity INTEGER,
  operator TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_station_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT valid_station_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Create indexes for performance

-- Index on project_id for fast location queries
CREATE INDEX IF NOT EXISTS idx_locations_project_id ON locations(project_id);

-- Index on location_id for fast analysis queries
CREATE INDEX IF NOT EXISTS idx_analyses_location_id ON analyses(location_id);

-- Spatial index on locations coordinates (using PostGIS)
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations 
  USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- Spatial index on existing_stations coordinates (using PostGIS)
CREATE INDEX IF NOT EXISTS idx_stations_coordinates ON existing_stations 
  USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- Index on station type for filtering
CREATE INDEX IF NOT EXISTS idx_stations_type ON existing_stations(type);

-- Create updated_at trigger for projects table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Schema created successfully! Now run the seed-data.sql file to add mock station data.';
END
$$;
