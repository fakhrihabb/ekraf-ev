'use client';

import { Box, Map } from 'lucide-react';

interface View3DToggleProps {
    is3DMode: boolean;
    onToggle: () => void;
}

export default function View3DToggle({ is3DMode, onToggle }: View3DToggleProps) {
    return (
        <button
            onClick={onToggle}
            className="absolute top-4 left-4 z-10 glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all shadow-md hover:shadow-lg group"
            title={is3DMode ? 'Kembali ke 2D' : 'Lihat 3D'}
        >
            {is3DMode ? (
                <>
                    <Map className="w-5 h-5 text-[var(--color-light-blue)]" />
                    <span className="text-sm font-medium text-gray-700">2D</span>
                </>
            ) : (
                <>
                    <Box className="w-5 h-5 text-[var(--color-light-blue)]" />
                    <span className="text-sm font-medium text-gray-700">3D</span>
                </>
            )}
        </button>
    );
}
