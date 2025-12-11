
"use client";

import { useState, useEffect } from "react";
import { Project, Location, Analysis } from "../../app/lib/types";
import { ProjectReportsService, SupabaseService } from "../../app/lib/storage"; // Assuming we can use SupabaseService or fetch directly
import { X, Plus, FolderOpen, MapPin, CheckCircle, ArrowRight, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface SaveToProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationData: Partial<Location>;
  analysisData: Partial<Analysis>; // Should match what the API expects
}

interface ProjectOption {
  id: string;
  name: string;
}

export const SaveToProjectModal = ({ isOpen, onClose, locationData, analysisData }: SaveToProjectModalProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  
  // Form State
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [locationName, setLocationName] = useState(locationData.name || "");
  
  // Data State
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  
  // Submission State
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setSaveSuccess(false);
      setSavedProjectId(null);
      setError(null);
      setNewProjectName("");
      // Fetch projects if needed
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      // In a real app we might use a dedicated API or the SupabaseService
      // Using /api/projects if it exists, or reusing SupabaseService
      // For now let's try SupabaseService if available in client context
      const data = await SupabaseService.fetchProjects();
      setProjects(data.map(p => ({ id: p.id, name: p.name })));
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const payload = {
        location: {
          ...locationData,
          name: locationName // Ensure name is passed
        },
        analysis: analysisData,
        locationName, // Explicit high level name
        projectId: activeTab === 'existing' ? selectedProjectId : undefined,
        newProjectName: activeTab === 'new' ? newProjectName : undefined
      };

      const response = await fetch('/api/save-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal menyimpan lokasi");
      }

      setSavedProjectId(result.projectId);
      setSaveSuccess(true);
      
      // Optionally clear marker or notify parent? 
      // For now we just show success UI in modal

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan server");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoToProject = () => {
    if (savedProjectId) {
      router.push(`/projects/${savedProjectId}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-md transition-all animate-in fade-in duration-200">
      <div className="glass-card bg-white/95 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-white/50">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-brand-primary/10 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
          <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
            <Save className="w-5 h-5 text-brand-primary" />
            Simpan Lokasi
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-brand-light transition-colors p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {saveSuccess ? (
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lokasi Berhasil Disimpan!</h3>
            <p className="text-gray-500 mb-8">
              Lokasi <strong>"{locationName}"</strong> telah ditambahkan ke proyek Anda.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={handleGoToProject}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#134474] text-white rounded-xl font-semibold hover:bg-[#0D263F] transition-all shadow-md active:scale-95"
              >
                Lihat Proyek <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Lanjut Analisis
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSave} className="p-6">
            
            {/* Location Name Field */}
            <div className="mb-6">
              <label htmlFor="locationName" className="block text-sm font-semibold text-brand-dark mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-brand-primary" /> Nama Lokasi
              </label>
              <input
                id="locationName"
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Contoh: Titik A - Depan Mall"
                className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all placeholder:text-gray-400 text-brand-dark"
              />
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('new')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'new' 
                    ? 'bg-white text-brand-primary shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Plus className="w-4 h-4" /> Buat Proyek Baru
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('existing')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'existing' 
                    ? 'bg-white text-brand-primary shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FolderOpen className="w-4 h-4" /> Proyek Ada
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[100px]">
              {activeTab === 'new' ? (
                <div className="animate-in fade-in slide-in-from-left-4 duration-200">
                  <label htmlFor="newProjectName" className="block text-sm font-semibold text-brand-dark mb-1.5">
                    Nama Proyek Baru
                  </label>
                  <input
                    id="newProjectName"
                    type="text"
                    required
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="Contoh: Rencana SPKLU Jakarta Selatan"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all placeholder:text-gray-400 text-brand-dark"
                  />
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-200">
                  <label htmlFor="existingProject" className="block text-sm font-semibold text-brand-dark mb-1.5">
                    Pilih Proyek
                  </label>
                  {isLoadingProjects ? (
                    <div className="py-2.5 px-4 bg-slate-50 border border-gray-200 rounded-xl text-gray-400 text-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Memuat proyek...
                    </div>
                  ) : projects.length > 0 ? (
                    <select
                      id="existingProject"
                      required
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all text-brand-dark"
                    >
                      <option value="" disabled>-- Pilih Proyek --</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="py-2.5 px-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                      Belum ada proyek tersedia.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2 animate-in fade-in">
                <span className="font-bold">Error:</span> {error}
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 mt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSaving || (activeTab === 'existing' && !selectedProjectId)}
                className="flex-1 px-5 py-2.5 text-sm font-semibold text-white bg-[#134474] hover:bg-[#0D263F] rounded-xl shadow-lg ring ring-brand-primary/10 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Simpan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
