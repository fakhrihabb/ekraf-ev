'use client';

import { ChevronLeft, ChevronRight, Zap, Battery, MapPin, Plus } from 'lucide-react';
import { LayerState, CandidateLocation } from '@/app/types/intelligence-planner';
import { POIFilterState } from '@/app/types/poi';
import POIFilterPanel from './POIFilterPanel';
import CandidateList from './CandidateList';

interface LeftSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    layers: LayerState;
    onLayerToggle: (layer: keyof LayerState) => void;
    stationCounts: {
        spklu: number;
        spbklu: number;
        candidates: number;
    };
    isAddingCandidate: boolean;
    onToggleAddMode: () => void;
    poiFilterState: POIFilterState;
    onPOIFilterChange: (filterState: POIFilterState) => void;
    poiCount: number;
    candidates: CandidateLocation[];
    onCandidateClick: (candidate: CandidateLocation) => void;
    onCandidateRemove: (id: string) => void;
}

export default function LeftSidebar({
    isOpen,
    onToggle,
    layers,
    onLayerToggle,
    stationCounts,
    isAddingCandidate,
    onToggleAddMode,
    poiFilterState,
    onPOIFilterChange,
    poiCount,
    candidates,
    onCandidateClick,
    onCandidateRemove,
}: LeftSidebarProps) {
    return (
        <div
            className={`relative h-full bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'
                }`}
        >
            {/* Sidebar Content */}
            <div className={`h-full overflow-y-auto ${isOpen ? 'p-4' : 'p-2'}`}>
                {isOpen ? (
                    <div className="space-y-4">
                        {/* Header with Toggle Button */}
                        <div className="relative mb-2">
                            <h2 className="text-lg font-semibold text-gray-800 text-center">
                                Kontrol Peta
                            </h2>
                            <button
                                onClick={onToggle}
                                className="absolute right-0 top-0 w-8 h-8 border-2 border-[var(--color-light-blue)] rounded-lg flex items-center justify-center hover:bg-[var(--color-light-blue)] hover:text-white transition-all group"
                                aria-label="Tutup sidebar"
                            >
                                <ChevronLeft className="w-4 h-4 text-[var(--color-light-blue)] group-hover:text-white" />
                            </button>
                        </div>

                        <div>

                            {/* Add Candidate Button */}
                            <button
                                onClick={onToggleAddMode}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${isAddingCandidate
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'bg-[var(--color-light-blue)] text-white hover:opacity-90'
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                {isAddingCandidate ? 'Klik Peta untuk Menambah' : 'Tambah Lokasi Kandidat'}
                            </button>

                            {isAddingCandidate && (
                                <p className="text-xs text-orange-600 mt-2 text-center animate-pulse">
                                    Klik lokasi di peta untuk menambahkan kandidat
                                </p>
                            )}
                        </div>

                        {/* Layer Toggles */}
                        <div className="glass-panel p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">
                                Layer Peta
                            </h3>
                            <div className="space-y-3">
                                {/* SPKLU Layer */}
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={layers.spklu}
                                            onChange={() => onLayerToggle('spklu')}
                                            className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                        <Zap className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm text-gray-700">SPKLU</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {stationCounts.spklu}
                                    </span>
                                </label>

                                {/* SPBKLU Layer */}
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={layers.spbklu}
                                            onChange={() => onLayerToggle('spbklu')}
                                            className="w-4 h-4 text-green-500 rounded focus:ring-2 focus:ring-green-500"
                                        />
                                        <Battery className="w-4 h-4 text-green-500" />
                                        <span className="text-sm text-gray-700">SPBKLU</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {stationCounts.spbklu}
                                    </span>
                                </label>

                                {/* Candidates Layer */}
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={layers.candidates}
                                            onChange={() => onLayerToggle('candidates')}
                                            className="w-4 h-4 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                                        />
                                        <MapPin className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-gray-700">Kandidat</span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                        {stationCounts.candidates}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* POI Filter Panel */}
                        <POIFilterPanel
                            filterState={poiFilterState}
                            onFilterChange={onPOIFilterChange}
                            poiCount={poiCount}
                        />

                        {/* Candidate List */}
                        <CandidateList
                            candidates={candidates}
                            onCandidateClick={onCandidateClick}
                            onCandidateRemove={onCandidateRemove}
                        />

                        {/* Info */}
                        <div className="glass-panel p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Petunjuk
                            </h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Klik peta untuk menambah lokasi kandidat</li>
                                <li>• Klik marker untuk melihat detail</li>
                                <li>• Toggle layer untuk show/hide marker</li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <button
                            onClick={onToggle}
                            className="w-8 h-8 border-2 border-[var(--color-light-blue)] rounded-lg flex items-center justify-center hover:bg-[var(--color-light-blue)] hover:text-white transition-all group"
                            aria-label="Buka sidebar"
                        >
                            <ChevronRight className="w-4 h-4 text-[var(--color-light-blue)] group-hover:text-white" />
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-light-blue)]/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-[var(--color-light-blue)]" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
