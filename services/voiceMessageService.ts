// cita-rd/services/voiceMessageService.ts
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
      console.log('🎤 Iniciando grabación de voz...');
      
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
        console.log('🎤 📋 MediaRecorder.onstop evento disparado');
        const duration = Math.floor((Date.now() - this.startTime) / 1000);
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        
        console.log('🎤 ✅ Grabación completada:');
        console.log('🎤   - Duración:', duration, 'segundos');
        console.log('🎤   - Chunks:', this.audioChunks.length);
        console.log('🎤   - Blob size:', audioBlob.size, 'bytes');
        console.log('🎤   - Blob type:', audioBlob.type);
        
        // Ejecutar callback
        console.log('🎤 📞 Ejecutando callback onDataAvailable...');
        this.onDataAvailable?.(duration, audioBlob);
        console.log('🎤 ✅ Callback ejecutado');
        
        // Limpiar stream
        if (this.stream) {
          console.log('🎤 🧹 Limpiando stream...');
          this.stream.getTracks().forEach(track => {
            track.stop();
            console.log('🎤   - Track detenido:', track.kind);
          });
          this.stream = null;
          console.log('🎤 ✅ Stream limpiado');
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('❌ Error en grabación:', event);
        this.onError?.(new Error('Error durante la grabación'));
      };

      // Iniciar grabación
      this.mediaRecorder.start();
      console.log('🎤 Grabación iniciada');

    } catch (error) {
      console.error('❌ Error iniciando grabación:', error);
      this.onError?.(error as Error);
      throw error;
    }
  }

  // Detener grabación
  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      console.log('🎤 🛑 VoiceRecorder.stopRecording() - MediaRecorder encontrado');
      console.log('🎤 Estado actual:', this.mediaRecorder.state);
      this.mediaRecorder.stop();
      console.log('🎤 ✅ MediaRecorder.stop() llamado');
    } else {
      console.error('❌ MediaRecorder no disponible o no está grabando');
      console.log('🎤 MediaRecorder:', this.mediaRecorder);
      console.log('🎤 Estado:', this.mediaRecorder?.state);
    }
  }

  // Cancelar grabación
  cancelRecording(): void {
    if (this.mediaRecorder) {
      console.log('🎤 Cancelando grabación...');
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

// Subir archivo de voz a Firebase Storage
export const uploadVoiceMessage = async (
  audioBlob: Blob, 
  chatId: string, 
  senderId: string
): Promise<string> => {
  try {
    console.log('☁️ Subiendo mensaje de voz...');
    console.log('☁️ Blob size:', audioBlob.size, 'bytes');
    console.log('☁️ Chat ID:', chatId);
    console.log('☁️ Sender ID:', senderId);
    
    // TEMPORAL: Crear URL local para desarrollo
    // En producción, usar Firebase Storage real
    const localUrl = URL.createObjectURL(audioBlob);
    console.log('☁️ ✅ URL local creada:', localUrl);
    
    // Simular delay de subida
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('☁️ ✅ Mensaje de voz "subido" (modo desarrollo)');
    return localUrl;
    
    /* CÓDIGO ORIGINAL PARA PRODUCCIÓN:
    const fileName = `voice_messages/${chatId}/${senderId}_${Date.now()}.webm`;
    const storageRef = ref(storage, fileName);
    
    // Subir archivo
    const snapshot = await uploadBytes(storageRef, audioBlob);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log('✅ Mensaje de voz subido:', downloadURL);
    return downloadURL;
    */
    
  } catch (error) {
    console.error('❌ Error subiendo mensaje de voz:', error);
    throw error;
  }
};

// Reproducir mensaje de voz
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

  // Reproducir audio
  async play(audioUrl: string): Promise<void> {
    try {
      if (this.audio) {
        this.audio.pause();
      }

      this.audio = new Audio(audioUrl);
      
      // Eventos del audio
      this.audio.onplay = () => {
        console.log('🔊 Reproduciendo mensaje de voz');
        this.onPlay?.();
      };

      this.audio.onpause = () => {
        console.log('⏸️ Mensaje de voz pausado');
        this.onPause?.();
      };

      this.audio.onended = () => {
        console.log('✅ Mensaje de voz terminado');
        this.onEnded?.();
      };

      this.audio.ontimeupdate = () => {
        if (this.audio) {
          this.onTimeUpdate?.(this.audio.currentTime, this.audio.duration);
        }
      };

      await this.audio.play();
      
    } catch (error) {
      console.error('❌ Error reproduciendo mensaje de voz:', error);
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

// Formatear duración en MM:SS
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};