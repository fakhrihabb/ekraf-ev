/**
 * Location Analysis API Endpoint
 * Developer 2: Analysis Engine & AI Lead
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

        // Generate AI insights (stub for now, will integrate Gemini in Day 2)
        const insights = generatePlaceholderInsights(scores, recommendation.type);

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

/**
 * Generate placeholder insights (will be replaced with Gemini AI in Day 2)
 */
function generatePlaceholderInsights(
    scores: any,
    type: string
): string {
    const { demand, grid, accessibility, competition, overall } = scores;

    let insights = `Analisis untuk lokasi ini menunjukkan skor kelayakan keseluruhan sebesar ${overall}/100. `;

    // Strengths
    const strengths = [];
    if (demand > 70) strengths.push('permintaan tinggi');
    if (grid > 70) strengths.push('kesiapan jaringan listrik yang baik');
    if (accessibility > 70) strengths.push('aksesibilitas yang sangat baik');
    if (competition > 70) strengths.push('kompetisi rendah');

    if (strengths.length > 0) {
        insights += `Kekuatan utama lokasi ini adalah ${strengths.join(', ')}. `;
    }

    // Concerns
    const concerns = [];
    if (demand < 50) concerns.push('permintaan yang moderat');
    if (grid < 50) concerns.push('jarak ke jaringan listrik');
    if (accessibility < 50) concerns.push('aksesibilitas terbatas');
    if (competition < 50) concerns.push('kompetisi tinggi');

    if (concerns.length > 0) {
        insights += `Perhatian utama meliputi ${concerns.join(', ')}. `;
    }

    // Recommendation
    insights += `Berdasarkan analisis ini, kami merekomendasikan infrastruktur ${type} untuk lokasi ini. `;

    // Financial note
    insights += `Estimasi investasi modal dan proyeksi pendapatan menunjukkan potensi pengembalian investasi yang layak.`;

    return insights;
}
