
"use client";

import { useState } from "react";
import { SaveToProjectModal } from "../../components/projects/SaveToProjectModal";
import { Location, Analysis } from "../../app/lib/types";
import { MapPin, BarChart3, Save } from "lucide-react";

export default function MockPlannerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  
  // Mock Data State
  const [location, setLocation] = useState<Partial<Location>>({
    latitude: -6.200000,
    longitude: 106.816666,
    address: "Jl. Jend. Sudirman No.Kav 52-53, Senayan, Kec. Kby. Baru, Kota Jakarta Selatan",
    name: "Mock Location SCBD"
  });

  const [analysis, setAnalysis] = useState<Partial<Analysis>>({});

  const handleAnalyze = () => {
    // Simulate Analysis
    setAnalyzed(true);
    setAnalysis({
      overall_score: 85,
      demand_score: 90,
      grid_score: 80,
      accessibility_score: 88,
      competition_score: 75,
      insights_text: "Lokasi ini sangat strategis karena berada di pusat bisnis.",
      recommendation: "Direkomendasikan untuk SPKLU Fast Charging"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="bg-[#134474] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <h1 className="text-3xl font-bold relative z-10">Intelligence Planner Mock</h1>
          <p className="text-blue-100 mt-2 relative z-10">Simulasi flow "Save to Project"</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          
          {/* 1. Location Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-[#134474] flex items-center justify-center text-sm">1</span>
              Pilih Lokasi Mock
            </h2>
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-[#134474] mt-1 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{location.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                  <p className="text-xs text-gray-400 mt-2 font-mono">Lat: {location.latitude}, Lng: {location.longitude}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Analysis */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-[#134474] flex items-center justify-center text-sm">2</span>
              Analisis Lokasi
            </h2>
            
            {!analyzed ? (
               <button 
                 onClick={handleAnalyze}
                 className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
               >
                 <BarChart3 className="w-4 h-4" /> Jalankan Analisis Mock
               </button>
            ) : (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
                 <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                   <p className="text-sm text-green-700 font-medium">Overall Score</p>
                   <p className="text-3xl font-bold text-green-800">{analysis.overall_score}</p>
                 </div>
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                   <p className="text-sm text-gray-600 font-medium">Rekomendasi</p>
                   <p className="text-sm text-gray-800 mt-1">{analysis.recommendation}</p>
                 </div>
              </div>
            )}
          </div>

          {/* 3. Save Action */}
          <div className={`space-y-4 transition-all duration-300 ${analyzed ? 'opacity-100' : 'opacity-50 blur-sm pointer-events-none'}`}>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-[#134474] flex items-center justify-center text-sm">3</span>
              Simpan Hasil
            </h2>
            <button 
               onClick={() => setIsModalOpen(true)}
               disabled={!analyzed}
               className="w-full px-6 py-4 bg-[#134474] text-white rounded-xl font-bold text-lg hover:bg-[#0D263F] shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
             >
               <Save className="w-5 h-5" /> Simpan ke Proyek
             </button>
          </div>

        </div>
      </div>

      <SaveToProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locationData={location}
        analysisData={analysis}
      />
    </div>
  );
}
