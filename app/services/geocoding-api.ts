'use client';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const CACHE_KEY_PREFIX = 'geocode_cache_';

interface CachedGeocodeData {
    address: string;
    timestamp: number;
}

/**
 * Service for interacting with Google Geocoding API
 */
export class GeocodingService {
    private geocoder: google.maps.Geocoder | null = null;

    constructor() {
        if (typeof window !== 'undefined' && window.google?.maps) {
            this.geocoder = new google.maps.Geocoder();
        }
    }

    /**
     * Initialize the geocoder
     */
    initialize() {
        if (typeof window !== 'undefined' && window.google?.maps) {
            this.geocoder = new google.maps.Geocoder();
        }
    }

    /**
     * Reverse geocode coordinates to address
     * @param lat Latitude
     * @param lng Longitude
     * @returns Promise of address string
     */
    async reverseGeocode(lat: number, lng: number): Promise<string> {
        // Check cache first
        const cacheKey = this.getCacheKey(lat, lng);
        const cached = this.getFromCache(cacheKey);
        if (cached) {
            return cached;
        }

        if (!this.geocoder) {
            this.initialize();
            if (!this.geocoder) {
                throw new Error('Geocoder not initialized');
            }
        }

        try {
            const result = await this.geocoder.geocode({
                location: { lat, lng }
            });

            if (result.results && result.results.length > 0) {
                const address = result.results[0].formatted_address;

                // Cache the result
                this.saveToCache(cacheKey, address);

                return address;
            }

            return 'Alamat tidak ditemukan';
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    }

    /**
     * Geocode address to coordinates
     * @param address Address string
     * @returns Promise of coordinates
     */
    async geocode(address: string): Promise<{ lat: number; lng: number } | null> {
        if (!this.geocoder) {
            this.initialize();
            if (!this.geocoder) {
                throw new Error('Geocoder not initialized');
            }
        }

        try {
            const result = await this.geocoder.geocode({
                address,
                componentRestrictions: {
                    country: 'ID' // Restrict to Indonesia
                }
            });

            if (result.results && result.results.length > 0) {
                const location = result.results[0].geometry.location;
                return {
                    lat: location.lat(),
                    lng: location.lng()
                };
            }

            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    }

    /**
     * Generate cache key
     */
    private getCacheKey(lat: number, lng: number): string {
        const latStr = lat.toFixed(4);
        const lngStr = lng.toFixed(4);
        return `${CACHE_KEY_PREFIX}${latStr}_${lngStr}`;
    }

    /**
     * Get data from cache
     */
    private getFromCache(key: string): string | null {
        try {
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            const data: CachedGeocodeData = JSON.parse(cached);
            const now = Date.now();

            // Check if cache is still valid
            if (now - data.timestamp < CACHE_DURATION) {
                return data.address;
            }

            // Cache expired, remove it
            localStorage.removeItem(key);
            return null;
        } catch (error) {
            console.error('Error reading from cache:', error);
            return null;
        }
    }

    /**
     * Save data to cache
     */
    private saveToCache(key: string, address: string): void {
        try {
            const data: CachedGeocodeData = {
                address,
                timestamp: Date.now()
            };
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }

    /**
     * Clear all geocoding cache
     */
    static clearCache(): void {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(CACHE_KEY_PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}

// Create singleton instance
let geocodingServiceInstance: GeocodingService | null = null;

export function getGeocodingService(): GeocodingService {
    if (!geocodingServiceInstance) {
        geocodingServiceInstance = new GeocodingService();
    }
    return geocodingServiceInstance;
}
