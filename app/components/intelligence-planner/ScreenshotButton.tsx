'use client';

import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';

interface ScreenshotButtonProps {
    mapContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScreenshotButton({ mapContainerRef }: ScreenshotButtonProps) {
    const [isCapturing, setIsCapturing] = useState(false);

    const handleScreenshot = async () => {
        if (!mapContainerRef.current) return;

        try {
            setIsCapturing(true);

            // Wait a bit for any animations to complete
            await new Promise((resolve) => setTimeout(resolve, 300));

            const canvas = await html2canvas(mapContainerRef.current, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 2, // Higher quality
            });

            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `sivana-map-${new Date().toISOString().slice(0, 10)}-${Date.now()}.png`;
                link.click();
                URL.revokeObjectURL(url);
            });

            setIsCapturing(false);
        } catch (error) {
            console.error('Screenshot failed:', error);
            setIsCapturing(false);
        }
    };

    return (
        <button
            onClick={handleScreenshot}
            disabled={isCapturing}
            className="absolute top-4 left-28 z-10 glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Tangkap Screenshot"
        >
            {isCapturing ? (
                <>
                    <Loader2 className="w-5 h-5 text-[var(--color-light-blue)] animate-spin" />
                    <span className="text-sm font-medium text-gray-700">Memproses...</span>
                </>
            ) : (
                <>
                    <Camera className="w-5 h-5 text-[var(--color-light-blue)]" />
                    <span className="text-sm font-medium text-gray-700">Screenshot</span>
                </>
            )}
        </button>
    );
}
