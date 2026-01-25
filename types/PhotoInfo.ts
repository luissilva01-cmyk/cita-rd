/**
 * Tipo para información de fotos de perfil
 * 
 * Este tipo se usa para almacenar información completa de cada foto,
 * incluyendo el fileId de ImageKit para poder eliminarla después.
 */
export type PhotoInfo = {
  url: string;           // URL pública de la foto en ImageKit
  fileId: string;        // ID de ImageKit para eliminar la foto
  isMain: boolean;       // Si es la foto principal (primera)
  createdAt: number;     // Unix timestamp (Date.now())
  analyzed?: boolean;    // Si ya fue analizada por el sistema de IA
};

/**
 * Normaliza fotos antiguas (strings) al nuevo formato PhotoInfo
 * 
 * Esta función permite compatibilidad con fotos guardadas antes
 * de implementar el sistema de PhotoInfo.
 * 
 * @param photos - Array de fotos (pueden ser strings o PhotoInfo)
 * @returns Array normalizado de PhotoInfo
 */
export function normalizePhotos(photos: (string | PhotoInfo)[]): PhotoInfo[] {
  console.log('🔄 normalizePhotos() llamada con:', photos.length, 'fotos');
  
  const normalized = photos.map((photo, index) => {
    // Si ya es PhotoInfo, retornar tal cual
    if (typeof photo === 'object' && 'url' in photo) {
      console.log(`   ✅ Foto ${index}: Ya es PhotoInfo`);
      return photo;
    }
    
    // Si es string, convertir a PhotoInfo
    console.log(`   🔄 Foto ${index}: Convirtiendo string a PhotoInfo`);
    return {
      url: photo,
      fileId: '', // No tenemos fileId para fotos antiguas
      isMain: index === 0,
      createdAt: Date.now(),
      analyzed: false
    };
  });
  
  console.log('✅ normalizePhotos() retorna:', normalized.length, 'fotos');
  return normalized;
}

/**
 * Extrae solo las URLs de un array de PhotoInfo
 * 
 * Útil para mantener compatibilidad con código que espera
 * solo un array de strings.
 * 
 * @param photos - Array de PhotoInfo
 * @returns Array de URLs (filtrando vacías)
 */
export function extractUrls(photos: PhotoInfo[]): string[] {
  return photos
    .filter(p => p && p.url && p.url.trim() !== '')
    .map(p => p.url);
}
