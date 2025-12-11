/**
 * Parse coordinate string in various formats
 * Supports: "-6.2088, 106.8456", "(-6.2088, 106.8456)", "-6.2088 106.8456"
 */
export function parseCoordinates(input: string): { lat: number; lng: number } | null {
    if (!input || typeof input !== 'string') {
        return null;
    }

    // Remove parentheses and extra whitespace
    const cleaned = input.trim().replace(/[()]/g, '');

    // Try comma-separated format
    const commaSplit = cleaned.split(',').map(s => s.trim());
    if (commaSplit.length === 2) {
        const lat = parseFloat(commaSplit[0]);
        const lng = parseFloat(commaSplit[1]);

        if (isValidCoordinate(lat, lng)) {
            return { lat, lng };
        }
    }

    // Try space-separated format
    const spaceSplit = cleaned.split(/\s+/);
    if (spaceSplit.length === 2) {
        const lat = parseFloat(spaceSplit[0]);
        const lng = parseFloat(spaceSplit[1]);

        if (isValidCoordinate(lat, lng)) {
            return { lat, lng };
        }
    }

    return null;
}

/**
 * Check if input string looks like coordinates
 */
export function isCoordinateString(input: string): boolean {
    if (!input || typeof input !== 'string') {
        return false;
    }

    // Pattern for coordinates: optional minus, digits, optional decimal point and digits
    const coordPattern = /^[(-]?\d+\.?\d*[,\s)]+[(-]?\d+\.?\d*\)?$/;
    return coordPattern.test(input.trim());
}

/**
 * Validate coordinate values
 */
function isValidCoordinate(lat: number, lng: number): boolean {
    return !isNaN(lat) && !isNaN(lng) &&
        lat >= -90 && lat <= 90 &&
        lng >= -180 && lng <= 180;
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(lat: number, lng: number, precision: number = 4): string {
    const latStr = lat.toFixed(precision);
    const lngStr = lng.toFixed(precision);
    return `Lat: ${latStr}, Lng: ${lngStr}`;
}

/**
 * Format coordinates for copying (simple format)
 */
export function formatCoordinatesForCopy(lat: number, lng: number, precision: number = 6): string {
    return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
}
