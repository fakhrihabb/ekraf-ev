/**
 * Database Types and API Response Formats
 * Developer 2: Analysis Engine & AI Lead
 * 
 * This file defines TypeScript types for database tables and API responses
 * for integration with Developer 1 (Frontend) and Developer 3 (Projects)
 */

// ============================================================================
// Database Table Types
// ============================================================================

export interface Project {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: string;
    project_id: string | null;
    name: string | null;
    latitude: number;
    longitude: number;
    address: string | null;
    created_at: string;
}

export interface Analysis {
    id: string;
    location_id: string | null;
    demand_score: number;
    grid_score: number;
    accessibility_score: number;
    competition_score: number;
    overall_score: number;
    insights_text: string | null;
    recommendation: string | null;
    financial_data_json: FinancialData | null;
    created_at: string;
}

export interface ExistingStation {
    id: string;
    name: string;
    type: 'SPKLU' | 'SPBKLU';
    latitude: number;
    longitude: number;
    capacity: number | null;
    operator: string | null;
    created_at: string;
}

// ============================================================================
// Analysis Data Structures
// ============================================================================

export interface AnalysisScores {
    demand: number;
    grid: number;
    accessibility: number;
    competition: number;
    overall: number;
}

export interface TechnicalSpecs {
    type: 'SPKLU' | 'SPBKLU' | 'Hybrid';
    chargers?: number;
    powerRequirement?: string;
    swapStations?: number;
    batteryInventory?: number;
    spaceRequirement: string;
}

export interface FinancialData {
    capitalInvestment: number;
    monthlyOperationalCost: number;
    revenueProjection: number;
    paybackPeriodMonths: number;
    currency: 'IDR';
}

export interface Recommendation {
    type: 'SPKLU' | 'SPBKLU' | 'Hybrid';
    rationale: string;
    technical_specs: TechnicalSpecs;
    financial_estimates: FinancialData;
}

export interface LocationData {
    lat: number;
    lng: number;
    address: string;
}

// ============================================================================
// API Response Formats (for Integration with Developer 1 & 3)
// ============================================================================

/**
 * Complete Analysis Response
 * 
 * Used by:
 * - Developer 1: Display analysis results on map
 * - Developer 3: Save to project and generate reports
 * 
 * Endpoint: POST /api/analyze-location-complete
 */
export interface AnalysisResponse {
    location: LocationData;
    scores: AnalysisScores;
    recommendation: Recommendation;
    insights: string;
    analyzed_at: string;
}

/**
 * Location Analysis Request
 * 
 * Sent by Developer 1 when user clicks "Analyze Location"
 * 
 * Endpoint: POST /api/analyze-location-complete
 */
export interface AnalysisRequest {
    latitude: number;
    longitude: number;
    address?: string;
}

/**
 * Save Location Request
 * 
 * Sent by Developer 1 when user saves location to project
 * Handled by Developer 3
 * 
 * Endpoint: POST /api/save-location
 */
export interface SaveLocationRequest {
    location: {
        latitude: number;
        longitude: number;
        address: string;
    };
    analysis: AnalysisResponse;
    project: {
        isNew: boolean;
        projectId?: string;
        projectName?: string;
        projectDescription?: string;
    };
    locationNickname?: string;
}

/**
 * Save Location Response
 * 
 * Returned to Developer 1 after successful save
 */
export interface SaveLocationResponse {
    success: boolean;
    projectId: string;
    locationId: string;
    message: string;
}

/**
 * Existing Stations Query Response
 * 
 * Used by Developer 1 to display stations on map
 * 
 * Endpoint: GET /api/stations?bounds=...
 */
export interface StationsResponse {
    stations: ExistingStation[];
    total: number;
}

// ============================================================================
// Supabase Database Type (auto-generated structure)
// ============================================================================

export interface Database {
    public: {
        Tables: {
            projects: {
                Row: Project;
                Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Project, 'id' | 'created_at'>>;
            };
            locations: {
                Row: Location;
                Insert: Omit<Location, 'id' | 'created_at'>;
                Update: Partial<Omit<Location, 'id' | 'created_at'>>;
            };
            analyses: {
                Row: Analysis;
                Insert: Omit<Analysis, 'id' | 'created_at'>;
                Update: Partial<Omit<Analysis, 'id' | 'created_at'>>;
            };
            existing_stations: {
                Row: ExistingStation;
                Insert: Omit<ExistingStation, 'id' | 'created_at'>;
                Update: Partial<Omit<ExistingStation, 'id' | 'created_at'>>;
            };
        };
    };
}

// ============================================================================
// Helper Types
// ============================================================================

export type InfrastructureType = 'SPKLU' | 'SPBKLU' | 'Hybrid';

export interface POIData {
    name: string;
    type: string;
    distance: number;
    rating?: number;
}

export interface NearbyStation {
    id: string;
    name: string;
    type: 'SPKLU' | 'SPBKLU';
    distance: number;
}
