/**
 * Solar Panel Configuration Constants
 * For EV charging station solar potential analysis
 */

export const SOLAR_CONFIG = {
    // Panel defaults for EV charging stations
    PANEL_AREA_M2: 50,  // ~20 panels (2.5m² each)
    PANEL_EFFICIENCY: 0.20,  // 20% (modern monocrystalline)
    PANEL_DEGRADATION: 0.005,  // 0.5% per year

    // Indonesia specifics
    ELECTRICITY_RATE_IDR_KWH: 1500,  // PLN residential rate (Rp/kWh)
    INSTALLATION_COST_PER_M2_IDR: 1_500_000,  // Rp 1.5M/m² (including installation)

    // Analysis parameters
    TERRAIN_SAMPLE_RADIUS_KM: 1,  // 1km radius for terrain sampling
    TERRAIN_SAMPLE_DIRECTIONS: 8,  // N, NE, E, SE, S, SW, W, NW
    TERRAIN_SAMPLES_PER_DIRECTION: 10,  // 10 points per direction
    MIN_SUN_ELEVATION_DEG: 10,  // Ignore sun below this angle

    // Scoring thresholds (kWh/m²/year)
    SCORE_EXCELLENT: 80,  // >1600 kWh/m²/year
    SCORE_GOOD: 60,       // >1400 kWh/m²/year
    SCORE_FAIR: 40,       // >1200 kWh/m²/year
    SCORE_POOR: 20,       // >1000 kWh/m²/year

    // ROI scoring thresholds
    ROI_EXCELLENT_YEARS: 7,   // Payback < 7 years
    ROI_GOOD_YEARS: 10,       // Payback < 10 years
    ROI_FAIR_YEARS: 15,       // Payback < 15 years
} as const;

/**
 * Direction angles for terrain sampling (degrees from North)
 */
export const COMPASS_DIRECTIONS = {
    N: 0,
    NE: 45,
    E: 90,
    SE: 135,
    S: 180,
    SW: 225,
    W: 270,
    NW: 315,
} as const;

export type CompassDirection = keyof typeof COMPASS_DIRECTIONS;
