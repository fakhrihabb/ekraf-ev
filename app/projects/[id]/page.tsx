"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Project, Location } from "../../lib/types";
import { SupabaseService } from "../../lib/storage";
import { ProjectHeader } from "@/components/projects/details/ProjectHeader";
import { SummaryStats } from "@/components/projects/details/SummaryStats";
import { LocationList } from "@/components/projects/details/LocationList";
import { ComparisonTable } from "@/components/projects/details/ComparisonTable";
import { ComparisonCharts } from "@/components/projects/details/ComparisonCharts";

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize tab from URL or default to 'list'
  const activeTab = searchParams.get('tab') === 'comparison' ? 'comparison' : 'list';

  const setActiveTab = (tab: 'list' | 'comparison') => {
      // Update URL without refreshing
      router.push(`/projects/${id}?tab=${tab}`, { scroll: false });
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setIsLoading(true);
    try {
      const data = await SupabaseService.fetchProjectById(id);
      if (data) {
        setProject(data);
      } else {
        setError("Proyek tidak ditemukan.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal memuat proyek.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
     try {
       await SupabaseService.deleteProject(id);
       router.push("/projects");
     } catch (err) {
       alert("Gagal menghapus proyek.");
     }
  };

  const handleUpdateProject = async (updates: Partial<Project>) => {
    // Stub
    console.log("Update", updates);
  };

  const handleAddLocation = async (locationData: Partial<Location>) => {
    // locationData now comes from the modal (name, address, lat, lng)
    // Suitability score is undefined, so backend will generate mock analysis
    
    try {
      await SupabaseService.addLocation(id, locationData);
      fetchProject(); // Refresh
    } catch (err) {
      alert("Gagal menambah lokasi.");
    }
  };


  const handleRemoveLocation = async (locationId: string) => {
    try {
      await SupabaseService.removeLocation(locationId);
      // Optimistic update
      if (project) {
        setProject({
          ...project,
          locations: project.locations.filter(l => l.id !== locationId)
        });
      }
    } catch (err) {
      alert("Gagal menghapus lokasi");
      fetchProject(); // Revert on fail
    }
  };

  const handleUpdateLocation = async (locationId: string, updates: Partial<Location>) => {
    try {
        await SupabaseService.updateLocation(locationId, updates);
        // Optimistic update
        if (project) {
            setProject({
                ...project,
                locations: project.locations.map(l => 
                    l.id === locationId ? { ...l, ...updates } : l
                )
            });
        }
    } catch (err) {
        alert("Gagal memperbarui lokasi.");
        fetchProject();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-red-500 font-semibold">{error || "Proyek tidak ditemukan"}</p>
        <button onClick={() => router.push("/projects")} className="text-brand-primary hover:underline">
          Kembali ke Daftar
        </button>
      </div>
    );
  }
  
  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden pb-12">
        {/* Background Shapes */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-brand-light/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        
        <ProjectHeader 
          project={project} 
          onDelete={handleDeleteProject} 
          onUpdate={handleUpdateProject} 
        />

        <SummaryStats project={project} />

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'list' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
               Daftar Detail
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${activeTab === 'comparison' ? 'bg-brand-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
               Perbandingan & Analisis
            </button>
        </div>

        {activeTab === 'list' ? (
            <div className="glass-panel p-6 rounded-2xl border border-brand-primary/10">
               <LocationList 
                 locations={project.locations} 
                 onAddLocation={handleAddLocation}
                 onRemoveLocation={handleRemoveLocation}
               />
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <ComparisonCharts locations={project.locations} />
               
               <div className="glass-panel p-6 rounded-2xl border border-brand-primary/10">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Tabel Perbandingan Detail</h3>
                  <ComparisonTable 
                    locations={project.locations} 
                    onUpdateLocation={handleUpdateLocation}
                  />
               </div>
            </div>
        )}
      </div>
    </main>
  );
}
