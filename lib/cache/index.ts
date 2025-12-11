/**
 * Smart tiered caching for API calls
 * Developer 2: Day 4 Performance Optimization
 * 
 * Different TTLs for different data types:
 * - Grid data: 24 hours (infrastructure rarely changes)
 * - Accessibility: 2 hours (roads/parking stable)
 * - POI/Demand: 1 hour (businesses can change)
 * - Competition: 30 minutes (stations may update frequently)
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Custom TTL per entry
}

interface CacheStats {
    hits: number;
    misses: number;
    totalRequests: number;
}

export enum CacheTTL {
    GRID = 24 * 60, // 24 hours in minutes
    ACCESSIBILITY = 2 * 60, // 2 hours
    DEMAND = 60, // 1 hour
    COMPETITION = 30, // 30 minutes
    DEFAULT = 60, // 1 hour
}

class SmartCache {
    private cache: Map<string, CacheEntry<any>>;
    private stats: CacheStats;

    constructor() {
        this.cache = new Map();
        this.stats = { hits: 0, misses: 0, totalRequests: 0 };
    }

    /**
     * Get cached data if available and not expired
     */
    get<T>(key: string): T | null {
        this.stats.totalRequests++;
        const entry = this.cache.get(key);

        if (!entry) {
            this.stats.misses++;
            return null;
        }

        const now = Date.now();
        const ttlMs = entry.ttl * 60 * 1000;

        if (now - entry.timestamp > ttlMs) {
            this.cache.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return entry.data as T;
    }

    /**
     * Set cache data with custom TTL
     */
    set<T>(key: string, data: T, ttlMinutes: number = CacheTTL.DEFAULT): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMinutes,
        });
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0, totalRequests: 0 };
    }

    /**
     * Get cache statistics
     */
    getStats() {
        const hitRate = this.stats.totalRequests > 0
            ? (this.stats.hits / this.stats.totalRequests) * 100
            : 0;

        return {
            ...this.stats,
            hitRate: Math.round(hitRate * 100) / 100,
            size: this.cache.size,
        };
    }

    /**
     * Generate cache key from parameters
     */
    static generateKey(...params: any[]): string {
        return params.map((p) => String(p)).join(':');
    }
}

// Export singleton instance
export const apiCache = new SmartCache();
