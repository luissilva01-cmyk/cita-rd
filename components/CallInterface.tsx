// cita-rd/components/CallInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Call } from '../types';

interface CallInterfaceProps {
  call: Call | null;
  isIncoming?: boolean;
  onAnswer?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
  otherUserName?: string;
  otherUserImage?: string;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
  call,
  isIncoming = false,
  onAnswer,
  onDecline,
  onEnd,
  otherUserName = 'Usuario',
  otherUserImage
}) => {
  const [duration, setDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Contador de duración
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (call?.status === 'active') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [call?.status]);

  // Activar cámara cuando la llamada esté activa
  useEffect(() => {
    const startCamera = async () => {
      if (call?.status === 'active' && call.type === 'video') {
        try {
          console.log('📹 Activando cámara para videollamada...');
          console.log('📹 Estado actual:', { call, localStream });
          
          // Si ya tenemos un stream, no crear otro
          if (localStream) {
            console.log('📹 Stream ya existe, reutilizando');
            if (localVideoRef.current && !localVideoRef.current.srcObject) {
              localVideoRef.current.srcObject = localStream;
              console.log('📹 Stream reasignado al video element');
            }
            return;
          }
          
          const constraints = {
            audio: true,
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user'
            }
          };

          console.log('📹 Solicitando permisos de cámara...');
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          console.log('📹 Stream de cámara obtenido:', stream);
          console.log('📹 Video tracks:', stream.getVideoTracks());
          console.log('📹 Audio tracks:', stream.getAudioTracks());
          
          setLocalStream(stream);
          
          // Asignar stream al video element inmediatamente
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            console.log('📹 Stream asignado al video element');
            
            // Forzar reproducción
            try {
              await localVideoRef.current.play();
              console.log('📹 Video iniciado correctamente');
            } catch (playError) {
              console.warn('📹 Error iniciando video (puede ser normal):', playError);
            }
          }
          
        } catch (error) {
          console.error('❌ Error activando cámara:', error);
          
          // Mostrar error más específico
          let errorMessage = 'Error desconocido';
          if (error instanceof Error) {
            if (error.name === 'NotAllowedError') {
              errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara.';
            } else if (error.name === 'NotFoundError') {
              errorMessage = 'No se encontró cámara disponible.';
            } else if (error.name === 'NotReadableError') {
              errorMessage = 'La cámara está siendo usada por otra aplicación.';
            } else {
              errorMessage = error.message;
            }
          }
          
          console.error('Error activando cámara:', errorMessage);
        }
      }
    };

    startCamera();

    // Cleanup: detener stream cuando el componente se desmonte o la llamada termine
    return () => {
      if (localStream && call?.status !== 'active') {
        console.log('📹 Limpiando stream de cámara...');
        localStream.getTracks().forEach(track => {
          track.stop();
          console.log('📹 Track detenido:', track.kind);
        });
        setLocalStream(null);
      }
    };
  }, [call?.status, call?.type]);

  // Asignar stream al video ref cuando esté disponible
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log('📹 Stream asignado al video ref');
    }
  }, [localStream]);

  // Efecto para manejar cambios en el estado de la cámara
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        // Escuchar cambios en el track
        const handleTrackChange = () => {
          console.log('📹 Track cambió, estado:', videoTrack.enabled);
          
          if (videoTrack.enabled && localVideoRef.current) {
            // Cuando se reactiva, forzar reproducción
            localVideoRef.current.play().catch(e => 
              console.warn('📹 Error reproduciendo video:', e)
            );
          }
        };
        
        // Agregar listener si está disponible
        if ('addEventListener' in videoTrack) {
          videoTrack.addEventListener('unmute', handleTrackChange);
          videoTrack.addEventListener('mute', handleTrackChange);
        }
        
        return () => {
          if ('removeEventListener' in videoTrack) {
            videoTrack.removeEventListener('unmute', handleTrackChange);
            videoTrack.removeEventListener('mute', handleTrackChange);
          }
        };
      }
    }
  }, [localStream, isCameraOn]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    // Detener todos los tracks antes de terminar
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    onEnd?.();
  };

  const handleToggleCamera = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOn(videoTrack.enabled);
        console.log('📹 Cámara:', videoTrack.enabled ? 'activada' : 'desactivada');
        
        // Forzar actualización del video element cuando se reactiva
        if (videoTrack.enabled && localVideoRef.current) {
          console.log('📹 Forzando actualización del video element...');
          
          // Método 1: Reasignar el stream
          const currentStream = localVideoRef.current.srcObject;
          localVideoRef.current.srcObject = null;
          
          setTimeout(() => {
            if (localVideoRef.current && currentStream) {
              localVideoRef.current.srcObject = currentStream;
              localVideoRef.current.play().catch(e => 
                console.warn('📹 Error reproduciendo video:', e)
              );
              console.log('📹 ✅ Video element actualizado');
            }
          }, 100);
        }
      }
    }
  };

  const handleToggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
        console.log('🎤 Micrófono:', audioTrack.enabled ? 'activado' : 'desactivado');
      }
    }
  };

  const handleAnswerCall = () => {
    onAnswer?.();
  };

  const handleDeclineCall = () => {
    onDecline?.();
  };

  if (!call) return null;

  console.log('🎬 CallInterface render:', { call, isIncoming, localStream });

  // Llamada entrante
  if (isIncoming && call.status === 'ringing') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-rose-500 to-pink-600 z-50 flex flex-col items-center justify-center text-white">
        
        {/* Avatar y nombre */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 mx-auto border-4 border-white/30">
            <img 
              src={otherUserImage || 'https://picsum.photos/200'} 
              alt={otherUserName}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold mb-2">{otherUserName}</h2>
          <p className="text-white/80">
            {call.type === 'video' ? 'Videollamada entrante...' : 'Llamada entrante...'}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-8">
          <button
            onClick={handleDeclineCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors text-2xl"
          >
            ❌
          </button>
          
          <button
            onClick={handleAnswerCall}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors text-2xl"
          >
            ✅
          </button>
        </div>
      </div>
    );
  }

  // Llamada activa
  if (call.status === 'active') {
    console.log('🎬 Renderizando llamada activa:', call);
    
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        
        {/* Header con información */}
        <div className="bg-black/80 text-white p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">
              {call.type === 'video' ? '📹 Videollamada' : '📞 Llamada'}
            </h2>
            <p className="text-sm opacity-80">Con: {otherUserName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Duración</p>
            <p className="font-mono text-lg">{formatDuration(duration)}</p>
          </div>
        </div>

        {/* Video container */}
        {call.type === 'video' && (
          <div className="flex-1 relative bg-gray-900">
            
            {/* Video remoto simulado (pantalla completa) */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl bg-gradient-to-br from-gray-700 to-gray-900">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gray-600 mb-4 mx-auto flex items-center justify-center text-4xl">
                  👤
                </div>
                <p>{otherUserName}</p>
                <p className="text-sm opacity-60">Video remoto</p>
              </div>
            </div>
            
            {/* Video local (esquina) - CÁMARA REAL */}
            <div className="absolute top-4 right-4 w-32 h-40 bg-black rounded-lg overflow-hidden border-2 border-white/30">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  isCameraOn ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: 'scaleX(-1)' }} // Efecto espejo para video local
                onLoadedMetadata={() => console.log('📹 Video metadata cargada')}
                onCanPlay={() => console.log('📹 Video listo para reproducir')}
                onError={(e) => console.error('📹 Error en video element:', e)}
              />
              
              {/* Overlay cuando la cámara está desactivada */}
              {!isCameraOn && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-white">
                  <div className="text-center">
                    <span className="text-3xl mb-2 block">📷</span>
                    <span className="text-xs">Cámara desactivada</span>
                  </div>
                </div>
              )}
              
              {/* Indicador de estado */}
              <div className="absolute bottom-1 left-1 text-xs text-white bg-black/50 px-1 rounded">
                Tú
              </div>
              
              {/* Debug info */}
              <div className="absolute top-1 left-1 text-xs text-white bg-black/70 px-1 rounded">
                {localStream ? (isCameraOn ? '🟢' : '🟡') : '🔴'}
              </div>
            </div>
          </div>
        )}

        {/* Solo audio */}
        {call.type === 'voice' && (
          <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white">
            <div className="w-32 h-32 rounded-full bg-gray-600 mb-6 flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-2xl font-bold mb-2">{otherUserName}</h2>
            <p className="text-white/80 mb-4">{formatDuration(duration)}</p>
            
            {/* Visualizador de audio */}
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-white/60 rounded-full animate-pulse"
                  style={{ 
                    height: `${Math.random() * 20 + 10}px`,
                    animationDelay: `${i * 0.1}s` 
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Controles */}
        <div className="bg-black/90 p-6 flex justify-center space-x-4">
          
          {/* Micrófono */}
          <button
            onClick={handleToggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-xl ${
              isMicOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {isMicOn ? '🎤' : '🔇'}
          </button>

          {/* Cámara (solo video) */}
          {call.type === 'video' && (
            <button
              onClick={handleToggleCamera}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors text-xl ${
                isCameraOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isCameraOn ? '📹' : '📷'}
            </button>
          )}

          {/* Colgar */}
          <button
            onClick={handleEndCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors text-white text-2xl"
          >
            📞
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CallInterface;