import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Sube una foto al Firebase Storage
 */
export const uploadPhoto = async (
  file: File, 
  userId: string, 
  photoIndex: number = 0
): Promise<PhotoUploadResult> => {
  try {
    // Validar el archivo
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'El archivo debe ser una imagen' };
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'La imagen debe ser menor a 5MB' };
    }

    // Crear referencia única para la foto
    const timestamp = Date.now();
    const fileName = `${userId}_${photoIndex}_${timestamp}.jpg`;
    const photoRef = ref(storage, `profile-photos/${fileName}`);

    console.log('📸 Subiendo foto:', fileName);

    // Subir archivo
    const snapshot = await uploadBytes(photoRef, file);
    console.log('✅ Foto subida exitosamente');

    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('🔗 URL obtenida:', downloadURL);

    return { success: true, url: downloadURL };
  } catch (error) {
    console.error('❌ Error subiendo foto:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
};

/**
 * Actualiza las fotos del perfil del usuario en Firestore
 */
export const updateUserPhotos = async (
  userId: string, 
  photos: string[]
): Promise<boolean> => {
  try {
    const userRef = doc(db, 'perfiles', userId);
    await updateDoc(userRef, {
      images: photos,
      updatedAt: new Date()
    });
    
    console.log('✅ Fotos del perfil actualizadas');
    return true;
  } catch (error) {
    console.error('❌ Error actualizando fotos del perfil:', error);
    return false;
  }
};

/**
 * Elimina una foto del Firebase Storage
 */
export const deletePhoto = async (photoUrl: string): Promise<boolean> => {
  try {
    // Extraer el path de la URL
    const url = new URL(photoUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      console.error('❌ No se pudo extraer el path de la URL');
      return false;
    }

    const path = decodeURIComponent(pathMatch[1]);
    const photoRef = ref(storage, path);
    
    await deleteObject(photoRef);
    console.log('✅ Foto eliminada del storage');
    return true;
  } catch (error) {
    console.error('❌ Error eliminando foto:', error);
    return false;
  }
};

/**
 * Redimensiona una imagen antes de subirla
 */
export const resizeImage = (
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 1200, 
  quality: number = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

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