// cita-rd/components/PhotoPreviewModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

type FilterType = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'warm' | 'cool';

interface PhotoData {
  file: File;
  preview: string;
  filtered: string;
  filter: FilterType;
}

interface PhotoPreviewModalProps {
  isOpen: boolean;
  files: File[];
  onClose: () => void;
  onSend: (photos: Array<{ base64: string; caption?: string; filter: FilterType }>) => void;
}

const PhotoPreviewModal: React.FC<PhotoPreviewModalProps> = ({
  isOpen,
  files,
  onClose,
  onSend
}) => {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Filtros disponibles
  const filters: Array<{ id: FilterType; name: string; preview: string }> = [
    { id: 'none', name: 'Original', preview: '🖼️' },
    { id: 'grayscale', name: 'B&N', preview: '⚫' },
    { id: 'sepia', name: 'Sepia', preview: '🟤' },
    { id: 'vintage', name: 'Vintage', preview: '📷' },
    { id: 'warm', name: 'Cálido', preview: '🔥' },
    { id: 'cool', name: 'Frío', preview: '❄️' }
  ];

  // Cargar fotos cuando se abre el modal
  useEffect(() => {
    if (isOpen && files.length > 0) {
      loadPhotos();
    }
  }, [isOpen, files]);

  // Aplicar filtro cuando cambia
  useEffect(() => {
    if (photos.length > 0 && currentIndex < photos.length) {
      applyFilter(currentIndex, selectedFilter);
    }
  }, [selectedFilter, currentIndex]);

  const loadPhotos = async () => {
    const loadedPhotos: PhotoData[] = [];
    
    for (const file of files) {
      const preview = await fileToDataURL(file);
      loadedPhotos.push({
        file,
        preview,
        filtered: preview,
        filter: 'none'
      });
    }
    
    setPhotos(loadedPhotos);
    setCurrentIndex(0);
    setSelectedFilter('none');
    setCaption('');
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const applyFilter = async (index: number, filter: FilterType) => {
    if (!canvasRef.current || !photos[index]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cargar imagen
    const img = new Image();
    img.src = photos[index].preview;
    
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    // Configurar canvas
    canvas.width = img.width;
    canvas.height = img.height;

    // Aplicar filtro
    ctx.filter = getFilterCSS(filter);
    ctx.drawImage(img, 0, 0);

    // Obtener imagen filtrada
    const filtered = canvas.toDataURL('image/jpeg', 0.9);

    // Actualizar foto
    setPhotos(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], filtered, filter };
      return updated;
    });
  };

  const getFilterCSS = (filter: FilterType): string => {
    switch (filter) {
      case 'grayscale':
        return 'grayscale(100%)';
      case 'sepia':
        return 'sepia(100%)';
      case 'vintage':
        return 'sepia(50%) contrast(110%) brightness(110%)';
      case 'warm':
        return 'sepia(30%) saturate(130%) brightness(105%)';
      case 'cool':
        return 'hue-rotate(180deg) saturate(120%)';
      default:
        return 'none';
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) {
        onClose();
      } else if (currentIndex >= updated.length) {
        setCurrentIndex(updated.length - 1);
      }
      return updated;
    });
  };

  const handleSend = async () => {
    if (photos.length === 0) return;

    setIsProcessing(true);

    try {
      // Preparar fotos para enviar
      const photosToSend = photos.map(photo => ({
        base64: photo.filtered,
        caption: currentIndex === 0 ? caption : undefined, // Solo primera foto tiene caption
        filter: photo.filter
      }));

      onSend(photosToSend);
      onClose();
    } catch (error) {
      console.error('Error enviando fotos:', error);
      alert('Error enviando fotos. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
    setSelectedFilter(photos[Math.max(0, currentIndex - 1)]?.filter || 'none');
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(photos.length - 1, prev + 1));
    setSelectedFilter(photos[Math.min(photos.length - 1, currentIndex + 1)]?.filter || 'none');
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Canvas oculto para aplicar filtros */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
          disabled={isProcessing}
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <p className="text-sm font-medium">
            {photos.length > 1 ? `${currentIndex + 1} de ${photos.length}` : 'Vista previa'}
          </p>
        </div>
        <button
          onClick={handleSend}
          disabled={isProcessing}
          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-full font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Enviando...
            </>
          ) : (
            <>
              <Send size={18} />
              Enviar
            </>
          )}
        </button>
      </div>

      {/* Imagen principal */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        {/* Navegación izquierda */}
        {photos.length > 1 && currentIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Imagen */}
        <div className="max-w-2xl max-h-full">
          <img
            src={currentPhoto.filtered}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>

        {/* Navegación derecha */}
        {photos.length > 1 && currentIndex < photos.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Botón eliminar foto */}
        {photos.length > 1 && (
          <button
            onClick={() => handleRemovePhoto(currentIndex)}
            className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
            title="Eliminar foto"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="px-4 py-3 bg-black/50 backdrop-blur-sm">
        <p className="text-white text-xs font-medium mb-2 uppercase tracking-wide">Filtros</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                selectedFilter === filter.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <span className="text-2xl">{filter.preview}</span>
              <span className="text-xs font-medium">{filter.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Miniaturas (si hay múltiples fotos) */}
      {photos.length > 1 && (
        <div className="px-4 py-3 bg-black/50 backdrop-blur-sm">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setSelectedFilter(photo.filter);
                }}
                className={`flex-shrink-0 relative ${
                  index === currentIndex ? 'ring-2 ring-rose-500' : 'opacity-60'
                } rounded-lg overflow-hidden transition-all`}
              >
                <img
                  src={photo.filtered}
                  alt={`Foto ${index + 1}`}
                  className="w-16 h-16 object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 border-2 border-rose-500 rounded-lg"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Caption */}
      <div className="p-4 bg-black/50 backdrop-blur-sm">
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Agregar un comentario..."
          className="w-full bg-white/10 text-white placeholder-white/50 px-4 py-3 rounded-full border border-white/20 focus:border-rose-500 focus:outline-none transition-colors"
          maxLength={200}
        />
        {caption.length > 0 && (
          <p className="text-white/50 text-xs mt-2 text-right">
            {caption.length}/200
          </p>
        )}
      </div>
    </div>
  );
};

export default PhotoPreviewModal;
