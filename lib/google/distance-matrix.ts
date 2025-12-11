/**
 * Google Distance Matrix API Client
 * Developer 2: Day 2 Implementation
 * 
 * For accessibility score calculation
 */

import { Client, TravelMode } from '@googlemaps/google-maps-services-js';

const client = new Client({});

// Major highways and roads in Jakarta (for testing)
export const JAKARTA_MAJOR_ROADS = [
    { name: 'Jalan Tol Dalam Kota', lat: -6.2088, lng: 106.8456 },
    { name: 'Jalan Sudirman', lat: -6.2215, lng: 106.8164 },
    { name: 'Jalan Gatot Subroto', lat: -6.2297, lng: 106.8301 },
    { name: 'Jalan HR Rasuna Said', lat: -6.2253, lng: 106.8304 },
];

export interface AccessibilityResult {
    nearestHighway: string;
    travelTimeMinutes: number;
    distance: number;
    hasParking: boolean;
}

/**
 * Calculate travel time to nearest highway
 */
export async function calculateHighwayDistance(
    latitude: number,
    longitude: number
): Promise<{ travelTimeMinutes: number; nearestHighway: string; distance: number }> {
    const apiKey = process.env.GOOGLE_DISTANCE_MATRIX_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('Google Distance Matrix API key not configured');
        // Return mock data for testing
        return {
            travelTimeMinutes: 10,
            nearestHighway: 'Jalan Tol Dalam Kota',
            distance: 3000,
        };
    }

    try {
        const origin = `${latitude},${longitude}`;
        const destinations = JAKARTA_MAJOR_ROADS.map(road => `${road.lat},${road.lng}`);

        const response = await client.distancematrix({
            params: {
                origins: [origin],
                destinations,
                mode: TravelMode.driving,
                key: apiKey,
            },
        });

        if (response.data.rows && response.data.rows[0].elements) {
            const elements = response.data.rows[0].elements;

            // Find the nearest highway
            let minTime = Infinity;
            let minIndex = 0;
            let minDistance = 0;

            elements.forEach((element, index) => {
                if (element.duration && element.duration.value < minTime) {
                    minTime = element.duration.value;
                    minIndex = index;
                    minDistance = element.distance?.value || 0;
                }
            });

            return {
                travelTimeMinutes: Math.round(minTime / 60),
                nearestHighway: JAKARTA_MAJOR_ROADS[minIndex].name,
                distance: minDistance,
            };
        }

        // Fallback if API fails
        return {
            travelTimeMinutes: 10,
            nearestHighway: 'Unknown',
            distance: 3000,
        };
    } catch (error) {
        console.error('Error calculating highway distance:', error);
        return {
            travelTimeMinutes: 10,
            nearestHighway: 'Unknown',
            distance: 3000,
        };
    }
}

/**
 * Calculate accessibility score
 */
export function calculateAccessibilityScoreFromData(
    travelTimeMinutes: number,
    hasParking: boolean
): number {
    let score = 0;

    // Base score from travel time
    if (travelTimeMinutes < 5) {
        score = 90;
    } else if (travelTimeMinutes < 10) {
        score = 70;
    } else if (travelTimeMinutes < 15) {
        score = 50;
    } else {
        score = 30;
    }

    // Bonus for parking
    if (hasParking) {
        score += 10;
    }

    // Cap at 100
    return Math.min(100, score);
}
