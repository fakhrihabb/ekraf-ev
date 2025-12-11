'use client';

import { CandidateLocation } from '@/app/types/intelligence-planner';
import { MapPin, Navigation, Trash2 } from 'lucide-react';
import { formatCoordinates } from '@/app/utils/coordinate-parser';

interface CandidateListProps {
    candidates: CandidateLocation[];
    onCandidateClick: (candidate: CandidateLocation) => void;
    onCandidateRemove: (id: string) => void;
}

export default function CandidateList({
    candidates,
    onCandidateClick,
    onCandidateRemove
}: CandidateListProps) {
    if (candidates.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-2">
                    Belum Ada Lokasi Kandidat
                </h3>
                <p className="text-sm text-gray-500">
                    Klik peta untuk menambahkan lokasi kandidat
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MapPin size={20} className="text-white" />
                        <h3 className="font-semibold text-white">Lokasi Kandidat</h3>
                    </div>
                    <span className="text-xs text-white/80 bg-white/20 px-2 py-1 rounded-full">
                        {candidates.length} lokasi
                    </span>
                </div>
            </div>

            {/* List */}
            <div className="max-h-96 overflow-y-auto">
                {candidates.map((candidate, index) => (
                    <div
                        key={candidate.id}
                        className="border-b border-gray-200 last:border-b-0 p-3 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-start gap-3">
                            {/* Number Badge */}
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-orange-600">
                                    {index + 1}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 mb-1">
                                    Kandidat #{index + 1}
                                </h4>
                                <p className="text-xs text-gray-600 mb-1 truncate" title={candidate.address}>
                                    {candidate.address}
                                </p>
                                <p className="text-xs font-mono text-gray-500">
                                    {formatCoordinates(candidate.latitude, candidate.longitude)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 flex gap-1">
                                <button
                                    onClick={() => onCandidateClick(candidate)}
                                    className="p-2 text-[var(--color-light-blue)] hover:bg-blue-50 rounded transition-colors"
                                    aria-label="Navigasi ke lokasi"
                                    title="Navigasi ke lokasi"
                                >
                                    <Navigation size={16} />
                                </button>
                                <button
                                    onClick={() => onCandidateRemove(candidate.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                                    aria-label="Hapus lokasi"
                                    title="Hapus lokasi"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
