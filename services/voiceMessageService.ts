// cita-rd/services/voiceMessageService.ts
// Usamos Firestore con Base64 en lugar de Firebase Storage

// ============================================
// FUNCIONES DE CONVERSIÓN BASE64
// ============================================

/**
 * Convierte un Blob a Base64 string
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Calcula el tamaño aproximado en bytes de un string Base64
 */
const getBase64Size = (base64String: string): number => {
  // Remover el prefijo data:...;base64,
  const base64Data = base64String.split(',')[1] || base64String;
  // Cada carácter Base64 representa 6 bits, y puede haber padding
  const padding = (base64Data.match(/=/g) || []).length;
  return (base64Data.length * 3) / 4 - padding;
};

// ============================================
// VOICE RECORDER CLASS
// ============================================

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  public onDataAvailable?: (duration: number, audioBlob: Blob) => void;
  public onError?: (error: Error) => void;

  constructor(
    onDataAvailable?: (duration: number, audioBlob: Blob) => void,
    onError?: (error: Error) => void
  ) {
    this.onDataAvailable = onDataAvailable;
    this.onError = onError;
  }

  // Iniciar grabación
  async startRecording(): Promise<void> {
    try {
      // Solicitar permisos de micrófono
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      // Configurar MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.audioChunks = [];
      this.startTime = Date.now();

      // Eventos del MediaRecorder
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const duration = Math.floor((Date.now() - this.startTime) / 1000);
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        // Ejecutar callback
        this.onDataAvailable?.(duration, audioBlob);
        
        // Limpiar stream
        if (this.stream) {
          this.stream.getTracks().forEach(track => {
            track.stop();
          });
          this.stream = null;
        }
      };

      this.mediaRecorder.onerror = () => {
        this.onError?.(new Error('Error durante la grabación'));
      };

      // Iniciar grabación
      this.mediaRecorder.start();

    } catch (error) {
      this.onError?.(error as Error);
      throw error;
    }
  }

  // Detener grabación
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  // Cancelar grabación
  cancelRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.audioChunks = [];
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  // Verificar si está grabando
  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  // Obtener duración actual
  getCurrentDuration(): number {
    if (this.startTime > 0) {
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
    return 0;
  }
}

// ============================================
// UPLOAD FUNCTION - AHORA USA BASE64
// ============================================

/**
 * Convierte un archivo de audio/video a Base64 para guardarlo en Firestore
 * NO usa Firebase Storage - guarda directamente en Firestore como Base64
 * 
 * LÍMITE: Firestore tiene un límite de 1MB por documento
 * - Mensajes de voz: ~100KB (10-15 segundos)
 * - Videomensajes: ~500KB-1MB (5-10 segundos con compresión)
 */
export const uploadVoiceMessage = async (
  audioBlob: Blob, 
  chatId: string, 
  senderId: string
): Promise<string> => {
  try {
    console.log('📦 Convirtiendo archivo a Base64...', {
      size: audioBlob.size,
      type: audioBlob.type,
      chatId,
      senderId
    });
    
    // Verificar tamaño del blob ANTES de convertir
    const MAX_SIZE = 1024 * 1024; // 1MB en bytes
    if (audioBlob.size > MAX_SIZE) {
      const sizeMB = (audioBlob.size / (1024 * 1024)).toFixed(2);
      const errorMsg = `El archivo es demasiado grande (${sizeMB}MB). El límite es 1MB.\n\nPor favor, graba un mensaje más corto (máximo 10-15 segundos).`;
      console.error('❌', errorMsg);
      alert(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Convertir Blob a Base64
    const base64String = await blobToBase64(audioBlob);
    
    // Verificar tamaño del Base64
    const base64Size = getBase64Size(base64String);
    const base64SizeKB = (base64Size / 1024).toFixed(2);
    
    console.log('✅ Conversión completada:', {
      originalSize: audioBlob.size,
      base64Size: base64Size,
      base64SizeKB: `${base64SizeKB}KB`,
      prefix: base64String.substring(0, 50) + '...'
    });
    
    // Verificar que no exceda el límite de Firestore
    if (base64Size > MAX_SIZE) {
      const errorMsg = `El archivo convertido es demasiado grande (${base64SizeKB}KB). El límite es 1MB.\n\nPor favor, graba un mensaje más corto.`;
      console.error('❌', errorMsg);
      alert(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Retornar el Base64 string directamente
    // Este string se guardará en Firestore en el campo 'content' del mensaje
    return base64String;
    
  } catch (error) {
    console.error('❌ Error procesando archivo:', error);
    throw error;
  }
};

// ============================================
// VOICE PLAYER CLASS
// ============================================

export class VoicePlayer {
  private audio: HTMLAudioElement | null = null;
  private onPlay?: () => void;
  private onPause?: () => void;
  private onEnded?: () => void;
  private onTimeUpdate?: (currentTime: number, duration: number) => void;

  constructor(
    onPlay?: () => void,
    onPause?: () => void,
    onEnded?: () => void,
    onTimeUpdate?: (currentTime: number, duration: number) => void
  ) {
    this.onPlay = onPlay;
    this.onPause = onPause;
    this.onEnded = onEnded;
    this.onTimeUpdate = onTimeUpdate;
  }

  // Reproducir audio (soporta URLs normales y Base64 data URLs)
  async play(audioUrl: string): Promise<void> {
    try {
      if (this.audio) {
        this.audio.pause();
      }

      this.audio = new Audio(audioUrl);
      
      // Eventos del audio
      this.audio.onplay = () => {
        this.onPlay?.();
      };

      this.audio.onpause = () => {
        this.onPause?.();
      };

      this.audio.onended = () => {
        this.onEnded?.();
      };

      this.audio.ontimeupdate = () => {
        if (this.audio) {
          this.onTimeUpdate?.(this.audio.currentTime, this.audio.duration);
        }
      };

      await this.audio.play();
      
    } catch (error) {
      console.error('Error reproduciendo mensaje de voz:', error);
      throw error;
    }
  }

  // Pausar audio
  pause(): void {
    if (this.audio) {
      this.audio.pause();
    }
  }

  // Detener audio
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  // Verificar si está reproduciendo
  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  // Obtener duración
  getDuration(): number {
    return this.audio?.duration || 0;
  }

  // Obtener tiempo actual
  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  // Establecer tiempo
  setCurrentTime(time: number): void {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }
}

// ============================================
// PHOTO UPLOAD FUNCTION
// ============================================

/**
 * Comprime y convierte una imagen a Base64 para Firestore
 * Límite: 1MB (límite de Firestore)
 * 
 * @param file - Archivo de imagen seleccionado
 * @param maxWidth - Ancho máximo de la imagen (default: 1200px)
 * @param quality - Calidad de compresión JPEG (0-1, default: 0.8)
 * @returns Base64 string de la imagen comprimida
 */
export const uploadPhotoMessage = async (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<string> => {
  try {
    console.log('📸 Procesando imagen...', {
      name: file.name,
      size: file.size,
      sizeKB: (file.size / 1024).toFixed(2) + 'KB',
      type: file.type
    });

    // Verificar que sea una imagen
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Crear imagen desde el archivo
    const img = await createImageFromFile(file);
    
    // Calcular nuevas dimensiones manteniendo aspect ratio
    let width = img.width;
    let height = img.height;
    
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    console.log('📐 Dimensiones:', {
      original: `${img.width}x${img.height}`,
      final: `${Math.round(width)}x${Math.round(height)}`
    });
    
    // Crear canvas y comprimir
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo crear contexto de canvas');
    }
    
    // Dibujar imagen redimensionada
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convertir a Base64 con compresión
    let base64String = canvas.toDataURL('image/jpeg', quality);
    let base64Size = getBase64Size(base64String);
    
    console.log('🗜️ Primera compresión:', {
      sizeKB: (base64Size / 1024).toFixed(2) + 'KB',
      quality: quality
    });
    
    // Si aún es muy grande, reducir calidad progresivamente
    const MAX_SIZE = 1024 * 1024; // 1MB
    let currentQuality = quality;
    
    while (base64Size > MAX_SIZE && currentQuality > 0.3) {
      currentQuality -= 0.1;
      base64String = canvas.toDataURL('image/jpeg', currentQuality);
      base64Size = getBase64Size(base64String);
      
      console.log('🗜️ Recomprimiendo:', {
        sizeKB: (base64Size / 1024).toFixed(2) + 'KB',
        quality: currentQuality.toFixed(1)
      });
    }
    
    // Verificar tamaño final
    if (base64Size > MAX_SIZE) {
      const sizeMB = (base64Size / (1024 * 1024)).toFixed(2);
      throw new Error(
        `La imagen es demasiado grande (${sizeMB}MB) incluso después de comprimir.\n\n` +
        `Por favor, selecciona una imagen más pequeña.`
      );
    }
    
    console.log('✅ Imagen procesada exitosamente:', {
      finalSizeKB: (base64Size / 1024).toFixed(2) + 'KB',
      finalQuality: currentQuality.toFixed(1),
      compression: ((1 - base64Size / file.size) * 100).toFixed(1) + '%'
    });
    
    return base64String;
    
  } catch (error) {
    console.error('❌ Error procesando imagen:', error);
    throw error;
  }
};

/**
 * Crea un elemento Image desde un File
 */
const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error cargando imagen'));
    };
    
    img.src = url;
  });
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Formatear duración en MM:SS
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};