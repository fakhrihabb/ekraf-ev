/**
 * Location Analysis API Endpoint
 * Developer 2: Day 3 Implementation
 * 
 * POST /api/analyze-location-complete
 * 
 * Accepts: { latitude, longitude, address?, locationId?, saveToDb? }
 * Returns: Complete analysis object with scores, insights, and recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnalysisRequest, AnalysisResponse } from '@/lib/supabase/types';
import {
    calculateAllScores,
    generateRecommendation,
    isValidCoordinates,
} from '@/lib/scoring';
import { generateInsights } from '@/lib/google/gemini';
import { supabase } from '@/app/lib/supabase';
import { fetchPVGISData } from '@/lib/solar/pvgis-client';
import { calculateTerrainShadows } from '@/lib/solar/terrain-shadows';
import { calculateSolarROI, calculateSolarScore } from '@/lib/solar/roi-calculator';

export async function POST(request: NextRequest) {
    try {
        const body: AnalysisRequest & { locationId?: string; saveToDb?: boolean } = await request.json();
        const { latitude, longitude, address, locationId, saveToDb } = body;

        // Validate input
        if (!latitude || !longitude) {
            return NextResponse.json(
                { error: 'Missing required fields: latitude, longitude' },
                { status: 400 }
            );
        }

        if (!isValidCoordinates(latitude, longitude)) {
            return NextResponse.json(
                { error: 'Invalid coordinates' },
                { status: 400 }
            );
        }

        // Calculate scores
        const scores = await calculateAllScores(latitude, longitude);

        // Generate recommendation
        const recommendation = generateRecommendation(scores);

        // Solar Panel Analysis
        console.log('Starting solar analysis...');
        let solarScore = null;
        let solarAnalysisJson = null;

        try {
            // 1. Fetch solar radiation data from PVGIS
            const pvgisData = await fetchPVGISData(latitude, longitude);
            console.log('PVGIS data fetched:', pvgisData.annual_radiation_kwh_m2);

            // 2. Get location elevation for terrain analysis
            const elevationResponse = await fetch(
                `https://maps.googleapis.com/maps/api/elevation/json?locations=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY}`
            );
            const elevationData = await elevationResponse.json();
            const locationElevation = elevationData.results?.[0]?.elevation || 0;

            // 3. Calculate terrain shadows
            const terrainShadows = await calculateTerrainShadows(
                latitude,
                longitude,
                locationElevation
            );
            console.log('Terrain shadows calculated:', terrainShadows.shadow_factor);

            // 4. Calculate ROI
            const solarROI = calculateSolarROI(
                pvgisData.annual_radiation_kwh_m2,
                pvgisData.monthly_radiation_kwh_m2,
                terrainShadows.shadow_factor
            );

            // 5. Calculate solar score
            solarScore = calculateSolarScore(
                pvgisData.annual_radiation_kwh_m2,
                terrainShadows.shadow_factor,
                solarROI.roi_analysis.payback_period_years
            );

            // 6. Build complete solar analysis JSON
            solarAnalysisJson = {
                annual_radiation_kwh_m2: pvgisData.annual_radiation_kwh_m2,
                optimal_tilt_deg: pvgisData.optimal_tilt_deg,
                average_sun_hours: pvgisData.average_sun_hours,
                shadow_factor: terrainShadows.shadow_factor,
                blocked_hours_per_day: terrainShadows.blocked_hours_per_day,
                terrain_obstacles: terrainShadows.terrain_obstacles,
                horizon_angles: terrainShadows.horizon_angles,
                panel_config: solarROI.panel_config,
                roi_analysis: solarROI.roi_analysis,
                monthly_production_kwh: solarROI.monthly_production_kwh,
                recommendation: solarROI.recommendation,
            };

            console.log('Solar analysis complete. Score:', solarScore);
        } catch (solarError) {
            console.error('Solar analysis failed:', solarError);
            // Continue without solar data - don't fail entire analysis
        }

        // Generate AI insights with Gemini (now includes solar data)
        const insights = await generateInsights(
            address || 'Lokasi tidak diketahui',
            scores,
            recommendation,
            solarScore,
            solarAnalysisJson
        );

        const analyzedAt = new Date().toISOString();

        // Save to database if requested
        let analysisId: string | undefined;
        if (saveToDb) {
            try {
                console.log('=== SAVING TO DATABASE ===');
                console.log('Solar Score (before save):', solarScore, 'Type:', typeof solarScore);
                console.log('Solar Analysis JSON (before save):', solarAnalysisJson ? 'EXISTS' : 'NULL');

                const analysisData: any = {
                    location_id: locationId || null,
                    demand_score: scores.demand,
                    grid_score: scores.grid,
                    accessibility_score: scores.accessibility,
                    competition_score: scores.competition,
                    overall_score: scores.overall,
                    insights_text: insights,
                    recommendation: recommendation.type,
                    financial_data_json: {
                        technical_specs: recommendation.technical_specs,
                        financial_estimates: recommendation.financial_estimates,
                        rationale: recommendation.rationale,
                    },
                };

                // Only add solar fields if they have valid data
                if (solarScore !== null && solarScore !== undefined) {
                    analysisData.solar_score = Math.round(solarScore); // Ensure integer
                }

                if (solarAnalysisJson && Object.keys(solarAnalysisJson).length > 0) {
                    analysisData.solar_analysis_json = solarAnalysisJson;
                }

                console.log('Analysis data to insert:', JSON.stringify(analysisData, null, 2));

                const { data, error } = await supabase
                    .from('analyses')
                    .insert(analysisData)
                    .select('id, solar_score, solar_analysis_json')
                    .single();

                if (error) {
                    console.error('❌ Error saving analysis to database:', error);
                    console.error('Error details:', JSON.stringify(error, null, 2));
                } else if (data) {
                    analysisId = data.id;
                    console.log('✅ Analysis saved with ID:', analysisId);
                    console.log('✅ Confirmed solar_score in DB:', data.solar_score);
                    console.log('✅ Confirmed solar_analysis_json in DB:', data.solar_analysis_json ? 'EXISTS' : 'NULL');
                }
            } catch (dbError) {
                console.error('❌ Database error:', dbError);
            }
        }

        // Build response
        const response: AnalysisResponse & { analysisId?: string; solarScore?: number | null; solarAnalysis?: any } = {
            location: {
                lat: latitude,
                lng: longitude,
                address: address || 'Alamat tidak tersedia',
            },
            scores,
            recommendation,
            insights,
            analyzed_at: analyzedAt,
            ...(analysisId && { analysisId }),
            ...(solarScore !== null && { solarScore }),
            ...(solarAnalysisJson && { solarAnalysis: solarAnalysisJson }),
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error analyzing location:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
