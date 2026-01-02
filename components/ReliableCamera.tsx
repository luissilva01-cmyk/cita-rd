// cita-rd/components/ReliableCamera.tsx
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';

interface ReliableCameraProps {
  onStreamReady?: (stream: MediaStream) => void;
  onVideoReady?: () => void;
  onError?: (error: string) => void;
  className?: string;
  autoStart?: boolean;
}

export interface ReliableCameraRef {
  startCamera: () => Promise<void>;
  capturePhoto: () => Promise<Blob | null>;
  stopCamera: () => void;
  isActive: () => boolean;
}

const ReliableCamera = forwardRef<ReliableCameraRef, ReliableCameraProps>(({ 
  onStreamReady, 
  onVideoReady, 
  onError,
  className = "w-full h-64 object-cover rounded-xl bg-black",
  autoStart = false
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);

  // Auto-start effect
  React.useEffect(() => {
    if (autoStart) {
      console.log('🚀 ReliableCamera - Auto-iniciando cámara...');
      startCameraInternal();
    }
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        console.log('🧹 ReliableCamera - Limpiando en unmount');
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [autoStart]);

  const startCameraInternal = async (): Promise<void> => {
      try {
        console.log('🎥 ReliableCamera - Iniciando cámara...');
        console.log('🔍 ReliableCamera - Estado actual isActive:', isActive);
        
        // Limpiar stream anterior
        if (streamRef.current) {
          console.log('🧹 ReliableCamera - Limpiando stream anterior');
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        
        console.log('📋 ReliableCamera - Solicitando acceso a cámara...');
        
        // Verificar si getUserMedia está disponible
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('getUserMedia no está disponible en este navegador');
        }
        
        // Solicitar acceso a cámara con configuración simple
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 640 },
            height: { ideal: 480 }
          } 
        });
        
        console.log('✅ ReliableCamera - Stream obtenido');
        console.log('📊 ReliableCamera - Stream activo:', stream.active);
        console.log('📹 ReliableCamera - Tracks:', stream.getTracks().length);
        
        if (!videoRef.current) {
          throw new Error('Elemento video no está disponible');
        }
        
        const video = videoRef.current;
        console.log('📺 ReliableCamera - Configurando elemento video');
        
        // Configurar srcObject
        video.srcObject = stream;
        
        // Configurar eventos del video
        video.onloadedmetadata = () => {
          console.log('📊 ReliableCamera - Metadata cargada');
          console.log('📐 ReliableCamera - Dimensiones:', video.videoWidth + 'x' + video.videoHeight);
        };
        
        video.oncanplay = () => {
          console.log('▶️ ReliableCamera - Video listo (oncanplay)');
          setIsActive(true);
          if (onVideoReady) {
            console.log('📞 ReliableCamera - Llamando onVideoReady callback');
            onVideoReady();
          }
        };
        
        video.onerror = (error) => {
          console.error('❌ ReliableCamera - Error en video:', error);
          if (onError) onError('Error en elemento de video');
        };
        
        // Intentar reproducir el video
        console.log('🎬 ReliableCamera - Intentando reproducir video...');
        try {
          await video.play();
          console.log('✅ ReliableCamera - Video reproduciendo exitosamente');
        } catch (playError) {
          console.warn('⚠️ ReliableCamera - Error en play (puede ser normal):', playError);
          // Aún así marcar como activo si el stream está funcionando
          if (stream.active) {
            console.log('🔄 ReliableCamera - Marcando como activo a pesar del error de play');
            setTimeout(() => {
              setIsActive(true);
              if (onVideoReady) {
                console.log('📞 ReliableCamera - Llamando onVideoReady callback (timeout)');
                onVideoReady();
              }
            }, 1000);
          }
        }
        
        streamRef.current = stream;
        if (onStreamReady) {
          console.log('📞 ReliableCamera - Llamando onStreamReady callback');
          onStreamReady(stream);
        }
        
        console.log('🎯 ReliableCamera - startCamera completado exitosamente');
        
      } catch (error) {
        console.error('❌ ReliableCamera - Error en startCamera:', error);
        console.error('❌ ReliableCamera - Error type:', typeof error);
        console.error('❌ ReliableCamera - Error name:', (error as Error).name);
        console.error('❌ ReliableCamera - Error message:', (error as Error).message);
        
        setIsActive(false);
        
        let errorMessage = 'Error desconocido';
        if (error instanceof Error) {
          switch (error.name) {
            case 'NotAllowedError':
              errorMessage = 'Acceso a la cámara denegado. Permite el acceso e intenta de nuevo.';
              break;
            case 'NotFoundError':
              errorMessage = 'No se encontró cámara disponible.';
              break;
            case 'NotReadableError':
              errorMessage = 'Cámara en uso por otra aplicación.';
              break;
            default:
              errorMessage = error.message;
          }
        }
        
        if (onError) {
          console.log('📞 ReliableCamera - Llamando onError callback:', errorMessage);
          onError(errorMessage);
        }
        
        throw error;
      }
    };

  useImperativeHandle(ref, () => ({
    startCamera: startCameraInternal,

    capturePhoto: async (): Promise<Blob | null> => {
      return new Promise((resolve) => {
        if (!videoRef.current || !canvasRef.current || !isActive) {
          console.error('❌ ReliableCamera - No se puede capturar: video, canvas o no activo');
          resolve(null);
          return;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        if (!context) {
          console.error('❌ ReliableCamera - No se pudo obtener contexto 2D');
          resolve(null);
          return;
        }

        try {
          // Configurar canvas con las dimensiones del video
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          
          console.log('📸 ReliableCamera - Capturando foto:', canvas.width + 'x' + canvas.height);
          
          // Dibujar frame actual del video
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          // Convertir a blob
          canvas.toBlob((blob) => {
            if (blob) {
              console.log('✅ ReliableCamera - Foto capturada exitosamente');
            } else {
              console.error('❌ ReliableCamera - Error creando blob');
            }
            resolve(blob);
          }, 'image/jpeg', 0.8);
          
        } catch (error) {
          console.error('❌ ReliableCamera - Error en captura:', error);
          resolve(null);
        }
      });
    },
    
    stopCamera: () => {
      console.log('🛑 ReliableCamera - Deteniendo cámara...');
      
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
      
      setIsActive(false);
      console.log('✅ ReliableCamera - Cámara detenida');
    },

    isActive: () => isActive
  }));

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={className}
        style={{ 
          transform: 'scaleX(-1)', // Efecto espejo
          maxWidth: '100%',
          display: 'block'
        }}
      />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Indicador de estado */}
      <div className="absolute top-2 right-2">
        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
      </div>
    </div>
  );
});

ReliableCamera.displayName = 'ReliableCamera';

export default ReliableCamera;