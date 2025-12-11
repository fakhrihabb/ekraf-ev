/**
 * Location Analysis API Endpoint
 * Developer 2: Day 2 Implementation
 * 
 * POST /api/analyze-location-complete
 * 
 * Accepts: { latitude, longitude, address? }
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

export async function POST(request: NextRequest) {
    try {
        const body: AnalysisRequest = await request.json();
        const { latitude, longitude, address } = body;

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

        // Build response
        const response: AnalysisResponse = {
            location: {
                lat: latitude,
                lng: longitude,
                address: address || 'Alamat tidak tersedia',
            },
            scores,
            recommendation,
            insights,
            analyzed_at: new Date().toISOString(),
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
