'use client';

import { InfoWindow } from '@react-google-maps/api';
import { CandidateLocation } from '@/app/types/intelligence-planner';
import { X, MapPin, Trash2, BarChart3 } from 'lucide-react';

interface CandidateInfoWindowProps {
    location: CandidateLocation;
    onAnalyze: () => void;
    onDelete: () => void;
    onClose: () => void;
}

export default function CandidateInfoWindow({
    location,
    onAnalyze,
    onDelete,
    onClose,
}: CandidateInfoWindowProps) {
    return (
        <InfoWindow
            position={{ lat: location.latitude, lng: location.longitude }}
            onCloseClick={onClose}
            options={{
                pixelOffset: new google.maps.Size(0, -42),
            }}
        >
            <div className="p-2 min-w-[220px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-orange-500" />
                        <h3 className="font-semibold text-gray-800">Lokasi Kandidat</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm mb-3">
                    <div>
                        <span className="text-gray-600 block mb-1">Alamat:</span>
                        <span className="text-gray-800">{location.address}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 block mb-1">Koordinat:</span>
                        <span className="text-gray-800 font-mono text-xs">
                            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onAnalyze}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-[var(--color-light-blue)] text-white rounded text-xs font-medium hover:opacity-90 transition-opacity"
                        disabled
                        title="Akan tersedia di Task 1.7"
                    >
                        <BarChart3 className="w-3 h-3" />
                        Analisis
                    </button>
                    <button
                        onClick={onDelete}
                        className="px-3 py-1.5 border border-red-200 text-red-600 rounded text-xs font-medium hover:bg-red-50 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </InfoWindow>
    );
}
