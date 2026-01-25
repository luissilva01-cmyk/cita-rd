/**
 * ImageKit Service - Servicio de subida de fotos usando ImageKit
 * 
 * ImageKit es un servicio de gestión de imágenes con CDN global
 * Plan gratuito: 20GB storage, 20GB bandwidth/mes
 * 
 * NOTA: La autenticación ahora se hace mediante Cloud Functions
 * para mayor seguridad (Private Key protegida en el backend)
 */

const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

export interface ImageKitUploadResult {
  success: boolean;
  url?: string;
  fileId?: string; // Necesario para eliminar la foto después
  error?: string;
}

/**
 * Obtiene parámetros de autenticación desde Cloud Function
 * Esto es más seguro porque la Private Key nunca se expone en el frontend
 */
const getAuthenticationParameters = async (): Promise<{
  signature: string;
  expire: number;
  token: string;
}> => {
  try {
    // Importar getFunctions y httpsCallable aquí para evitar problemas de importación circular
    const { getFunctions, httpsCallable } = await import('firebase/functions');
    
    console.log('🔐 Obteniendo parámetros de autenticación desde Cloud Function...');
    
    const functions = getFunctions();
    const getImageKitAuthParams = httpsCallable(functions, 'getImageKitAuthParams');
    
    const result = await getImageKitAuthParams();
    const authParams = result.data as { signature: string; expire: number; token: string };
    
    console.log('✅ Parámetros de autenticación obtenidos');
    return authParams;
    
  } catch (error) {
    console.error('❌ Error obteniendo parámetros de autenticación:', error);
    throw new Error('No se pudieron obtener los parámetros de autenticación');
  }
};

/**
 * Sube una imagen a ImageKit
 */
export const uploadToImageKit = async (
  file: File,
  fileName?: string
): Promise<ImageKitUploadResult> => {
  try {
    console.log('📤 Subiendo a ImageKit...');
    console.log('📋 Archivo:', file.name);
    console.log('📊 Tamaño:', (file.size / 1024).toFixed(2), 'KB');
    
    // Validar configuración
    if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_URL_ENDPOINT) {
      console.error('❌ ImageKit no está configurado correctamente');
      return {
        success: false,
        error: 'ImageKit no está configurado. Verifica las variables de entorno.'
      };
    }
    
    // Obtener parámetros de autenticación
    const authParams = await getAuthenticationParameters();
    
    // Preparar FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName || file.name);
    formData.append('publicKey', IMAGEKIT_PUBLIC_KEY);
    formData.append('signature', authParams.signature);
    formData.append('expire', authParams.expire.toString());
    formData.append('token', authParams.token);
    
    // Configurar carpeta y opciones
    formData.append('folder', '/profile-photos');
    formData.append('useUniqueFileName', 'true');
    
    console.log('🔄 Enviando a ImageKit...');
    
    // Hacer la petición
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error de ImageKit:', errorData);
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ Subida exitosa a ImageKit');
    console.log('🔗 URL:', data.url);
    console.log('🆔 File ID:', data.fileId);
    
    return {
      success: true,
      url: data.url,
      fileId: data.fileId
    };
    
  } catch (error) {
    console.error('❌ Error subiendo a ImageKit:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al subir la foto'
    };
  }
};

/**
 * Genera una URL transformada de ImageKit
 * Permite aplicar transformaciones como resize, crop, quality, etc.
 */
export const getTransformedImageUrl = (
  imageUrl: string,
  transformations: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'jpg' | 'png' | 'webp';
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  } = {}
): string => {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    
    // Construir string de transformaciones
    const transforms: string[] = [];
    
    if (transformations.width) transforms.push(`w-${transformations.width}`);
    if (transformations.height) transforms.push(`h-${transformations.height}`);
    if (transformations.quality) transforms.push(`q-${transformations.quality}`);
    if (transformations.format) transforms.push(`f-${transformations.format}`);
    if (transformations.crop) transforms.push(`c-${transformations.crop}`);
    
    if (transforms.length === 0) return imageUrl;
    
    // Insertar transformaciones en la URL
    const transformString = `tr:${transforms.join(',')}`;
    pathParts.splice(3, 0, transformString);
    
    url.pathname = pathParts.join('/');
    return url.toString();
    
  } catch (error) {
    console.error('❌ Error generando URL transformada:', error);
    return imageUrl;
  }
};

/**
 * Obtiene una versión optimizada de la imagen para thumbnails
 */
export const getThumbnailUrl = (imageUrl: string): string => {
  return getTransformedImageUrl(imageUrl, {
    width: 400,
    height: 400,
    quality: 80,
    format: 'webp',
    crop: 'maintain_ratio'
  });
};

/**
 * Obtiene una versión optimizada de la imagen para perfil
 */
export const getProfileImageUrl = (imageUrl: string): string => {
  return getTransformedImageUrl(imageUrl, {
    width: 800,
    height: 1200,
    quality: 85,
    format: 'webp',
    crop: 'maintain_ratio'
  });
};
