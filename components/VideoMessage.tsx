// cita-rd/components/VideoMessage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Video as VideoIcon, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoMessageProps {
  videoUrl: string;
  duration?: number;
  isOwn: boolean;
  timestamp?: number;
}

const VideoMessage: React.FC<VideoMessageProps> = ({
  videoUrl,
  duration,
  isOwn,
  timestamp
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log('📹 VideoMessage montado:', {
      videoUrl,
      duration,
      isOwn,
      timestamp
    });
  }, [videoUrl, duration, isOwn, timestamp]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error('❌ Error reproduciendo video:', e);
        });
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const handleLoadedMetadata = () => {
    console.log('✅ Video metadata cargada:', {
      duration: videoRef.current?.duration,
      width: videoRef.current?.videoWidth,
      height: videoRef.current?.videoHeight,
      url: videoUrl
    });
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Error cargando video:', {
      error: e,
      url: videoUrl,
      videoElement: videoRef.current
    });
    setHasError(true);
    setIsLoading(false);
  };

  const handleCanPlay = () => {
    console.log('✅ Video listo para reproducir');
    setIsLoading(false);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (hasError) {
    return (
      <div 
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl overflow-hidden shadow-lg ${
          isOwn ? 'rounded-tr-none' : 'rounded-tl-none'
        }`}
      >
        <div className="bg-red-50 border border-red-200 p-4 text-center">
          <VideoIcon className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-red-700 text-sm font-medium">Error cargando video</p>
          <p className="text-red-600 text-xs mt-1">El video no está disponible</p>
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-500 text-xs underline mt-2 inline-block"
          >
            Intentar abrir directamente
          </a>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl overflow-hidden shadow-lg ${
        isOwn ? 'rounded-tr-none' : 'rounded-tl-none'
      }`}
    >
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full max-h-96 object-contain"
          preload="metadata"
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onError={handleError}
          onCanPlay={handleCanPlay}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onClick={handlePlay}
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Cargando video...</p>
            </div>
          </div>
        )}

        {/* Play/Pause overlay */}
        {!isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            onClick={handlePlay}
          >
            <div className="bg-black/50 rounded-full p-4 group-hover:bg-black/70 transition-colors">
              {isPlaying ? (
                <Pause className="text-white" size={32} />
              ) : (
                <Play className="text-white" size={32} />
              )}
            </div>
          </div>
        )}

        {/* Mute button */}
        {!isLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMute();
            }}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="text-white" size={20} />
            ) : (
              <Volume2 className="text-white" size={20} />
            )}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className={`px-3 py-1.5 text-xs flex items-center gap-2 ${
        isOwn 
          ? 'bg-rose-500 text-white' 
          : 'bg-white text-slate-600 border-t border-slate-100'
      }`}>
        <VideoIcon size={14} />
        <span>Videomensaje{duration ? ` • ${formatDuration(duration)}` : ''}</span>
      </div>
    </div>
  );
};

export default VideoMessage;
