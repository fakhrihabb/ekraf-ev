"use client";

import { Project } from "../../app/lib/types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="glass-card rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-xl text-brand-dark line-clamp-1 group-hover:text-brand-light transition-colors">
          {project.name}
        </h3>
      </div>
      
      {project.description && (
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {project.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-brand-primary/10">
        <span className="font-medium text-brand-primary/60">
          {new Date(project.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
        <span className="bg-brand-light/10 text-brand-primary px-3 py-1.5 rounded-full font-semibold border border-brand-light/20">
          {project.location_count} Lokasi
        </span>
      </div>
    </div>
  );
};
