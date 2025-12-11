import { POIType } from '@/app/types/poi';

/**
 * Get color for candidate marker based on analysis score
 * @param score - Overall analysis score (0-100), undefined if not analyzed
 * @returns Hex color code
 */
export const getCandidateMarkerColor = (score?: number): string => {
  // Brown/default for unanalyzed
  if (score === undefined) {
    return '#8B4513'; // Brown
  }

  // Beautiful gradient: Red (#EF4444) → Yellow (#FBBF24) → Teal Green (#10B981)
  if (score <= 50) {
    // Red to Yellow (0-50)
    const ratio = score / 50;
    // Start: #EF4444 (239, 68, 68) → End: #FBBF24 (251, 191, 36)
    const r = Math.round(239 + (251 - 239) * ratio);
    const g = Math.round(68 + (191 - 68) * ratio);
    const b = Math.round(68 + (36 - 68) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Yellow to Teal Green (50-100)
    const ratio = (score - 50) / 50;
    // Start: #FBBF24 (251, 191, 36) → End: #10B981 (16, 185, 129)
    const r = Math.round(251 + (16 - 251) * ratio);
    const g = Math.round(191 + (185 - 191) * ratio);
    const b = Math.round(36 + (129 - 36) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

/**
 * Generate custom marker icons for different station types
 */
export const getMarkerIcon = (
  type: 'SPKLU' | 'SPBKLU' | 'CANDIDATE',
  score?: number // For candidates only
): google.maps.Icon => {
  const colors = {
    SPKLU: '#0EA5E9', // Blue (brand color)
    SPBKLU: '#10B981', // Green
    CANDIDATE: getCandidateMarkerColor(score), // Dynamic based on score
  };

  const color = colors[type];

  // SVG marker with pin shape
  const svg = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z" 
            fill="${color}" 
            stroke="white" 
            stroke-width="2"/>
      <circle cx="16" cy="16" r="6" fill="white"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(32, 42),
    anchor: new google.maps.Point(16, 42),
  };
};

/**
 * Generate POI marker icon with custom color
 */
export const getPOIMarkerIcon = (color: string): google.maps.Icon => {
  // Smaller circular marker for POIs
  const svg = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(24, 24),
    anchor: new google.maps.Point(12, 12),
  };
};
