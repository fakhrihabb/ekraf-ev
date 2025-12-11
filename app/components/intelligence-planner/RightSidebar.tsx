
'use client';

import { ChevronLeft, ChevronRight, BarChart3, Save } from 'lucide-react';
import { useState } from 'react';
import { SaveToProjectModal } from '@/components/projects/SaveToProjectModal';
import { Location, Analysis } from '@/app/lib/types';

interface RightSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function RightSidebar({ isOpen, onToggle }: RightSidebarProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Placeholder data until fully integrated with Analysis Engine
    const mockLocation: Partial<Location> = {
        name: "Lokasi Analisis AI",
        address: "Jl. Jend. Sudirman, Jakarta",
        latitude: -6.2088,
        longitude: 106.8456
    };

    const mockAnalysis: Partial<Analysis> = {
        overall_score: 85,
        recommendation: "Sangat Direkomendasikan untuk Fast Charging",
        insights_text: "Lokasi memiliki kepadatan lalu lintas tinggi dan akses mudah."
    };

    return (
        <div
            className={`relative h-full bg-white border-l border-gray-200 transition-all duration-300 ${isOpen ? 'w-96' : 'w-12'
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -left-4 top-4 z-10 w-10 h-10 bg-white border-2 border-[var(--color-light-blue)] rounded-lg flex items-center justify-center hover:bg-[var(--color-light-blue)] hover:text-white transition-all shadow-md hover:shadow-lg group"
                aria-label={isOpen ? 'Tutup panel hasil' : 'Buka panel hasil'}
            >
                {isOpen ? (
                    <ChevronRight className="w-5 h-5 text-[var(--color-light-blue)] group-hover:text-white" />
                ) : (
                    <ChevronLeft className="w-5 h-5 text-[var(--color-light-blue)] group-hover:text-white" />
                )}
            </button>

            {/* Sidebar Content */}
            <div className={`h-full overflow-hidden ${isOpen ? 'p-4' : 'p-2'}`}>
                {isOpen ? (
                    <div className="space-y-4 h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                    Hasil Analisis
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Hasil analisis lokasi akan ditampilkan di sini.
                                </p>
                            </div>

                            {/* Placeholder for analysis results */}
                            <div className="glass-panel p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Skor Kesesuaian
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Permintaan</span>
                                        <span className="text-xs font-medium text-gray-400">-</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Grid</span>
                                        <span className="text-xs font-medium text-gray-400">-</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Aksesibilitas</span>
                                        <span className="text-xs font-medium text-gray-400">-</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-600">Kompetisi</span>
                                        <span className="text-xs font-medium text-gray-400">-</span>
                                    </div>
                                    <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-700">Total</span>
                                            <span className="text-sm font-bold text-gray-400">-</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Wawasan AI
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Penjelasan berbasis AI tentang lokasi yang dipilih akan muncul di sini.
                                </p>
                            </div>

                            <div className="glass-panel p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">
                                    Rekomendasi
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Rekomendasi infrastruktur (SPKLU/SPBKLU) dan spesifikasi teknis akan ditampilkan di sini.
                                </p>
                            </div>
                        </div>

                        {/* Save Actions */}
                        <div className="pt-4 border-t border-gray-100 bg-white">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full px-4 py-3 bg-[#134474] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0D263F] transition-all shadow-md active:scale-95"
                            >
                                <Save className="w-4 h-4" />
                                Simpan ke Proyek
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 pt-12">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-light-blue)]/10 flex items-center justify-center">
                            <BarChart3 className="w-5 h-5 text-[var(--color-light-blue)]" />
                        </div>
                    </div>
                )}
            </div>
            
            <SaveToProjectModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                locationData={mockLocation}
                analysisData={mockAnalysis}
            />
        </div>
    );
}
