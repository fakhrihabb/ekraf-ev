'use client';

import { useEffect, useRef, useState } from 'react';

interface Map3DViewProps {
    center: { lat: number; lng: number };
    onClose: () => void;
}

declare global {
    interface Window {
        google: any;
    }
}

export default function Map3DView({ center, onClose }: Map3DViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const initMap3D = async () => {
            try {
                // Wait for google.maps to be available (max 10 seconds)
                let attempts = 0;
                while (!window.google?.maps?.importLibrary && attempts < 20) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    attempts++;
                }

                if (!window.google?.maps?.importLibrary) {
                    throw new Error('Google Maps API not loaded');
                }

                // Load the maps3d library
                const { Map3DElement } = await window.google.maps.importLibrary('maps3d');

                if (!containerRef.current) return;

                // Create 3D map element
                const map3DElement = new Map3DElement({
                    center: {
                        lat: center.lat,
                        lng: center.lng,
                        altitude: 0,
                    },
                    range: 1000, // Distance from the point
                    heading: 0, // Direction (0 = North)
                    tilt: 60, // Viewing angle
                });

                // Clear container and append map
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(map3DElement);

                setIsLoading(false);
            } catch (err) {
                console.error('Error loading 3D map:', err);
                setError('Gagal memuat peta 3D. Fitur ini memerlukan API key dengan akses Maps 3D (beta). Kembali ke mode 2D.');
                setIsLoading(false);
            }
        };

        initMap3D();

        // Cleanup timeout on unmount
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [center]);

    if (error) {
        return (
            <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <p className="text-red-600 font-semibold mb-2">{error}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-4 py-2 bg-[var(--color-light-blue)] text-white rounded-lg hover:opacity-90"
                    >
                        Kembali ke 2D
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-50">
            {isLoading && (
                <div className="absolute inset-0 bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-12 h-12 border-4 border-[var(--color-light-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Memuat peta 3D fotorealistik...</p>
                    </div>
                </div>
            )}
            <div ref={containerRef} className="w-full h-full" />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-10 glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all shadow-md hover:shadow-lg"
            >
                <span className="text-sm font-medium text-gray-700">Kembali ke 2D</span>
            </button>
        </div>
    );
}
