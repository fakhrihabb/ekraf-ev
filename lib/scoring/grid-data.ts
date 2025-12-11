/**
 * Mock Grid/Substation Data
 * Developer 2: Day 2 Implementation
 * 
 * Simulated grid infrastructure data for Indonesia
 */

export interface GridSubstation {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    capacity: number; // MW
    availableCapacity: number; // Percentage
    city: string;
}

// Mock grid substations across major Indonesian cities
export const MOCK_SUBSTATIONS: GridSubstation[] = [
    // Jakarta
    { id: 'GI-JKT-01', name: 'GI Gandul', latitude: -6.2945, longitude: 106.8127, capacity: 500, availableCapacity: 65, city: 'Jakarta' },
    { id: 'GI-JKT-02', name: 'GI Cibinong', latitude: -6.4818, longitude: 106.8539, capacity: 400, availableCapacity: 70, city: 'Jakarta' },
    { id: 'GI-JKT-03', name: 'GI Bekasi', latitude: -6.2383, longitude: 107.0011, capacity: 450, availableCapacity: 55, city: 'Jakarta' },
    { id: 'GI-JKT-04', name: 'GI Tangerang', latitude: -6.1781, longitude: 106.6298, capacity: 400, availableCapacity: 60, city: 'Jakarta' },
    { id: 'GI-JKT-05', name: 'GI Depok', latitude: -6.4025, longitude: 106.7942, capacity: 350, availableCapacity: 75, city: 'Jakarta' },

    // Surabaya
    { id: 'GI-SBY-01', name: 'GI Gubeng', latitude: -7.2667, longitude: 112.7505, capacity: 400, availableCapacity: 60, city: 'Surabaya' },
    { id: 'GI-SBY-02', name: 'GI Ngagel', latitude: -7.2811, longitude: 112.7573, capacity: 350, availableCapacity: 65, city: 'Surabaya' },
    { id: 'GI-SBY-03', name: 'GI Sidoarjo', latitude: -7.4477, longitude: 112.7186, capacity: 300, availableCapacity: 70, city: 'Surabaya' },

    // Bandung
    { id: 'GI-BDG-01', name: 'GI Soreang', latitude: -6.9880, longitude: 107.5184, capacity: 300, availableCapacity: 65, city: 'Bandung' },
    { id: 'GI-BDG-02', name: 'GI Cikarang', latitude: -6.8772, longitude: 107.6156, capacity: 350, availableCapacity: 60, city: 'Bandung' },
    { id: 'GI-BDG-03', name: 'GI Cimahi', latitude: -6.8722, longitude: 107.5422, capacity: 250, availableCapacity: 75, city: 'Bandung' },

    // Medan
    { id: 'GI-MDN-01', name: 'GI Titi Kuning', latitude: 3.5898, longitude: 98.6755, capacity: 300, availableCapacity: 70, city: 'Medan' },
    { id: 'GI-MDN-02', name: 'GI Binjai', latitude: 3.6001, longitude: 98.4851, capacity: 250, availableCapacity: 65, city: 'Medan' },

    // Semarang
    { id: 'GI-SMG-01', name: 'GI Tugu', latitude: -6.9537, longitude: 110.4357, capacity: 300, availableCapacity: 60, city: 'Semarang' },
    { id: 'GI-SMG-02', name: 'GI Ungaran', latitude: -7.1397, longitude: 110.4052, capacity: 250, availableCapacity: 70, city: 'Semarang' },
];

/**
 * Find nearest substation using simple distance calculation
 */
export function findNearestSubstation(
    latitude: number,
    longitude: number
): { substation: GridSubstation; distance: number } | null {
    if (MOCK_SUBSTATIONS.length === 0) return null;

    let nearest = MOCK_SUBSTATIONS[0];
    let minDistance = calculateDistance(
        latitude,
        longitude,
        nearest.latitude,
        nearest.longitude
    );

    for (const substation of MOCK_SUBSTATIONS) {
        const distance = calculateDistance(
            latitude,
            longitude,
            substation.latitude,
            substation.longitude
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearest = substation;
        }
    }

    return {
        substation: nearest,
        distance: minDistance,
    };
}

/**
 * Calculate grid readiness score
 */
export function calculateGridScore(distance: number, availableCapacity: number): number {
    let score = 0;

    // Base score from distance
    if (distance < 1000) {
        score = 95;
    } else if (distance < 3000) {
        score = 85;
    } else if (distance < 5000) {
        score = 65;
    } else if (distance < 10000) {
        score = 45;
    } else {
        score = 25;
    }

    // Bonus for available capacity
    if (availableCapacity > 70) {
        score += 5;
    } else if (availableCapacity > 50) {
        score += 3;
    }

    return Math.min(100, score);
}

/**
 * Simple distance calculation (Haversine formula)
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
