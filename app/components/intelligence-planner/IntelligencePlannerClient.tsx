'use client';

import { useState, useEffect, useCallback } from 'react';
import GoogleMapComponent from './GoogleMapComponent';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import {
    Station,
    CandidateLocation,
    LayerState,
    SelectedMarker,
} from '@/app/types/intelligence-planner';

export default function IntelligencePlannerClient() {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    // Layer visibility state
    const [layers, setLayers] = useState<LayerState>({
        spklu: true,
        spbklu: true,
        candidates: true,
    });

    // Data state
    const [stations, setStations] = useState<Station[]>([]);
    const [candidates, setCandidates] = useState<CandidateLocation[]>([]);
    const [loading, setLoading] = useState(true);

    // Add candidate mode
    const [isAddingCandidate, setIsAddingCandidate] = useState(false);

    // Selected marker for info window
    const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null);

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
    const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng && isAddingCandidate) {
            const newCandidate: CandidateLocation = {
                id: `candidate-${Date.now()}`,
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng(),
                address: 'Memuat alamat...', // Will be reverse geocoded in future task
                createdAt: new Date(),
            };

            setCandidates((prev) => [...prev, newCandidate]);
            setIsAddingCandidate(false); // Reset mode after adding one candidate
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

    // Handle marker click
    const handleMarkerClick = useCallback((marker: SelectedMarker) => {
        setSelectedMarker(marker);
    }, []);

    // Handle info window close
    const handleInfoWindowClose = useCallback(() => {
        setSelectedMarker(null);
    }, []);

    // Handle analyze (placeholder for Task 1.7)
    const handleAnalyze = useCallback(() => {
        console.log('Analyze clicked - will be implemented in Task 1.7');
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
            />

            {/* Map Container */}
            <div className="flex-1 relative">
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
            />
        </div>
    );
}
