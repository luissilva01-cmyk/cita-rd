import React, { useState, useRef } from 'react';
import { Camera, Plus, X, Upload, AlertCircle, BarChart3 } from 'lucide-react';
import { uploadPhoto, resizeImage, updateUserPhotos, deletePhoto } from '../services/photoUploadService';
import { PhotoInfo, normalizePhotos, extractUrls } from '../types/PhotoInfo';
import PhotoAnalysisCard from './PhotoAnalysisCard';
import { validateProfilePhoto } from '../services/photoValidationService';

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
      
      console.log('📤 Resultado de subida:', { success: result.success, hasUrl: !!result.url, hasFileId: !!result.fileId });
      
      if (result.success && result.url && result.fileId) {
        // VALIDAR LA FOTO SUBIDA
        console.log('🔍 INICIANDO VALIDACIÓN de foto subida...');
        console.log('🔍 URL a validar:', result.url);
        
        try {
          const validation = await validateProfilePhoto(result.url);
          console.log('🔍 Resultado de validación:', validation);
          
          if (!validation.isValid) {
            // Foto no válida - eliminar de ImageKit y mostrar error
            console.log('❌ Foto NO VÁLIDA, eliminando de ImageKit...');
            console.log('❌ Errores:', validation.errors);
            await deletePhoto(result.url, result.fileId);
            
            setError(validation.errors.join('. '));
            setUploading(null);
            return;
          }
          
          // Mostrar advertencias si las hay
          if (validation.warnings.length > 0) {
            console.log('⚠️ Advertencias:', validation.warnings);
          }
          
          console.log('✅ Foto VÁLIDA, continuando con guardado...');
        } catch (validationError) {
          console.error('❌ ERROR en validación:', validationError);
          setError('Error validando la foto. Intenta de nuevo.');
          await deletePhoto(result.url, result.fileId);
          setUploading(null);
          return;
        }
        // Obtener photosInfo actual de Firestore
        const { doc: docFunc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../services/firebase');
        
        const userRef = docFunc(db, 'perfiles', userId);
        const userDoc = await getDoc(userRef);
        
        let photosInfo: PhotoInfo[] = [];
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          
          console.log('📊 Datos de Firestore:');
          console.log('   - photosInfo:', data.photosInfo);
          console.log('   - images:', data.images);
          
          const hasPhotosInfo = data.photosInfo && Array.isArray(data.photosInfo) && data.photosInfo.length > 0;
          const hasImages = data.images && Array.isArray(data.images) && data.images.length > 0;
          
          // Filtrar elementos inválidos de photosInfo
          if (hasPhotosInfo) {
            data.photosInfo = data.photosInfo.filter((p: any) => p && p.url && typeof p.url === 'string');
          }
          
          // Filtrar elementos inválidos de images
          if (hasImages) {
            data.images = data.images.filter((url: any) => url && typeof url === 'string');
          }
          
          // Si ambos existen pero tienen diferente longitud, hay desincronización
          if (hasPhotosInfo && hasImages && data.photosInfo.length !== data.images.length) {
            console.warn('⚠️ DESINCRONIZACIÓN DETECTADA:');
            console.warn('   - photosInfo tiene', data.photosInfo.length, 'elementos');
            console.warn('   - images tiene', data.images.length, 'elementos');
            console.warn('   - Sincronizando usando images como fuente de verdad...');
            
            // Usar images como fuente de verdad y sincronizar con photosInfo
            const imagesArray = data.images;
            const photosInfoMap = new Map(data.photosInfo.map((p: PhotoInfo) => [p.url, p]));
            
            photosInfo = imagesArray.map((url: string) => {
              // Si existe en photosInfo, usar ese objeto
              if (photosInfoMap.has(url)) {
                return photosInfoMap.get(url)!;
              }
              // Si no existe, crear PhotoInfo nuevo (foto antigua sin fileId)
              return {
                url,
                fileId: '',
                isMain: false,
                createdAt: Date.now(),
                analyzed: false
              };
            });
            
            // Marcar la primera como main
            if (photosInfo.length > 0) {
              photosInfo[0].isMain = true;
            }
            
            console.log('   ✅ Sincronizado:', photosInfo.length, 'fotos');
          }
          // Si solo existe photosInfo, usarlo
          else if (hasPhotosInfo) {
            photosInfo = data.photosInfo;
            console.log('   ✅ Usando photosInfo de Firestore:', photosInfo.length, 'fotos');
          } 
          // Si solo existe images, normalizarlo
          else if (hasImages) {
            photosInfo = normalizePhotos(data.images);
            console.log('   ⚠️ Usando images (normalizadas):', photosInfo.length, 'fotos');
          }
          
          console.log('   - Total fotos cargadas:', photosInfo.length);
        }
        
        // Crear nuevo PhotoInfo para la foto subida
        const newPhotoInfo: PhotoInfo = {
          url: result.url,
          fileId: result.fileId,
          isMain: photosInfo.length === 0, // Primera foto es main
          createdAt: Date.now(),
          analyzed: false
        };
        
        console.log('📝 ANTES de agregar:');
        console.log('   - Fotos existentes:', photosInfo.length);
        console.log('   - URLs existentes:', photosInfo.map(p => p && p.url ? p.url.substring(0, 50) + '...' : 'URL inválida'));
        
        // Simplemente agregar al final del array
        photosInfo.push(newPhotoInfo);
        
        console.log('📝 DESPUÉS de agregar:');
        console.log('   - Total de fotos:', photosInfo.length);
        console.log('   - Nueva foto URL:', result.url.substring(0, 50) + '...');
        console.log('   - Array completo:', JSON.stringify(photosInfo.map(p => ({
          url: p && p.url ? p.url.substring(0, 50) + '...' : 'URL inválida',
          fileId: p ? p.fileId : 'N/A',
          isMain: p ? p.isMain : false
        })), null, 2));
        
        // Actualizar en Firestore
        const updateSuccess = await updateUserPhotos(userId, photosInfo);
        
        if (updateSuccess) {
          // Actualizar UI con URLs
          const newPhotos = extractUrls(photosInfo);
          onPhotosUpdate(newPhotos);
          console.log('✅ Foto subida y perfil actualizado con fileId');
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
    if (!photoUrl) {
      console.log('⚠️ No hay foto en el índice', index);
      return;
    }

    // Confirmación antes de eliminar
    if (!confirm('¿Estás seguro de que quieres eliminar esta foto?')) {
      return;
    }

    setError(null);
    
    try {
      // Obtener photosInfo completo de Firestore
      const { doc: docFunc, getDoc } = await import('firebase/firestore');
      const { db } = await import('../services/firebase');
      
      const userRef = docFunc(db, 'perfiles', userId);
      const userDoc = await getDoc(userRef);
      
      let fileId: string | undefined;
      let photosInfo: PhotoInfo[] = [];
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log('📊 Datos de Firestore:', data);
        
        // Obtener y normalizar photosInfo
        const rawPhotos = data.photosInfo || data.images || [];
        photosInfo = normalizePhotos(rawPhotos);
        
        console.log('📋 photosInfo normalizado:', photosInfo);
        
        // Buscar la foto por URL
        const photoInfo = photosInfo.find(p => p.url === photoUrl);
        
        if (photoInfo && photoInfo.fileId) {
          fileId = photoInfo.fileId;
          console.log('✅ fileId encontrado:', fileId);
        } else {
          console.log('⚠️ No se encontró fileId para esta URL');
        }
      }
      
      console.log('🗑️ Eliminando foto con fileId:', fileId || 'no disponible');
      
      // Eliminar de ImageKit (con fileId si está disponible)
      await deletePhoto(photoUrl, fileId);
      
      // Actualizar photosInfo eliminando la foto
      const updatedPhotosInfo = photosInfo.filter(p => p.url !== photoUrl);
      
      // Actualizar en Firestore
      const updateSuccess = await updateUserPhotos(userId, updatedPhotosInfo);
      
      if (updateSuccess) {
        // Actualizar UI
        const newPhotos = currentPhotos.filter(p => p !== photoUrl);
        onPhotosUpdate(newPhotos);
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
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-start gap-3 text-red-800 shadow-sm">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-sm mb-1">❌ Foto no válida</p>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2 text-red-600">
              💡 Tip: Usa una foto donde se vea tu rostro claramente con buena iluminación
            </p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700 shrink-0"
          >
            <X size={18} />
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