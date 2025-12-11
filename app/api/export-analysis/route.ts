/**
 * Export Analysis API Endpoint
 * Developer 2: Day 3 Implementation
 * 
 * GET /api/export-analysis?locationId=xxx or projectId=xxx
 * 
 * Returns: Formatted analysis data for report generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get('locationId');
        const projectId = searchParams.get('projectId');

        if (!locationId && !projectId) {
            return NextResponse.json(
                { error: 'Either locationId or projectId is required' },
                { status: 400 }
            );
        }

        // Export single location
        if (locationId) {
            const result = await exportSingleLocation(locationId);
            return NextResponse.json(result);
        }

        // Export project
        if (projectId) {
            const result = await exportProject(projectId);
            return NextResponse.json(result);
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        console.error('Error in export endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Export analysis for a single location
 */
async function exportSingleLocation(locationId: string) {
    // Get location details
    const { data: location, error: locError } = await supabase
        .from('locations')
        .select('*')
        .eq('id', locationId)
        .single();

    if (locError || !location) {
        throw new Error('Location not found');
    }

    // Get latest analysis
    const { data: analysis, error: analysisError } = await supabase
        .from('analyses')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (analysisError || !analysis) {
        throw new Error('No analysis found for this location');
    }

    return {
        export_type: 'single_location',
        location: {
            id: location.id,
            name: location.name,
            address: location.address,
            coordinates: {
                latitude: location.latitude,
                longitude: location.longitude,
            },
        },
        analysis: {
            scores: {
                demand: analysis.demand_score,
                grid: analysis.grid_score,
                accessibility: analysis.accessibility_score,
                competition: analysis.competition_score,
                overall: analysis.overall_score,
            },
            recommendation: {
                type: analysis.recommendation,
                ...(analysis.financial_data_json || {}),
            },
            insights: analysis.insights_text,
            analyzed_at: analysis.created_at,
        },
        exported_at: new Date().toISOString(),
    };
}

/**
 * Export all locations in a project
 */
async function exportProject(projectId: string) {
    // Get project details
    const { data: project, error: projError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (projError || !project) {
        throw new Error('Project not found');
    }

    // Get all locations in project
    const { data: locations, error: locsError } = await supabase
        .from('locations')
        .select('*')
        .eq('project_id', projectId);

    if (locsError) {
        throw new Error('Failed to fetch locations');
    }

    // Get analyses for all locations
    const locationsWithAnalyses = await Promise.all(
        (locations || []).map(async (location) => {
            const { data: analysis } = await supabase
                .from('analyses')
                .select('*')
                .eq('location_id', location.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            return {
                id: location.id,
                name: location.name,
                address: location.address,
                coordinates: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
                analysis: analysis ? {
                    scores: {
                        demand: analysis.demand_score,
                        grid: analysis.grid_score,
                        accessibility: analysis.accessibility_score,
                        competition: analysis.competition_score,
                        overall: analysis.overall_score,
                    },
                    recommendation: {
                        type: analysis.recommendation,
                        ...(analysis.financial_data_json || {}),
                    },
                    insights: analysis.insights_text,
                } : null,
            };
        })
    );

    // Calculate summary statistics
    const analyzedLocations = locationsWithAnalyses.filter(l => l.analysis);
    const avgOverall = analyzedLocations.length > 0
        ? Math.round(
            analyzedLocations.reduce((sum, l) => sum + (l.analysis?.scores.overall || 0), 0) /
            analyzedLocations.length
        )
        : 0;

    const bestLocation = analyzedLocations.sort(
        (a, b) => (b.analysis?.scores.overall || 0) - (a.analysis?.scores.overall || 0)
    )[0];

    const worstLocation = analyzedLocations.sort(
        (a, b) => (a.analysis?.scores.overall || 0) - (b.analysis?.scores.overall || 0)
    )[0];

    return {
        export_type: 'project',
        project: {
            id: project.id,
            name: project.name,
            description: project.description,
            created_at: project.created_at,
        },
        locations: locationsWithAnalyses,
        summary: {
            total_locations: locations?.length || 0,
            analyzed_locations: analyzedLocations.length,
            avg_overall_score: avgOverall,
            best_location: bestLocation ? {
                name: bestLocation.name,
                address: bestLocation.address,
                overall_score: bestLocation.analysis?.scores.overall,
            } : null,
            worst_location: worstLocation ? {
                name: worstLocation.name,
                address: worstLocation.address,
                overall_score: worstLocation.analysis?.scores.overall,
            } : null,
        },
        exported_at: new Date().toISOString(),
    };
}
