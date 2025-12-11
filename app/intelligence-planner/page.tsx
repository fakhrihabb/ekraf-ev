'use client';

import { Map, Layers, BarChart3 } from 'lucide-react';

export default function IntelligencePlannerPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container-custom py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-24 h-24 mx-auto mb-8 rounded-2xl gradient-primary flex items-center justify-center">
                        <Map className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Intelligence <span className="gradient-text">Planner</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Halaman ini akan berisi peta interaktif 2D/3D, analisis lokasi, dan fitur eksplorasi data.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="glass-card p-6">
                            <Map className="w-8 h-8 text-[var(--color-blue)] mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Peta Interaktif</h3>
                            <p className="text-sm text-gray-600">2D & 3D visualization</p>
                        </div>
                        <div className="glass-card p-6">
                            <Layers className="w-8 h-8 text-[var(--color-blue)] mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Data Layers</h3>
                            <p className="text-sm text-gray-600">POI, Grid, Competition</p>
                        </div>
                        <div className="glass-card p-6">
                            <BarChart3 className="w-8 h-8 text-[var(--color-blue)] mx-auto mb-4" />
                            <h3 className="font-semibold mb-2">Analisis AI</h3>
                            <p className="text-sm text-gray-600">Powered by Gemini</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 text-left">
                        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
                        <p className="text-gray-600 mb-4">
                            Fitur Intelligence Planner akan diimplementasikan pada Day 2-3, meliputi:
                        </p>
                        <ul className="space-y-2 text-gray-600">
                            <li>✅ Google Maps integration dengan center di DKI Jakarta</li>
                            <li>✅ Toggle 2D/3D view</li>
                            <li>✅ Marker untuk SPKLU/SPBKLU existing</li>
                            <li>✅ Click-to-add candidate locations</li>
                            <li>✅ POI layer dari Google Places API</li>
                            <li>✅ Location analysis dengan AI insights</li>
                            <li>✅ Save to Projects functionality</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
