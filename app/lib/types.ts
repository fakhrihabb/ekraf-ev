export interface Analysis {
  id: string;
  location_id: string;
  demand_score: number;
  grid_score: number;
  accessibility_score: number;
  competition_score: number;
  overall_score: number;
  insights_text?: string;
  recommendation?: string;
  financial_data_json?: any;
  created_at: string;
}

export interface Location {
  id: string;
  project_id: string;
  name?: string;
  latitude: number;
  longitude: number;
  address?: string;
  created_at: string;
  // Analysis data often comes joined
  analysis?: Analysis; 
  // For UI convenience
  suitability_score?: number; // mapped from analysis.overall_score
  status?: 'recommended' | 'rejected' | 'pending';
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  objective?: string;
  created_at: string;
  updated_at: string;
  locations: Location[];
  location_count: number;
}

export interface ProjectReport {
  id: string;
  project_id: string;
  name: string;
  storage_path: string;
  size_bytes: number;
  created_at: string;
}
