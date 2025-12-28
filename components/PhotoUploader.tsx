import React, { useState, useRef } from 'react';
import { Camera, Plus, X, Upload, AlertCircle, BarChart3 } from 'lucide-react';
import { uploadPhoto, resizeImage, updateUserPhotos, deletePhoto } from '../services/photoUploadService';
import PhotoAnalysisCard from './PhotoAnalysisCard';

interface PhotoUploaderProps {
  userId: string;
  currentPhotos: string[];
  onPhotosUpdate: (photos: string[]) => void;
  maxPhotos?: number;
  showAnalysis?: boolean;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  userId,
  currentPhotos,
  onPhotosUpdate,
  maxPhotos = 6,
  showAnalysis = true
}) => {
  const [uploading, setUploading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(index);

    try {
      // Redimensionar imagen antes de subir
      console.log('🔄 Redimensionando imagen...');
      const resizedFile = await resizeImage(file, 800, 1200, 0.8);
      
      // Subir foto
      console.log('📤 Subiendo foto...');
      const result = await uploadPhoto(resizedFile, userId, index);
      
      if (result.success && result.url) {
        // Actualizar array de fotos
        const newPhotos = [...currentPhotos];
        newPhotos[index] = result.url;
        
        // Actualizar en Firestore
        const updateSuccess = await updateUserPhotos(userId, newPhotos);
        
        if (updateSuccess) {
          onPhotosUpdate(newPhotos);
          console.log('✅ Foto subida y perfil actualizado');
        } else {
          setError('Error actualizando el perfil');
        }
      } else {
        setError(result.error || 'Error subiendo la foto');
      }
    } catch (error) {
      console.error('❌ Error en el proceso de subida:', error);
      setError('Error inesperado subiendo la foto');
    } finally {
      setUploading(null);
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeletePhoto = async (index: number) => {
    const photoUrl = currentPhotos[index];
    if (!photoUrl) return;

    setError(null);
    
    try {
      // Eliminar de Firebase Storage
      await deletePhoto(photoUrl);
      
      // Actualizar array de fotos
      const newPhotos = [...currentPhotos];
      newPhotos[index] = '';
      
      // Actualizar en Firestore
      const updateSuccess = await updateUserPhotos(userId, newPhotos.filter(p => p));
      
      if (updateSuccess) {
        onPhotosUpdate(newPhotos.filter(p => p));
        console.log('✅ Foto eliminada');
      } else {
        setError('Error actualizando el perfil');
      }
    } catch (error) {
      console.error('❌ Error eliminando foto:', error);
      setError('Error eliminando la foto');
    }
  };

  const openFileDialog = (index: number) => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = (e) => handleFileSelect(e as any, index);
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Photos grid */}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: maxPhotos }).map((_, index) => {
          const hasPhoto = currentPhotos[index];
          const isUploading = uploading === index;

          return (
            <div
              key={index}
              className="aspect-3/4 bg-gray-100 rounded-lg overflow-hidden relative group"
            >
              {hasPhoto ? (
                <>
                  {/* Existing photo with analysis */}
                  {showAnalysis ? (
                    <PhotoAnalysisCard
                      photoUrl={hasPhoto}
                      photoIndex={index}
                      isMainPhoto={index === 0}
                    />
                  ) : (
                    <img
                      src={hasPhoto}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  {/* Delete button */}
                  <button
                    onClick={() => handleDeletePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X size={12} />
                  </button>
                  
                  {/* Replace button */}
                  {!showAnalysis && (
                    <button
                      onClick={() => openFileDialog(index)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="text-white" size={24} />
                    </button>
                  )}
                </>
              ) : (
                <>
                  {/* Upload placeholder */}
                  <button
                    onClick={() => openFileDialog(index)}
                    disabled={isUploading}
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mb-2"></div>
                        <span className="text-xs">Subiendo...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={24} className="mb-2" />
                        <span className="text-xs text-center">
                          {index === 0 ? 'Foto principal' : `Foto ${index + 1}`}
                        </span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2 text-blue-700">
          <Upload size={16} className="mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium mb-1">Consejos para mejores fotos:</p>
            <ul className="text-xs space-y-1 text-blue-600">
              <li>• Usa fotos claras y bien iluminadas</li>
              <li>• Incluye al menos una foto de cara completa</li>
              <li>• Máximo 5MB por foto</li>
              <li>• Se recomienda subir 3-6 fotos</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default PhotoUploader;