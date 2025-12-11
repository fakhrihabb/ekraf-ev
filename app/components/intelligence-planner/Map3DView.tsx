'use client';

import { useEffect, useState } from 'react';

interface Map3DViewProps {
    center: { lat: number; lng: number };
    map: google.maps.Map | null;
    onClose: () => void;
}

export default function Map3DView({ center, map, onClose }: Map3DViewProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!map) return;

        // Enable Map ID for 3D buildings
        map.setOptions({
            mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
        });

        // Enable 3D tilt
        map.setTilt(45);

        // Enable rotation and heading controls
        map.setOptions({
            rotateControl: true,
            rotateControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER,
            },
            headingInteractionEnabled: true,
            tiltInteractionEnabled: true,
        });

        // Smooth animation to the center
        map.panTo(center);

        // Set appropriate zoom for 3D view
        const currentZoom = map.getZoom() || 15;
        if (currentZoom < 15) {
            map.setZoom(15);
        }

        setIsReady(true);

        // Cleanup: reset to 2D mode when component unmounts
        return () => {
            if (map) {
                map.setTilt(0);
                map.setOptions({
                    mapId: undefined, // Remove Map ID to disable 3D buildings
                    rotateControl: false,
                    headingInteractionEnabled: false,
                    tiltInteractionEnabled: false,
                });
                map.setHeading(0); // Reset rotation
            }
        };
    }, [map, center]);

    return (
        <div className="absolute top-4 left-4 z-10">
            {/* Close button */}
            <button
                onClick={onClose}
                className="glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all shadow-md hover:shadow-lg"
            >
                <span className="text-sm font-medium text-gray-700">← Kembali ke 2D</span>
            </button>

            {!isReady && (
                <div className="glass-panel px-4 py-2 rounded-lg mt-2">
                    <p className="text-sm text-gray-600">Mengaktifkan tampilan 3D...</p>
                </div>
            )}

            {/* Instructions */}
            {isReady && (
                <div className="glass-panel px-4 py-2 rounded-lg mt-2 max-w-xs">
                    <p className="text-xs text-gray-600">
                        <strong>Kontrol 3D:</strong><br />
                        • Shift + Drag: Putar peta<br />
                        • Ctrl + Drag: Ubah kemiringan<br />
                        • Gunakan kompas di kiri untuk rotasi
                    </p>
                </div>
            )}
        </div>
    );
}
