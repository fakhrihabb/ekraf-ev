-- Solar Analysis Feature Migration
-- Add solar_score and solar_analysis_json to analyses table
-- Run this in Supabase SQL Editor

-- Add solar score column
ALTER TABLE analyses 
ADD COLUMN IF NOT EXISTS solar_score INTEGER 
CHECK (solar_score >= 0 AND solar_score <= 100);

-- Add solar analysis JSON column
ALTER TABLE analyses 
ADD COLUMN IF NOT EXISTS solar_analysis_json JSONB;

-- Create comment for documentation
COMMENT ON COLUMN analyses.solar_score IS 'Solar panel potential score (0-100) based on radiation, shadows, and ROI';
COMMENT ON COLUMN analyses.solar_analysis_json IS 'Detailed solar analysis including PVGIS data, terrain shadows, and ROI calculations';
