/**
 * Generate custom marker icons for different station types
 */
export const getMarkerIcon = (
    type: 'SPKLU' | 'SPBKLU' | 'CANDIDATE'
): google.maps.Icon => {
    const colors = {
        SPKLU: '#0EA5E9', // Blue (brand color)
        SPBKLU: '#10B981', // Green
        CANDIDATE: '#F97316', // Orange
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
