/**
 * Compare Locations API Endpoint
 * Developer 2: Day 3 Implementation
 * 
 * POST /api/compare-locations
 * 
 * Accepts: { locationIds: string[] } or { analyses: Array<{address, scores}> }
 * Returns: Comparison with rankings and recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { compareLocations } from '@/lib/comparison';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { locationIds, analyses } = body;

        // If location IDs provided, fetch from database
        if (locationIds && Array.isArray(locationIds)) {
            const locationsData = await Promise.all(
                locationIds.map(async (id: string) => {
                    const { data: location } = await supabase
                        .from('locations')
                        .select('*')
                        .eq('id', id)
                        .single();

                    const { data: analysis } = await supabase
                        .from('analyses')
                        .select('*')
                        .eq('location_id', id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single();

                    if (!location || !analysis) return null;

                    return {
                        address: location.address || `${location.latitude}, ${location.longitude}`,
                        locationId: location.id,
                        scores: {
                            demand: analysis.demand_score,
                            grid: analysis.grid_score,
                            accessibility: analysis.accessibility_score,
                            competition: analysis.competition_score,
                            overall: analysis.overall_score,
                        },
                        recommendation: analysis.recommendation,
                    };
                })
            );

            const validLocations = locationsData.filter((l) => l !== null);

            if (validLocations.length < 2) {
                return NextResponse.json(
                    { error: 'At least 2 valid locations with analyses required' },
                    { status: 400 }
                );
            }

            const comparison = compareLocations(validLocations);
            return NextResponse.json(comparison);
        }

        // If analyses provided directly, use them
        if (analyses && Array.isArray(analyses)) {
            if (analyses.length < 2 || analyses.length > 10) {
                return NextResponse.json(
                    { error: 'Provide 2-10 analyses for comparison' },
                    { status: 400 }
                );
            }

            const comparison = compareLocations(analyses);
            return NextResponse.json(comparison);
        }

        return NextResponse.json(
            { error: 'Provide either locationIds or analyses array' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error('Error in compare endpoint:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
