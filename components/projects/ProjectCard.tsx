"use client";

import { Project } from "../../app/lib/types";
import { MapPin, Target } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

// Get score color based on value (0-100)
const getScoreColor = (score: number | null): string => {
  if (score === null || score === undefined) return 'text-gray-400';

  if (score >= 75) return 'text-green-600 font-bold';
  if (score >= 50) return 'text-yellow-600 font-bold';
  if (score >= 25) return 'text-orange-600 font-bold';
  return 'text-red-600 font-bold';
};

export const ProjectCard = ({ project }: ProjectCardProps) => {
  // Calculate average score from locations (assume it's available in project data)
  const avgScore = project.average_score || null;

  return (
    <div className="glass-card rounded-xl p-5 hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl text-brand-dark line-clamp-1 group-hover:text-brand-light transition-colors">
          {project.name}
        </h3>
      </div>

      {/* Compact Stats */}
      <div className="flex items-center gap-4 mb-4">
        {/* Overall Score */}
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-brand-primary" />
          <span className="text-xs text-gray-500">Score:</span>
          <span className={`text-sm ${getScoreColor(avgScore)}`}>
            {avgScore !== null ? avgScore.toFixed(0) : 'N/A'}
          </span>
        </div>

        {/* Total Locations */}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-brand-primary" />
          <span className="text-xs text-gray-500">Lokasi:</span>
          <span className="text-sm font-semibold text-brand-dark">
            {project.location_count}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-brand-primary/10">
        <span className="font-medium text-brand-primary/60">
          {new Date(project.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
        <span className="text-brand-primary/60 italic">
          Intelligence Planner
        </span>
      </div>
    </div>
  );
};
