'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useLoadScript, LoadScriptProps } from '@react-google-maps/api';

// Define the libraries we need
const libraries: LoadScriptProps['libraries'] = ['places'];

// Define the context type
interface GoogleMapsContextType {
    isLoaded: boolean;
    loadError: Error | undefined;
}

// Create the context
const GoogleMapsContext = createContext<GoogleMapsContextType | undefined>(undefined);

// Provider component
export function GoogleMapsProvider({ children }: { children: ReactNode }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
        version: 'beta', // Use beta version for consistency
        id: 'google-map-script', // Unique ID to prevent duplicates
    });

    return (
        <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
            {children}
        </GoogleMapsContext.Provider>
    );
}

// Custom hook to use the Google Maps context
export function useGoogleMaps() {
    const context = useContext(GoogleMapsContext);
    if (context === undefined) {
        throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
    }
    return context;
}
