"use client";

import { useState } from "react";
import { Location } from "../../../app/lib/types";
import { ArrowUpDown, CheckCircle, XCircle, AlertCircle, Save } from "lucide-react";

interface ComparisonTableProps {
  locations: Location[];
  onUpdateLocation: (id: string, updates: Partial<Location>) => void;
}

type SortField = 'name' | 'overall_score' | 'demand_score' | 'grid_score' | 'accessibility_score' | 'competition_score' | 'investment';
type SortDirection = 'asc' | 'desc';

export const ComparisonTable = ({ locations, onUpdateLocation }: ComparisonTableProps) => {
  const [sortField, setSortField] = useState<SortField>('overall_score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesBuffer, setNotesBuffer] = useState("");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const sortedLocations = [...locations].sort((a, b) => {
    let valA: any = 0;
    let valB: any = 0;

    // Helper to safe get deep values
    const getVal = (loc: Location, field: SortField) => {
        if (field === 'investment') return 150000000; // Mock fixed investment for now
        if (field === 'name') return loc.name || "";
        if (field === 'overall_score') return loc.suitability_score || 0;
        
        // Sub-scores from analysis
        const analysis = loc.analysis;
        if (!analysis) return 0;
        
        switch(field) {
            case 'demand_score': return analysis.demand_score;
            case 'grid_score': return analysis.grid_score;
            case 'accessibility_score': return analysis.accessibility_score;
            case 'competition_score': return analysis.competition_score;
            default: return 0;
        }
    };

    valA = getVal(a, sortField);
    valB = getVal(b, sortField);

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const saveNotes = (id: string) => {
      onUpdateLocation(id, { notes: notesBuffer });
      setEditingNotes(null);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
          <tr>
            <th className="p-4 min-w-[200px]">
                <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-brand-primary">
                    Lokasi <ArrowUpDown className="w-3 h-3" />
                </button>
            </th>
            <th className="p-4 text-center">
                <button onClick={() => handleSort('overall_score')} className="flex items-center gap-1 hover:text-brand-primary mx-auto">
                    Skor Total <ArrowUpDown className="w-3 h-3" />
                </button>
            </th>
            <th className="p-4 text-center hidden md:table-cell">Permintaan</th>
            <th className="p-4 text-center hidden md:table-cell">Grid</th>
            <th className="p-4 text-center hidden md:table-cell">Akses</th>
            <th className="p-4 text-center hidden md:table-cell">Kompetisi</th>
            <th className="p-4 text-center">Status</th>
            <th className="p-4 min-w-[250px]">Catatan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sortedLocations.map((loc) => (
            <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
              <td className="p-4">
                <div className="font-medium text-brand-dark">{loc.name || "Lokasi Tanpa Nama"}</div>
                <div className="text-xs text-gray-500 truncate max-w-[180px]">{loc.address}</div>
              </td>
              <td className="p-4 text-center">
                <span className={`px-2.5 py-1 rounded-lg font-bold border ${getScoreColor(loc.suitability_score || 0)}`}>
                    {loc.suitability_score || 0}
                </span>
              </td>
              
              {/* Sub-scores */}
              <td className="p-4 text-center hidden md:table-cell text-gray-600">{loc.analysis?.demand_score || "-"}</td>
              <td className="p-4 text-center hidden md:table-cell text-gray-600">{loc.analysis?.grid_score || "-"}</td>
              <td className="p-4 text-center hidden md:table-cell text-gray-600">{loc.analysis?.accessibility_score || "-"}</td>
              <td className="p-4 text-center hidden md:table-cell text-gray-600">{loc.analysis?.competition_score || "-"}</td>

              {/* Status Actions */}
              <td className="p-4 text-center">
                 <div className="flex justify-center gap-1">
                    <button 
                        onClick={() => onUpdateLocation(loc.id, { status: 'recommended' })}
                        className={`p-1.5 rounded-full transition-all ${loc.status === 'recommended' ? 'bg-green-100 text-green-600 ring-2 ring-green-200' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}`}
                        title="Rekomendasikan"
                    >
                        <CheckCircle className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onUpdateLocation(loc.id, { status: 'rejected' })}
                        className={`p-1.5 rounded-full transition-all ${loc.status === 'rejected' ? 'bg-red-100 text-red-600 ring-2 ring-red-200' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}
                        title="Tolak"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                 </div>
              </td>

              {/* Notes */}
              <td className="p-4 relative group">
                  {editingNotes === loc.id ? (
                      <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="w-full text-sm border border-brand-primary/30 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-brand-primary text-gray-900 bg-white placeholder:text-gray-400"
                            value={notesBuffer}
                            onChange={(e) => setNotesBuffer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveNotes(loc.id)}
                            autoFocus
                          />
                          <button onClick={() => saveNotes(loc.id)} className="text-brand-primary p-1">
                              <Save className="w-4 h-4" />
                          </button>
                      </div>
                  ) : (
                      <div 
                        onClick={() => {
                            setEditingNotes(loc.id);
                            setNotesBuffer(loc.notes || "");
                        }}
                        className="cursor-pointer min-h-[30px] flex items-center text-gray-600 hover:text-brand-dark group-hover:bg-white border border-transparent hover:border-gray-200 rounded px-2 -ml-2 transition-all"
                      >
                         {loc.notes ? (
                             <span className="text-sm">{loc.notes}</span>
                         ) : (
                             <span className="text-xs text-gray-400 italic flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Tambah catatan...
                             </span>
                         )}
                      </div>
                  )}
              </td>
            </tr>
          ))}
          
          {locations.length === 0 && (
              <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 italic">
                      Belum ada data untuk dibandingkan.
                  </td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
