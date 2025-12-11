'use client';

import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

interface RightSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function RightSidebar({ isOpen, onToggle }: RightSidebarProps) {
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
                    <div className="space-y-4">
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

                        {/* Placeholder for save buttons */}
                        <div className="space-y-2">
                            <button
                                disabled
                                className="w-full px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                            >
                                Simpan ke Proyek Baru
                            </button>
                            <button
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                            >
                                Tambah ke Proyek yang Ada
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
        </div>
    );
}
