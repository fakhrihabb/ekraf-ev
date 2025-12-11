'use client';

import { useState, useRef, useCallback } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Search, X, Loader2 } from 'lucide-react';
import { parseCoordinates, isCoordinateString } from '@/app/utils/coordinate-parser';

interface SearchBarProps {
    onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
    placeholder?: string;
}

export default function SearchBar({
    onLocationSelect,
    placeholder = 'Cari alamat, tempat, atau koordinat...'
}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handleLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
        autocompleteRef.current = autocomplete;

        // Restrict to Indonesia
        autocomplete.setComponentRestrictions({ country: 'id' });

        // Set fields to retrieve
        autocomplete.setFields(['formatted_address', 'geometry', 'name']);
    }, []);

    const handlePlaceChanged = useCallback(() => {
        if (!autocompleteRef.current) return;

        const place = autocompleteRef.current.getPlace();

        if (place.geometry?.location) {
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address || place.name || 'Lokasi tidak diketahui'
            };

            onLocationSelect(location);
            setSearchValue('');
        }
    }, [onLocationSelect]);

    const handleSearch = useCallback(() => {
        if (!searchValue.trim()) return;

        setIsLoading(true);

        // Check if input is coordinates
        if (isCoordinateString(searchValue)) {
            const coords = parseCoordinates(searchValue);
            if (coords) {
                onLocationSelect({
                    ...coords,
                    address: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
                });
                setSearchValue('');
                setIsLoading(false);
                return;
            }
        }

        // If not coordinates, let autocomplete handle it
        setIsLoading(false);
    }, [searchValue, onLocationSelect]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        } else if (e.key === 'Escape') {
            setSearchValue('');
        }
    }, [handleSearch]);

    const handleClear = useCallback(() => {
        setSearchValue('');
    }, []);

    return (
        <div className="absolute top-4 left-4 z-10 w-full max-w-md">
            <Autocomplete
                onLoad={handleLoad}
                onPlaceChanged={handlePlaceChanged}
            >
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5 text-gray-400" />
                        )}
                    </div>

                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-light-blue)] focus:border-transparent text-sm"
                    />

                    {searchValue && (
                        <button
                            onClick={handleClear}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 rounded-r-lg transition-colors"
                            aria-label="Hapus pencarian"
                        >
                            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>
            </Autocomplete>

            {/* Hint for coordinate search */}
            {searchValue && isCoordinateString(searchValue) && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs text-blue-800">
                    💡 Tekan Enter untuk mencari koordinat
                </div>
            )}
        </div>
    );
}
