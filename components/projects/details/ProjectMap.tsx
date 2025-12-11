
"use client";

import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { useGoogleMaps } from '@/app/components/GoogleMapsProvider';
import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { Location } from '@/app/lib/types';
import { getMarkerIcon } from '@/app/utils/markerIcons';

interface ProjectMapProps {
  locations: Location[];
  onLocationSelect?: (locationId: string) => void;
  selectedLocationId?: string | null;
}

export const ProjectMap = ({ locations, onLocationSelect, selectedLocationId }: ProjectMapProps) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);


  // Use shared Google Maps loader from provider
  const { isLoaded, loadError } = useGoogleMaps();


  // Center on last added location, or default to Jakarta if no locations
  const defaultCenter = useMemo(() => {
    if (locations.length === 0) {
      return { lat: -6.2088, lng: 106.8456 }; // Jakarta default
    }

    // Find the most recently added location (last in the array or by created_at)
    const lastLocation = locations[locations.length - 1];

    if (lastLocation.latitude && lastLocation.longitude) {
      return { lat: lastLocation.latitude, lng: lastLocation.longitude };
    }

    return { lat: -6.2088, lng: 106.8456 }; // Fallback to Jakarta
  }, [locations]);

  // Fit bounds when locations change
  useEffect(() => {
    if (mapRef.current && locations.length > 0 && !selectedLocationId) {
      const bounds = new google.maps.LatLngBounds();
      let hasValidLoc = false;
      locations.forEach(loc => {
        if (loc.latitude && loc.longitude) {
          bounds.extend({ lat: loc.latitude, lng: loc.longitude });
          hasValidLoc = true;
        }
      });
      if (hasValidLoc) {
        mapRef.current.fitBounds(bounds, 50); // 50px padding
      }
    }
  }, [locations, isLoaded, selectedLocationId]);

  // Pan to selected location
  // Pan to selected location
  useEffect(() => {
    if (mapRef.current && selectedLocationId) {
      const selectedLoc = locations.find(l => l.id === selectedLocationId);
      if (selectedLoc && selectedLoc.latitude && selectedLoc.longitude) {
        mapRef.current.panTo({ lat: selectedLoc.latitude, lng: selectedLoc.longitude });
        mapRef.current.setZoom(15);
        setActiveMarker(selectedLocationId);
      }
    }
  }, [selectedLocationId, locations]);

  const handleMarkerClick = (location: Location) => {
    setActiveMarker(location.id);
    if (onLocationSelect) onLocationSelect(location.id);
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  // Calculate initial zoom level based on locations
  const initialZoom = useMemo(() => {
    // If we have locations and are centering on the last one, zoom in closer
    if (locations.length > 0 && locations[locations.length - 1].latitude) {
      return 14; // Closer zoom for single location
    }
    return 11; // Default zoom for Jakarta or when showing all
  }, [locations]);

  if (loadError) return <div className="h-full bg-gray-100 flex items-center justify-center text-red-500">Error Loading Map</div>;
  if (!isLoaded) return <div className="h-full bg-gray-100 flex items-center justify-center text-gray-500">Memuat Peta...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
      center={defaultCenter}
      zoom={initialZoom}
      onLoad={onLoad}
      options={{
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {locations.map((loc) => (
        loc.latitude && loc.longitude && (
          <Marker
            key={loc.id}
            position={{ lat: loc.latitude, lng: loc.longitude }}
            icon={getMarkerIcon('CANDIDATE')}
            onClick={() => handleMarkerClick(loc)}
          />
        )
      ))}

      {activeMarker && (
        (() => {
          const loc = locations.find(l => l.id === activeMarker);
          if (!loc || !loc.latitude || !loc.longitude) return null;
          return (
            <InfoWindow
              position={{ lat: loc.latitude, lng: loc.longitude }}
              onCloseClick={() => {
                setActiveMarker(null);
                if (onLocationSelect) onLocationSelect(""); // Clear selection
              }}
              options={{
                pixelOffset: new google.maps.Size(0, -42) // Offset to match marker height
              }}
            >
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-gray-900 mb-1">{loc.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{loc.address}</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                    Score: {loc.suitability_score || 'N/A'}
                  </span>
                </div>
              </div>
            </InfoWindow>
          );
        })()
      )}
    </GoogleMap>
  );
};
