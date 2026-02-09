// cita-rd/services/advancedFaceDetection.ts

/**
 * Sistema avanzado de detección de rostros
 * Usa múltiples validaciones para reducir falsos positivos
 */

export interface FaceDetectionResult {
  hasFace: boolean;
  confidence: number; // 0-100
  reasons: string[];
  details: {
    skinToneDetected: boolean;
    facialFeaturesDetected: boolean;
    contrastValid: boolean;
    proportionsValid: boolean;
  };
}

/**
 * Analiza una imagen para detectar rostros humanos reales
 * Usa Canvas API para análisis de píxeles
 */
export const detectFaceAdvanced = async (imageUrl: string): Promise<FaceDetectionResult> => {
  console.log('🔍 [ADVANCED] Iniciando detección avanzada de rostro...');
  
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Crear canvas para análisis
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve({
            hasFace: false,
            confidence: 0,
            reasons: ['Error: No se pudo crear contexto de canvas'],
            details: {
              skinToneDetected: false,
              facialFeaturesDetected: false,
              contrastValid: false,
              proportionsValid: false
            }
          });
          return;
        }
        
        // Redimensionar para análisis más rápido
        const maxSize = 400;
        let width = img.width;
        let height = img.height;
        
        if (width > height && width > maxSize) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width / height) * maxSize;
          height = maxSize;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        // Obtener datos de píxeles
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;
        
        console.log('🔍 [ADVANCED] Analizando', pixels.length / 4, 'píxeles...');
        
        // Realizar análisis
        const skinToneDetected = analyzeSkinTone(pixels);
        const contrastValid = analyzeContrast(pixels);
        const facialFeaturesDetected = analyzeFacialFeatures(imageData, width, height);
        const proportionsValid = analyzeProportions(width, height);
        
        // Calcular confianza
        let confidence = 0;
        const reasons: string[] = [];
        
        if (skinToneDetected) {
          confidence += 35;
          reasons.push('✓ Tonos de piel detectados');
        } else {
          reasons.push('✗ No se detectaron tonos de piel humana');
        }
        
        if (facialFeaturesDetected) {
          confidence += 30;
          reasons.push('✓ Patrones faciales detectados');
        } else {
          reasons.push('✗ No se detectaron patrones faciales');
        }
        
        if (contrastValid) {
          confidence += 20;
          reasons.push('✓ Contraste adecuado');
        } else {
          reasons.push('✗ Contraste insuficiente o uniforme');
        }
        
        if (proportionsValid) {
          confidence += 15;
          reasons.push('✓ Proporciones válidas');
        } else {
          reasons.push('✗ Proporciones no válidas para rostro');
        }
        
        const hasFace = confidence >= 60; // Umbral: 60%
        
        console.log('🔍 [ADVANCED] Resultado:', {
          hasFace,
          confidence,
          skinTone: skinToneDetected,
          features: facialFeaturesDetected,
          contrast: contrastValid,
          proportions: proportionsValid
        });
        
        resolve({
          hasFace,
          confidence,
          reasons,
          details: {
            skinToneDetected,
            facialFeaturesDetected,
            contrastValid,
            proportionsValid
          }
        });
      } catch (error) {
        console.error('❌ [ADVANCED] Error en análisis:', error);
        resolve({
          hasFace: false,
          confidence: 0,
          reasons: ['Error en el análisis de la imagen'],
          details: {
            skinToneDetected: false,
            facialFeaturesDetected: false,
            contrastValid: false,
            proportionsValid: false
          }
        });
      }
    };
    
    img.onerror = () => {
      console.error('❌ [ADVANCED] Error cargando imagen');
      resolve({
        hasFace: false,
        confidence: 0,
        reasons: ['Error cargando la imagen'],
        details: {
          skinToneDetected: false,
          facialFeaturesDetected: false,
          contrastValid: false,
          proportionsValid: false
        }
      });
    };
    
    img.src = imageUrl;
  });
};

/**
 * Analiza si hay tonos de piel humana en la imagen
 */
function analyzeSkinTone(pixels: Uint8ClampedArray): boolean {
  let skinPixels = 0;
  let totalPixels = 0;
  
  // Muestrear cada 10 píxeles para velocidad
  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    
    totalPixels++;
    
    // Rangos de tonos de piel humana (diversos tonos)
    // Basado en estudios de colorimetría de piel humana
    if (isSkinTone(r, g, b)) {
      skinPixels++;
    }
  }
  
  const skinPercentage = (skinPixels / totalPixels) * 100;
  console.log('🔍 [SKIN] Porcentaje de piel:', skinPercentage.toFixed(2) + '%');
  
  // Al menos 15% de la imagen debe ser tono de piel
  return skinPercentage >= 15;
}

/**
 * Verifica si un color RGB es tono de piel humana
 */
function isSkinTone(r: number, g: number, b: number): boolean {
  // Múltiples rangos para diferentes tonos de piel
  
  // Rango 1: Piel clara
  const range1 = r > 95 && g > 40 && b > 20 &&
                 r > g && r > b &&
                 Math.abs(r - g) > 15 &&
                 r - b > 15;
  
  // Rango 2: Piel media
  const range2 = r > 80 && g > 50 && b > 30 &&
                 r > g && g > b &&
                 r - g < 50;
  
  // Rango 3: Piel oscura
  const range3 = r > 50 && g > 30 && b > 20 &&
                 r >= g && g >= b &&
                 r - b > 10;
  
  return range1 || range2 || range3;
}

/**
 * Analiza el contraste de la imagen
 */
function analyzeContrast(pixels: Uint8ClampedArray): boolean {
  const brightnesses: number[] = [];
  
  // Muestrear brillo
  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const brightness = (r + g + b) / 3;
    brightnesses.push(brightness);
  }
  
  // Calcular desviación estándar
  const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const variance = brightnesses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / brightnesses.length;
  const stdDev = Math.sqrt(variance);
  
  console.log('🔍 [CONTRAST] Desviación estándar:', stdDev.toFixed(2));
  
  // Imágenes con rostros tienen contraste moderado (no uniforme)
  // Objetos uniformes tienen baja desviación
  return stdDev > 20 && stdDev < 100;
}

/**
 * Busca patrones que sugieran características faciales
 */
function analyzeFacialFeatures(imageData: ImageData, width: number, height: number): boolean {
  const pixels = imageData.data;
  
  // Dividir imagen en regiones (superior, media, inferior)
  const regionHeight = Math.floor(height / 3);
  
  // Analizar región superior (donde suelen estar los ojos)
  const topRegion = analyzeRegion(pixels, width, 0, regionHeight, width);
  
  // Analizar región media (nariz)
  const middleRegion = analyzeRegion(pixels, width, regionHeight, regionHeight * 2, width);
  
  // Analizar región inferior (boca)
  const bottomRegion = analyzeRegion(pixels, width, regionHeight * 2, height, width);
  
  // Buscar patrones de sombras/luces que sugieran rasgos faciales
  const hasTopFeatures = topRegion.darkSpots >= 2; // Ojos
  const hasMiddleFeatures = middleRegion.variance > 15; // Nariz con sombras
  const hasBottomFeatures = bottomRegion.darkSpots >= 1; // Boca
  
  console.log('🔍 [FEATURES] Regiones:', {
    top: hasTopFeatures,
    middle: hasMiddleFeatures,
    bottom: hasBottomFeatures
  });
  
  // Al menos 2 de 3 regiones deben tener características
  const featuresCount = [hasTopFeatures, hasMiddleFeatures, hasBottomFeatures].filter(Boolean).length;
  return featuresCount >= 2;
}

/**
 * Analiza una región de la imagen
 */
function analyzeRegion(pixels: Uint8ClampedArray, width: number, startY: number, endY: number, imageWidth: number) {
  let darkSpots = 0;
  let brightnesses: number[] = [];
  
  for (let y = startY; y < endY; y += 5) {
    for (let x = 0; x < width; x += 5) {
      const i = (y * imageWidth + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const brightness = (r + g + b) / 3;
      
      brightnesses.push(brightness);
      
      // Detectar puntos oscuros (posibles ojos, boca)
      if (brightness < 80) {
        darkSpots++;
      }
    }
  }
  
  const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const variance = brightnesses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / brightnesses.length;
  
  return { darkSpots, variance: Math.sqrt(variance) };
}

/**
 * Verifica que las proporciones sean adecuadas para un rostro
 */
function analyzeProportions(width: number, height: number): boolean {
  const ratio = width / height;
  
  console.log('🔍 [PROPORTIONS] Ratio:', ratio.toFixed(2));
  
  // Rostros humanos típicamente tienen ratio entre 0.6 y 1.2
  // (más ancho que alto en horizontal, más alto en vertical)
  return ratio >= 0.6 && ratio <= 1.5;
}

export default {
  detectFaceAdvanced
};
