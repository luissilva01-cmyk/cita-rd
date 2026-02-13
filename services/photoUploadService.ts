import { uploadToImageKit } from './imagekitService';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { PhotoInfo, normalizePhotos, extractUrls } from '../types/PhotoInfo';
import { logger } from '../utils/logger';
import { PHOTO_CONFIG, FIREBASE_CONFIG } from '../config/constants';

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  fileId?: string; // ID de ImageKit para eliminar después
  error?: string;
}

// Re-exportar PhotoInfo para compatibilidad
export type { PhotoInfo };

/**
 * Sube una foto usando ImageKit
 */
export const uploadPhoto = async (
  file: File, 
  userId: string, 
  photoIndex: number = 0
): Promise<PhotoUploadResult> => {
  try {
    logger.api.info('Iniciando subida de foto', { 
      fileName: file.name,
      fileSize: `${(file.size / 1024).toFixed(2)} KB`,
      fileType: file.type,
      userId,
      photoIndex
    });
    
    // Validar el archivo
    if (!PHOTO_CONFIG.ACCEPTED_FORMATS.includes(file.type as any)) {
      logger.api.warn('Formato de archivo inválido', { fileType: file.type });
      return { success: false, error: 'El archivo debe ser una imagen (JPG, PNG, WebP)' };
    }

    // Validar tamaño usando constante
    if (file.size > PHOTO_CONFIG.MAX_SIZE_BYTES) {
      logger.api.warn('Archivo demasiado grande', { 
        fileSize: file.size,
        maxSize: PHOTO_CONFIG.MAX_SIZE_BYTES 
      });
      return { success: false, error: `La imagen debe ser menor a ${PHOTO_CONFIG.MAX_SIZE_MB}MB` };
    }

    // Redimensionar imagen antes de subir
    logger.api.debug('Redimensionando imagen...');
    const resizedFile = await resizeImage(file);
    logger.api.debug('Imagen redimensionada', { 
      newSize: `${(resizedFile.size / 1024).toFixed(2)} KB` 
    });

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const fileName = `${userId}_${photoIndex}_${timestamp}.jpg`;

    logger.api.debug('Subiendo a ImageKit...', { fileName });
    
    // Subir a ImageKit
    const result = await uploadToImageKit(resizedFile, fileName);
    
    if (!result.success) {
      logger.api.error('Error en uploadToImageKit', result.error);
      return result;
    }

    logger.api.success('Foto subida exitosamente a ImageKit', { 
      url: result.url,
      fileId: result.fileId 
    });
    
    // Retornar con fileId para poder eliminar después
    return {
      success: true,
      url: result.url,
      fileId: result.fileId
    };
    
  } catch (error) {
    logger.api.error('Error subiendo foto', error);
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido al subir la foto' 
    };
  }
};

/**
 * Actualiza las fotos del perfil del usuario en Firestore
 * Guarda PhotoInfo completo (con fileId) para poder eliminar después
 */
export const updateUserPhotos = async (
  userId: string, 
  photos: PhotoInfo[]
): Promise<boolean> => {
  try {
    logger.firebase.info('Actualizando fotos en Firestore', { 
      userId,
      photoCount: photos.length 
    });
    logger.firebase.debug('Datos de fotos', { photos });
    
    const userRef = doc(db, FIREBASE_CONFIG.COLLECTIONS.PROFILES, userId);
    
    // Extraer URLs para compatibilidad con código antiguo
    const photoUrls = extractUrls(photos);
    
    // Convertir PhotoInfo a objeto plano para Firestore
    // Filtrar undefined y null para evitar errores de Firestore
    const photosData = photos
      .filter(p => p && p.url) // Solo fotos válidas
      .map(p => ({
        url: p.url,
        fileId: p.fileId || '', // Asegurar que nunca sea undefined
        isMain: p.isMain || false,
        createdAt: p.createdAt,
        analyzed: p.analyzed || false
      }));
    
    logger.firebase.debug('Enviando a Firestore', { 
      images: photoUrls,
      photosInfo: photosData 
    });
    
    // Usar setDoc con merge: true en lugar de updateDoc
    // Esto funciona tanto si el documento existe como si no
    // Y solo actualiza los campos especificados
    await setDoc(userRef, {
      images: photoUrls,           // Array de URLs (compatibilidad)
      photosInfo: photosData,      // Array de objetos PhotoInfo
      updatedAt: Date.now()
    }, { merge: true });
    
    logger.firebase.success('Fotos del perfil actualizadas en Firestore');
    return true;
  } catch (error) {
    logger.firebase.error('Error actualizando fotos del perfil', error);
    
    // Log adicional para debugging
    if (error instanceof Error) {
      logger.firebase.error('Detalles del error', { 
        message: error.message,
        stack: error.stack 
      });
    }
    
    return false;
  }
};

/**
 * Elimina una foto de ImageKit usando Cloud Function
 * Ahora elimina físicamente la foto de ImageKit de forma segura
 */
export const deletePhoto = async (photoUrl: string, fileId?: string): Promise<boolean> => {
  try {
    logger.api.info('Eliminando foto de ImageKit', { photoUrl, fileId });
    
    if (!fileId) {
      logger.api.warn('No se proporcionó fileId, no se puede eliminar de ImageKit');
      logger.api.info('La foto se eliminará solo de Firestore');
      return true; // Continuar con la eliminación de Firestore
    }
    
    // Llamar a Cloud Function para eliminar de ImageKit
    const functions = getFunctions();
    const deleteImageKitPhoto = httpsCallable(functions, 'deleteImageKitPhoto');
    
    logger.api.debug('Llamando a Cloud Function deleteImageKitPhoto...');
    const result = await deleteImageKitPhoto({ fileId, photoUrl });
    
    logger.api.success('Respuesta de Cloud Function', result.data);
    return true;
    
  } catch (error) {
    logger.api.error('Error eliminando foto', error);
    
    // Si falla la eliminación de ImageKit, aún así continuar
    // La foto se eliminará de Firestore y quedará huérfana en ImageKit
    // (se puede limpiar después con la función cleanOrphanedPhotos)
    logger.api.warn('No se pudo eliminar de ImageKit, pero se eliminará de Firestore');
    return true;
  }
};

/**
 * Redimensiona una imagen antes de subirla
 * Mantiene aspect ratio 3:4 (vertical) para consistencia visual
 */
export const resizeImage = (
  file: File, 
  maxWidth: number = PHOTO_CONFIG.MAX_WIDTH, 
  maxHeight: number = PHOTO_CONFIG.MAX_HEIGHT,
  quality: number = PHOTO_CONFIG.JPEG_QUALITY
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Aspect ratio objetivo: 3:4 (0.75)
      const targetRatio = 3 / 4;
      
      let { width, height } = img;
      const currentRatio = width / height;
      
      // Calcular dimensiones para crop centrado
      let cropX = 0;
      let cropY = 0;
      let cropWidth = width;
      let cropHeight = height;
      
      if (currentRatio > targetRatio) {
        // Imagen más ancha - crop horizontal
        cropWidth = height * targetRatio;
        cropX = (width - cropWidth) / 2;
      } else if (currentRatio < targetRatio) {
        // Imagen más alta - crop vertical
        cropHeight = width / targetRatio;
        cropY = (height - cropHeight) / 2;
      }
      
      // Calcular dimensiones finales manteniendo el ratio 3:4
      let finalWidth = maxWidth;
      let finalHeight = maxHeight;
      
      if (cropWidth > cropHeight) {
        finalHeight = (finalWidth * 4) / 3;
      } else {
        finalWidth = (finalHeight * 3) / 4;
      }
      
      // Asegurar que no exceda los límites
      if (finalWidth > maxWidth) {
        finalWidth = maxWidth;
        finalHeight = (finalWidth * 4) / 3;
      }
      if (finalHeight > maxHeight) {
        finalHeight = maxHeight;
        finalWidth = (finalHeight * 3) / 4;
      }

      canvas.width = finalWidth;
      canvas.height = finalHeight;

      // Dibujar imagen cropeada y redimensionada
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight,  // Área de origen (crop)
        0, 0, finalWidth, finalHeight          // Área de destino (canvas)
      );

      // Convertir a blob y luego a File
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            resolve(file); // Fallback al archivo original
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};