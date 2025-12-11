/**
 * Simple in-memory cache for API calls
 * Developer 2: Day 2 Implementation
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

class SimpleCache {
    private cache: Map<string, CacheEntry<any>>;
    private ttl: number; // Time to live in milliseconds

    constructor(ttlMinutes: number = 60) {
        this.cache = new Map();
        this.ttl = ttlMinutes * 60 * 1000;
    }

    /**
     * Get cached data if available and not expired
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        const now = Date.now();
        if (now - entry.timestamp > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set cache data
     */
    set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Generate cache key from parameters
     */
    static generateKey(...params: any[]): string {
        return params.map(p => String(p)).join(':');
    }
}

// Export singleton instance
export const apiCache = new SimpleCache(60); // 60 minutes TTL
