"use client";

import { Project } from "@/app/lib/types";
import { ArrowLeft, Edit2, Trash2, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConfirmationModal } from "./ConfirmationModal";
import { ReportGenerator } from "./ReportGenerator";
import { EditProjectModal } from "../EditProjectModal";

interface ProjectHeaderProps {
  project: Project;
  onDelete: () => void;
  onUpdate: (updates: Partial<Project>) => void;
}

export const ProjectHeader = ({ project, onDelete, onUpdate }: ProjectHeaderProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updates: Partial<Project>) => {
    onUpdate(updates);
    setIsEditModalOpen(false);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setIsDeleting(true);
    onDelete();
  };

  return (
    <div className="mb-8">
      <Link
        href="/projects"
        className="inline-flex items-center text-brand-primary hover:text-brand-dark mb-6 transition-colors font-medium group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Proyek
      </Link>

      <div className="glass-panel p-6 rounded-2xl border border-brand-primary/10 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-light/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-brand-dark">{project.name}</h1>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wide">
                Active
              </span>
            </div>

            {project.description && (
              <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
            )}

            {project.objective && (
              <div className="flex items-start gap-2 text-gray-500 bg-white/50 p-3 rounded-lg border border-gray-100 inline-block">
                <Target className="w-5 h-5 mt-0.5 text-brand-primary" />
                <div>
                  <span className="font-semibold text-brand-dark text-sm block">Tujuan / Goal:</span>
                  <span className="text-sm">{project.objective}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Dibuat: {new Date(project.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ReportGenerator project={project} />

            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-brand-primary transition-colors shadow-sm"
              onClick={handleEditClick}
            >
              <Edit2 className="w-4 h-4" />
              Edit Info
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors shadow-sm disabled:opacity-50"
            >
              {isDeleting ? 'Menghapus...' : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Hapus Proyek
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Proyek?"
        message="Apakah Anda yakin ingin menghapus proyek ini? Semua data lokasi dan analisis terkait akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan."
        confirmText="Hapus Proyek"
        isDanger={true}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        project={project}
      />
    </div>
  );
};
