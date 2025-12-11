'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GoogleMapComponent from './GoogleMapComponent';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import {
    Station,
    CandidateLocation,
    LayerState,
    SelectedMarker,
} from '@/app/types/intelligence-planner';
import { POIFilterState } from '@/app/types/poi';
import { DEFAULT_POI_RADIUS } from '@/app/constants/poi-types';
import { getGeocodingService } from '@/app/services/geocoding-api';

export default function IntelligencePlannerClient() {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    // Layer visibility state
    const [layers, setLayers] = useState<LayerState>({
        spklu: true,
        spbklu: true,
        candidates: true,
        poi: false, // POI layer starts disabled
    });

    // POI filter state
    const [poiFilterState, setPoiFilterState] = useState<POIFilterState>({
        enabled: false,
        categories: {
            shopping_mall: true,
            university: true,
            parking: true,
            rest_stop: true,
            transit_station: true,
        },
        radius: DEFAULT_POI_RADIUS,
    });

    // Data state
    const [stations, setStations] = useState<Station[]>([]);
    const [candidates, setCandidates] = useState<CandidateLocation[]>([]);
    const [loading, setLoading] = useState(true);

    // Add candidate mode
    const [isAddingCandidate, setIsAddingCandidate] = useState(false);

    // Selected marker for info window
    const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null);

    // Analysis results state
    const [analysisResults, setAnalysisResults] = useState<any | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Map container ref for screenshot
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    // Fetch stations from API on mount
    useEffect(() => {
        const fetchStations = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/stations');
                const data = await response.json();

                if (data.error) {
                    console.error('Error fetching stations:', data.error);
                    return;
                }

                setStations(data.stations);
            } catch (error) {
                console.error('Failed to fetch stations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStations();
    }, []);

    // Handle map click to add candidate
    const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
        if (e.latLng && isAddingCandidate) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            // Create candidate with temporary address
            const newCandidate: CandidateLocation = {
                id: `candidate-${Date.now()}`,
                latitude: lat,
                longitude: lng,
                address: 'Memuat alamat...',
                createdAt: new Date(),
            };

            setCandidates((prev) => [...prev, newCandidate]);
            setIsAddingCandidate(false);

            // Reverse geocode address in background
            try {
                const geocodingService = getGeocodingService();
                const address = await geocodingService.reverseGeocode(lat, lng);

                setCandidates((prev) =>
                    prev.map((c) =>
                        c.id === newCandidate.id ? { ...c, address } : c
                    )
                );
            } catch (error) {
                console.error('Failed to reverse geocode:', error);
            }
        }
    }, [isAddingCandidate]);

    // Handle delete candidate
    const handleDeleteCandidate = useCallback((id: string) => {
        setCandidates((prev) => prev.filter((c) => c.id !== id));
        setSelectedMarker(null);
    }, []);

    // Handle layer toggle
    const handleLayerToggle = useCallback((layer: keyof LayerState) => {
        setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
    }, []);

    // Handle POI filter change
    const handlePOIFilterChange = useCallback((newFilterState: POIFilterState) => {
        setPoiFilterState(newFilterState);
        // Sync POI layer visibility with filter enabled state
        setLayers((prev) => ({ ...prev, poi: newFilterState.enabled }));
    }, []);

    // Handle marker click
    const handleMarkerClick = useCallback((marker: SelectedMarker) => {
        setSelectedMarker(marker);
    }, []);

    // Handle info window close
    const handleInfoWindowClose = useCallback(() => {
        setSelectedMarker(null);
    }, []);

    // Handle analyze - call backend API
    const handleAnalyze = useCallback(async () => {
        if (!selectedMarker || selectedMarker.type !== 'candidate') return;

        const candidate = selectedMarker.data as CandidateLocation;

        setIsAnalyzing(true);
        try {
            console.log('Analyzing location:', candidate.address);

            const response = await fetch('/api/analyze-location-complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: candidate.latitude,
                    longitude: candidate.longitude,
                    address: candidate.address,
                }),
            });

            if (!response.ok) {
                throw new Error('Analysis failed');
            }

            const analysisData = await response.json();
            console.log('Analysis complete:', analysisData);

            // Store analysis results in state
            setAnalysisResults(analysisData);

            // Update candidate with analysis score
            setCandidates(prev => prev.map(c =>
                c.id === candidate.id
                    ? { ...c, analysisScore: analysisData.scores.overall }
                    : c
            ));

            // Open right sidebar to show results
            setRightSidebarOpen(true);

        } catch (error) {
            console.error('Error analyzing location:', error);
            alert('Gagal menganalisis lokasi. Silakan coba lagi.');
        } finally {
            setIsAnalyzing(false);
        }
    }, [selectedMarker]);

    // Handle search location select
    const handleSearchLocationSelect = useCallback(async (location: { lat: number; lng: number; address: string }) => {
        // Optionally add as candidate or just center map
        // For now, just center map (GoogleMapComponent handles this)
        console.log('Search location selected:', location);
    }, []);

    // Handle candidate navigation (center map on candidate)
    const handleCandidateNavigate = useCallback((candidate: CandidateLocation) => {
        // This will be handled by passing the candidate to a map centering function
        // For now, we'll use a ref to trigger map centering
        console.log('Navigate to candidate:', candidate);
        // The actual centering will be handled in GoogleMapComponent via a new prop
    }, []);

    // Calculate station counts
    const stationCounts = {
        spklu: stations.filter((s) => s.type === 'SPKLU').length,
        spbklu: stations.filter((s) => s.type === 'SPBKLU').length,
        candidates: candidates.length,
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full">
            {/* Left Sidebar */}
            <LeftSidebar
                isOpen={leftSidebarOpen}
                onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
                layers={layers}
                onLayerToggle={handleLayerToggle}
                stationCounts={stationCounts}
                isAddingCandidate={isAddingCandidate}
                onToggleAddMode={() => setIsAddingCandidate(!isAddingCandidate)}
                poiFilterState={poiFilterState}
                onPOIFilterChange={handlePOIFilterChange}
                poiCount={0} // Will be updated when POIs are loaded
                candidates={candidates}
                onCandidateClick={handleCandidateNavigate}
                onCandidateRemove={handleDeleteCandidate}
            />

            {/* Map Container */}
            <div ref={mapContainerRef} className="flex-1 relative">
                <GoogleMapComponent
                    stations={stations}
                    candidates={candidates}
                    layers={layers}
                    selectedMarker={selectedMarker}
                    onMapClick={handleMapClick}
                    onMarkerClick={handleMarkerClick}
                    onInfoWindowClose={handleInfoWindowClose}
                    onDeleteCandidate={handleDeleteCandidate}
                    onAnalyze={handleAnalyze}
                    mapContainerRef={mapContainerRef}
                    isAnalyzing={isAnalyzing}
                    poiFilterState={poiFilterState}
                    onPOIFilterChange={handlePOIFilterChange}
                    onSearchLocationSelect={handleSearchLocationSelect}
                />
                {loading && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md">
                        <p className="text-sm text-gray-600">Memuat stasiun...</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <RightSidebar
                isOpen={rightSidebarOpen}
                onToggle={() => setRightSidebarOpen(!rightSidebarOpen)}
                analysisResults={analysisResults}
                isAnalyzing={isAnalyzing}
            />
        </div>
    );
}
