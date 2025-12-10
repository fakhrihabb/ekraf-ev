/**
 * Supabase Client Configuration
 * Developer 2: Analysis Engine & AI Lead
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

let supabaseInstance: SupabaseClient<Database> | null = null;

// Create Supabase client (lazy-loaded)
export function getSupabase() {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
        );
    }

    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
    return supabaseInstance;
}

// For use in API routes (server-side) - creates new client each time
export function getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error(
            'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
        );
    }

    return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Deprecated: Use getSupabase() instead
// This is kept for backwards compatibility
export const supabase = {
    get from() {
        return getSupabase().from;
    },
    get auth() {
        return getSupabase().auth;
    },
    get storage() {
        return getSupabase().storage;
    },
};
