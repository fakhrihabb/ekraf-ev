"use client";

import { X, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isDanger = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col transform transition-all scale-100">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDanger ? "bg-red-50 text-red-500" : "bg-blue-50 text-brand-primary"}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`
              px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all active:scale-95
              ${isDanger 
                ? "bg-red-500 hover:bg-red-600 shadow-red-200" 
                : "bg-brand-primary hover:bg-brand-primary/90 shadow-brand-primary/20"}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
