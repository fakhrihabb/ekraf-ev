/**
 * Analysis History API Endpoint
 * Developer 2: Day 3 Implementation
 * 
 * GET /api/analyses/[locationId]
 * 
 * Returns: Historical analyses for a specific location
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ locationId: string }> }
) {
    try {
        const { locationId } = await params;

        if (!locationId) {
            return NextResponse.json(
                { error: 'Location ID is required' },
                { status: 400 }
            );
        }

        // Query all analyses for this location, ordered by most recent first
        const { data: analyses, error } = await supabase
            .from('analyses')
            .select('*')
            .eq('location_id', locationId)
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching analyses:', error);
            return NextResponse.json(
                { error: 'Failed to fetch analyses' },
                { status: 500 }
            );
        }

        // Format response
        const formatted = analyses?.map((analysis) => ({
            id: analysis.id,
            scores: {
                demand: analysis.demand_score,
                grid: analysis.grid_score,
                accessibility: analysis.accessibility_score,
                competition: analysis.competition_score,
                overall: analysis.overall_score,
                ...(analysis.solar_score !== null && { solar: analysis.solar_score }),
            },
            recommendation: {
                type: analysis.recommendation,
                ...(analysis.financial_data_json || {}),
            },
            insights: analysis.insights_text,
            analyzed_at: analysis.created_at,
            ...(analysis.solar_analysis_json && { solarAnalysis: analysis.solar_analysis_json }),
        })) || [];

        return NextResponse.json({
            locationId,
            analyses: formatted,
            total: formatted.length,
        });
    } catch (error) {
        console.error('Error in analyses endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
