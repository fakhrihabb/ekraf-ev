/**
 * Terrain Shadow Analysis
 * Uses Google Elevation API to calculate terrain-based shadow impact on solar panels
 */

import { SOLAR_CONFIG, COMPASS_DIRECTIONS, CompassDirection } from '@/app/constants/solar-config';
import { calculateSunPosition } from './sun-position';

export interface TerrainShadowAnalysis {
    shadow_factor: number;  // 0-1 (1 = no shadows, 0 = fully shaded)
    blocked_hours_per_day: number;
    terrain_obstacles: string[];
    horizon_angles: Record<CompassDirection, number>;  // Degrees above horizon
}

interface ElevationPoint {
    latitude: number;
    longitude: number;
    elevation: number;
}

/**
 * Calculate terrain shadows using Google Elevation API
 * @param latitude Location latitude
 * @param longitude Location longitude
 * @param locationElevation Elevation at the location (meters)
 * @returns Shadow analysis data
 */
export async function calculateTerrainShadows(
    latitude: number,
    longitude: number,
    locationElevation: number
): Promise<TerrainShadowAnalysis> {
    try {
        // Sample elevations in 8 directions
        const horizonAngles: Record<CompassDirection, number> = {} as any;
        const obstacles: string[] = [];

        for (const [direction, azimuth] of Object.entries(COMPASS_DIRECTIONS)) {
            const angle = await calculateHorizonAngle(
                latitude,
                longitude,
                locationElevation,
                azimuth
            );

            horizonAngles[direction as CompassDirection] = angle;

            // Identify significant obstacles (>5° horizon angle)
            if (angle > 5) {
                obstacles.push(`${direction} (${Math.round(angle)}°)`);
            }
        }

        // Calculate shadow factor based on sun path
        const shadowFactor = calculateShadowFactor(latitude, longitude, horizonAngles);

        // Estimate blocked hours per day
        const blockedHours = estimateBlockedHours(horizonAngles);

        return {
            shadow_factor: shadowFactor,
            blocked_hours_per_day: blockedHours,
            terrain_obstacles: obstacles.length > 0 ? obstacles : ['No significant terrain obstacles'],
            horizon_angles: horizonAngles,
        };

    } catch (error) {
        console.error('Error calculating terrain shadows:', error);

        // Fallback: assume minimal shadows for flat terrain
        return {
            shadow_factor: 0.95,
            blocked_hours_per_day: 0.3,
            terrain_obstacles: ['Unable to calculate terrain shadows'],
            horizon_angles: {
                N: 0, NE: 0, E: 0, SE: 0,
                S: 0, SW: 0, W: 0, NW: 0,
            },
        };
    }
}

/**
 * Calculate horizon angle in a specific direction
 * @param lat Origin latitude
 * @param lng Origin longitude
 * @param originElev Origin elevation (meters)
 * @param azimuth Direction in degrees from North
 * @returns Maximum horizon angle (degrees)
 */
async function calculateHorizonAngle(
    lat: number,
    lng: number,
    originElev: number,
    azimuth: number
): Promise<number> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn('Google Maps API key not found');
        return 0;
    }

    // Generate sample points along the direction
    const points = generateSamplePoints(
        lat,
        lng,
        azimuth,
        SOLAR_CONFIG.TERRAIN_SAMPLE_RADIUS_KM,
        SOLAR_CONFIG.TERRAIN_SAMPLES_PER_DIRECTION
    );

    try {
        // Fetch elevations for all points
        const elevations = await fetchElevations(points, apiKey);

        // Calculate maximum angle
        let maxAngle = 0;

        for (let i = 0; i < elevations.length; i++) {
            const point = elevations[i];
            const distance = calculateDistance(lat, lng, point.latitude, point.longitude) * 1000;  // km to m
            const heightDiff = point.elevation - originElev;
            const angle = Math.atan2(heightDiff, distance) * 180 / Math.PI;

            if (angle > maxAngle) {
                maxAngle = angle;
            }
        }

        return Math.max(0, maxAngle);  // Ensure non-negative

    } catch (error) {
        console.error(`Error fetching elevations for azimuth ${azimuth}:`, error);
        return 0;
    }
}

/**
 * Generate sample points along a direction
 */
function generateSamplePoints(
    lat: number,
    lng: number,
    azimuth: number,
    radiusKm: number,
    numPoints: number
): Array<{ lat: number; lng: number }> {
    const points: Array<{ lat: number; lng: number }> = [];
    const azimuthRad = azimuth * Math.PI / 180;

    for (let i = 1; i <= numPoints; i++) {
        const distance = (radiusKm / numPoints) * i;  // km
        const earthRadiusKm = 6371;

        // Calculate new position using spherical geometry
        const latRad = lat * Math.PI / 180;
        const lngRad = lng * Math.PI / 180;
        const distRad = distance / earthRadiusKm;

        const newLatRad = Math.asin(
            Math.sin(latRad) * Math.cos(distRad) +
            Math.cos(latRad) * Math.sin(distRad) * Math.cos(azimuthRad)
        );

        const newLngRad = lngRad + Math.atan2(
            Math.sin(azimuthRad) * Math.sin(distRad) * Math.cos(latRad),
            Math.cos(distRad) - Math.sin(latRad) * Math.sin(newLatRad)
        );

        points.push({
            lat: newLatRad * 180 / Math.PI,
            lng: newLngRad * 180 / Math.PI,
        });
    }

    return points;
}

/**
 * Fetch elevations from Google Elevation API
 */
async function fetchElevations(
    points: Array<{ lat: number; lng: number }>,
    apiKey: string
): Promise<ElevationPoint[]> {
    const locations = points.map(p => `${p.lat},${p.lng}`).join('|');
    const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${locations}&key=${apiKey}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Elevation API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error(`Elevation API status: ${data.status}`);
    }

    return data.results.map((r: any) => ({
        latitude: r.location.lat,
        longitude: r.location.lng,
        elevation: r.elevation,
    }));
}

/**
 * Calculate shadow factor based on sun path and horizon angles
 */
function calculateShadowFactor(
    latitude: number,
    longitude: number,
    horizonAngles: Record<CompassDirection, number>
): number {
    // Sample sun positions throughout the year
    let totalSunlight = 0;
    let availableSunlight = 0;

    // Sample 12 months, 12 hours per day (6am-6pm)
    for (let month = 0; month < 12; month++) {
        const date = new Date(2024, month, 15);

        for (let hour = 6; hour <= 18; hour++) {
            date.setHours(hour, 0, 0, 0);
            const sunPos = calculateSunPosition(latitude, longitude, date);

            if (sunPos.elevation > SOLAR_CONFIG.MIN_SUN_ELEVATION_DEG) {
                totalSunlight += 1;

                // Check if sun is blocked by terrain
                const direction = azimuthToDirection(sunPos.azimuth);
                const horizonAngle = horizonAngles[direction];

                if (sunPos.elevation > horizonAngle) {
                    availableSunlight += 1;
                }
            }
        }
    }

    return totalSunlight > 0 ? availableSunlight / totalSunlight : 1;
}

/**
 * Convert azimuth to compass direction
 */
function azimuthToDirection(azimuth: number): CompassDirection {
    const normalized = ((azimuth % 360) + 360) % 360;

    if (normalized < 22.5 || normalized >= 337.5) return 'N';
    if (normalized < 67.5) return 'NE';
    if (normalized < 112.5) return 'E';
    if (normalized < 157.5) return 'SE';
    if (normalized < 202.5) return 'S';
    if (normalized < 247.5) return 'SW';
    if (normalized < 292.5) return 'W';
    return 'NW';
}

/**
 * Estimate blocked hours per day
 */
function estimateBlockedHours(horizonAngles: Record<CompassDirection, number>): number {
    const avgHorizonAngle = Object.values(horizonAngles).reduce((sum, angle) => sum + angle, 0) / 8;

    // Rough estimate: each degree of horizon angle blocks ~0.05 hours
    return Math.min(4, avgHorizonAngle * 0.05);
}

/**
 * Calculate distance between two points (Haversine formula)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;  // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
