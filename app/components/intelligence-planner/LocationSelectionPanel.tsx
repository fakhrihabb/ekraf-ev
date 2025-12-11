'use client';

import { useState, useEffect } from 'react';
import { MapPin, Copy, X, Loader2, CheckCircle2 } from 'lucide-react';
import { formatCoordinates, formatCoordinatesForCopy } from '@/app/utils/coordinate-parser';
import { getGeocodingService } from '@/app/services/geocoding-api';

interface LocationSelectionPanelProps {
    location: { lat: number; lng: number } | null;
    onAnalyze: () => void;
    onClose: () => void;
}

export default function LocationSelectionPanel({
    location,
    onAnalyze,
    onClose
}: LocationSelectionPanelProps) {
    const [address, setAddress] = useState<string>('Memuat alamat...');
    const [isLoadingAddress, setIsLoadingAddress] = useState(false);
    const [copied, setCopied] = useState(false);

    // Reverse geocode when location changes
    useEffect(() => {
        if (!location) {
            setAddress('');
            return;
        }

        const fetchAddress = async () => {
            setIsLoadingAddress(true);
            try {
                const geocodingService = getGeocodingService();
                const result = await geocodingService.reverseGeocode(location.lat, location.lng);
                setAddress(result);
            } catch (error) {
                console.error('Error fetching address:', error);
                setAddress('Alamat tidak ditemukan');
            } finally {
                setIsLoadingAddress(false);
            }
        };

        fetchAddress();
    }, [location]);

    const handleCopyCoordinates = async () => {
        if (!location) return;

        try {
            const coordsText = formatCoordinatesForCopy(location.lat, location.lng);
            await navigator.clipboard.writeText(coordsText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy coordinates:', error);
        }
    };

    if (!location) return null;

    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[var(--color-light-blue)]" />
                        <h3 className="font-semibold text-gray-900">Lokasi Terpilih</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Tutup"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Coordinates */}
                <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Koordinat:</p>
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-mono text-gray-700">
                            {formatCoordinates(location.lat, location.lng)}
                        </p>
                        <button
                            onClick={handleCopyCoordinates}
                            className="flex items-center gap-1 px-2 py-1 text-xs text-[var(--color-light-blue)] hover:bg-blue-50 rounded transition-colors"
                            aria-label="Salin koordinat"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 size={14} />
                                    <span>Tersalin!</span>
                                </>
                            ) : (
                                <>
                                    <Copy size={14} />
                                    <span>Salin</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Address */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Alamat:</p>
                    {isLoadingAddress ? (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Memuat alamat...</span>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-700">{address}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onAnalyze}
                        className="flex-1 bg-[var(--color-light-blue)] text-white px-4 py-2 rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
                    >
                        Analisis Lokasi Ini
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
