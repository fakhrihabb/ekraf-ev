'use client';

import { InfoWindow } from '@react-google-maps/api';
import { Station } from '@/app/types/intelligence-planner';
import { X, Zap, Battery } from 'lucide-react';

interface StationInfoWindowProps {
    station: Station;
    onClose: () => void;
}

export default function StationInfoWindow({ station, onClose }: StationInfoWindowProps) {
    const Icon = station.type === 'SPKLU' ? Zap : Battery;
    const iconColor = station.type === 'SPKLU' ? 'text-[#3b82f6]' : 'text-[#22c55e]';

    return (
        <InfoWindow
            position={{ lat: station.latitude, lng: station.longitude }}
            onCloseClick={onClose}
            options={{
                pixelOffset: new google.maps.Size(0, -42),
            }}
        >
            <div className="p-2 min-w-[200px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${iconColor}`} />
                        <h3 className="font-semibold text-[#1f2937]">{station.name}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-[#9ca3af] hover:text-[#4b5563] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Details */}
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-[#4b5563]">Tipe:</span>
                        <span className="font-medium text-[#1f2937]">{station.type}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#4b5563]">Kapasitas:</span>
                        <span className="font-medium text-[#1f2937]">
                            {station.capacity} charger{station.capacity > 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[#4b5563]">Operator:</span>
                        <span className="font-medium text-[#1f2937]">{station.operator}</span>
                    </div>
                </div>
            </div>
        </InfoWindow>
    );
}
