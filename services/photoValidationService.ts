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
  console.log('🔍 [VALIDATION] Iniciando validación de foto:', imageUrl.substring(0, 80) + '...');
  
  try {
    // Analizar la foto
    console.log('🔍 [VALIDATION] Llamando a analyzePhoto...');
    const analysis = await analyzePhoto(imageUrl);
    console.log('🔍 [VALIDATION] Análisis recibido:', {
      hasFace: analysis.hasFace,
      faceClarity: analysis.faceClarity,
      photoQuality: analysis.photoQuality
    });
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // VALIDACIÓN CRÍTICA: Debe tener rostro
    if (!analysis.hasFace) {
      errors.push('❌ No se detectó un rostro en la foto');
      errors.push('Por favor usa una foto donde se vea tu cara claramente');
      errors.push('No se permiten paisajes, avatares, dibujos o fondos oscuros');
    }
    
    // VALIDACIÓN CRÍTICA: Claridad mínima del rostro (más estricto)
    if (analysis.hasFace && analysis.faceClarity < 50) {
      errors.push('❌ El rostro no se ve con suficiente claridad');
      errors.push('Usa una foto con mejor iluminación y enfoque');
    }
    
    // VALIDACIÓN CRÍTICA: Calidad mínima
    if (analysis.photoQuality < 40) {
      errors.push('❌ La calidad de la foto es muy baja');
      errors.push('Usa una foto más nítida y con mejor resolución');
    }
    
    // ADVERTENCIAS: Mejoras recomendadas
    if (analysis.hasFace && analysis.faceClarity >= 50 && analysis.faceClarity < 70) {
      warnings.push('⚠️ La foto podría ser más clara para mejores resultados');
    }
    
    if (analysis.photoQuality >= 40 && analysis.photoQuality < 70) {
      warnings.push('⚠️ Considera usar una foto de mejor calidad');
    }
    
    if (!analysis.isMainPhotoWorthy && analysis.hasFace) {
      warnings.push('💡 Esta foto no es ideal para foto principal');
    }
    
    const isValid = errors.length === 0;
    
    console.log('🔍 [VALIDATION] Resultado final:', {
      isValid,
      errorsCount: errors.length,
      warningsCount: warnings.length,
      errors,
      warnings
    });
    
    if (!isValid) {
      console.log('❌ [VALIDATION] FOTO RECHAZADA');
    } else {
      console.log('✅ [VALIDATION] FOTO ACEPTADA');
    }
    
    return {
      isValid,
      errors,
      warnings,
      analysis
    };
  } catch (error) {
    console.error('❌ [VALIDATION] Error crítico validando foto:', error);
    
    // Si hay error en la validación, RECHAZAR la foto por seguridad
    // Esto previene que fotos sin rostro pasen por errores de CORS u otros
    return {
      isValid: false,
      errors: [
        '❌ No se pudo validar la foto correctamente',
        'Por favor intenta con otra imagen',
        'Asegúrate de que la foto muestre tu rostro claramente'
      ],
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
