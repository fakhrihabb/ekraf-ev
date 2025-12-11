/**
 * Google Places API Client
 * Developer 2: Day 2 Implementation
 * 
 * For demand score calculation based on nearby POIs
 */

import { Client, PlaceType1 } from '@googlemaps/google-maps-services-js';

const client = new Client({});

// POI categories and their weights
export const POI_WEIGHTS = {
    HIGH_TRAFFIC: 20, // Malls, universities, transit stations
    MEDIUM_TRAFFIC: 10, // Restaurants, cafes, offices
    LOW_TRAFFIC: 5, // Parks, ATMs, gas stations
};

export const POI_CATEGORIES = {
    HIGH_TRAFFIC: [
        'shopping_mall',
        'university',
        'transit_station',
        'airport',
        'train_station',
        'bus_station',
    ] as PlaceType1[],
    MEDIUM_TRAFFIC: [
        'restaurant',
        'cafe',
        'office',
        'hotel',
        'hospital',
        'school',
    ] as PlaceType1[],
    LOW_TRAFFIC: [
        'park',
        'atm',
        'gas_station',
        'convenience_store',
    ] as PlaceType1[],
};

export interface POIResult {
    name: string;
    type: string;
    distance: number;
    weight: number;
}

/**
 * Fetch POIs within radius using Google Places API
 */
export async function fetchNearbyPOIs(
    latitude: number,
    longitude: number,
    radius: number = 2000 // 2km default
): Promise<POIResult[]> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('Google Places API key not configured');
        return [];
    }

    try {
        const allPOIs: POIResult[] = [];

        // Search for high-traffic POIs
        for (const type of POI_CATEGORIES.HIGH_TRAFFIC) {
            const response = await client.placesNearby({
                params: {
                    location: { lat: latitude, lng: longitude },
                    radius,
                    type,
                    key: apiKey,
                },
            });

            if (response.data.results) {
                response.data.results.forEach((place) => {
                    if (place.geometry?.location) {
                        allPOIs.push({
                            name: place.name || 'Unknown',
                            type: type,
                            distance: calculateDistance(
                                latitude,
                                longitude,
                                place.geometry.location.lat,
                                place.geometry.location.lng
                            ),
                            weight: POI_WEIGHTS.HIGH_TRAFFIC,
                        });
                    }
                });
            }
        }

        // Search for medium-traffic POIs
        for (const type of POI_CATEGORIES.MEDIUM_TRAFFIC) {
            const response = await client.placesNearby({
                params: {
                    location: { lat: latitude, lng: longitude },
                    radius,
                    type,
                    key: apiKey,
                },
            });

            if (response.data.results) {
                response.data.results.forEach((place) => {
                    if (place.geometry?.location) {
                        allPOIs.push({
                            name: place.name || 'Unknown',
                            type: type,
                            distance: calculateDistance(
                                latitude,
                                longitude,
                                place.geometry.location.lat,
                                place.geometry.location.lng
                            ),
                            weight: POI_WEIGHTS.MEDIUM_TRAFFIC,
                        });
                    }
                });
            }
        }

        return allPOIs;
    } catch (error: any) {
        console.error('Error fetching POIs:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return [];
    }
}

/**
 * Calculate demand score based on POIs
 */
export function calculateDemandScoreFromPOIs(pois: POIResult[]): number {
    const totalPoints = pois.reduce((sum, poi) => sum + poi.weight, 0);

    // Scale to 0-100
    // 0 points = 0
    // 100 points = 80
    // 200+ points = 100
    let score: number;

    if (totalPoints === 0) {
        score = 0;
    } else if (totalPoints >= 200) {
        score = 100;
    } else if (totalPoints >= 100) {
        score = 80 + ((totalPoints - 100) / 100) * 20; // 80-100
    } else {
        score = (totalPoints / 100) * 80; // 0-80
    }

    return Math.round(score);
}

/**
 * Calculate distance between two points (simple Haversine)
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Check for parking facilities within radius
 */
export async function checkParkingAvailability(
    latitude: number,
    longitude: number,
    radius: number = 200 // 200m
): Promise<boolean> {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return false;
    }

    try {
        const response = await client.placesNearby({
            params: {
                location: { lat: latitude, lng: longitude },
                radius,
                type: 'parking' as PlaceType1,
                key: apiKey,
            },
        });

        return (response.data.results?.length || 0) > 0;
    } catch (error) {
        console.error('Error checking parking:', error);
        return false;
    }
}
