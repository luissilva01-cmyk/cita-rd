import { detectFaceAdvanced, FaceDetectionResult } from './advancedFaceDetection';

export interface PhotoAnalysis {
  hasFace: boolean;
  faceClarity: number; // 0-100
  photoQuality: number; // 0-100
  isMainPhotoWorthy: boolean;
  suggestions: string[];
  score: number; // 0-100 overall score
  advancedDetection?: FaceDetectionResult; // Detalles del análisis avanzado
}

export interface ProfileScore {
  totalScore: number; // 0-100
  hasMainPhoto: boolean;
  photoCount: number;
  verifiedPhotos: number;
  qualityAverage: number;
  badges: string[];
  visibilityBoost: number; // multiplier 1.0-2.0
}

/**
 * Analiza una imagen para detectar calidad y presencia de cara
 * Nota: Esta es una implementación básica. En producción usarías APIs como:
 * - Google Vision API
 * - AWS Rekognition
 * - Azure Computer Vision
 */
export const analyzePhoto = async (imageUrl: string): Promise<PhotoAnalysis> => {
  try {
    console.log('🔍 Analizando foto:', imageUrl);
    
    // Simular análisis (en producción sería una llamada a API real)
    const analysis = await simulatePhotoAnalysis(imageUrl);
    
    console.log('✅ Análisis completado:', analysis);
    return analysis;
  } catch (error) {
    console.error('❌ Error analizando foto:', error);
    return {
      hasFace: false,
      faceClarity: 0,
      photoQuality: 50,
      isMainPhotoWorthy: false,
      suggestions: ['Error analizando la foto. Intenta con otra imagen.'],
      score: 0
    };
  }
};

/**
 * Analiza la foto usando el sistema avanzado de detección de rostros
 */
const simulatePhotoAnalysis = async (imageUrl: string): Promise<PhotoAnalysis> => {
  console.log('🔍 [ANALYSIS] Iniciando análisis avanzado de foto...');
  
  try {
    // Usar el sistema avanzado de detección de rostros
    const faceDetection = await detectFaceAdvanced(imageUrl);
    
    console.log('🔍 [ANALYSIS] Detección avanzada completada:', {
      hasFace: faceDetection.hasFace,
      confidence: faceDetection.confidence,
      reasons: faceDetection.reasons
    });
    
    // Calcular calidad de la foto basada en los detalles de detección
    let photoQuality = 40; // Base
    
    if (faceDetection.details.skinToneDetected) photoQuality += 12;
    if (faceDetection.details.facialFeaturesDetected) photoQuality += 12;
    if (faceDetection.details.contrastValid) photoQuality += 10;
    if (faceDetection.details.proportionsValid) photoQuality += 8;
    if (faceDetection.details.saturationNatural) photoQuality += 6;
    if (faceDetection.details.notSolidColor) photoQuality += 6;
    if (faceDetection.details.notScreenshot) photoQuality += 6;
    
    // Usar la confianza como claridad del rostro
    const faceClarity = faceDetection.confidence;
    
    // Determinar si es apta para foto principal
    const isMainPhotoWorthy = faceDetection.hasFace && faceClarity >= 70 && photoQuality >= 70;
    
    // Generar sugerencias basadas en el análisis
    const suggestions = generateAdvancedSuggestions(faceDetection, photoQuality);
    
    // Calcular score general
    const score = Math.round((faceClarity * 0.6) + (photoQuality * 0.4));
    
    const analysis: PhotoAnalysis = {
      hasFace: faceDetection.hasFace,
      faceClarity,
      photoQuality,
      isMainPhotoWorthy,
      suggestions,
      score,
      advancedDetection: faceDetection
    };
    
    console.log('✅ [ANALYSIS] Análisis final:', {
      hasFace: analysis.hasFace,
      faceClarity: analysis.faceClarity.toFixed(2),
      photoQuality: analysis.photoQuality,
      isMainPhotoWorthy: analysis.isMainPhotoWorthy,
      score: analysis.score
    });
    
    return analysis;
  } catch (error) {
    console.error('❌ [ANALYSIS] Error en análisis:', error);
    
    // Fallback en caso de error
    return {
      hasFace: false,
      faceClarity: 0,
      photoQuality: 30,
      isMainPhotoWorthy: false,
      suggestions: [
        '❌ Error al analizar la foto',
        'Intenta con otra imagen',
        'Asegúrate de que la foto sea clara y muestre tu rostro'
      ],
      score: 0
    };
  }
};

/**
 * Genera sugerencias basadas en el análisis avanzado
 */
const generateAdvancedSuggestions = (detection: FaceDetectionResult, quality: number): string[] => {
  const suggestions: string[] = [];
  
  if (!detection.hasFace) {
    // Foto rechazada - dar razones específicas
    suggestions.push('❌ No se detectó un rostro humano en esta foto');
    
    // Razones específicas del análisis
    if (!detection.details.skinToneDetected) {
      suggestions.push('No se detectaron tonos de piel humana');
    }
    if (!detection.details.facialFeaturesDetected) {
      suggestions.push('No se detectaron características faciales (ojos, nariz, boca)');
    }
    if (!detection.details.contrastValid) {
      suggestions.push('La imagen es muy uniforme u oscura');
    }
    if (!detection.details.proportionsValid) {
      suggestions.push('Las proporciones no corresponden a un rostro');
    }
    
    suggestions.push('💡 Usa una foto donde se vea tu cara claramente');
    suggestions.push('Las fotos con rostro obtienen 10x más matches');
  } else {
    // Foto aceptada - dar consejos de mejora
    if (detection.confidence >= 80) {
      suggestions.push('✅ ¡Excelente foto! Perfecta para tu perfil');
    } else if (detection.confidence >= 60) {
      suggestions.push('✅ Buena foto, se detectó tu rostro correctamente');
      
      if (quality < 70) {
        suggestions.push('💡 Podrías mejorar la iluminación para mejor calidad');
      }
    } else {
      suggestions.push('✅ Foto aceptada, pero podría mejorar');
      suggestions.push('💡 Intenta con mejor iluminación y enfoque');
    }
    
    // Sugerencias específicas de mejora
    if (!detection.details.contrastValid) {
      suggestions.push('Usa mejor iluminación para más contraste');
    }
    if (quality < 60) {
      suggestions.push('Evita fotos borrosas o muy oscuras');
    }
  }
  
  return suggestions;
};

/**
 * Calcula el score total del perfil basado en todas las fotos
 */
export const calculateProfileScore = async (photos: string[]): Promise<ProfileScore> => {
  if (photos.length === 0) {
    return {
      totalScore: 0,
      hasMainPhoto: false,
      photoCount: 0,
      verifiedPhotos: 0,
      qualityAverage: 0,
      badges: [],
      visibilityBoost: 0.5 // Penalización por no tener fotos
    };
  }
  
  console.log('📊 Calculando score del perfil con', photos.length, 'fotos');
  
  // Analizar todas las fotos
  const analyses = await Promise.all(
    photos.map(photo => analyzePhoto(photo))
  );
  
  // Calcular métricas
  const photoCount = photos.length;
  const verifiedPhotos = analyses.filter(a => a.hasFace).length;
  const qualityAverage = analyses.reduce((sum, a) => sum + a.photoQuality, 0) / photoCount;
  const hasMainPhoto = analyses[0]?.isMainPhotoWorthy || false;
  
  // Calcular score total
  let totalScore = 0;
  
  // Base score por tener fotos
  totalScore += Math.min(photoCount * 15, 60); // Máximo 60 por cantidad
  
  // Bonus por calidad promedio
  totalScore += qualityAverage * 0.3; // Máximo 30
  
  // Bonus por foto principal clara
  if (hasMainPhoto) totalScore += 10;
  
  // Bonus por múltiples fotos verificadas
  totalScore += Math.min(verifiedPhotos * 5, 20); // Máximo 20
  
  totalScore = Math.min(Math.round(totalScore), 100);
  
  // Generar badges
  const badges = generateBadges(analyses, photoCount, verifiedPhotos, qualityAverage);
  
  // Calcular boost de visibilidad
  const visibilityBoost = calculateVisibilityBoost(totalScore, hasMainPhoto, verifiedPhotos);
  
  const profileScore: ProfileScore = {
    totalScore,
    hasMainPhoto,
    photoCount,
    verifiedPhotos,
    qualityAverage: Math.round(qualityAverage),
    badges,
    visibilityBoost
  };
  
  console.log('✅ Score del perfil calculado:', profileScore);
  return profileScore;
};

/**
 * Genera badges basados en el análisis del perfil
 */
const generateBadges = (
  analyses: PhotoAnalysis[], 
  photoCount: number, 
  verifiedPhotos: number, 
  qualityAverage: number
): string[] => {
  const badges: string[] = [];
  
  if (verifiedPhotos >= 1) badges.push('Cara Verificada');
  if (photoCount >= 3) badges.push('Perfil Completo');
  if (qualityAverage >= 80) badges.push('Fotos de Calidad');
  if (verifiedPhotos >= 3) badges.push('Múltiples Verificadas');
  if (analyses[0]?.isMainPhotoWorthy) badges.push('Foto Principal Clara');
  if (photoCount >= 5) badges.push('Galería Completa');
  
  return badges;
};

/**
 * Calcula el multiplicador de visibilidad
 */
const calculateVisibilityBoost = (
  totalScore: number, 
  hasMainPhoto: boolean, 
  verifiedPhotos: number
): number => {
  let boost = 1.0;
  
  // Boost por score total
  if (totalScore >= 80) boost += 0.5;
  else if (totalScore >= 60) boost += 0.3;
  else if (totalScore >= 40) boost += 0.1;
  
  // Boost por foto principal
  if (hasMainPhoto) boost += 0.2;
  
  // Boost por fotos verificadas
  boost += Math.min(verifiedPhotos * 0.1, 0.3);
  
  return Math.min(boost, 2.0); // Máximo 2x boost
};

/**
 * Obtiene recomendaciones para mejorar el perfil
 */
export const getProfileRecommendations = (score: ProfileScore): string[] => {
  const recommendations: string[] = [];
  
  if (score.photoCount === 0) {
    recommendations.push('Sube al menos una foto para empezar');
    return recommendations;
  }
  
  if (!score.hasMainPhoto) {
    recommendations.push('Sube una foto clara de tu cara como foto principal');
  }
  
  if (score.photoCount < 3) {
    recommendations.push(`Sube ${3 - score.photoCount} fotos más para perfil completo`);
  }
  
  if (score.verifiedPhotos === 0) {
    recommendations.push('Incluye al menos una foto donde se vea tu cara');
  }
  
  if (score.qualityAverage < 70) {
    recommendations.push('Mejora la calidad de tus fotos con mejor iluminación');
  }
  
  if (score.photoCount < 5) {
    recommendations.push('Sube más fotos para mayor atractivo del perfil');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('¡Tu perfil se ve genial! Sigue así.');
  }
  
  return recommendations;
};