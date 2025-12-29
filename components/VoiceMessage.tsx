// cita-rd/components/VoiceMessage.tsx
import React, { useState, useEffect } from 'react';
import { Play, Pause, Mic } from 'lucide-react';
import { VoicePlayer, formatDuration } from '../services/voiceMessageService';

interface VoiceMessageProps {
  audioUrl: string;
  duration: number;
  isOwn: boolean;
  timestamp: number;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ 
  audioUrl, 
  duration, 
  isOwn, 
  timestamp 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [player] = useState(() => new VoicePlayer(
    () => setIsPlaying(true),
    () => setIsPlaying(false),
    () => {
      setIsPlaying(false);
      setCurrentTime(0);
    },
    (current, total) => setCurrentTime(current)
  ));

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        player.pause();
      } else {
        await player.play(audioUrl);
      }
    } catch (error) {
      console.error('Error reproduciendo mensaje de voz:', error);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl max-w-xs ${
      isOwn 
        ? 'bg-rose-500 text-white ml-auto' 
        : 'bg-white border border-gray-200 text-gray-800'
    }`}>
      
      {/* Botón play/pause */}
      <button
        onClick={handlePlayPause}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          isOwn 
            ? 'bg-white/20 hover:bg-white/30' 
            : 'bg-rose-100 hover:bg-rose-200'
        }`}
      >
        {isPlaying ? (
          <Pause size={16} className={isOwn ? 'text-white' : 'text-rose-600'} />
        ) : (
          <Play size={16} className={isOwn ? 'text-white' : 'text-rose-600'} />
        )}
      </button>

      {/* Visualización de onda de audio */}
      <div className="flex-1 flex flex-col gap-2">
        
        {/* Barras de audio */}
        <div className="flex items-center gap-1 h-6">
          {Array.from({ length: 20 }).map((_, i) => {
            const barHeight = Math.random() * 16 + 4; // Altura aleatoria entre 4-20px
            const isActive = (i / 20) * 100 <= progress;
            
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isActive 
                    ? isOwn ? 'bg-white' : 'bg-rose-500'
                    : isOwn ? 'bg-white/30' : 'bg-gray-300'
                }`}
                style={{ height: `${barHeight}px` }}
              />
            );
          })}
        </div>

        {/* Duración */}
        <div className="flex justify-between items-center text-xs">
          <span className={isOwn ? 'text-white/80' : 'text-gray-500'}>
            {formatDuration(currentTime)}
          </span>
          <span className={isOwn ? 'text-white/80' : 'text-gray-500'}>
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Icono de micrófono */}
      <Mic size={14} className={isOwn ? 'text-white/60' : 'text-gray-400'} />
    </div>
  );
};

export default VoiceMessage;