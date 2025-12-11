
'use client';

import { ChevronLeft, ChevronRight, BarChart3, Save, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { SaveToProjectModal } from '@/components/projects/SaveToProjectModal';
import { Location, Analysis } from '@/app/lib/types';
import SolarAnalysisPanel from './SolarAnalysisPanel';

interface RightSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    analysisResults?: any | null;
    isAnalyzing?: boolean;
}

export default function RightSidebar({ isOpen, onToggle, analysisResults, isAnalyzing }: RightSidebarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Extract data from analysis results
    const scores = analysisResults?.scores;
    const insights = analysisResults?.insights;
    const recommendation = analysisResults?.recommendation;

    return (
        <div
            className={`relative h-full bg-white border-l border-gray-200 transition-all duration-300 ${isOpen ? 'w-96' : 'w-12'
                }`}
        >
            {/* Sidebar Content */}
            <div className={`h-full overflow-hidden ${isOpen ? 'p-4' : 'p-2'}`}>
                {isOpen ? (
                    <div className="space-y-4 h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                            {/* Header with Toggle Button */}
                            <div className="relative mb-2">
                                <button
                                    onClick={onToggle}
                                    className="absolute left-0 top-0 w-8 h-8 border-2 border-[var(--color-light-blue)] rounded-lg flex items-center justify-center hover:bg-[var(--color-light-blue)] hover:text-white transition-all group"
                                    aria-label="Tutup panel hasil"
                                >
                                    <ChevronRight className="w-4 h-4 text-[var(--color-light-blue)] group-hover:text-white" />
                                </button>
                                <h2 className="text-lg font-semibold text-gray-800 text-center">
                                    Hasil Analisis
                                </h2>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 text-center">
                                    {analysisResults ? 'Hasil analisis lokasi telah selesai.' : 'Hasil analisis lokasi akan ditampilkan di sini.'}
                                </p>
                            </div>

                            {isAnalyzing && (
                                <div className="glass-panel p-6 rounded-lg flex flex-col items-center justify-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-[var(--color-light-blue)] mb-2" />
                                    <p className="text-sm text-gray-600">Menganalisis lokasi...</p>
                                </div>
                            )}

                            {!isAnalyzing && scores && (
                                <>
                                    {/* Scores Section */}
                                    <div className="glass-panel p-4 rounded-lg">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                                            Skor Kesesuaian
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Permintaan</span>
                                                <span className={`text-xs font-medium ${scores.demand >= 70 ? 'text-green-600' : scores.demand >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {scores.demand}/100
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Grid</span>
                                                <span className={`text-xs font-medium ${scores.grid >= 70 ? 'text-green-600' : scores.grid >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {scores.grid}/100
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Aksesibilitas</span>
                                                <span className={`text-xs font-medium ${scores.accessibility >= 70 ? 'text-green-600' : scores.accessibility >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {scores.accessibility}/100
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-600">Kompetisi</span>
                                                <span className={`text-xs font-medium ${scores.competition >= 70 ? 'text-green-600' : scores.competition >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                    {scores.competition}/100
                                                </span>
                                            </div>
                                            {analysisResults?.solarScore !== undefined && analysisResults?.solarScore !== null && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-gray-600">☀️ Solar</span>
                                                    <span className={`text-xs font-medium ${analysisResults.solarScore >= 70 ? 'text-green-600' : analysisResults.solarScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {analysisResults.solarScore}/100
                                                    </span>
                                                </div>
                                            )}
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700">Total</span>
                                                    <span className={`text-lg font-bold ${scores.overall >= 70 ? 'text-green-600' : scores.overall >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                        {scores.overall}/100
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Solar Analysis Panel */}
                                    {analysisResults?.solarAnalysis && analysisResults?.solarScore !== undefined && (
                                        <SolarAnalysisPanel
                                            solarAnalysis={analysisResults.solarAnalysis}
                                            solarScore={analysisResults.solarScore}
                                        />
                                    )}

                                    {/* AI Insights */}
                                    {insights && (
                                        <div className="glass-panel p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                                Wawasan AI
                                            </h3>
                                            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                                {insights}
                                            </p>
                                        </div>
                                    )}

                                    {/* Recommendation */}
                                    {recommendation && (
                                        <div className="glass-panel p-4 rounded-lg">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                                Rekomendasi
                                            </h3>
                                            <div className="mb-3">
                                                <span className="inline-block px-3 py-1 bg-[var(--color-light-blue)] text-white text-xs font-medium rounded-full">
                                                    {recommendation.type}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-3">
                                                {recommendation.rationale}
                                            </p>
                                            {recommendation.technical_specs && (
                                                <div className="text-xs text-gray-500 space-y-1">
                                                    <p><strong>Chargers:</strong> {recommendation.technical_specs.chargers || '-'}</p>
                                                    <p><strong>Power:</strong> {recommendation.technical_specs.powerRequirement || '-'}</p>
                                                    <p><strong>Space:</strong> {recommendation.technical_specs.spaceRequirement || '-'}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {!isAnalyzing && !analysisResults && (
                                <div className="glass-panel p-6 rounded-lg text-center">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-sm text-gray-500">
                                        Klik marker kandidat dan pilih "Analisis" untuk memulai
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Save Actions */}
                        {analysisResults && (
                            <div className="pt-4 border-t border-gray-100 bg-white">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="w-full px-4 py-3 bg-[#134474] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0D263F] transition-all shadow-md active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    Simpan ke Proyek
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 pt-4">
                        <button
                            onClick={onToggle}
                            className="w-8 h-8 border-2 border-[var(--color-light-blue)] rounded-lg flex items-center justify-center hover:bg-[var(--color-light-blue)] hover:text-white transition-all group"
                            aria-label="Buka panel hasil"
                        >
                            <ChevronLeft className="w-4 h-4 text-[var(--color-light-blue)] group-hover:text-white" />
                        </button>
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-light-blue)]/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-[var(--color-light-blue)]" />
                        </div>
                    </div>
                )}
            </div>

            <SaveToProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                locationData={analysisResults?.location}
                analysisData={analysisResults}
            />
        </div>
    );
}
