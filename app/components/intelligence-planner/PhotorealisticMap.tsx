import React, { useEffect, useRef, useState } from 'react';
import { Station, CandidateLocation, SelectedMarker } from '@/app/types/intelligence-planner';
import { getMarkerIcon } from '@/app/utils/markerIcons';

interface PhotorealisticMapProps {
    center: google.maps.LatLngLiteral;
    zoom: number; // We'll convert zoom to range
    heading: number;
    tilt: number;
    stations: Station[];
    candidates: CandidateLocation[];
    onMarkerClick: (marker: SelectedMarker) => void;
    onCameraChange?: (camera: { center: google.maps.LatLngLiteral; zoom: number; heading: number; tilt: number }) => void;
    onLoad?: (map: google.maps.maps3d.Map3DElement) => void;
}

// Helper to convert Zoom level to Range (altitude in meters)
// This is an approximation as they behave differently
const zoomToRange = (zoom: number) => {
    // Basic approximation: range = 591657550.500000 / 2^(zoom - 1)
    // Adjusting for realistic viewing 
    return 150000000 / Math.pow(2, zoom);
};

// Helper (reverse)
const rangeToZoom = (range: number) => {
    return Math.log2(150000000 / range);
};

// Wrapper for 3D Marker to handle property assignment (React 18 limitation)
const Marker3DWrapper = ({
    position,
    title,
    src,
    onClick
}: {
    position: google.maps.LatLngLiteral,
    title: string,
    src: string,
    onClick: () => void
}) => {
    const markerRef = useRef<google.maps.maps3d.Marker3DElement>(null);

    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.position = position;
        }
    }, [position]);

    return (
        // @ts-ignore
        <gmp-marker-3d
            ref={markerRef}
            title={title}
            src={src}
            height={0} // Ensure it's reachable
            onClick={onClick}
        />
    );
};

// React 18 / Custom Element wrapper using Attributes
export default function PhotorealisticMap({
    center,
    zoom,
    heading,
    tilt,
    stations,
    candidates,
    onMarkerClick,
    onCameraChange,
    onLoad
}: PhotorealisticMapProps) {
    const mapRef = useRef<google.maps.maps3d.Map3DElement>(null);
    const [isCustomElementReady, setIsCustomElementReady] = useState(false);

    // Wait for the custom element to be defined
    useEffect(() => {
        customElements.whenDefined('gmp-map-3d').then(() => {
            setIsCustomElementReady(true);
        });
    }, []);

    // Unified Map Initialization and Update
    useEffect(() => {
        const initMap = async () => {
            if (!mapRef.current) return;

            try {
                // 1. Ensure Library is Imported
                console.log('Importing maps3d library...');
                await google.maps.importLibrary('maps3d');
                console.log('maps3d library imported.');

                const map = mapRef.current;

                // 2. Set Properties (Hardcoded Jakarta for Debugging)
                console.log('Setting map properties...', { center, tilt, heading, zoom });

                // Explicitly construct property objects
                const targetCenter = {
                    lat: -6.2088,
                    lng: 106.8456,
                    altitude: 0
                };

                map.center = targetCenter;
                map.tilt = 45;
                map.heading = 0;
                map.range = 2000; // Explicit range

                console.log('Map properties set successfully.', map.center);

                // 3. Attach Listeners
                const handleCameraChange = () => {
                    if (onCameraChange && map.center) {
                        onCameraChange({
                            center: { lat: map.center.lat, lng: map.center.lng },
                            zoom: rangeToZoom(map.range || 2000),
                            heading: map.heading || 0,
                            tilt: map.tilt || 0
                        });
                    }
                };

                map.addEventListener('gmp-center-change', handleCameraChange);
                map.addEventListener('gmp-range-change', handleCameraChange);
                map.addEventListener('gmp-heading-change', handleCameraChange);
                map.addEventListener('gmp-tilt-change', handleCameraChange);

                // Cleanup listeners on unmount (or re-run) - logic simplified for debug
                // (In production, we'd return a cleanup function here, but async effects complicate that.
                //  For debugging, adding duplicates isn't the main crash risk, but we should be careful.)

            } catch (err) {
                console.error('FAILED to initialize 3D Map:', err);
            }
        };

        if (isCustomElementReady && mapRef.current) {
            initMap();
        }
    }, [isCustomElementReady]); // Run ONCE when element is ready. disregarding prop updates for a moment used hardcoded.

    /*
    // Verified ref attachment
    useEffect(() => {
        if (mapRef.current) {
            console.log('gmp-map-3d element mounted:', mapRef.current);
        }
    }, [isCustomElementReady]);
    */

    if (!isCustomElementReady) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-gray-500">Menginisialisasi peta 3D...</p>
            </div>
        );
    }

    return (
        // @ts-ignore - Custom element
        <gmp-map-3d
            ref={mapRef}
            style={{ width: '100%', height: '500px', border: '5px solid red', display: 'block' }}
        >
            {/* 
                DEBUG: Removing all markers to rule out render crashes.
                Use 'Hello World' state.
            */}
        </gmp-map-3d>
    );
}
