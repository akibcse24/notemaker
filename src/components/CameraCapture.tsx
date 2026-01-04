import React, { useRef, useState, useCallback } from 'react';
import { Camera } from 'lucide-react';
import { Button } from './Button';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            onCapture(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.9);
      }
    }
  }, [onCapture, stream]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => stopCamera();
  }, []);

  if (error) {
    return (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
            <p>{error}</p>
            <Button variant="ghost" onClick={startCamera} className="mt-2 text-red-700">Try Again</Button>
        </div>
    )
  }

  if (!stream) {
    return (
      <Button onClick={startCamera} variant="outline" className="w-full py-8 flex-col gap-2 h-auto border-dashed">
        <Camera className="w-8 h-8 text-slate-400" />
        <span>Take a Photo</span>
      </Button>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <Button onClick={stopCamera} variant="secondary" size="sm">Cancel</Button>
        <button
            onClick={capturePhoto}
            className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 shadow-lg hover:scale-105 transition-transform"
        />
      </div>
    </div>
  );
};
