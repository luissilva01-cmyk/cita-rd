export interface PhotoAnalysis {
  hasFace: boolean;
  faceClarity: number; // 0-100
  photoQuality: number; // 0-100
  isMainPhotoWorthy: boolean;
  suggestions: string[];
  score: number; // 0-100 overall score
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
 * Simula el análisis de foto (reemplazar con API real en producción)
 */
const simulatePhotoAnalysis = async (imageUrl: string): Promise<PhotoAnalysis> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Análisis simulado basado en características de la URL
  const urlLower = imageUrl.toLowerCase();
  const isRandomUser = urlLower.includes('randomuser.me');
  const isUIAvatar = urlLower.includes('ui-avatars.com');
  
  let analysis: PhotoAnalysis;
  
  if (isRandomUser) {
    // RandomUser siempre tiene caras claras
    analysis = {
      hasFace: true,
      faceClarity: 85 + Math.random() * 15, // 85-100
      photoQuality: 80 + Math.random() * 20, // 80-100
      isMainPhotoWorthy: true,
      suggestions: ['¡Excelente foto! Perfecta para foto principal.'],
      score: 90 + Math.random() * 10 // 90-100
    };
  } else if (isUIAvatar) {
    // UI Avatars son avatares, no fotos reales
    analysis = {
      hasFace: false,
      faceClarity: 0,
      photoQuality: 60,
      isMainPhotoWorthy: false,
      suggestions: [
        'Esta parece ser un avatar. Sube una foto real para mejor visibilidad.',
        'Las fotos reales obtienen 3x más matches.'
      ],
      score: 20
    };
  } else {
    // Análisis aleatorio para otras URLs
    const hasGoodFace = Math.random() > 0.3;
    const quality = hasGoodFace ? 60 + Math.random() * 40 : 30 + Math.random() * 40;
    
    analysis = {
      hasFace: hasGoodFace,
      faceClarity: hasGoodFace ? 50 + Math.random() * 50 : Math.random() * 30,
      photoQuality: quality,
      isMainPhotoWorthy: hasGoodFace && quality > 70,
      suggestions: generateSuggestions(hasGoodFace, quality),
      score: Math.round((hasGoodFace ? 60 : 30) + (quality * 0.4))
    };
  }
  
  return analysis;
};

/**
 * Genera sugerencias basadas en el análisis
 */
const generateSuggestions = (hasFace: boolean, quality: number): string[] => {
  const suggestions: string[] = [];
  
  if (!hasFace) {
    suggestions.push('Sube una foto donde se vea tu cara claramente');
    suggestions.push('Las fotos con cara obtienen 5x más matches');
  } else if (quality < 50) {
    suggestions.push('Intenta con mejor iluminación');
    suggestions.push('Usa una foto más nítida');
  } else if (quality < 70) {
    suggestions.push('¡Buena foto! Podrías mejorar la iluminación');
  } else {
    suggestions.push('¡Excelente foto!');
  }
  
  if (quality < 60) {
    suggestions.push('Evita fotos borrosas o muy oscuras');
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