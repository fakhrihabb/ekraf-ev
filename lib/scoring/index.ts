/**
 * Scoring Algorithms for Location Analysis
 * Developer 2: Day 2 Implementation
 * 
 * Full implementation with Google APIs and PostGIS
 */

import { AnalysisScores, Recommendation, TechnicalSpecs, FinancialData, InfrastructureType } from '@/lib/supabase/types';
import { fetchNearbyPOIs, calculateDemandScoreFromPOIs, checkParkingAvailability } from '@/lib/google/places';
import { calculateHighwayDistance, calculateAccessibilityScoreFromData } from '@/lib/google/distance-matrix';
import { findNearestSubstation, calculateGridScore as calcGridScore } from '@/lib/scoring/grid-data';
import { supabase } from '@/app/lib/supabase';
import { apiCache, CacheTTL } from '@/lib/cache';

// ============================================================================
// Scoring Functions (Day 2 - Full Implementation)
// ============================================================================

/**
 * Calculate Demand Score (0-100)
 * Uses Google Places API to count nearby POIs
 */
export async function calculateDemandScore(
    latitude: number,
    longitude: number
): Promise<number> {
    // Check cache first
    const cacheKey = `demand:${latitude}:${longitude}`;
    const cached = apiCache.get<number>(cacheKey);
    if (cached !== null) return cached;

    try {
        const pois = await fetchNearbyPOIs(latitude, longitude, 2000);
        const score = calculateDemandScoreFromPOIs(pois);

        // Cache with 1 hour TTL (businesses can change)
        apiCache.set(cacheKey, score, CacheTTL.DEMAND);
        return score;
    } catch (error) {
        console.error('Error calculating demand score:', error);
        // Fallback to moderate score
        return 60;
    }
}

/**
 * Calculate Grid Readiness Score (0-100)
 * Uses mock grid data and distance calculation
 */
export async function calculateGridScore(
    latitude: number,
    longitude: number
): Promise<number> {
    try {
        const nearest = findNearestSubstation(latitude, longitude);

        if (!nearest) {
            return 40; // Default if no substations found
        }

        const score = calcGridScore(nearest.distance, nearest.substation.availableCapacity);
        return score;
    } catch (error) {
        console.error('Error calculating grid score:', error);
        return 50;
    }
}

/**
 * Calculate Accessibility Score (0-100)
 * Uses Google Distance Matrix API and Places API for parking
 */
export async function calculateAccessibilityScore(
    latitude: number,
    longitude: number
): Promise<number> {
    // Check cache first
    const cacheKey = `accessibility:${latitude}:${longitude}`;
    const cached = apiCache.get<number>(cacheKey);
    if (cached !== null) return cached;

    try {
        const highwayData = await calculateHighwayDistance(latitude, longitude);
        const hasParking = await checkParkingAvailability(latitude, longitude);

        const score = calculateAccessibilityScoreFromData(
            highwayData.travelTimeMinutes,
            hasParking
        );

        // Cache the result
        apiCache.set(cacheKey, score);
        return score;
    } catch (error) {
        console.error('Error calculating accessibility score:', error);
        return 60;
    }
}

/**
 * Calculate Competition Score (0-100)
 * Uses PostGIS spatial queries on existing_stations table
 */
export async function calculateCompetitionScore(
    latitude: number,
    longitude: number
): Promise<number> {
    try {
        // Query stations within 5km using PostGIS
        const { data: nearbyStations, error } = await supabase
            .rpc('get_stations_within_radius', {
                target_lat: latitude,
                target_lng: longitude,
                radius_meters: 5000,
            })
            .throwOnError();

        if (error) {
            console.error('Error querying nearby stations:', error);
            // Fallback: query all stations and filter manually
            const { data: allStations } = await supabase
                .from('existing_stations')
                .select('latitude, longitude');

            if (allStations) {
                const nearby = allStations.filter(station => {
                    const distance = calculateSimpleDistance(
                        latitude,
                        longitude,
                        station.latitude,
                        station.longitude
                    );
                    return distance <= 5000;
                });

                return calculateCompetitionScoreFromStations(nearby.length, nearby);
            }

            return 70; // Default moderate competition
        }

        return calculateCompetitionScoreFromStations(
            nearbyStations?.length || 0,
            nearbyStations || []
        );
    } catch (error) {
        console.error('Error calculating competition score:', error);
        return 70;
    }
}

/**
 * Helper: Calculate competition score from stations count
 */
function calculateCompetitionScoreFromStations(
    count: number,
    stations: Array<{ latitude: number; longitude: number }>
): number {
    let score = 100;

    // Base penalty by count
    if (count === 0) {
        return 100;
    } else if (count === 1) {
        score = 80;
    } else if (count === 2) {
        score = 60;
    } else if (count === 3) {
        score = 45;
    } else {
        score = 30;
    }

    // Additional penalty for very close stations (simplified)
    // In production, would weight by actual distance
    const veryCloseCount = Math.min(count, 5);
    score -= veryCloseCount * 5;

    return Math.max(20, score); // Minimum score 20
}

/**
 * Helper: Simple distance calculation
 */
function calculateSimpleDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * Calculate Overall Suitability Score (0-100)
 * 
 * Weighted average:
 * - Demand: 30%
 * - Grid: 25%
 * - Accessibility: 25%
 * - Competition: 20%
 */
export function calculateOverallScore(scores: {
    demand: number;
    grid: number;
    accessibility: number;
    competition: number;
}): number {
    const weighted =
        scores.demand * 0.3 +
        scores.grid * 0.25 +
        scores.accessibility * 0.25 +
        scores.competition * 0.2;

    return Math.round(weighted);
}

/**
 * Calculate all scores for a location
 */
export async function calculateAllScores(
    latitude: number,
    longitude: number
): Promise<AnalysisScores> {
    const [demand, grid, accessibility, competition] = await Promise.all([
        calculateDemandScore(latitude, longitude),
        calculateGridScore(latitude, longitude),
        calculateAccessibilityScore(latitude, longitude),
        calculateCompetitionScore(latitude, longitude),
    ]);

    const overall = calculateOverallScore({ demand, grid, accessibility, competition });

    return {
        demand,
        grid,
        accessibility,
        competition,
        overall,
    };
}

// ============================================================================
// Recommendation Logic (Stub for Day 1, to be implemented in Day 2-3)
// ============================================================================

/**
 * Determine infrastructure recommendation based on scores
 * 
 * Logic:
 * - Demand >70 + Accessibility >60 → SPKLU
 * - Demand 40-70 + low competition → SPBKLU
 * - Demand >80 + large commercial area → Hybrid
 * - Default → SPKLU
 * 
 * @param scores - Analysis scores
 * @returns Infrastructure type recommendation
 */
export function determineInfrastructureType(scores: AnalysisScores): InfrastructureType {
    // TODO: Refine logic in Day 2
    if (scores.demand > 80 && scores.accessibility > 70) {
        return 'Hybrid';
    } else if (scores.demand > 70 && scores.accessibility > 60) {
        return 'SPKLU';
    } else if (scores.demand >= 40 && scores.demand <= 70 && scores.competition > 60) {
        return 'SPBKLU';
    } else {
        return 'SPKLU';
    }
}

/**
 * Generate technical specifications based on infrastructure type
 * 
 * @param type - Infrastructure type
 * @param demandScore - Demand score (affects capacity)
 * @returns Technical specifications
 */
export function generateTechnicalSpecs(
    type: InfrastructureType,
    demandScore: number
): TechnicalSpecs {
    // TODO: Refine in Day 2
    const baseSpecs: TechnicalSpecs = {
        type,
        spaceRequirement: '50-200 sq meters',
    };

    if (type === 'SPKLU' || type === 'Hybrid') {
        baseSpecs.chargers = demandScore > 80 ? 4 : demandScore > 60 ? 2 : 1;
        baseSpecs.powerRequirement = demandScore > 80 ? '350 kW' : demandScore > 60 ? '150 kW' : '50 kW';
    }

    if (type === 'SPBKLU' || type === 'Hybrid') {
        baseSpecs.swapStations = demandScore > 70 ? 2 : 1;
        baseSpecs.batteryInventory = demandScore > 70 ? 20 : 10;
    }

    return baseSpecs;
}

/**
 * Generate financial estimates
 * 
 * @param type - Infrastructure type
 * @param specs - Technical specifications
 * @returns Financial estimates in IDR
 */
export function generateFinancialEstimates(
    type: InfrastructureType,
    specs: TechnicalSpecs
): FinancialData {
    // TODO: Refine in Day 2 based on actual market data
    let capitalInvestment = 500_000_000; // Base 500M IDR
    let monthlyOperationalCost = 10_000_000; // Base 10M IDR

    if (type === 'SPKLU') {
        capitalInvestment = (specs.chargers || 1) * 400_000_000;
        monthlyOperationalCost = (specs.chargers || 1) * 8_000_000;
    } else if (type === 'SPBKLU') {
        capitalInvestment = (specs.swapStations || 1) * 1_500_000_000;
        monthlyOperationalCost = (specs.swapStations || 1) * 20_000_000;
    } else if (type === 'Hybrid') {
        capitalInvestment = 2_500_000_000;
        monthlyOperationalCost = 30_000_000;
    }

    // Revenue projection (simplified)
    const utilizationRate = 0.6; // 60% utilization assumption
    const avgTransactionValue = type === 'SPBKLU' ? 100_000 : 80_000; // IDR per charge/swap
    const dailyTransactions = (specs.chargers || specs.swapStations || 1) * 10 * utilizationRate;
    const revenueProjection = Math.round(dailyTransactions * avgTransactionValue * 30);

    // Payback period in months
    const paybackPeriodMonths = Math.round(
        capitalInvestment / (revenueProjection - monthlyOperationalCost)
    );

    return {
        capitalInvestment: Math.round(capitalInvestment),
        monthlyOperationalCost: Math.round(monthlyOperationalCost),
        revenueProjection: Math.round(revenueProjection),
        paybackPeriodMonths,
        currency: 'IDR',
    };
}

/**
 * Generate complete recommendation
 * 
 * @param scores - Analysis scores
 * @returns Complete recommendation object
 */
export function generateRecommendation(scores: AnalysisScores): Recommendation {
    const type = determineInfrastructureType(scores);
    const technicalSpecs = generateTechnicalSpecs(type, scores.demand);
    const financialEstimates = generateFinancialEstimates(type, technicalSpecs);

    let rationale = '';
    if (type === 'SPKLU') {
        rationale = 'Lokasi ini sangat cocok untuk SPKLU (Stasiun Pengisian Kendaraan Listrik Umum) karena tingkat permintaan dan aksesibilitas yang baik.';
    } else if (type === 'SPBKLU') {
        rationale = 'Lokasi ini ideal untuk SPBKLU (Stasiun Penukaran Baterai Kendaraan Listrik Umum) dengan kompetisi rendah dan permintaan moderat.';
    } else {
        rationale = 'Lokasi ini sangat strategis untuk infrastruktur Hybrid yang menggabungkan SPKLU dan SPBKLU untuk melayani berbagai kebutuhan.';
    }

    return {
        type,
        rationale,
        technical_specs: technicalSpecs,
        financial_estimates: financialEstimates,
    };
}

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Validate coordinates
 */
export function isValidCoordinates(lat: number, lng: number): boolean {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

/**
 * Validate score (0-100)
 */
export function isValidScore(score: number): boolean {
    return score >= 0 && score <= 100;
}
