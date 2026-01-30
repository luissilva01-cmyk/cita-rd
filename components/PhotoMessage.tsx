// cita-rd/components/PhotoMessage.tsx
import React, { useState } from 'react';
import { Download, X } from 'lucide-react';

interface PhotoMessageProps {
  photoUrl: string;
  isOwn: boolean;
  timestamp: number;
  caption?: string;
}

const PhotoMessage: React.FC<PhotoMessageProps> = ({ 
  photoUrl, 
  isOwn, 
  timestamp,
  caption 
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDownload = () => {
    // Crear un link temporal para descargar
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = `photo_${timestamp}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-DO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (imageError) {
    return (
      <div 
        className={`max-w-[85%] sm:max-w-[300px] ${
          isOwn ? 'ml-auto' : 'mr-auto'
        }`}
      >
        <div className={`p-4 rounded-2xl ${
          isOwn 
            ? 'bg-rose-500 text-white rounded-tr-none' 
            : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
        }`}>
          <p className="text-sm">❌ Error cargando imagen</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`max-w-[85%] sm:max-w-[300px] ${
          isOwn ? 'ml-auto' : 'mr-auto'
        }`}
      >
        <div 
          className={`rounded-2xl overflow-hidden shadow-md ${
            isOwn 
              ? 'bg-rose-500 rounded-tr-none' 
              : 'bg-white rounded-tl-none border border-slate-200'
          }`}
        >
          {/* Imagen */}
          <div 
            className="relative cursor-pointer group"
            onClick={() => setIsFullScreen(true)}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                <div className="w-8 h-8 border-4 border-slate-300 border-t-rose-500 rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={photoUrl}
              alt="Foto enviada"
              className={`w-full h-auto object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              style={{ maxHeight: '400px' }}
            />
            
            {/* Overlay al hacer hover */}
            {imageLoaded && (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">
                    Ver imagen
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Caption (si existe) */}
          {caption && (
            <div className={`px-3 py-2 ${
              isOwn ? 'text-white' : 'text-slate-700'
            }`}>
              <p className="text-sm">{caption}</p>
            </div>
          )}

          {/* Timestamp y botón de descarga */}
          <div className={`px-3 py-2 flex items-center justify-between ${
            isOwn ? 'text-white/70' : 'text-slate-400'
          }`}>
            <span className="text-xs">{formatTime(timestamp)}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isOwn 
                  ? 'hover:bg-white/20' 
                  : 'hover:bg-slate-100'
              }`}
              title="Descargar imagen"
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal de pantalla completa */}
      {isFullScreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsFullScreen(false)}
        >
          {/* Botón de cerrar */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Botón de descargar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="absolute top-4 left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10 flex items-center gap-2"
          >
            <Download size={20} />
            <span className="text-sm font-medium hidden sm:inline">Descargar</span>
          </button>

          {/* Imagen en pantalla completa */}
          <img
            src={photoUrl}
            alt="Foto en pantalla completa"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Caption en pantalla completa */}
          {caption && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-3">
              <p className="text-white text-center">{caption}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PhotoMessage;
