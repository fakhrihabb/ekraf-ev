"use client";

import { useState } from "react";
import { Location } from "@/app/lib/types";
import { Plus, MapPin, ExternalLink, Trash2 } from "lucide-react";
import { LocationPickerModal } from "./LocationPickerModal"; // Component moved to details
import { ConfirmationModal } from "./ConfirmationModal";

interface LocationListProps {
  locations: Location[];
  onAddLocation: (data: Partial<Location>) => void;
  onRemoveLocation: (id: string) => void;
}

export const LocationList = ({ locations, onAddLocation, onRemoveLocation }: LocationListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-brand-dark flex items-center gap-2">
          <MapPin className="w-6 h-6 text-brand-primary" />
          Daftar Kandidat Lokasi
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-sm font-semibold">
             {locations ? locations.length : 0}
          </span>
        </h2>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 btn-primary rounded-lg text-sm font-semibold shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tambah Lokasi
        </button>
      </div>

      {locations && locations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {locations.map((location) => (
            <div key={location.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all group relative overflow-hidden">
               {/* Score Badge */}
               <div className="absolute top-4 right-4 z-10">
                 <div className={`
                    flex flex-col items-center justify-center w-12 h-12 rounded-lg font-bold text-sm shadow-sm border
                    ${(location.suitability_score || 0) >= 80 ? 'bg-green-50 text-green-700 border-green-200' : 
                      (location.suitability_score || 0) >= 60 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}
                 `}>
                   <span>{location.suitability_score || 0}</span>
                   <span className="text-[10px] font-normal opacity-80">Skor</span>
                 </div>
               </div>

               <div className="flex gap-4">
                 {/* Map Thumbnail Placeholder */}
                 <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-gray-100">
                    <MapPin className="w-8 h-8 text-gray-300" />
                 </div>

                 <div className="flex-1 pr-14">
                   <h3 className="font-bold text-lg text-brand-dark mb-1 line-clamp-1">{location.name || "Lokasi Tanpa Nama"}</h3>
                   <p className="text-gray-500 text-sm mb-3 line-clamp-2 h-10">
                     {location.address || `Lat: ${location.latitude?.toFixed(4)}, Long: ${location.longitude?.toFixed(4)}`}
                   </p>
                   
                   <div className="flex items-center gap-3">
                     <button className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1">
                        Lihat Analisis <ExternalLink className="w-3 h-3" />
                     </button>
                     <button 
                        onClick={() => setDeleteId(location.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1"
                     >
                        Hapus <Trash2 className="w-3 h-3" />
                     </button>
                   </div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-panel rounded-xl border-dashed border-2 border-gray-300/50 bg-slate-50/50">
           <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
           <p className="text-gray-600 font-medium">Belum ada lokasi yang ditambahkan.</p>
           <p className="text-sm text-gray-400 mb-4">Mulai analisis lokasi baru atau tambahkan lokasi manual.</p>
           <button
             onClick={() => setIsModalOpen(true)}
             className="text-brand-primary hover:underline text-sm font-semibold"
           >
             + Tambah Lokasi Manual
           </button>
        </div>
      )}

      {/* Map Picker Modal */}
      <LocationPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(data) => {
            onAddLocation(data);
            setIsModalOpen(false);
        }}
      />
      
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
            if (deleteId) onRemoveLocation(deleteId);
        }}
        title="Hapus Lokasi?"
        message="Apakah Anda yakin ingin menghapus lokasi ini? Data analisis yang terkait juga akan dihapus permanen."
        confirmText="Hapus Lokasi"
        isDanger={true}
      />
    </div>
  );
};
