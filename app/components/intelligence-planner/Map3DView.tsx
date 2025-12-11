'use client';

import { useEffect, useRef, useState } from 'react';

interface Map3DViewProps {
    center: { lat: number; lng: number };
    onClose: () => void;
}

export default function Map3DView({ center, onClose }: Map3DViewProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let map3DElement: any = null;

        const initMap3D = async () => {
            try {
                // Wait for google.maps to be available
                if (!window.google?.maps?.importLibrary) {
                    throw new Error('Google Maps API not loaded');
                }

                // Import maps3d library
                const { Map3DElement } = await window.google.maps.importLibrary('maps3d');

                if (!containerRef.current) return;

                // Create 3D map element
                map3DElement = new Map3DElement({
                    center: {
                        lat: center.lat,
                        lng: center.lng,
                        altitude: 0,
                    },
                    range: 1000,
                    tilt: 60,
                    heading: 0,
                    mode: 'HYBRID',
                });

                // Wait for map to be ready before hiding loading
                map3DElement.addEventListener('gmp-steadystate', ({ isSteady }: any) => {
                    if (isSteady) {
                        setIsLoading(false);
                    }
                }, { once: true });

                // Handle errors
                map3DElement.addEventListener('gmp-error', (err: any) => {
                    console.error('3D Map error:', err);
                    setError('Gagal memuat peta 3D. Fitur ini memerlukan API key dengan akses Maps 3D (beta).');
                    setIsLoading(false);
                });

                // Append to container
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(map3DElement);

            } catch (err) {
                console.error('Error initializing 3D map:', err);
                setError('Gagal memuat peta 3D. Pastikan koneksi internet stabil dan API key valid.');
                setIsLoading(false);
            }
        };

        // Start initialization
        initMap3D();

        // Cleanup
        return () => {
            if (map3DElement && containerRef.current) {
                try {
                    containerRef.current.innerHTML = '';
                } catch (e) {
                    // Ignore cleanup errors
                }
            }
        };
    }, [center]);

    if (error) {
        return (
            <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <p className="text-red-600 font-semibold mb-4">{error}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-[var(--color-light-blue)] text-white rounded-lg hover:opacity-90 transition-opacity"
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
                <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[var(--color-light-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-700 font-medium">Memuat peta 3D fotorealistik...</p>
                        <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
                    </div>
                </div>
            )}

            <div ref={containerRef} className="w-full h-full" />

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-20 glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all shadow-md hover:shadow-lg"
            >
                <span className="text-sm font-medium text-gray-700">← Kembali ke 2D</span>
            </button>
        </div>
    );
}
