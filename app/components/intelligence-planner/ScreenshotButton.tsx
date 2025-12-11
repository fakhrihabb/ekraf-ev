'use client';

import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';


interface ScreenshotButtonProps {
    mapContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScreenshotButton({ mapContainerRef }: ScreenshotButtonProps) {
    const [isCapturing, setIsCapturing] = useState(false);

    const handleScreenshot = async () => {
        try {
            setIsCapturing(true);

            // 1. Request screen capture
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: 'browser',
                },
                audio: false,
            });

            // 2. Create a video element to play the stream
            const video = document.createElement('video');
            video.srcObject = stream;
            video.muted = true;
            video.playsInline = true;

            await video.play();

            // 3. Create canvas and draw the video frame
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // Draw the current video frame to canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 4. Stop the stream (stop sharing)
            stream.getTracks().forEach((track) => track.stop());
            video.remove();

            // 5. Convert to blob and download
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `sivana-map-${new Date().toISOString().slice(0, 10)}-${Date.now()}.png`;
                link.click();
                URL.revokeObjectURL(url);
            }, 'image/png');

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
            className="absolute bottom-4 left-28 z-10 glass-panel px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-white/90 transition-all shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
            title="Tangkap Screenshot"
        >
            {isCapturing ? (
                <>
                    <Loader2 className="w-5 h-5 text-[var(--color-light-blue)] animate-spin" />
                    <span className="text-sm font-medium text-gray-700">Merekam...</span>
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
