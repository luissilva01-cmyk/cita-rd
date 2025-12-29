// cita-rd/components/CallInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneOff, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Volume2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Call } from '../types';
import { callManager, updateCallStatus } from '../services/callService';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Contador de duración
  useEffect(() => {
    if (call?.status === 'active') {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setDuration(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [call?.status]);

  // Configurar video local
  useEffect(() => {
    if (call?.type === 'video' && localVideoRef.current) {
      const stream = callManager.getLocalStream();
      if (stream) {
        localVideoRef.current.srcObject = stream;
      }
    }
  }, [call, localVideoRef.current]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleMute = async () => {
    const newMutedState = await callManager.toggleMicrophone();
    setIsMuted(!newMutedState);
  };

  const handleToggleCamera = async () => {
    const newCameraState = await callManager.toggleCamera();
    setIsCameraOff(!newCameraState);
  };

  const handleEndCall = () => {
    callManager.endCall();
    onEnd?.();
  };

  const handleAnswerCall = () => {
    if (call) {
      callManager.answerCall(call);
      onAnswer?.();
    }
  };

  const handleDeclineCall = () => {
    if (call) {
      callManager.declineCall(call);
      onDecline?.();
    }
  };

  if (!call) return null;

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

        {/* Animación de llamada */}
        <div className="flex space-x-4 mb-12">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white/60 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-8">
          <button
            onClick={handleDeclineCall}
            className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <PhoneOff size={24} />
          </button>
          
          <button
            onClick={handleAnswerCall}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          >
            <Phone size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Llamada activa
  if (call.status === 'active') {
    return (
      <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isMinimized ? 'bottom-20 right-4 w-48 h-64 rounded-2xl' : ''}`}>
        
        {/* Video container */}
        {call.type === 'video' && (
          <div className="flex-1 relative">
            {/* Video remoto (pantalla completa) */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-900"
            />
            
            {/* Video local (esquina) */}
            <div className="absolute top-4 right-4 w-24 h-32 bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* Información de llamada */}
            <div className="absolute top-4 left-4 text-white">
              <p className="font-semibold">{otherUserName}</p>
              <p className="text-sm opacity-80">{formatDuration(duration)}</p>
            </div>

            {/* Botón minimizar */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="absolute top-4 right-32 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white"
            >
              {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </button>
          </div>
        )}

        {/* Solo audio */}
        {call.type === 'voice' && (
          <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-white">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white/20">
              <img 
                src={otherUserImage || 'https://picsum.photos/200'} 
                alt={otherUserName}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2">{otherUserName}</h2>
            <p className="text-white/80 mb-4">{formatDuration(duration)}</p>
            
            {/* Visualizador de audio */}
            <div className="flex space-x-1 mb-8">
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

        {/* Controles de llamada */}
        <div className="bg-black/80 p-6 flex justify-center space-x-6">
          
          {/* Silenciar */}
          <button
            onClick={handleToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-500' : 'bg-white/20'
            }`}
          >
            {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-white" />}
          </button>

          {/* Cámara (solo video) */}
          {call.type === 'video' && (
            <button
              onClick={handleToggleCamera}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isCameraOff ? 'bg-red-500' : 'bg-white/20'
              }`}
            >
              {isCameraOff ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
            </button>
          )}

          {/* Altavoz */}
          <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Volume2 size={20} className="text-white" />
          </button>

          {/* Colgar */}
          <button
            onClick={handleEndCall}
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <PhoneOff size={20} className="text-white" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CallInterface;