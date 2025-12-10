"use client";

import { Location } from "../../../app/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

interface ComparisonChartsProps {
  locations: Location[];
}

export const ComparisonCharts = ({ locations }: ComparisonChartsProps) => {
  if (!locations || locations.length === 0) return null;

  // 1. Prepare Data for Bar Chart (Overall Scores)
  const barData = locations.map(loc => ({
    name: loc.name || "Unknown",
    score: loc.suitability_score || 0,
    fill: (loc.suitability_score || 0) >= 80 ? '#16a34a' : (loc.suitability_score || 0) >= 60 ? '#ca8a04' : '#dc2626'
  }));

  // 2. Prepare Data for Radar Chart (Metrics)
  // We need to transform data: keys are metrics, values are scores for each location
  const metrics = [
    { label: "Permintaan", key: "demand_score" },
    { label: "Grid", key: "grid_score" },
    { label: "Akses", key: "accessibility_score" },
    { label: "Kompetisi", key: "competition_score" },
  ];

  const radarData = metrics.map(metric => {
    const dataPoint: any = { metric: metric.label };
    locations.forEach((loc, index) => {
       // Safe access analysis
       const analysis: any = loc.analysis || {};
       dataPoint[`loc_${loc.id}`] = analysis[metric.key] || 0;
    });
    return dataPoint;
  });

  // Color palette for radar lines
  const colors = ["#2563eb", "#db2777", "#ea580c", "#16a34a", "#9333ea"];

  return (
    <div id="comparison-charts-container" className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Bar Chart: Overall Scores */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Perbandingan Skor Total</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        cursor={{ fill: '#f3f4f6' }}
                    />
                    <Bar dataKey="score" name="Skor Total" radius={[0, 4, 4, 0]} barSize={32} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart: Multi-dimensional */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Analisis Multi-Dimensi</h3>
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#4b5563', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    {locations.map((loc, index) => (
                        <Radar
                            key={loc.id}
                            name={loc.name}
                            dataKey={`loc_${loc.id}`}
                            stroke={colors[index % colors.length]}
                            fill={colors[index % colors.length]}
                            fillOpacity={0.1}
                        />
                    ))}
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
        {locations.length > 5 && (
            <p className="text-center text-xs text-gray-400 mt-2">* Menampilkan semua lokasi mungkin membingungkan</p>
        )}
      </div>
    </div>
  );
};
