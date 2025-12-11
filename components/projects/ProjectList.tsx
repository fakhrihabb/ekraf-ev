"use client";

import { useEffect, useState } from "react";
import { Project } from "../../app/lib/types";
import { LocalStorageService, SupabaseService } from "../../app/lib/storage";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectModal } from "./CreateProjectModal";
import Link from "next/link";
import { Search, ArrowUp, ArrowDown, Plus } from "lucide-react";

export const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Sort state
  const [sortField, setSortField] = useState<"created_at" | "name">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterAndSortProjects();
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [projects, searchQuery, sortField, sortOrder]);

  const loadProjects = async () => {
    // 1. Initial load from LocalStorage for speed
    const localData = LocalStorageService.getProjects();
    setProjects(localData);
    if (localData.length > 0) setIsLoading(false);

    // 2. Fetch from Supabase for truth and syncing
    try {
      const remoteData = await SupabaseService.fetchProjects();

      if (remoteData) {
        // Merge logic: Create a map by ID
        // Prefer remote data (server truth) but keep local-only data
        const mergedMap = new Map<string, Project>();

        // Add local data first
        localData.forEach(p => mergedMap.set(p.id, p));

        // Overwrite with remote data (updates)
        remoteData.forEach(p => mergedMap.set(p.id, p));

        const mergedProjects = Array.from(mergedMap.values());
        setProjects(mergedProjects);

        // Background Sync: Find projects that are in Local but NOT in Remote
        const missingInRemote = localData.filter(lp => !remoteData.find(rp => rp.id === lp.id));

        if (missingInRemote.length > 0) {
          console.log(`Syncing ${missingInRemote.length} projects to Supabase...`);
          // Sync each one
          Promise.allSettled(missingInRemote.map(p => SupabaseService.saveProject(p)))
            .then((results) => {
              console.log("Sync complete", results);
              // Optional: Re-fetch to ensure consistency?
              // For now, the merged state is sufficient
            });
        }
      }
    } catch (error) {
      console.error("Supabase fetch failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async (newProject: Project) => {
    // Optimistic update
    LocalStorageService.saveProject(newProject);
    const updatedLocal = LocalStorageService.getProjects();
    setProjects(updatedLocal);

    // Async save to Supabase
    try {
      await SupabaseService.saveProject(newProject);
      // Re-fetch to confirm ID generation if DB generated it (but we generate UUID on client so it's fine)
    } catch (error) {
      console.error("Failed to sync project to Supabase", error);
      alert("Project saved locally but failed to sync to server.");
    }
  };

  const filterAndSortProjects = () => {
    let result = [...projects];

    // Search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "created_at") {
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else {
        comparison = a.name.localeCompare(b.name);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    setFilteredProjects(result);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center glass-panel p-4 rounded-xl">
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="Cari proyek..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all text-brand-dark shadow-sm"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3 group-focus-within:text-brand-primary transition-colors" />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Sorting Controls */}
          <div className="flex items-center rounded-lg bg-white/50 border border-gray-200 p-1">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as "created_at" | "name")}
              className="px-3 py-1.5 bg-transparent border-none outline-none cursor-pointer text-brand-dark font-medium text-sm focus:ring-0"
            >
              <option value="created_at">Waktu Dibuat</option>
              <option value="name">Abjad (A-Z)</option>
            </select>

            <div className="w-px h-4 bg-gray-300 mx-1"></div>

            <button
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-brand-primary"
              title={sortOrder === "asc" ? "Urutan: Menaik (A-Z / Terlama)" : "Urutan: Menurun (Z-A / Terbaru)"}
            >
              {sortOrder === "asc" ? (
                // Ascending: Arrow Up (Low to High)
                <ArrowUp className="w-5 h-5" />
              ) : (
                // Descending: Arrow Down (High to Low)
                <ArrowDown className="w-5 h-5" />
              )}
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-lg font-semibold shadow-md active:scale-95 whitespace-nowrap ml-2"
          >
            <Plus className="w-5 h-5" />
            Buat Proyek
          </button>
        </div>
      </div>

      {/* Project Grid */}
      {currentProjects.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProjects.map((project) => (
              <Link href={`/projects/${project.id}`} key={project.id} className="block group">
                <ProjectCard project={project} />
              </Link>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                ← Sebelumnya
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first, last, current, and adjacent pages
                  const showPage = page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  if (!showPage && page === 2 && currentPage > 3) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  if (!showPage && page === totalPages - 1 && currentPage < totalPages - 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  if (!showPage) return null;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[40px] h-10 rounded-lg font-medium text-sm transition-colors ${currentPage === page
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
              >
                Selanjutnya →
              </button>
            </div>
          )}

          {/* Results Info */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredProjects.length)} dari {filteredProjects.length} proyek
          </p>
        </>
      ) : (
        <div className="text-center py-24 glass-panel rounded-2xl border-dashed border-2 border-gray-300/50">
          <div className="mx-auto w-20 h-20 bg-brand-light/5 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-light/5">
            <Search className="w-10 h-10 text-brand-primary/50" />
          </div>
          <h3 className="text-xl font-bold text-brand-dark mb-2">Belum ada proyek</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg leading-relaxed">
            {searchQuery
              ? `Tidak ditemukan proyek dengan kata kunci "${searchQuery}"`
              : "Mulai dengan membuat proyek pertama Anda untuk merencanakan lokasi SPKLU/SPBKLU."}
          </p>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-brand-primary font-semibold hover:text-brand-light hover:underline inline-flex items-center gap-1 transition-all"
            >
              Buat Proyek Baru <span className="text-xl">&rarr;</span>
            </button>
          )}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
      />
    </div>
  );
};
