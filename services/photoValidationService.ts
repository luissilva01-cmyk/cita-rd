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
    
    // VALIDACIÓN CRÍTICA: Debe tener rostro humano real
    if (!analysis.hasFace) {
      errors.push('❌ No se detectó un rostro humano en la foto');
      
      // Dar razones específicas basadas en el análisis avanzado
      const det = analysis.advancedDetection?.details;
      if (det) {
        if (!det.notSolidColor) {
          errors.push('La imagen parece ser un color sólido o está vacía');
        } else if (!det.notScreenshot) {
          errors.push('La imagen parece ser un screenshot o captura de pantalla');
        } else if (!det.saturationNatural) {
          errors.push('La imagen parece ser un dibujo animado o ilustración digital');
        } else if (!det.skinToneDetected) {
          errors.push('No se detectaron tonos de piel humana (¿es una mascota, flor o paisaje?)');
        } else if (!det.skinClusterValid) {
          errors.push('No se detectó un rostro centrado en la imagen');
        } else {
          errors.push('No se detectaron características faciales suficientes');
        }
      }
      
      errors.push('Solo se permiten fotos reales de personas. No se aceptan mascotas, dibujos, paisajes ni objetos.');
    }
    
    // VALIDACIÓN CRÍTICA: Claridad mínima del rostro
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
  
  // Validar fotos adicionales (también deben ser fotos reales de personas)
  const additionalPhotosWarnings: string[] = [];
  
  for (let i = 1; i < photos.length; i++) {
    const validation = await validateProfilePhoto(photos[i]);
    
    if (!validation.isValid) {
      // Las fotos adicionales también deben ser de personas reales
      additionalPhotosWarnings.push(`Foto ${i + 1}: No cumple con los requisitos de seguridad`);
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
