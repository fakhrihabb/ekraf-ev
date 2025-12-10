'use client';

import { useLoadScript, GoogleMap, LoadScriptProps } from '@react-google-maps/api';
import { useMemo } from 'react';

interface GoogleMapComponentProps {
    onMapLoad?: (map: google.maps.Map) => void;
    onMapClick?: (e: google.maps.MapMouseEvent) => void;
}

const libraries: LoadScriptProps['libraries'] = ['places'];

export default function GoogleMapComponent({ onMapLoad, onMapClick }: GoogleMapComponentProps) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
    });

    // Default center: DKI Jakarta
    const center = useMemo(() => ({ lat: -6.2088, lng: 106.8456 }), []);

    if (loadError) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                    <p className="text-red-600 font-semibold mb-2">Gagal memuat peta</p>
                    <p className="text-gray-600 text-sm">
                        Periksa koneksi internet dan API key Google Maps
                    </p>
                </div>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[var(--color-light-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat peta...</p>
                </div>
            </div>
        );
    }

    // Map options - only created after script is loaded
    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: false,
        clickableIcons: true,
        scrollwheel: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: ['roadmap', 'satellite', 'hybrid'],
        },
        zoomControl: true,
        streetViewControl: false, // Removed - not relevant for location planning
        fullscreenControl: true,
    };

    return (
        <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={11}
            options={mapOptions}
            onLoad={onMapLoad}
            onClick={onMapClick}
        />
    );
}
