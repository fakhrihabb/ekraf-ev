/**
 * Scoring Algorithms for Location Analysis
 * Developer 2: Analysis Engine & AI Lead
 * 
 * This file contains utility functions and stubs for calculating
 * location suitability scores. Full implementation will be in Day 2.
 */

import { AnalysisScores, Recommendation, TechnicalSpecs, FinancialData, InfrastructureType } from '@/lib/supabase/types';

// ============================================================================
// Scoring Functions (Stubs for Day 1, to be implemented in Day 2)
// ============================================================================

/**
 * Calculate Demand Score (0-100)
 * 
 * Based on nearby POIs using Google Places API:
 * - High-traffic POIs (malls, universities, transit): +20 points each
 * - Medium-traffic (restaurants, offices): +10 points each
 * - Considers 2km radius
 * 
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Score from 0-100
 */
export async function calculateDemandScore(
    latitude: number,
    longitude: number
): Promise<number> {
    // TODO: Implement in Day 2 with Google Places API
    // Mock implementation for now
    return Math.floor(Math.random() * 40) + 60; // 60-100 for demo
}

/**
 * Calculate Grid Readiness Score (0-100)
 * 
 * Based on distance to nearest substation and available capacity:
 * - <1km = 90-100
 * - <3km = 70-90
 * - <5km = 50-70
 * - >5km = <50
 * 
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Score from 0-100
 */
export async function calculateGridScore(
    latitude: number,
    longitude: number
): Promise<number> {
    // TODO: Implement in Day 2 with PostGIS spatial queries
    // Mock implementation for now
    return Math.floor(Math.random() * 40) + 50; // 50-90 for demo
}

/**
 * Calculate Accessibility Score (0-100)
 * 
 * Based on:
 * - Travel time from nearby major roads/highways
 * - Parking facilities within 200m
 * - <5min from highway + parking = 90-100
 * - <10min + parking = 70-90
 * 
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Score from 0-100
 */
export async function calculateAccessibilityScore(
    latitude: number,
    longitude: number
): Promise<number> {
    // TODO: Implement in Day 2 with Google Distance Matrix API
    // Mock implementation for now
    return Math.floor(Math.random() * 40) + 60; // 60-100 for demo
}

/**
 * Calculate Competition Score (0-100)
 * 
 * Based on existing SPKLU/SPBKLU stations within 5km:
 * - 0 stations = 100
 * - 1 station = 80
 * - 2 stations = 60
 * - 3+ stations = 40 or less
 * 
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Score from 0-100
 */
export async function calculateCompetitionScore(
    latitude: number,
    longitude: number
): Promise<number> {
    // TODO: Implement in Day 2 with PostGIS spatial queries on existing_stations
    // Mock implementation for now
    return Math.floor(Math.random() * 50) + 40; // 40-90 for demo
}

/**
 * Calculate Overall Suitability Score (0-100)
 * 
 * Weighted average:
 * - Demand: 30%
 * - Grid: 25%
 * - Accessibility: 25%
 * - Competition: 20%
 * 
 * @param scores - Individual scores
 * @returns Overall score from 0-100
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
 * 
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Complete analysis scores
 */
export async function calculateAllScores(
    latitude: number,
    longitude: number
): Promise<AnalysisScores> {
    const demand = await calculateDemandScore(latitude, longitude);
    const grid = await calculateGridScore(latitude, longitude);
    const accessibility = await calculateAccessibilityScore(latitude, longitude);
    const competition = await calculateCompetitionScore(latitude, longitude);
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
