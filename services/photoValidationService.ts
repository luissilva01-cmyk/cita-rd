// cita-rd/services/photoValidationService.ts
import { analyzePhoto, PhotoAnalysis } from './photoAnalysisService';

export interface PhotoValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  analysis?: PhotoAnalysis;
}

/**
 * Valida que una foto sea apta para perfil
 * - Debe tener rostro visible
 * - No puede ser paisaje, avatar, o fondo negro
 * - Debe tener calidad mínima
 */
export const validateProfilePhoto = async (imageUrl: string): Promise<PhotoValidationResult> => {
  console.log('🔍 Validando foto de perfil:', imageUrl);
  
  try {
    // Analizar la foto
    const analysis = await analyzePhoto(imageUrl);
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // VALIDACIÓN CRÍTICA: Debe tener rostro
    if (!analysis.hasFace) {
      errors.push('La foto debe mostrar tu rostro claramente');
      errors.push('No se permiten paisajes, avatares o fondos oscuros');
    }
    
    // VALIDACIÓN CRÍTICA: Claridad mínima del rostro
    if (analysis.hasFace && analysis.faceClarity < 40) {
      errors.push('El rostro no se ve con suficiente claridad');
      errors.push('Usa una foto con mejor iluminación');
    }
    
    // VALIDACIÓN CRÍTICA: Calidad mínima
    if (analysis.photoQuality < 30) {
      errors.push('La calidad de la foto es muy baja');
      errors.push('Usa una foto más nítida y con mejor resolución');
    }
    
    // ADVERTENCIAS: Mejoras recomendadas
    if (analysis.hasFace && analysis.faceClarity < 60) {
      warnings.push('La foto podría ser más clara');
    }
    
    if (analysis.photoQuality < 60) {
      warnings.push('Considera usar una foto de mejor calidad');
    }
    
    if (!analysis.isMainPhotoWorthy) {
      warnings.push('Esta foto no es ideal para foto principal');
    }
    
    const isValid = errors.length === 0;
    
    console.log(isValid ? '✅ Foto válida' : '❌ Foto no válida', { errors, warnings });
    
    return {
      isValid,
      errors,
      warnings,
      analysis
    };
  } catch (error) {
    console.error('❌ Error validando foto:', error);
    return {
      isValid: false,
      errors: ['Error al analizar la foto. Intenta con otra imagen.'],
      warnings: []
    };
  }
};

/**
 * Valida que un perfil tenga al menos 1 foto válida
 */
export const validateProfilePhotos = async (photos: string[]): Promise<PhotoValidationResult> => {
  console.log('📸 Validando fotos del perfil:', photos.length, 'fotos');
  
  // VALIDACIÓN: Mínimo 1 foto
  if (photos.length === 0) {
    return {
      isValid: false,
      errors: [
        'Debes subir al menos 1 foto para continuar',
        'Las fotos son obligatorias en Ta\' Pa\' Ti'
      ],
      warnings: []
    };
  }
  
  // VALIDACIÓN: Máximo 6 fotos
  if (photos.length > 6) {
    return {
      isValid: false,
      errors: ['Máximo 6 fotos permitidas'],
      warnings: []
    };
  }
  
  // Validar la primera foto (principal)
  const mainPhotoValidation = await validateProfilePhoto(photos[0]);
  
  if (!mainPhotoValidation.isValid) {
    return {
      isValid: false,
      errors: [
        'Tu foto principal debe mostrar tu rostro claramente',
        ...mainPhotoValidation.errors
      ],
      warnings: mainPhotoValidation.warnings
    };
  }
  
  // Validar fotos adicionales (menos estricto)
  const additionalPhotosErrors: string[] = [];
  const additionalPhotosWarnings: string[] = [];
  
  for (let i = 1; i < photos.length; i++) {
    const validation = await validateProfilePhoto(photos[i]);
    
    if (!validation.isValid) {
      additionalPhotosWarnings.push(`Foto ${i + 1}: ${validation.errors[0]}`);
    }
  }
  
  return {
    isValid: true, // Si la principal es válida, el perfil es válido
    errors: [],
    warnings: [
      ...mainPhotoValidation.warnings,
      ...additionalPhotosWarnings
    ]
  };
};

/**
 * Obtiene mensajes de ayuda para mejorar fotos
 */
export const getPhotoImprovementTips = (): string[] => {
  return [
    '✅ Usa fotos donde se vea tu cara claramente',
    '✅ Asegúrate de tener buena iluminación',
    '✅ Evita fotos borrosas o muy oscuras',
    '✅ No uses avatares, dibujos o fotos de paisajes',
    '✅ Sonríe y muestra tu personalidad',
    '✅ Usa fotos recientes (últimos 6 meses)',
    '💡 Tip: Las fotos con rostro claro obtienen 10x más matches'
  ];
};

/**
 * Verifica si una URL de foto es válida
 */
export const isValidPhotoUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export default {
  validateProfilePhoto,
  validateProfilePhotos,
  getPhotoImprovementTips,
  isValidPhotoUrl
};
