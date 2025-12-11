import { supabase } from '@/app/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const bounds = searchParams.get('bounds');

        let query = supabase
            .from('existing_stations')
            .select('*')
            .order('name');

        // Optional: Filter by bounds for performance
        if (bounds) {
            const [swLat, swLng, neLat, neLng] = bounds.split(',').map(Number);
            query = query
                .gte('latitude', swLat)
                .lte('latitude', neLat)
                .gte('longitude', swLng)
                .lte('longitude', neLng);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            return Response.json({ error: error.message }, { status: 500 });
        }

        return Response.json({
            stations: data || [],
            total: data?.length || 0,
        });
    } catch (error) {
        console.error('API error:', error);
        return Response.json(
            { error: 'Failed to fetch stations' },
            { status: 500 }
        );
    }
}
