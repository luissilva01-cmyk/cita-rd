// cita-rd/components/ManualCamera.tsx
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface ManualCameraProps {
  onStreamReady?: (stream: MediaStream) => void;
  onVideoReady?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export interface ManualCameraRef {
  startCamera: () => Promise<void>;
  capturePhoto: () => Promise<Blob | null>;
  stopCamera: () => void;
  isActive: () => boolean;
}

const ManualCamera = forwardRef<ManualCameraRef, ManualCameraProps>(({ 
  onStreamReady, 
  onVideoReady, 
  onError,
  className = "w-full h-64 object-cover rounded-xl bg-black"
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useImperativeHandle(ref, () => ({
    startCamera: async (): Promise<void> => {
      try {
        console.log('🎥 ManualCamera - Iniciando cámara manualmente...');
        
        // Limpiar stream anterior si existe
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        });
        
        console.log('✅ ManualCamera - Stream obtenido:', stream.active);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('📊 ManualCamera - Video metadata cargada');
          };
          
          videoRef.current.oncanplay = () => {
            console.log('▶️ ManualCamera - Video listo');
            setIsReady(true);
            setIsActive(true);
            if (onVideoReady) onVideoReady();
          };
          
          videoRef.current.onerror = (error) => {
            console.error('❌ ManualCamera - Error en video:', error);
            if (onError) onError('Error en elemento de video');
          };
          
          // Forzar reproducción
          setTimeout(() => {
            if (videoRef.current && stream.active) {
              videoRef.current.play().catch(console.error);
            }
          }, 100);
        }
        
        streamRef.current = stream;
        if (onStreamReady) onStreamReady(stream);
        
      } catch (error) {
        console.error('❌ ManualCamera - Error:', error);
        if (onError) onError((error as Error).message);
      }
    },

    capturePhoto: async (): Promise<Blob | null> => {
      return new Promise((resolve) => {
        if (!videoRef.current || !canvasRef.current || !isReady) {
          resolve(null);
          return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          resolve(null);
          return;
        }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      });
    },
    
    stopCamera: () => {
      console.log('🛑 ManualCamera - Deteniendo cámara...');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('🔴 Track detenido:', track.kind);
        });
        streamRef.current = null;
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsReady(false);
      setIsActive(false);
      console.log('✅ ManualCamera - Cámara detenida');
    },

    isActive: () => isActive
  }));

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={className}
        style={{ 
          transform: 'scaleX(-1)',
          maxWidth: '100%',
          display: 'block'
        }}
      />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
});

ManualCamera.displayName = 'ManualCamera';

export default ManualCamera;