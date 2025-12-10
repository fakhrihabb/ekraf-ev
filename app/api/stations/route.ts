/**
 * Get Existing Stations API Endpoint
 * Developer 2: Analysis Engine & AI Lead
 * 
 * GET /api/stations?bounds=swLat,swLng,neLat,neLng
 * 
 * Returns: List of existing SPKLU/SPBKLU stations in the given bounds
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase/client';
import { StationsResponse } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
    try {
        // Check if Supabase is configured
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            return NextResponse.json(
                { error: 'Supabase not configured. Please set up environment variables.' },
                { status: 503 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const bounds = searchParams.get('bounds');

        const supabase = getSupabaseClient();

        // If bounds provided, filter by bounds (to be implemented with PostGIS)
        // For now, return all stations (will optimize in Day 2)
        const { data: stations, error } = await supabase
            .from('existing_stations')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching stations:', error);
            return NextResponse.json(
                { error: 'Failed to fetch stations' },
                { status: 500 }
            );
        }

        const response: StationsResponse = {
            stations: stations || [],
            total: stations?.length || 0,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error('Error in stations API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
