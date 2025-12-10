"use client";

import { useMemo } from "react";
import { Project } from "@/app/lib/types";
import { Calculator, MapPin, TrendingUp, DollarSign } from "lucide-react";

interface SummaryStatsProps {
  project: Project;
}

export const SummaryStats = ({ project }: SummaryStatsProps) => {
  const stats = useMemo(() => {
    const totalLocations = project.locations.length;
    
    // Calculate average suitability score
    const totalScore = project.locations.reduce((sum, loc) => sum + (loc.suitability_score || 0), 0);
    const avgScore = totalLocations > 0 ? Math.round(totalScore / totalLocations) : 0;

    // Placeholder for investment (e.g. mock cost per station type usually)
    // For now we'll mock it based on location count
    const estimatedInvestment = totalLocations * 150000000; // 150jt per location (mock)

    // Mix (mock)
    const spkluCount = Math.ceil(totalLocations * 0.7);
    const spbkluCount = totalLocations - spkluCount;

    return {
      totalLocations,
      avgScore,
      estimatedInvestment,
      spkluCount,
      spbkluCount
    };
  }, [project]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Locations */}
      <div className="glass-card p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Total Kandidat</p>
          <p className="text-2xl font-bold text-brand-dark mt-1">{stats.totalLocations}</p>
        </div>
        <div className="bg-brand-light/10 p-3 rounded-lg text-brand-primary">
          <MapPin className="w-6 h-6" />
        </div>
      </div>

      {/* Avg Score */}
      <div className="glass-card p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Rata-rata Skor</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-2xl font-bold text-brand-dark">{stats.avgScore}</p>
            <span className="text-xs text-gray-400">/ 100</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${stats.avgScore >= 75 ? 'bg-green-100 text-green-600' : stats.avgScore >= 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* Est Investment */}
      <div className="glass-card p-4 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">Est. Investasi</p>
          <p className="text-2xl font-bold text-brand-dark mt-1 truncate">
            Rp {(stats.estimatedInvestment / 1000000).toFixed(0)} Jt
          </p>
        </div>
        <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

       {/* Quick Mix */}
       <div className="glass-card p-4 rounded-xl">
        <p className="text-sm text-gray-500 font-medium mb-2">Rekomendasi Tipe</p>
        <div className="flex gap-2 items-center text-sm font-semibold">
           <span className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded">SPKLU: {stats.spkluCount}</span>
           <span className="bg-brand-light/10 text-brand-light px-2 py-1 rounded">SPBKLU: {stats.spbkluCount}</span>
        </div>
      </div>
    </div>
  );
};
