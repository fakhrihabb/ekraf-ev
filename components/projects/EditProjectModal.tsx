"use client";

import { useState, useEffect } from "react";
import { Project } from "../../app/lib/types";
import { X } from "lucide-react";

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updates: Partial<Project>) => void;
    project: Project;
}

export const EditProjectModal = ({ isOpen, onClose, onSave, project }: EditProjectModalProps) => {
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description || "");
    const [objective, setObjective] = useState(project.objective || "");

    // Update form when project changes
    useEffect(() => {
        setName(project.name);
        setDescription(project.description || "");
        setObjective(project.objective || "");
    }, [project]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            name,
            description,
            objective,
        });

        onClose();
    };

    const handleClose = () => {
        // Reset to original values
        setName(project.name);
        setDescription(project.description || "");
        setObjective(project.objective || "");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-md transition-all">
            <div className="glass-card bg-white/95 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-white/50">
                <div className="px-6 py-5 border-b border-brand-primary/10 flex justify-between items-center bg-gradient-to-r from-white to-slate-50">
                    <h2 className="text-xl font-bold text-brand-dark">Edit Proyek</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-brand-light transition-colors p-1 rounded-full hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-semibold text-brand-dark mb-1.5">
                            Nama Proyek <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="edit-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Contoh: SPKLU Rest Area KM 88"
                            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all placeholder:text-gray-400 text-brand-dark"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-semibold text-brand-dark mb-1.5">
                            Deskripsi (Opsional)
                        </label>
                        <textarea
                            id="edit-description"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Deskripsi singkat proyek..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all placeholder:text-gray-400 text-brand-dark resize-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-objective" className="block text-sm font-semibold text-brand-dark mb-1.5">
                            Tujuan/Goal (Opsional)
                        </label>
                        <input
                            id="edit-objective"
                            type="text"
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            placeholder="Contoh: Menentukan lokasi terbaik..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-light/50 focus:border-brand-light outline-none transition-all placeholder:text-gray-400 text-brand-dark"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t border-brand-primary/5 mt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 text-sm font-semibold text-white btn-primary rounded-xl shadow-lg ring ring-brand-primary/10"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
