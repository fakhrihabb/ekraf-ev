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

        // Generate AI insights with Gemini
        const insights = await generateInsights(
            address || 'Lokasi tidak diketahui',
            scores,
            recommendation
        );

        const analyzedAt = new Date().toISOString();

        // Save to database if requested
        let analysisId: string | undefined;
        if (saveToDb) {
            try {
                const { data, error } = await supabase
                    .from('analyses')
                    .insert({
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
                    })
                    .select('id')
                    .single();

                if (error) {
                    console.error('Error saving analysis to database:', error);
                } else {
                    analysisId = data?.id;
                }
            } catch (dbError) {
                console.error('Database error:', dbError);
                // Continue even if save fails
            }
        }

        // Build response
        const response: AnalysisResponse & { analysisId?: string } = {
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
