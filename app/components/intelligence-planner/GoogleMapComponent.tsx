'use client';

import { useLoadScript, GoogleMap, Marker, LoadScriptProps, InfoWindow } from '@react-google-maps/api';
import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import {
    Station,
    CandidateLocation,
    LayerState,
    SelectedMarker,
} from '@/app/types/intelligence-planner';
import { POI, POIFilterState, POIType } from '@/app/types/poi';
import { getMarkerIcon, getPOIMarkerIcon } from '@/app/utils/markerIcons';
import { POI_TYPES, DEFAULT_POI_RADIUS } from '@/app/constants/poi-types';
import { isWithinRadius } from '@/app/utils/distance-calculator';
import { PlacesService } from '@/app/services/places-api';
import StationInfoWindow from './StationInfoWindow';
import CandidateInfoWindow from './CandidateInfoWindow';
import POIInfoWindow from './POIInfoWindow';
import SearchBar from './SearchBar';
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
    isAnalyzing?: boolean;
    poiFilterState: POIFilterState;
    onPOIFilterChange: (filterState: POIFilterState) => void;
    onSearchLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

// @ts-ignore - maps3d removed
const libraries: LoadScriptProps['libraries'] = ['places'];

// Default center: DKI Jakarta
const DEFAULT_CENTER = { lat: -6.2088, lng: 106.8456 };
const DEFAULT_ZOOM = 15; // Zoomed in for 3D effect

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
    isAnalyzing = false,
    poiFilterState,
    onPOIFilterChange,
    onSearchLocationSelect,
}: GoogleMapComponentProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [is3DMode, setIs3DMode] = useState(false);
    const [pois, setPois] = useState<POI[]>([]);
    const [isLoadingPOIs, setIsLoadingPOIs] = useState(false);
    const placesServiceRef = useRef<PlacesService | null>(null);

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
    });

    // Toggle 3D mode logic
    const toggle3DMode = useCallback(() => {
        setIs3DMode(prev => !prev);
    }, []);

    // Handle map load
    const handleMapLoad = useCallback((mapInstance: google.maps.Map) => {
        setMap(mapInstance);
        // Initialize Places Service
        placesServiceRef.current = new PlacesService(mapInstance);
    }, []);

    // Handle search location select
    const handleSearchSelect = useCallback((location: { lat: number; lng: number; address: string }) => {
        if (map) {
            // Center map on location with smooth animation
            map.panTo({ lat: location.lat, lng: location.lng });
            map.setZoom(16);

            // Update view state
            viewStateRef.current.center = { lat: location.lat, lng: location.lng };
            viewStateRef.current.zoom = 16;
        }

        // Pass to parent
        onSearchLocationSelect(location);
    }, [map, onSearchLocationSelect]);



    // Filter stations by type and layer visibility
    const visibleStations = stations.filter((station) => {
        if (station.type === 'SPKLU') return layers.spklu;
        if (station.type === 'SPBKLU') return layers.spbklu;
        return false;
    });

    // Filter candidates by layer visibility
    const visibleCandidates = layers.candidates ? candidates : [];

    // Fetch POIs when filter state changes
    useEffect(() => {
        const fetchPOIs = async () => {
            if (!poiFilterState.enabled || !placesServiceRef.current || candidates.length === 0) {
                setPois([]);
                return;
            }

            // Get selected POI types
            const selectedTypes = Object.entries(poiFilterState.categories)
                .filter(([_, enabled]) => enabled)
                .map(([type]) => type as POIType);

            if (selectedTypes.length === 0) {
                setPois([]);
                return;
            }

            setIsLoadingPOIs(true);

            try {
                // Use the first candidate as center point
                const centerCandidate = candidates[0];
                const location = {
                    lat: centerCandidate.latitude,
                    lng: centerCandidate.longitude
                };

                const results = await placesServiceRef.current.searchNearby(
                    location,
                    poiFilterState.radius,
                    selectedTypes
                );

                setPois(results);
            } catch (error) {
                console.error('Error fetching POIs:', error);
                setPois([]);
            } finally {
                setIsLoadingPOIs(false);
            }
        };

        fetchPOIs();
    }, [poiFilterState, candidates]);

    // Filter POIs by radius from candidates
    const visiblePOIs = useMemo(() => {
        if (!layers.poi || !poiFilterState.enabled || candidates.length === 0) {
            return [];
        }

        // Filter POIs within radius of any candidate
        return pois.filter(poi => {
            return candidates.some(candidate =>
                isWithinRadius(
                    candidate.latitude,
                    candidate.longitude,
                    poi.latitude,
                    poi.longitude,
                    poiFilterState.radius
                )
            );
        });
    }, [pois, layers.poi, poiFilterState.enabled, poiFilterState.radius, candidates]);

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
                mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, // Use Vector Map for 3D
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
                <div className="text-center p-4">
                    <p className="text-red-600 font-semibold mb-2">Gagal memuat peta</p>
                    <p className="text-gray-600 text-sm mb-2">
                        Periksa koneksi internet dan API key Google Maps
                    </p>
                    <pre className="text-xs text-red-500 bg-red-50 p-2 rounded max-w-md overflow-auto">
                        {JSON.stringify(loadError, null, 2)}
                    </pre>
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
            {/* Search Bar - Top Left */}
            <SearchBar onLocationSelect={handleSearchSelect} />

            {/* 3D Toggle Button - Bottom Left */}
            <View3DToggle is3DMode={is3DMode} onToggle={toggle3DMode} />

            {/* Screenshot Button - Bottom Left (below 3D toggle) */}
            <ScreenshotButton mapContainerRef={mapContainerRef} />

            {/* Google Map - Key change forces remount between modes to ensure clean Map ID switch*/}
            <GoogleMap
                key={is3DMode ? 'map-3d-vector' : 'map-2d-raster'}
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={viewStateRef.current.center}
                zoom={viewStateRef.current.zoom}
                options={mapOptions}
                onClick={onMapClick}
                onLoad={handleMapLoad}
                onUnmount={() => setMap(null)}
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

                {/* Render POI Markers */}
                {visiblePOIs.map((poi) => {
                    const poiConfig = Object.values(POI_TYPES).find(config => config.id === poi.type);
                    return (
                        <Marker
                            key={poi.id}
                            position={{ lat: poi.latitude, lng: poi.longitude }}
                            icon={getPOIMarkerIcon(poiConfig?.color || '#6B7280')}
                            title={poi.name}
                            onClick={() => onMarkerClick({ type: 'poi', data: poi })}
                            zIndex={1} // Lower z-index so POIs appear below stations/candidates
                        />
                    );
                })}

                {/* Render Candidate Markers */}
                {visibleCandidates.map((candidate) => (
                    <Marker
                        key={candidate.id}
                        position={{ lat: candidate.latitude, lng: candidate.longitude }}
                        icon={getMarkerIcon('CANDIDATE', candidate.analysisScore)}
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
                        isAnalyzing={isAnalyzing}
                    />
                )}

                {selectedMarker && selectedMarker.type === 'poi' && (
                    <POIInfoWindow
                        poi={selectedMarker.data as POI}
                        candidateLocation={candidates[0]}
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
