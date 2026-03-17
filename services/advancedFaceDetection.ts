// cita-rd/services/advancedFaceDetection.ts

/**
 * Sistema avanzado de detección de rostros humanos reales
 * Múltiples capas de validación para bloquear:
 * - Mascotas (perros, gatos, etc.)
 * - Dibujos animados / ilustraciones / avatares
 * - Flores, paisajes, objetos
 * - Screenshots, texto, colores sólidos
 * - Fondos oscuros / imágenes vacías
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
    saturationNatural: boolean;
    notSolidColor: boolean;
    notScreenshot: boolean;
    skinClusterValid: boolean;
  };
}

/**
 * Analiza una imagen para detectar rostros humanos reales
 * Usa Canvas API para análisis de píxeles con múltiples capas
 */
export const detectFaceAdvanced = async (imageUrl: string): Promise<FaceDetectionResult> => {
  console.log('🔍 [ADVANCED] Iniciando detección avanzada de rostro...');

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(failResult('Error: No se pudo crear contexto de canvas'));
          return;
        }

        // Redimensionar para análisis rápido
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

        const imageData = ctx.getImageData(0, 0, width, height);
        const pixels = imageData.data;

        console.log('🔍 [ADVANCED] Analizando', pixels.length / 4, 'píxeles...');

        // === CAPA 1: Rechazar imágenes de color sólido / casi vacías ===
        const notSolidColor = checkNotSolidColor(pixels);

        // === CAPA 2: Rechazar screenshots (mucho texto/bordes rectos) ===
        const notScreenshot = checkNotScreenshot(pixels, width, height);

        // === CAPA 3: Detección de tonos de piel humana ===
        const skinToneDetected = analyzeSkinTone(pixels);

        // === CAPA 4: Verificar que la piel está agrupada (no dispersa como en paisajes) ===
        const skinClusterValid = analyzeSkinClustering(pixels, width, height);

        // === CAPA 5: Contraste adecuado ===
        const contrastValid = analyzeContrast(pixels);

        // === CAPA 6: Patrones faciales (ojos, nariz, boca) ===
        const facialFeaturesDetected = analyzeFacialFeatures(imageData, width, height);

        // === CAPA 7: Proporciones de imagen razonables ===
        const proportionsValid = analyzeProportions(width, height);

        // === CAPA 8: Saturación natural (anti-dibujos/ilustraciones) ===
        const saturationNatural = analyzeSaturation(pixels);

        // Calcular confianza con pesos
        let confidence = 0;
        const reasons: string[] = [];

        // Checks eliminatorios (si fallan, confianza queda muy baja)
        if (!notSolidColor) {
          reasons.push('✗ Imagen de color sólido o casi vacía');
        } else {
          confidence += 5;
          reasons.push('✓ No es color sólido');
        }

        if (!notScreenshot) {
          reasons.push('✗ Parece un screenshot o imagen con texto');
        } else {
          confidence += 5;
          reasons.push('✓ No es screenshot');
        }

        if (skinToneDetected) {
          confidence += 25;
          reasons.push('✓ Tonos de piel humana detectados');
        } else {
          reasons.push('✗ No se detectaron tonos de piel humana');
        }

        if (skinClusterValid) {
          confidence += 15;
          reasons.push('✓ Piel agrupada en zona central (rostro)');
        } else {
          reasons.push('✗ Piel no agrupada como rostro humano');
        }

        if (facialFeaturesDetected) {
          confidence += 20;
          reasons.push('✓ Patrones faciales detectados');
        } else {
          reasons.push('✗ No se detectaron patrones faciales');
        }

        if (contrastValid) {
          confidence += 10;
          reasons.push('✓ Contraste adecuado');
        } else {
          reasons.push('✗ Contraste insuficiente o uniforme');
        }

        if (proportionsValid) {
          confidence += 10;
          reasons.push('✓ Proporciones válidas');
        } else {
          reasons.push('✗ Proporciones no válidas para retrato');
        }

        if (saturationNatural) {
          confidence += 10;
          reasons.push('✓ Saturación natural (no dibujo)');
        } else {
          reasons.push('✗ Saturación artificial (posible dibujo/ilustración)');
        }

        // Checks eliminatorios: si falla alguno crítico, forzar rechazo
        if (!notSolidColor || !notScreenshot) {
          confidence = Math.min(confidence, 30);
        }
        if (!skinToneDetected && !skinClusterValid) {
          confidence = Math.min(confidence, 40);
        }

        const hasFace = confidence >= 65;

        console.log('🔍 [ADVANCED] Resultado:', {
          hasFace, confidence,
          skinTone: skinToneDetected, skinCluster: skinClusterValid,
          features: facialFeaturesDetected, contrast: contrastValid,
          proportions: proportionsValid, saturation: saturationNatural,
          solidColor: notSolidColor, screenshot: notScreenshot
        });

        resolve({
          hasFace, confidence, reasons,
          details: {
            skinToneDetected, facialFeaturesDetected, contrastValid,
            proportionsValid, saturationNatural, notSolidColor,
            notScreenshot, skinClusterValid
          }
        });
      } catch (error) {
        console.error('❌ [ADVANCED] Error en análisis:', error);
        resolve(failResult('Error en el análisis de la imagen'));
      }
    };

    img.onerror = () => {
      console.error('❌ [ADVANCED] Error cargando imagen');
      resolve(failResult('Error cargando la imagen'));
    };

    img.src = imageUrl;
  });
};

/** Helper para resultado de fallo */
function failResult(reason: string): FaceDetectionResult {
  return {
    hasFace: false, confidence: 0, reasons: [reason],
    details: {
      skinToneDetected: false, facialFeaturesDetected: false,
      contrastValid: false, proportionsValid: false,
      saturationNatural: false, notSolidColor: false,
      notScreenshot: false, skinClusterValid: false
    }
  };
}

// ============================================================
// CAPA 1: Detección de color sólido / imagen vacía
// ============================================================
function checkNotSolidColor(pixels: Uint8ClampedArray): boolean {
  const colorSet = new Set<string>();
  let sampleCount = 0;

  for (let i = 0; i < pixels.length; i += 80) {
    const r = Math.floor(pixels[i] / 16);
    const g = Math.floor(pixels[i + 1] / 16);
    const b = Math.floor(pixels[i + 2] / 16);
    colorSet.add(`${r},${g},${b}`);
    sampleCount++;
  }

  const uniqueColors = colorSet.size;
  const colorDiversity = uniqueColors / sampleCount;

  console.log('🔍 [SOLID] Colores únicos (cuantizados):', uniqueColors, 'diversidad:', colorDiversity.toFixed(4));

  // Imágenes de color sólido tienen muy pocos colores únicos
  if (uniqueColors < 20) {
    console.log('❌ [SOLID] RECHAZADO: Muy pocos colores, parece color sólido');
    return false;
  }

  // Muy baja diversidad = imagen casi uniforme
  if (colorDiversity < 0.02) {
    console.log('❌ [SOLID] RECHAZADO: Diversidad de color muy baja');
    return false;
  }

  return true;
}

// ============================================================
// CAPA 2: Detección de screenshots / imágenes con texto
// ============================================================
function checkNotScreenshot(pixels: Uint8ClampedArray, width: number, height: number): boolean {
  let whitePixels = 0;
  let blackPixels = 0;
  let grayPixels = 0;
  let totalSampled = 0;

  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    totalSampled++;

    // Blanco puro o casi blanco
    if (r > 240 && g > 240 && b > 240) whitePixels++;
    // Negro puro o casi negro
    if (r < 15 && g < 15 && b < 15) blackPixels++;
    // Gris (bajo en saturación, medio en brillo)
    if (Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && r > 50 && r < 200) grayPixels++;
  }

  const whitePct = (whitePixels / totalSampled) * 100;
  const blackPct = (blackPixels / totalSampled) * 100;
  const grayPct = (grayPixels / totalSampled) * 100;

  console.log('🔍 [SCREENSHOT] Blanco:', whitePct.toFixed(1) + '%, Negro:', blackPct.toFixed(1) + '%, Gris:', grayPct.toFixed(1) + '%');

  // Screenshots típicos: fondo blanco con texto negro
  if (whitePct > 60 && blackPct > 5) {
    console.log('❌ [SCREENSHOT] RECHAZADO: Patrón de screenshot (fondo blanco + texto)');
    return false;
  }

  // Fondo negro con texto blanco (dark mode screenshots)
  if (blackPct > 60 && whitePct > 5) {
    console.log('❌ [SCREENSHOT] RECHAZADO: Patrón de screenshot dark mode');
    return false;
  }

  // Demasiado gris = UI/interfaz
  if (grayPct > 50) {
    console.log('❌ [SCREENSHOT] RECHAZADO: Demasiado gris, parece interfaz');
    return false;
  }

  return true;
}

// ============================================================
// CAPA 3: Detección de tonos de piel humana
// ============================================================
function analyzeSkinTone(pixels: Uint8ClampedArray): boolean {
  let skinPixels = 0;
  let totalPixels = 0;

  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    totalPixels++;

    if (isSkinTone(r, g, b)) {
      skinPixels++;
    }
  }

  const skinPercentage = (skinPixels / totalPixels) * 100;
  console.log('🔍 [SKIN] Porcentaje de piel:', skinPercentage.toFixed(2) + '%');

  // Al menos 15% de la imagen debe ser tono de piel
  // Pero no más de 80% (eso sería un fondo de color piel, no un rostro)
  return skinPercentage >= 15 && skinPercentage <= 80;
}

function isSkinTone(r: number, g: number, b: number): boolean {
  // Piel clara
  const range1 = r > 95 && g > 40 && b > 20 &&
                 r > g && r > b &&
                 Math.abs(r - g) > 15 && r - b > 15;
  // Piel media
  const range2 = r > 80 && g > 50 && b > 30 &&
                 r > g && g > b && r - g < 50;
  // Piel oscura
  const range3 = r > 50 && g > 30 && b > 20 &&
                 r >= g && g >= b && r - b > 10 && r < 160;

  return range1 || range2 || range3;
}

// ============================================================
// CAPA 4: Verificar que la piel está agrupada en zona central
// (Diferencia entre rostro humano vs paisaje con tonos cálidos)
// ============================================================
function analyzeSkinClustering(pixels: Uint8ClampedArray, width: number, height: number): boolean {
  // Dividir imagen en 9 zonas (3x3 grid)
  const zoneW = Math.floor(width / 3);
  const zoneH = Math.floor(height / 3);
  const zoneSkin = Array(9).fill(0);
  const zoneTotal = Array(9).fill(0);

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const i = (y * width + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      const zoneX = Math.min(Math.floor(x / zoneW), 2);
      const zoneY = Math.min(Math.floor(y / zoneH), 2);
      const zoneIdx = zoneY * 3 + zoneX;

      zoneTotal[zoneIdx]++;
      if (isSkinTone(r, g, b)) {
        zoneSkin[zoneIdx]++;
      }
    }
  }

  // Calcular porcentaje de piel por zona
  const zonePct = zoneSkin.map((s, i) => zoneTotal[i] > 0 ? (s / zoneTotal[i]) * 100 : 0);

  // Zona central (índice 4) y zonas adyacentes superiores (1, 3, 5)
  // En un retrato, la cara está en la zona central-superior
  const centralSkin = zonePct[4]; // Centro
  const upperCenterSkin = zonePct[1]; // Arriba centro
  const leftCenterSkin = zonePct[3]; // Izquierda centro
  const rightCenterSkin = zonePct[5]; // Derecha centro

  const centralAreaSkin = (centralSkin + upperCenterSkin + leftCenterSkin + rightCenterSkin) / 4;

  // Zonas de esquinas
  const cornerSkin = (zonePct[0] + zonePct[2] + zonePct[6] + zonePct[8]) / 4;

  console.log('🔍 [CLUSTER] Piel zona central:', centralAreaSkin.toFixed(1) + '%, esquinas:', cornerSkin.toFixed(1) + '%');

  // En un rostro real, la zona central tiene significativamente más piel que las esquinas
  // Y la zona central debe tener al menos algo de piel
  if (centralAreaSkin < 10) {
    console.log('❌ [CLUSTER] RECHAZADO: Muy poca piel en zona central');
    return false;
  }

  // Si la piel está distribuida uniformemente, probablemente no es un rostro
  // (podría ser un fondo cálido, arena, etc.)
  if (centralAreaSkin > 5 && cornerSkin > 5) {
    const ratio = centralAreaSkin / (cornerSkin + 0.1);
    if (ratio < 1.2) {
      console.log('❌ [CLUSTER] RECHAZADO: Piel distribuida uniformemente (no es rostro)');
      return false;
    }
  }

  return true;
}

// ============================================================
// CAPA 5: Análisis de contraste
// ============================================================
function analyzeContrast(pixels: Uint8ClampedArray): boolean {
  const brightnesses: number[] = [];

  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    brightnesses.push((r + g + b) / 3);
  }

  const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const variance = brightnesses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / brightnesses.length;
  const stdDev = Math.sqrt(variance);

  console.log('🔍 [CONTRAST] Desviación estándar:', stdDev.toFixed(2), 'Media:', mean.toFixed(2));

  // Rechazar imágenes muy oscuras (media < 30) o muy claras (media > 240)
  if (mean < 30 || mean > 240) {
    console.log('❌ [CONTRAST] RECHAZADO: Imagen demasiado oscura o clara');
    return false;
  }

  // Contraste moderado esperado en fotos con rostros
  return stdDev > 20 && stdDev < 100;
}

// ============================================================
// CAPA 6: Detección de patrones faciales
// ============================================================
function analyzeFacialFeatures(imageData: ImageData, width: number, height: number): boolean {
  const pixels = imageData.data;
  const regionHeight = Math.floor(height / 3);

  // Región superior (ojos)
  const topRegion = analyzeRegion(pixels, width, 0, regionHeight, width);
  // Región media (nariz)
  const middleRegion = analyzeRegion(pixels, width, regionHeight, regionHeight * 2, width);
  // Región inferior (boca)
  const bottomRegion = analyzeRegion(pixels, width, regionHeight * 2, height, width);

  const hasTopFeatures = topRegion.darkSpots >= 2; // Ojos
  const hasMiddleFeatures = middleRegion.variance > 15; // Nariz con sombras
  const hasBottomFeatures = bottomRegion.darkSpots >= 1; // Boca

  console.log('🔍 [FEATURES] Regiones:', {
    top: hasTopFeatures, middle: hasMiddleFeatures, bottom: hasBottomFeatures
  });

  const featuresCount = [hasTopFeatures, hasMiddleFeatures, hasBottomFeatures].filter(Boolean).length;
  return featuresCount >= 2;
}

function analyzeRegion(pixels: Uint8ClampedArray, width: number, startY: number, endY: number, imageWidth: number) {
  let darkSpots = 0;
  const brightnesses: number[] = [];

  for (let y = startY; y < endY; y += 5) {
    for (let x = 0; x < width; x += 5) {
      const i = (y * imageWidth + x) * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const brightness = (r + g + b) / 3;

      brightnesses.push(brightness);
      if (brightness < 80) darkSpots++;
    }
  }

  const mean = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
  const variance = brightnesses.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / brightnesses.length;

  return { darkSpots, variance: Math.sqrt(variance) };
}

// ============================================================
// CAPA 7: Proporciones de imagen
// ============================================================
function analyzeProportions(width: number, height: number): boolean {
  const ratio = width / height;
  console.log('🔍 [PROPORTIONS] Ratio:', ratio.toFixed(2));
  // Retratos típicos: ratio entre 0.5 y 1.5
  return ratio >= 0.5 && ratio <= 1.5;
}

// ============================================================
// CAPA 8: Saturación natural (anti-dibujos animados)
// ============================================================
function analyzeSaturation(pixels: Uint8ClampedArray): boolean {
  let totalSaturation = 0;
  let highSaturationPixels = 0;
  let veryHighSatPixels = 0;
  let pixelCount = 0;

  for (let i = 0; i < pixels.length; i += 40) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max > 0 ? ((max - min) / max) * 100 : 0;

    totalSaturation += saturation;
    pixelCount++;

    if (saturation > 65) highSaturationPixels++;
    if (saturation > 85) veryHighSatPixels++;
  }

  const avgSaturation = totalSaturation / pixelCount;
  const highSatPct = (highSaturationPixels / pixelCount) * 100;
  const veryHighSatPct = (veryHighSatPixels / pixelCount) * 100;

  console.log('🔍 [SATURATION] Promedio:', avgSaturation.toFixed(2) + '%, Alta:', highSatPct.toFixed(2) + '%, Muy alta:', veryHighSatPct.toFixed(2) + '%');

  // Dibujos animados: saturación promedio alta
  if (avgSaturation > 45) {
    console.log('❌ [SATURATION] RECHAZADO: Saturación promedio muy alta (dibujo animado)');
    return false;
  }

  // Ilustraciones digitales: muchos píxeles muy saturados
  if (highSatPct > 25) {
    console.log('❌ [SATURATION] RECHAZADO: Demasiados píxeles saturados (ilustración)');
    return false;
  }

  // Colores neón / arte digital
  if (veryHighSatPct > 10) {
    console.log('❌ [SATURATION] RECHAZADO: Colores neón detectados (arte digital)');
    return false;
  }

  return true;
}

export default { detectFaceAdvanced };
