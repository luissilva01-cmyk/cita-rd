import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Send, 
  Mic, 
  MicOff,
  Sparkles, 
  Loader2, 
  Smile,
  Image as ImageIcon,
  StopCircle,
  Brain,
  Video as VideoIcon,
  Check,
  CheckCheck
} from 'lucide-react';
import { Match, Message } from '../../types';
import { getIcebreakerSuggestions } from '../../services/geminiService';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  updateTypingStatus, 
  listenToTypingStatus, 
  markMessagesAsRead,
  deleteMessageForMe,
  deleteMessageForEveryone
} from '../../services/chatService';
import { VoiceRecorder, uploadVoiceMessage, uploadPhotoMessage } from '../../services/voiceMessageService';
import EmojiPicker from '../../components/EmojiPicker';
import VoiceMessage from '../../components/VoiceMessage';
import VideoMessage from '../../components/VideoMessage';
import PhotoMessage from '../../components/PhotoMessage';
import PhotoPreviewModal from '../../components/PhotoPreviewModal';
import EmotionalInsights from '../../components/EmotionalInsights';
import MessageContextMenu from '../../components/MessageContextMenu';
import { useEmotionalAI } from '../../hooks/useEmotionalAI';
import TypingIndicator from '../../components/TypingIndicator';
import { SmartSuggestion } from '../../services/emotionalAI';
import { listenToUserPresence, formatPresenceStatus, PresenceStatus } from '../../services/presenceService';
import { logger } from '../../utils/logger';

interface ChatViewProps {
  match: Match;
  messages: Message[];
  onSendMessage: (text?: string, type?: Message['type'], content?: string, duration?: number) => void;
  onBack: () => void;
  currentUserId: string;
  chatId: string; // Necesitamos el chatId para el typing status
}

const ChatView: React.FC<ChatViewProps> = ({ 
  match, 
  messages, 
  onSendMessage, 
  onBack, 
  currentUserId,
  chatId
}) => {
  logger.chat.debug('ChatView mounted', { 
    chatId, 
    currentUserId, 
    matchUserId: match.user.id, 
    matchUserName: match.user.name
  });
  
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIce, setLoadingIce] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserPresence, setOtherUserPresence] = useState<PresenceStatus>({ online: false, lastSeen: Date.now() });
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Detectar si estamos en desktop (>=1024px)
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Check inicial
    checkDesktop();
    
    // Listener para cambios de tamaño
    window.addEventListener('resize', checkDesktop);
    
    return () => {
      window.removeEventListener('resize', checkDesktop);
    };
  }, []);
  
  // Estados para nuevas funcionalidades
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoRecordingDuration, setVideoRecordingDuration] = useState(0);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoRecordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para preview de fotos
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Estados para IA Emocional
  const [showEmotionalInsights, setShowEmotionalInsights] = useState(false);
  
  // Estados para menú contextual de mensajes
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    messageId: string;
    isOwnMessage: boolean;
    messageText?: string;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    messageId: '',
    isOwnMessage: false,
    messageText: ''
  });
  
  // Hook de IA Emocional
  const {
    currentEmotion,
    conversationInsights,
    smartSuggestions,
    conversationMetrics,
    isAnalyzing,
    error: emotionalError,
    analyzeMessage,
    analyzeConversation,
    generateSuggestions,
    calculateMetrics
  } = useEmotionalAI();

  // Cleanup al desmontar componente
  useEffect(() => {
    return () => {
      // Limpiar interval de grabación de audio
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      // Limpiar interval de grabación de video
      if (videoRecordingIntervalRef.current) {
        clearInterval(videoRecordingIntervalRef.current);
      }
      
      // Limpiar timeout de typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Limpiar typing status al salir
      if (chatId && currentUserId) {
        updateTypingStatus(chatId, currentUserId, false);
      }
      
      // Cancelar grabación de audio si está activa
      const recorder = (window as any).currentVoiceRecorder;
      if (recorder) {
        recorder.cancelRecording();
        (window as any).currentVoiceRecorder = null;
      }
      
      // Cancelar grabación de video si está activa
      const videoRecorder = (window as any).currentVideoRecorder;
      if (videoRecorder) {
        videoRecorder.stop();
        (window as any).currentVideoRecorder = null;
      }
    };
  }, [chatId, currentUserId]);

  // Escuchar typing status del otro usuario
  useEffect(() => {
    logger.chat.debug('Setting up typing listener', { 
      chatId, 
      matchUserId: match.user.id, 
      matchUserName: match.user.name 
    });
    
    if (!chatId || !match.user.id) {
      logger.chat.warn('Missing chatId or match.user.id, skipping typing listener setup');
      return;
    }
    
    logger.chat.debug('Configuring typing listener');
    
    const unsubscribe = listenToTypingStatus(chatId, match.user.id, (isTyping) => {
      logger.chat.debug('Typing status changed', { userName: match.user.name, isTyping });
      setOtherUserTyping(isTyping);
    });
    
    logger.chat.debug('Typing listener configured successfully');
    
    return () => {
      logger.firebase.debug('Cleaning up typing listener');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [chatId, match.user.id]);

  // Listen to other user's presence status
  useEffect(() => {
    logger.chat.debug('Setting up presence listener', { userId: match.user.id });
    
    if (!match.user.id) {
      return;
    }
    
    const unsubscribe = listenToUserPresence(match.user.id, (status) => {
      logger.chat.debug('Presence status updated', { userId: match.user.id, status });
      setOtherUserPresence(status);
    });
    
    return () => {
      logger.firebase.debug('Cleaning up presence listener');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [match.user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Analizar conversación cuando cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      // Analizar el último mensaje si es nuevo
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.text) {
        analyzeMessage(lastMessage);
      }
      
      // Analizar conversación completa cada 3 mensajes
      if (messages.length % 3 === 0) {
        analyzeConversation(match.id, messages);
        generateSuggestions(match.id, messages);
      }
      
      // Calcular métricas
      calculateMetrics(messages);
    }
  }, [messages, match.id, analyzeMessage, analyzeConversation, generateSuggestions, calculateMetrics]);

  // Marcar mensajes como leídos cuando se abre el chat
  useEffect(() => {
    if (messages.length > 0 && chatId && currentUserId) {
      // Filtrar mensajes no leídos que no son del usuario actual
      const unreadMessages = messages.filter(
        msg => !msg.isRead && msg.senderId !== currentUserId
      );
      
      if (unreadMessages.length > 0) {
        const messageIds = unreadMessages.map(msg => msg.id);
        markMessagesAsRead(chatId, currentUserId, messageIds);
        logger.chat.info('Mensajes marcados como leídos', { count: messageIds.length });
      }
    }
  }, [messages, chatId, currentUserId]);

  const loadIcebreakers = async () => {
    setLoadingIce(true);
    try {
      const suggestions = await getIcebreakerSuggestions(match.user.name, match.user.interests);
      setIcebreakers(suggestions);
    } catch (error) {
      logger.chat.error('Error loading icebreakers', { error, userName: match.user.name });
      // Fallback to demo suggestions if AI fails
      setIcebreakers([
        `¡Hola ${match.user.name}! Me encantó tu perfil 😊`,
        `¿Qué tal? Vi que te gusta ${match.user.interests?.[0] || 'la música'}, ¿me cuentas más?`,
        `Hey! ¿Cómo va tu día?`
      ]);
    }
    setLoadingIce(false);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue, 'text');
      setInputValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      
      // Limpiar typing status
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      updateTypingStatus(chatId, currentUserId, false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
    
    logger.chat.debug('Input changed, updating typing status', { 
      isTyping: !!value.trim(), 
      chatId, 
      currentUserId 
    });
    
    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (value.trim()) {
      // Usuario está escribiendo
      updateTypingStatus(chatId, currentUserId, true);
      
      // Establecer timeout para limpiar después de 15 segundos de inactividad
      typingTimeoutRef.current = setTimeout(() => {
        logger.chat.debug('Timeout: Clearing typing status after 15 seconds of inactivity');
        updateTypingStatus(chatId, currentUserId, false);
      }, 15000);
    } else {
      // Campo vacío, limpiar inmediatamente
      updateTypingStatus(chatId, currentUserId, false);
    }
  };

  const handleSendEmoji = (emoji: string) => {
    onSendMessage(undefined, 'emoji', emoji);
  };

  // Manejar selección de sugerencia de IA
  const handleSuggestionSelect = (suggestion: SmartSuggestion) => {
    setInputValue(suggestion.text);
    setShowEmotionalInsights(false);
  };

  const handleStartVoiceRecording = async () => {
    try {
      // Crear nuevo recorder
      const recorder = new VoiceRecorder(
        // onDataAvailable - cuando termina la grabación
        async (duration: number, audioBlob: Blob) => {
          try {
            // Subir a Firebase Storage
            const audioUrl = await uploadVoiceMessage(audioBlob, match.id, currentUserId);
            
            // Enviar mensaje de voz
            onSendMessage(undefined, 'voice', audioUrl, duration);
            
            setIsRecording(false);
            setRecordingDuration(0);
            
          } catch (error) {
            logger.chat.error('Error processing voice message', { error });
            setIsRecording(false);
            setRecordingDuration(0);
          }
        },
        // onError
        (error: Error) => {
          logger.chat.error('Error in voice recording', { error });
          setIsRecording(false);
          setRecordingDuration(0);
        }
      );
      
      // Iniciar grabación
      await recorder.startRecording();
      
      setIsRecording(true);
      
      // Contador de duración
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      // Guardar referencia del recorder para poder detenerlo
      (window as any).currentVoiceRecorder = recorder;
      
    } catch (error) {
      logger.chat.error('Error starting voice recording', { error });
      
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No se encontró micrófono disponible.';
        } else {
          errorMessage = error.message;
        }
      }
      
      logger.chat.error('Voice recording error details', { errorMessage });
    }
  };

  const handleStopVoiceRecording = () => {
    // Detener contador
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    // Detener grabación
    const recorder = (window as any).currentVoiceRecorder;
    if (recorder) {
      recorder.stopRecording();
      (window as any).currentVoiceRecorder = null;
    } else {
      setIsRecording(false);
      setRecordingDuration(0);
    }
  };

  const handleCancelVoiceRecording = () => {
    // Detener contador
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    
    // Cancelar grabación
    const recorder = (window as any).currentVoiceRecorder;
    if (recorder) {
      recorder.cancelRecording();
      (window as any).currentVoiceRecorder = null;
    }
    
    setIsRecording(false);
    setRecordingDuration(0);
  };

  // Funciones para videomensajes
  const handleStartVideoRecording = async () => {
    try {
      logger.chat.info('Starting video message recording');
      
      // IMPORTANTE: Activar estado PRIMERO para que el elemento <video> se renderice
      setIsRecordingVideo(true);
      
      // Pequeño delay para asegurar que el DOM se actualice
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Solicitar permisos de cámara y micrófono
      // Formato vertical (retrato) para videomensajes tipo Stories
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 720 },
          height: { ideal: 1280 },
          facingMode: 'user',
          aspectRatio: { ideal: 9/16 } // Formato vertical 9:16
        },
        audio: true
      });
      
      logger.chat.debug('Video stream obtained', { 
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length
      });
      
      // Asignar stream al elemento video
      if (videoPreviewRef.current) {
        logger.chat.debug('Assigning stream to video preview');
        videoPreviewRef.current.srcObject = stream;
        
        // Forzar reproducción
        try {
          await videoPreviewRef.current.play();
          logger.chat.success('Video preview started successfully');
        } catch (playError) {
          logger.chat.warn('Error starting preview (may be normal)', { playError });
          // Intentar de nuevo después de un delay
          setTimeout(async () => {
            if (videoPreviewRef.current) {
              try {
                await videoPreviewRef.current.play();
                logger.chat.success('Video preview started on second attempt');
              } catch (e) {
                logger.chat.error('Could not start video preview', { error: e });
              }
            }
          }, 100);
        }
      } else {
        logger.chat.error('videoPreviewRef.current is null!');
        // Si el ref es null, limpiar y salir
        stream.getTracks().forEach(track => track.stop());
        setIsRecordingVideo(false);
        return;
      }
      
      // Crear MediaRecorder
      const options = { mimeType: 'video/webm;codecs=vp8,opus' };
      const mediaRecorder = new MediaRecorder(stream, options);
      const chunks: Blob[] = [];
      
      logger.chat.debug('MediaRecorder created', { mimeType: options.mimeType });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
          logger.chat.debug('Chunk received', { size: event.data.size });
        }
      };
      
      mediaRecorder.onstop = async () => {
        logger.chat.info('Video recording stopped, processing');
        
        // Detener todos los tracks del stream
        stream.getTracks().forEach(track => {
          track.stop();
          logger.chat.debug('Track stopped', { kind: track.kind });
        });
        
        // Limpiar vista previa
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
          logger.chat.debug('Video preview cleaned');
        }
        
        // Crear blob del video
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        logger.chat.info('Video blob created', {
          size: videoBlob.size,
          sizeKB: (videoBlob.size / 1024).toFixed(2) + 'KB',
          sizeMB: (videoBlob.size / (1024 * 1024)).toFixed(2) + 'MB',
          type: videoBlob.type,
          duration: videoRecordingDuration
        });
        
        // Verificar tamaño ANTES de intentar subir
        const MAX_SIZE = 1024 * 1024; // 1MB
        if (videoBlob.size > MAX_SIZE) {
          const sizeMB = (videoBlob.size / (1024 * 1024)).toFixed(2);
          const errorMsg = `El video es demasiado grande (${sizeMB}MB). El límite es 1MB.\n\nPor favor, graba un video más corto (máximo 5-10 segundos).`;
          logger.chat.error('Video too large', { sizeMB, maxSizeMB: 1 });
          alert(errorMsg);
          setIsRecordingVideo(false);
          setVideoRecordingDuration(0);
          return;
        }
        
        try {
          // Convertir a Base64 y enviar
          logger.chat.debug('Converting video to Base64');
          const { uploadVoiceMessage } = await import('../../services/voiceMessageService');
          const videoUrl = await uploadVoiceMessage(videoBlob, match.id, currentUserId);
          
          logger.chat.success('Video converted successfully');
          logger.chat.info('Sending video message');
          
          // Enviar como mensaje de video
          onSendMessage(undefined, 'video', videoUrl, videoRecordingDuration);
          
          logger.chat.success('Video message sent successfully');
          
          setIsRecordingVideo(false);
          setVideoRecordingDuration(0);
          
        } catch (error) {
          logger.chat.error('Error processing video message', { 
            error,
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error)
          });
          alert(`Error procesando video: ${error instanceof Error ? error.message : 'Error desconocido'}`);
          setIsRecordingVideo(false);
          setVideoRecordingDuration(0);
        }
      };
      
      mediaRecorder.onerror = (error) => {
        logger.chat.error('MediaRecorder error', { error });
        stream.getTracks().forEach(track => track.stop());
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
        setIsRecordingVideo(false);
        setVideoRecordingDuration(0);
      };
      
      // Iniciar grabación
      mediaRecorder.start();
      logger.chat.info('Video recording started');
      
      // Contador de duración
      videoRecordingIntervalRef.current = setInterval(() => {
        setVideoRecordingDuration(prev => {
          // Límite de 30 segundos
          if (prev >= 30) {
            handleStopVideoRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
      
      // Guardar referencia
      (window as any).currentVideoRecorder = mediaRecorder;
      (window as any).currentVideoStream = stream;
      
    } catch (error) {
      logger.chat.error('Error starting video recording', { error });
      
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permisos de cámara denegados. Por favor, permite el acceso a la cámara y micrófono.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No se encontró cámara disponible.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'La cámara está siendo usada por otra aplicación.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      setIsRecordingVideo(false);
      setVideoRecordingDuration(0);
    }
  };

  const handleStopVideoRecording = () => {
    logger.chat.info('Stopping video recording');
    
    // Detener contador
    if (videoRecordingIntervalRef.current) {
      clearInterval(videoRecordingIntervalRef.current);
      videoRecordingIntervalRef.current = null;
    }
    
    // Limpiar vista previa
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    
    // Detener grabación
    const mediaRecorder = (window as any).currentVideoRecorder;
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      (window as any).currentVideoRecorder = null;
    }
  };

  const handleCancelVideoRecording = () => {
    logger.chat.info('Canceling video recording');
    
    // Detener contador
    if (videoRecordingIntervalRef.current) {
      clearInterval(videoRecordingIntervalRef.current);
      videoRecordingIntervalRef.current = null;
    }
    
    // Limpiar vista previa
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
    
    // Detener y limpiar
    const mediaRecorder = (window as any).currentVideoRecorder;
    const stream = (window as any).currentVideoStream;
    
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
    
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
    
    (window as any).currentVideoRecorder = null;
    (window as any).currentVideoStream = null;
    
    setIsRecordingVideo(false);
    setVideoRecordingDuration(0);
  };

  const formatRecordingDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter envía el mensaje (como WhatsApp Web)
    // Shift+Enter agrega nueva línea
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Funciones para envío de fotos
  const handlePhotoButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    logger.chat.info('Photos selected', { count: files.length });

    // Validar que sean imágenes
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }

    // Limitar a 5 fotos
    const limitedFiles = imageFiles.slice(0, 5);
    
    if (imageFiles.length > 5) {
      alert('Máximo 5 fotos por mensaje. Se seleccionaron las primeras 5.');
    }

    logger.chat.success('Opening photo preview modal', { photoCount: limitedFiles.length });

    // Mostrar modal de preview
    setSelectedFiles(limitedFiles);
    setShowPhotoPreview(true);

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendPhotos = async (photos: Array<{ base64: string; caption?: string; filter: string }>) => {
    logger.chat.info('Sending photos with filters', {
      count: photos.length,
      filters: photos.map(p => p.filter),
      hasCaption: photos.some(p => p.caption)
    });

    try {
      // Si es una sola foto, enviar con caption
      if (photos.length === 1) {
        const photo = photos[0];
        logger.chat.debug('Sending single photo', {
          filter: photo.filter,
          caption: photo.caption,
          base64Length: photo.base64.length
        });
        onSendMessage(photo.caption, 'image', photo.base64);
      } else {
        // Múltiples fotos: enviar cada una por separado
        logger.chat.debug('Sending multiple photos', { count: photos.length });
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          logger.chat.debug(`Sending photo ${i + 1}/${photos.length}`, {
            filter: photo.filter,
            base64Length: photo.base64.length
          });
          onSendMessage(undefined, 'image', photo.base64);
          // Pequeño delay entre fotos para mantener el orden
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      logger.chat.success('All photos sent successfully');
    } catch (error) {
      logger.chat.error('Error sending photos', { error });
      alert('Error enviando fotos. Por favor intenta de nuevo.');
    }
  };

  // Funciones para menú contextual de mensajes
  const handleMessageLongPress = (
    e: React.MouseEvent | React.TouchEvent,
    messageId: string,
    isOwnMessage: boolean,
    messageText?: string
  ) => {
    e.preventDefault();
    
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setContextMenu({
      isOpen: true,
      position: { x, y },
      messageId,
      isOwnMessage,
      messageText
    });
  };

  const handleCopyMessage = () => {
    if (contextMenu.messageText) {
      navigator.clipboard.writeText(contextMenu.messageText);
      logger.chat.success('Mensaje copiado al portapapeles');
    }
  };

  const handleDeleteForMe = async () => {
    try {
      await deleteMessageForMe(chatId, contextMenu.messageId, currentUserId);
      logger.chat.success('Mensaje borrado para ti');
    } catch (error) {
      logger.chat.error('Error borrando mensaje', error);
      alert('Error al borrar el mensaje');
    }
  };

  const handleDeleteForEveryone = async () => {
    try {
      await deleteMessageForEveryone(chatId, contextMenu.messageId, currentUserId);
      logger.chat.success('Mensaje borrado para todos');
    } catch (error) {
      logger.chat.error('Error borrando mensaje para todos', error);
      alert('Error al borrar el mensaje para todos');
    }
  };

  return (
    <div 
      className="flex flex-col bg-white chat-view-container" 
      style={{ 
        minWidth: 0,
        ...(isDesktop ? {
          height: 'calc(100vh - 8rem)',
          maxHeight: 'calc(100vh - 8rem)',
          overflow: 'hidden',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        } : {
          // Mobile: Fixed height layout
          height: '100dvh',
          maxHeight: '100dvh',
          overflow: 'hidden'
        })
      }}
    >
      {/* Header - Responsive */}
      <div className="bg-white backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-3 lg:py-4 flex items-center justify-between flex-shrink-0 z-20 safe-area-top" style={{
        ...(isDesktop ? {
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px'
        } : {})
      }}>
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button 
            onClick={onBack} 
            className="p-2 -ml-1 sm:-ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <img 
            src={match.user.images[0]} 
            alt={match.user.name}
            className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full profile-image-smart shadow-md flex-shrink-0 ring-2 ring-white" 
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm sm:text-base lg:text-lg truncate text-slate-800">{match.user.name}</h3>
            <p className={`text-[9px] sm:text-[10px] lg:text-xs font-semibold uppercase flex items-center gap-1.5 ${
              otherUserPresence.online ? 'text-emerald-500' : 'text-slate-400'
            }`}>
              <span className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${
                otherUserPresence.online ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}></span>
              {formatPresenceStatus(otherUserPresence, t)}
            </p>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 text-slate-400 flex-shrink-0">
          {/* Botón de IA Emocional */}
          <button 
            onClick={() => setShowEmotionalInsights(true)}
            className={`p-2 hover:bg-slate-100 rounded-full transition-colors relative min-w-[44px] min-h-[44px] flex items-center justify-center ${
              currentEmotion || conversationInsights ? 'text-purple-500' : ''
            }`}
            title="Análisis Emocional IA"
          >
            <Brain size={18} className="sm:w-5 sm:h-5" />
            {/* Indicador de actividad */}
            {isAnalyzing && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse"></div>
            )}
            {/* Indicador de insights disponibles */}
            {(currentEmotion || conversationInsights) && !isAnalyzing && (
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            )}
          </button>
        </div>
      </div>

      {/* Messages - Responsive */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 chat-messages-area"
        style={{
          background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
          flex: '1 1 auto',
          minHeight: 0,
          maxHeight: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-6 sm:py-8 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <Send className="text-white" size={20} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">{t('newMatchExclamation')}</h3>
            <p className="text-slate-600 text-sm mb-4">{t('sendFirstMessage', { name: match.user.name })}</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Filtrar mensajes borrados para el usuario actual
            if (msg.deletedFor?.includes(currentUserId)) {
              return null;
            }

            return (
              <div 
                key={msg.id} 
                className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                {/* Mensaje de texto */}
                {msg.type === 'text' && (
                  <div className="flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] lg:max-w-[65%]">
                    <div 
                      className={`px-4 sm:px-4 lg:px-5 py-2.5 sm:py-2.5 lg:py-3 rounded-2xl text-sm lg:text-base message-bubble cursor-pointer inline-block transition-all hover:scale-[1.02] ${
                        msg.senderId === currentUserId 
                          ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-tr-none shadow-lg shadow-rose-200' 
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-md hover:shadow-lg'
                      } ${msg.deletedForEveryone ? 'italic opacity-60' : ''}`}
                      style={{ 
                        wordBreak: 'break-word', 
                        overflowWrap: 'break-word'
                      }}
                      onContextMenu={(e) => handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, msg.text)}
                      onTouchStart={(e) => {
                        const touchTimer = setTimeout(() => {
                          handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, msg.text);
                        }, 500);
                        (e.currentTarget as any).touchTimer = touchTimer;
                      }}
                      onTouchEnd={(e) => {
                        const touchTimer = (e.currentTarget as any).touchTimer;
                        if (touchTimer) {
                          clearTimeout(touchTimer);
                        }
                      }}
                    >
                      {msg.text}
                    </div>
                    {/* Indicador de visto (solo para mensajes propios) */}
                    {msg.senderId === currentUserId && (
                      <div className="flex items-center justify-end gap-1 px-1">
                        {msg.isRead || msg.readBy?.length ? (
                          <CheckCheck size={14} className="text-blue-500" />
                        ) : (
                          <Check size={14} className="text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Mensaje de emoji */}
              {msg.type === 'emoji' && (
                <div 
                  className={`inline-block max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-2xl sm:text-3xl ${
                    msg.senderId === currentUserId 
                      ? 'bg-rose-500 rounded-tr-none shadow-md shadow-rose-100' 
                      : 'bg-white rounded-tl-none border border-slate-100 shadow-sm'
                  }`}
                  style={{ width: 'fit-content' }}
                >
                  {msg.content}
                </div>
              )}

              {/* Mensaje de voz */}
              {msg.type === 'voice' && msg.content && msg.duration && (
                <VoiceMessage
                  audioUrl={msg.content}
                  duration={msg.duration}
                  isOwn={msg.senderId === currentUserId}
                  timestamp={msg.timestamp}
                  onContextMenu={(e) => handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, 'Mensaje de voz')}
                  onTouchStart={(e) => {
                    const touchTimer = setTimeout(() => {
                      handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, 'Mensaje de voz');
                    }, 500);
                    (e.currentTarget as any).touchTimer = touchTimer;
                  }}
                  onTouchEnd={(e) => {
                    const touchTimer = (e.currentTarget as any).touchTimer;
                    if (touchTimer) {
                      clearTimeout(touchTimer);
                    }
                  }}
                />
              )}

              {/* Videomensaje */}
              {msg.type === 'video' && msg.content && (
                <VideoMessage
                  videoUrl={msg.content}
                  duration={msg.duration}
                  isOwn={msg.senderId === currentUserId}
                  timestamp={msg.timestamp}
                  onContextMenu={(e) => handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, 'Videomensaje')}
                  onTouchStart={(e) => {
                    const touchTimer = setTimeout(() => {
                      handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, 'Videomensaje');
                    }, 500);
                    (e.currentTarget as any).touchTimer = touchTimer;
                  }}
                  onTouchEnd={(e) => {
                    const touchTimer = (e.currentTarget as any).touchTimer;
                    if (touchTimer) {
                      clearTimeout(touchTimer);
                    }
                  }}
                />
              )}

              {/* Mensaje de foto */}
              {msg.type === 'image' && msg.content && (
                <PhotoMessage
                  photoUrl={msg.content}
                  isOwn={msg.senderId === currentUserId}
                  timestamp={msg.timestamp}
                  caption={msg.text}
                  onContextMenu={(e) => handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, msg.text || 'Imagen')}
                  onTouchStart={(e) => {
                    const touchTimer = setTimeout(() => {
                      handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, msg.text || 'Imagen');
                    }, 500);
                    (e.currentTarget as any).touchTimer = touchTimer;
                  }}
                  onTouchEnd={(e) => {
                    const touchTimer = (e.currentTarget as any).touchTimer;
                    if (touchTimer) {
                      clearTimeout(touchTimer);
                    }
                  }}
                />
              )}

              {/* Reacción a historia */}
              {msg.type === 'story_reaction' && (
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm flex flex-col items-center gap-2 ${
                    msg.senderId === currentUserId 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-tr-none shadow-md shadow-purple-100' 
                      : 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-800 rounded-tl-none border border-purple-200 shadow-sm'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{msg.text}</span>
                  <span className="text-xs opacity-70">Reaccionó a tu historia</span>
                </div>
              )}
            </div>
            );
          })
        )}

        {/* Typing Indicator - Real-time with Firebase */}
        <TypingIndicator 
          userName={match.user.name}
          isVisible={otherUserTyping}
        />

        {/* AI Icebreakers Section - Responsive */}
        <div className="pt-3 sm:pt-4 flex flex-col items-center px-2 sm:px-0">
          {!icebreakers.length && !loadingIce && (
            <button 
              onClick={loadIcebreakers}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 sm:px-4 py-2 rounded-full text-xs font-black shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors min-h-[44px]"
            >
              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" /> Romper el hielo con IA
            </button>
          )}

          {loadingIce && (
            <div className="flex items-center gap-2 text-indigo-400">
              <Loader2 className="animate-spin" size={14} />
              <span className="text-xs">Generando sugerencias...</span>
            </div>
          )}

          {icebreakers.length > 0 && (
            <div className="w-full space-y-2">
              <p className="text-[9px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-2">
                Sugerencias bacanas
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {icebreakers.map((ice, i) => (
                  <button 
                    key={i}
                    onClick={() => setInputValue(ice)}
                    className="shrink-0 bg-white border border-indigo-100 text-[10px] sm:text-[11px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-slate-700 shadow-sm hover:bg-indigo-50 transition-colors min-h-[44px] flex items-center"
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias de IA Emocional - Responsive */}
          {smartSuggestions.length > 0 && (
            <div className="w-full space-y-2 mt-3 sm:mt-4">
              <p className="text-[9px] sm:text-[10px] font-black text-purple-400 uppercase tracking-widest ml-2 flex items-center gap-1">
                <Brain size={8} className="sm:w-2.5 sm:h-2.5" />
                IA Emocional sugiere
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {smartSuggestions.slice(0, 3).map((suggestion) => (
                  <button 
                    key={suggestion.id}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="shrink-0 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 text-[10px] sm:text-[11px] px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-purple-700 shadow-sm hover:from-purple-100 hover:to-pink-100 transition-all min-h-[44px] flex flex-col items-center justify-center"
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[9px] sm:text-xs opacity-70">{Math.round(suggestion.confidence * 100)}%</span>
                      <div className="flex">
                        {suggestion.emotionalContext.slice(0, 2).map((emotion, i) => (
                          <span key={i} className="text-[10px] sm:text-xs">
                            {emotion === 'joy' ? '😊' : 
                             emotion === 'flirtation' ? '😏' :
                             emotion === 'interest' ? '🤔' :
                             emotion === 'love' ? '❤️' :
                             emotion === 'playfulness' ? '😄' : '🙂'}
                          </span>
                        ))}
                      </div>
                    </div>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input - Responsive */}
      <div 
        className="p-3 sm:p-4 lg:p-5 bg-white border-t border-slate-200 safe-area-bottom chat-input-area flex-shrink-0"
        style={{
          flexShrink: 0,
          flexGrow: 0,
          ...(isDesktop ? {
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
          } : {
            boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
          })
        }}
      >
        
        {/* Grabación de voz activa - Responsive */}
        {isRecording && (
          <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between recording-indicator-mobile">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-red-700 font-medium text-sm">Grabando audio...</span>
              <span className="text-red-600 text-sm">{formatRecordingDuration(recordingDuration)}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleCancelVoiceRecording}
                className="px-3 py-1.5 text-red-600 text-sm hover:bg-red-100 rounded-lg transition-colors min-h-[44px] flex items-center"
              >
                Cancelar
              </button>
              <button
                onClick={handleStopVoiceRecording}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1 min-h-[44px]"
              >
                <StopCircle size={14} />
                Enviar
              </button>
            </div>
          </div>
        )}

        {/* Grabación de video activa - Responsive */}
        {isRecordingVideo && (
          <div className="mb-3 sm:mb-4 bg-purple-50 border border-purple-200 rounded-2xl p-3 sm:p-4">
            {/* Vista previa de video */}
            <div className="relative mb-2 rounded-xl overflow-hidden bg-black mx-auto" style={{ maxWidth: 'min(280px, calc(100vw - 4rem))' }}>
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full object-cover"
                style={{ 
                  transform: 'scaleX(-1)',
                  aspectRatio: '4/5',
                  maxHeight: '35vh'
                }}
              />
              {/* Overlay con información */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-medium">REC</span>
                </div>
                <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-white text-sm font-mono">
                    {formatRecordingDuration(videoRecordingDuration)} / 0:30
                  </span>
                </div>
              </div>
            </div>
            
            {/* Botones de control */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-700">
                <VideoIcon size={18} />
                <span className="text-sm font-medium">Grabando videomensaje...</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelVideoRecording}
                  className="px-3 py-1.5 text-purple-600 text-sm hover:bg-purple-100 rounded-lg transition-colors min-h-[44px] flex items-center"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleStopVideoRecording}
                  className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1 min-h-[44px]"
                >
                  <StopCircle size={14} />
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-0.5 sm:gap-1.5 lg:gap-2 bg-slate-50 rounded-full px-1.5 sm:px-3 lg:px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all w-full border border-slate-200">
          
          {/* Input file oculto para fotos */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoSelect}
            className="hidden"
          />

          {/* Botón de emoji */}
          <button
            onClick={() => setShowEmojiPicker(true)}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 sm:p-2 min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center flex-shrink-0 rounded-full hover:bg-slate-100"
            disabled={isRecording || isRecordingVideo}
          >
            <Smile size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Botón de foto */}
          <button
            onClick={handlePhotoButtonClick}
            className="text-slate-400 hover:text-rose-500 transition-colors p-1 sm:p-2 min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center flex-shrink-0 rounded-full hover:bg-slate-100"
            title="Enviar foto"
            disabled={isRecording || isRecordingVideo}
          >
            <ImageIcon size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Botón de videomensaje */}
          <button
            onClick={isRecordingVideo ? handleStopVideoRecording : handleStartVideoRecording}
            className={`transition-colors p-1 sm:p-2 min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center flex-shrink-0 rounded-full hover:bg-slate-100 ${
              isRecordingVideo 
                ? 'text-purple-500 hover:text-purple-600' 
                : 'text-slate-400 hover:text-rose-500'
            }`}
            title={isRecordingVideo ? 'Detener grabación de video' : 'Grabar videomensaje'}
            disabled={isRecording}
          >
            <VideoIcon size={16} className="sm:w-5 sm:h-5" />
          </button>

          {/* Botón de micrófono */}
          <button
            onClick={isRecording ? handleStopVoiceRecording : handleStartVoiceRecording}
            className={`transition-colors p-1 sm:p-2 min-w-[32px] min-h-[32px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center flex-shrink-0 rounded-full hover:bg-slate-100 ${
              isRecording 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-slate-400 hover:text-rose-500'
            }`}
            title={isRecording ? 'Detener grabación' : 'Grabar mensaje de voz'}
            disabled={isRecordingVideo}
          >
            {isRecording ? <MicOff size={16} className="sm:w-5 sm:h-5" /> : <Mic size={16} className="sm:w-5 sm:h-5" />}
          </button>

          <textarea 
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t('typeSomethingCool')}
            rows={1}
            className="flex-1 bg-transparent border-none focus:ring-0 py-2 sm:py-3 text-sm lg:text-base outline-none placeholder-slate-400 min-h-[36px] sm:min-h-[44px] max-h-[120px] min-w-0 resize-none overflow-y-auto"
            disabled={isRecording || isRecordingVideo}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isRecording || isRecordingVideo}
            className={`p-2 sm:p-2.5 rounded-full transition-all min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center flex-shrink-0 ${
              inputValue.trim() && !isRecording && !isRecordingVideo
                ? 'text-white bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 shadow-lg shadow-rose-200 hover:shadow-xl hover:scale-105' 
                : 'text-slate-300 bg-slate-100'
            }`}
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onEmojiSelect={handleSendEmoji}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* Emotional AI Insights */}
      <EmotionalInsights
        isOpen={showEmotionalInsights}
        onClose={() => setShowEmotionalInsights(false)}
        currentEmotion={currentEmotion}
        conversationInsights={conversationInsights}
        smartSuggestions={smartSuggestions}
        conversationMetrics={conversationMetrics}
        onSuggestionSelect={handleSuggestionSelect}
      />

      {/* Photo Preview Modal */}
      <PhotoPreviewModal
        isOpen={showPhotoPreview}
        files={selectedFiles}
        onClose={() => {
          setShowPhotoPreview(false);
          setSelectedFiles([]);
        }}
        onSend={handleSendPhotos}
      />

      {/* Message Context Menu */}
      <MessageContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        isOwnMessage={contextMenu.isOwnMessage}
        onDeleteForMe={handleDeleteForMe}
        onDeleteForEveryone={handleDeleteForEveryone}
        onCopy={handleCopyMessage}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
      />
    </div>
  );
};

export default ChatView;