'use client';

import { useLoadScript, GoogleMap, Marker, LoadScriptProps } from '@react-google-maps/api';
import { useMemo, useState, useCallback, useRef } from 'react';
import {
    Station,
    CandidateLocation,
    LayerState,
    SelectedMarker,
} from '@/app/types/intelligence-planner';
import { getMarkerIcon } from '@/app/utils/markerIcons';
import StationInfoWindow from './StationInfoWindow';
import CandidateInfoWindow from './CandidateInfoWindow';
import View3DToggle from './View3DToggle';
import ScreenshotButton from './ScreenshotButton';
import Map3DView from './Map3DView';

interface GoogleMapComponentProps {
    stations: Station[];
    candidates: CandidateLocation[];
    layers: LayerState;
    selectedMarker: SelectedMarker | null;
    onMapClick?: (e: google.maps.MapMouseEvent) => void;
    onMarkerClick: (marker: SelectedMarker) => void;
    onInfoWindowClose: () => void;
    onDeleteCandidate: (id: string) => void;
    onAnalyze: () => void;
    mapContainerRef: React.RefObject<HTMLDivElement | null>;
}

const libraries: LoadScriptProps['libraries'] = ['places'];

// Default center: DKI Jakarta
const DEFAULT_CENTER = { lat: -6.2088, lng: 106.8456 };
const DEFAULT_ZOOM = 11;

export default function GoogleMapComponent({
    stations,
    candidates,
    layers,
    selectedMarker,
    onMapClick,
    onMarkerClick,
    onInfoWindowClose,
    onDeleteCandidate,
    onAnalyze,
    mapContainerRef,
}: GoogleMapComponentProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [is3DMode, setIs3DMode] = useState(false);

    // Store the view state (center, zoom, etc.) to persist across re-renders/remounts
    const viewStateRef = useRef({
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        heading: 0,
        tilt: 0
    });

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries,
        version: 'beta', // Required for photorealistic 3D
    });

    // Toggle 3D mode logic
    const toggle3DMode = useCallback(() => {
        if (map) {
            // Check if getCenter returns a value before accessing
            const currentCenter = map.getCenter();

            // Capture current state before switching
            viewStateRef.current = {
                center: currentCenter ? currentCenter.toJSON() : viewStateRef.current.center,
                zoom: map.getZoom() || viewStateRef.current.zoom,
                heading: map.getHeading() || 0,
                tilt: map.getTilt() || 0
            };
        }
        setIs3DMode(prev => !prev);
    }, [map]);

    // Handle map load
    const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
    }, []);

    // Filter stations by type and layer visibility
    const visibleStations = stations.filter((station) => {
        if (station.type === 'SPKLU') return layers.spklu;
        if (station.type === 'SPBKLU') return layers.spbklu;
        return false;
    });

    // Filter candidates by layer visibility
    const visibleCandidates = layers.candidates ? candidates : [];

    // Calculate map options based on mode
    const mapOptions = useMemo<google.maps.MapOptions>(() => {
        if (!isLoaded) {
            return {};
        }

        // Base options common to both modes
        const baseOptions: google.maps.MapOptions = {
            disableDefaultUI: false,
            clickableIcons: true,
            scrollwheel: true,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                position: google.maps.ControlPosition.TOP_RIGHT,
                mapTypeIds: ['roadmap', 'satellite'],
            },
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: false,
        };

        if (is3DMode) {
            return {
                ...baseOptions,
                mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
                tilt: 45, // Initial tilt for 3D mode
                headingInteractionEnabled: true,
                tiltInteractionEnabled: true,
            };
        } else {
            return {
                ...baseOptions,
                mapId: undefined, // undefined to ensure Raster map (no Vector)
                tilt: 0,
                headingInteractionEnabled: false,
                tiltInteractionEnabled: false,
                rotateControl: false,
            };
        }
    }, [is3DMode, isLoaded]);

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

    return (
        <>
            {/* 3D Toggle Button */}
            <View3DToggle is3DMode={is3DMode} onToggle={toggle3DMode} />

            {/* Screenshot Button */}
            <ScreenshotButton mapContainerRef={mapContainerRef} />

            {/* Google Map - Key change forces remount between modes */}
            <GoogleMap
                key={is3DMode ? 'map-3d' : 'map-2d'}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={viewStateRef.current.center}
                zoom={viewStateRef.current.zoom}
                options={mapOptions}
                onClick={onMapClick}
                onLoad={handleMapLoad}
            >
                {/* Render Station Markers */}
                {visibleStations.map((station) => (
                    <Marker
                        key={station.id}
                        position={{ lat: station.latitude, lng: station.longitude }}
                        icon={getMarkerIcon(station.type)}
                        title={station.name}
                        onClick={() => onMarkerClick({ type: 'station', data: station })}
                    />
                ))}

                {/* Render Candidate Markers */}
                {visibleCandidates.map((candidate) => (
                    <Marker
                        key={candidate.id}
                        position={{ lat: candidate.latitude, lng: candidate.longitude }}
                        icon={getMarkerIcon('CANDIDATE')}
                        title="Lokasi Kandidat"
                        onClick={() => onMarkerClick({ type: 'candidate', data: candidate })}
                    />
                ))}

                {/* Render Info Window */}
                {selectedMarker && selectedMarker.type === 'station' && (
                    <StationInfoWindow
                        station={selectedMarker.data as Station}
                        onClose={onInfoWindowClose}
                    />
                )}

                {selectedMarker && selectedMarker.type === 'candidate' && (
                    <CandidateInfoWindow
                        location={selectedMarker.data as CandidateLocation}
                        onAnalyze={onAnalyze}
                        onDelete={() => onDeleteCandidate((selectedMarker.data as CandidateLocation).id)}
                        onClose={onInfoWindowClose}
                    />
                )}
            </GoogleMap>

            {/* 3D View Overlay - Controls & Instructions */}
            <Map3DView
                map={map}
                is3DMode={is3DMode}
            />
        </>
    );
}
