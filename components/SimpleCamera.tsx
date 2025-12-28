// cita-rd/components/SimpleCamera.tsx
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface SimpleCameraProps {
  onStreamReady: (stream: MediaStream) => void;
  onVideoReady: () => void;
  onError: (error: string) => void;
}

export interface SimpleCameraRef {
  capturePhoto: () => Promise<Blob | null>;
  stopCamera: () => void;
}

const SimpleCamera = forwardRef<SimpleCameraRef, SimpleCameraProps>(({ onStreamReady, onVideoReady, onError }, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(ref, () => ({
    capturePhoto: async (): Promise<Blob | null> => {
      return new Promise((resolve) => {
        if (!videoRef.current || !canvasRef.current) {
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

        // Configurar canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Dibujar frame actual del video
        context.drawImage(video, 0, 0);

        // Convertir a blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.8);
      });
    },
    
    stopCamera: () => {
      console.log('🛑 SimpleCamera - Deteniendo cámara...');
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
      console.log('✅ SimpleCamera - Cámara detenida completamente');
    }
  }));

  const startCamera = async () => {
    try {
      console.log('🎥 SimpleCamera - Solicitando acceso a cámara...');
      
      // Exactamente como test-camera.html
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      console.log('✅ SimpleCamera - Stream obtenido:', stream.active);
      console.log('📹 SimpleCamera - Tracks:', stream.getTracks().length);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('📊 SimpleCamera - Video metadata cargada');
          console.log('📐 SimpleCamera - Dimensiones:', videoRef.current?.videoWidth + 'x' + videoRef.current?.videoHeight);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('▶️ SimpleCamera - Video listo para reproducir');
          setIsReady(true);
          onVideoReady();
        };
        
        videoRef.current.onerror = (error) => {
          console.error('❌ SimpleCamera - Error en video:', error);
          onError('Error en elemento de video');
        };
      }
      
      // Guardar referencia del stream para poder detenerlo después
      streamRef.current = stream;
      onStreamReady(stream);
      
    } catch (error) {
      console.error('❌ SimpleCamera - Error:', error);
      onError((error as Error).message);
    }
  };

  useEffect(() => {
    startCamera();
    
    // Limpieza automática cuando el componente se desmonta
    return () => {
      console.log('🧹 SimpleCamera - Limpieza automática al desmontar');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log('🔴 Track detenido en cleanup:', track.kind);
        });
      }
    };
  }, []);

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-64 object-cover rounded-xl bg-black"
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

SimpleCamera.displayName = 'SimpleCamera';

export default SimpleCamera;