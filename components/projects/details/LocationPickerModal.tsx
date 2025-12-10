"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { X, MapPin, Loader2, Globe } from "lucide-react";
import { Location } from "@/app/lib/types";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.5rem",
};

// Default center (Jakarta)
const defaultCenter = {
  lat: -6.2088,
  lng: 106.8456,
};

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = ["places"];

// Extracted Map Component to control API loading
const ActiveMap = ({ 
  onMapClick, 
  onLoad, 
  onUnmount, 
  selectedPos 
}: { 
  onMapClick: (e: google.maps.MapMouseEvent) => void;
  onLoad: (map: google.maps.Map) => void;
  onUnmount: (map: google.maps.Map) => void;
  selectedPos: google.maps.LatLngLiteral | null;
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
    libraries,
  });

  if (!isLoaded) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        <span>Memuat Peta Google Maps...</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={11}
      onLoad={onLoad}
      onUnmount={onUnmount}
      onClick={onMapClick}
      options={{
          disableDefaultUI: false,
          streetViewControl: false,
          mapTypeControl: false
      }}
    >
      {selectedPos && (
          <Marker position={selectedPos} animation={google.maps.Animation.DROP} />
      )}
    </GoogleMap>
  );
};

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<Location>) => void;
}

export const LocationPickerModal = ({ isOpen, onClose, onConfirm }: LocationPickerModalProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [selectedPos, setSelectedPos] = useState<google.maps.LatLngLiteral | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  // Dev Mode Optimization
  const isDev = process.env.NODE_ENV === "development";
  const [enableMaps, setEnableMaps] = useState(!isDev);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
        // If in dev mode, always start with maps disabled to be safe/efficient
        if (isDev) setEnableMaps(false);
        setName("");
        setAddress("");
        setSelectedPos(null);
    }
  }, [isOpen, isDev]);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPos({ lat, lng });
      
      setAddress(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  const handleConfirm = () => {
    if (!name || !selectedPos) {
      alert("Mohon isi nama lokasi dan pilih titik di peta.");
      return;
    }

    onConfirm({
      name,
      address,
      latitude: selectedPos.lat,
      longitude: selectedPos.lng,
      suitability_score: undefined 
    });
    
    // Reset fields
    setName("");
    setAddress("");
    setSelectedPos(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-3">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-primary" />
                Pilih Lokasi Manual
             </h2>
             
             {isDev && (
               <button 
                 onClick={() => setEnableMaps(!enableMaps)}
                 className={`
                    px-2 py-1 text-xs font-semibold rounded border transition-colors flex items-center gap-1
                    ${enableMaps 
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" 
                        : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"}
                 `}
                 title="Toggle Google Maps API loading to save quotas"
               >
                 <Globe className="w-3 h-3" />
                 {enableMaps ? "Disable Dev Maps" : "Enable Dev Maps"}
               </button>
             )}
          </div>

          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Nama Lokasi</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: SPKLU Rest Area KM 57"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Alamat / Koordinat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Klik pada peta untuk mengisi otomatis"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all outline-none"
              />
            </div>
          </div>

          {/* Map Area */}
          <div className="relative rounded-xl overflow-hidden border border-gray-300 shadow-inner bg-slate-100 min-h-[400px]">
            {enableMaps ? (
                <ActiveMap 
                    onMapClick={onMapClick}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    selectedPos={selectedPos}
                />
            ) : (
                <div className="h-[400px] flex flex-col items-center justify-center text-gray-400 gap-3 bg-slate-50">
                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-300" />
                   </div>
                   <div className="text-center px-6">
                       <p className="text-gray-600 font-medium">Maps API Disabled in Development</p>
                       <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                         To save Google Cloud quotas, the map is hidden by default. 
                         Click the "Enable Dev Maps" button in the header to load the map.
                       </p>
                   </div>
                   {/* Fallback for manual coordinate entry if needed (Optional) */}
                   <div className="flex gap-2 mt-4">
                     <button 
                       onClick={() => {
                          const mockLat = defaultCenter.lat;
                          const mockLng = defaultCenter.lng;
                          setSelectedPos({ lat: mockLat, lng: mockLng });
                          setAddress(`Lat: ${mockLat}, Lng: ${mockLng} (Mock)`);
                       }}
                       className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
                     >
                        Set Default Location (Mock)
                     </button>
                   </div>
                </div>
            )}
            
            {!selectedPos && enableMaps && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-600 border border-gray-200 pointer-events-none z-10">
                    Klik di peta untuk menandai lokasi
                </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!name || !selectedPos}
            className={`
                px-6 py-2 rounded-lg font-semibold text-white shadow-md transition-all flex items-center gap-2
                ${(!name || !selectedPos) 
                    ? "bg-gray-300 cursor-not-allowed" 
                    : "bg-brand-primary hover:bg-brand-primary/90 active:scale-95"}
            `}
          >
            <MapPin className="w-4 h-4" />
            Simpan Lokasi
          </button>
        </div>
      </div>
    </div>
  );
};
