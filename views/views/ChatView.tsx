import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  Send, 
  Phone, 
  Video, 
  Mic, 
  MicOff,
  Sparkles, 
  Loader2, 
  Smile,
  Image,
  Camera,
  StopCircle,
  Brain
} from 'lucide-react';
import { Match, Message, Call } from '../../types';
import { getIcebreakerSuggestions } from '../../services/geminiService';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendMessage, updateTypingStatus, listenToTypingStatus } from '../../services/chatService';
import { callManager, listenToIncomingCalls } from '../../services/callService';
import { VoiceRecorder, uploadVoiceMessage } from '../../services/voiceMessageService';
import EmojiPicker from '../../components/EmojiPicker';
import CallInterface from '../../components/CallInterface';
import VoiceMessage from '../../components/VoiceMessage';
import EmotionalInsights from '../../components/EmotionalInsights';
import { useEmotionalAI } from '../../hooks/useEmotionalAI';
import TypingIndicator from '../../components/TypingIndicator';
import { SmartSuggestion } from '../../services/emotionalAI';
import { listenToUserPresence, formatPresenceStatus, PresenceStatus } from '../../services/presenceService';

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
  console.log('🚀 ChatView montado:', { 
    chatId, 
    currentUserId, 
    matchUserId: match.user.id, 
    matchUserName: match.user.name,
    'Escuchando typing de': match.user.id
  });
  
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIce, setLoadingIce] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserPresence, setOtherUserPresence] = useState<PresenceStatus>({ online: false, lastSeen: Date.now() });
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estados para nuevas funcionalidades
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [incomingCalls, setIncomingCalls] = useState<Call[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estados para IA Emocional
  const [showEmotionalInsights, setShowEmotionalInsights] = useState(false);
  
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
      // Limpiar interval de grabación
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      // Limpiar timeout de typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Limpiar typing status al salir
      if (chatId && currentUserId) {
        updateTypingStatus(chatId, currentUserId, false);
      }
      
      // Cancelar grabación si está activa
      const recorder = (window as any).currentVoiceRecorder;
      if (recorder) {
        recorder.cancelRecording();
        (window as any).currentVoiceRecorder = null;
      }
    };
  }, [chatId, currentUserId]);

  // Escuchar typing status del otro usuario
  useEffect(() => {
    console.log('='.repeat(50));
    console.log('🎯 TYPING LISTENER USEEFFECT EJECUTÁNDOSE');
    console.log('chatId:', chatId);
    console.log('match.user.id:', match.user.id);
    console.log('match.user.name:', match.user.name);
    console.log('='.repeat(50));
    
    if (!chatId || !match.user.id) {
      console.log('❌ Falta chatId o match.user.id, saliendo');
      return;
    }
    
    console.log('✅ Configurando listener de typing...');
    
    const unsubscribe = listenToTypingStatus(chatId, match.user.id, (isTyping) => {
      console.log('🔔 Typing status changed:', { userName: match.user.name, isTyping });
      setOtherUserTyping(isTyping);
    });
    
    console.log('✅ Listener configurado exitosamente');
    
    return () => {
      console.log('🧹 Limpiando listener de typing');
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [chatId, match.user.id]);

  // Listen to other user's presence status
  useEffect(() => {
    console.log('👁️ Setting up presence listener for:', match.user.id);
    
    if (!match.user.id) {
      return;
    }
    
    const unsubscribe = listenToUserPresence(match.user.id, (status) => {
      console.log('🟢 Presence status updated:', { userId: match.user.id, status });
      setOtherUserPresence(status);
    });
    
    return () => {
      console.log('🧹 Cleaning up presence listener');
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

  // Escuchar llamadas entrantes
  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    
    const unsubscribe = listenToIncomingCalls(currentUserId, (calls) => {
      setIncomingCalls(calls);
      // Si hay una llamada entrante para este chat, mostrarla
      const incomingCall = calls.find(call => 
        call.chatId === match.id && call.status === 'ringing'
      );
      if (incomingCall) {
        setCurrentCall(incomingCall);
      }
    });

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [currentUserId, match.id]);

  // Configurar call manager
  useEffect(() => {
    const handleCallStateChange = (call: Call | null) => {
      setCurrentCall(call);
    };

    callManager.onCallStateChange = handleCallStateChange;

    return () => {
      callManager.onCallStateChange = undefined;
    };
  }, []);

  const loadIcebreakers = async () => {
    setLoadingIce(true);
    try {
      const suggestions = await getIcebreakerSuggestions(match.user.name, match.user.interests);
      setIcebreakers(suggestions);
    } catch (error) {
      console.error('Error loading icebreakers:', error);
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
      
      // Limpiar typing status
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      updateTypingStatus(chatId, currentUserId, false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    console.log('⌨️ Input changed, updating typing status:', { value: value.trim() ? 'typing' : 'not typing', chatId, currentUserId });
    
    // Limpiar timeout anterior
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (value.trim()) {
      // Usuario está escribiendo
      updateTypingStatus(chatId, currentUserId, true);
      
      // Establecer timeout para limpiar después de 15 segundos de inactividad
      typingTimeoutRef.current = setTimeout(() => {
        console.log('⏱️ Timeout: Limpiando typing status después de 15 segundos');
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
            console.error('Error procesando mensaje de voz:', error);
            setIsRecording(false);
            setRecordingDuration(0);
          }
        },
        // onError
        (error: Error) => {
          console.error('Error en grabación:', error);
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
      console.error('Error iniciando grabación:', error);
      
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
      
      console.error('Error iniciando grabación:', errorMessage);
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

  const handleStartCall = async (type: 'voice' | 'video') => {
    try {
      // Verificar permisos primero
      const constraints = {
        audio: true,
        video: type === 'video'
      };
      
      // Solicitar permisos antes de crear la llamada
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Crear llamada simulada (en producción usar callManager.startCall)
      const mockCall: Call = {
        id: 'test-call-' + Date.now(),
        chatId: match.id,
        callerId: currentUserId,
        receiverId: match.user.id,
        type,
        status: 'active', // Directamente activa para pruebas
        startTime: Date.now()
      };
      
      setCurrentCall(mockCall);
      
      // No limpiar el stream inmediatamente, dejarlo para CallInterface
      
    } catch (error) {
      console.error('Error iniciando llamada:', error);
      
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Permisos denegados. Por favor, permite el acceso a la cámara y micrófono.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No se encontró cámara o micrófono disponible.';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'La cámara está siendo usada por otra aplicación.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error('Error iniciando llamada:', errorMessage);
    }
  };

  const formatRecordingDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
      {/* Header - Responsive */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-20 safe-area-top">
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
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full profile-image-smart shadow-sm flex-shrink-0" 
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm sm:text-base truncate">{match.user.name}</h3>
            <p className={`text-[9px] sm:text-[10px] font-bold uppercase flex items-center gap-1 ${
              otherUserPresence.online ? 'text-emerald-500' : 'text-slate-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                otherUserPresence.online ? 'bg-emerald-500' : 'bg-slate-400'
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
          
          <button 
            onClick={() => handleStartCall('voice')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Phone size={18} className="sm:w-5 sm:h-5 cursor-pointer hover:text-slate-600 transition-colors" />
          </button>
          <button 
            onClick={() => handleStartCall('video')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Video size={18} className="sm:w-5 sm:h-5 cursor-pointer hover:text-slate-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages - Responsive */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-slate-50/50 no-scrollbar"
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
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              {/* Mensaje de texto */}
              {msg.type === 'text' && (
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-sm ${
                    msg.senderId === currentUserId 
                      ? 'bg-rose-500 text-white rounded-tr-none shadow-md shadow-rose-100' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Mensaje de emoji */}
              {msg.type === 'emoji' && (
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-2xl sm:text-3xl ${
                    msg.senderId === currentUserId 
                      ? 'bg-rose-500 rounded-tr-none shadow-md shadow-rose-100' 
                      : 'bg-white rounded-tl-none border border-slate-100 shadow-sm'
                  }`}
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
          ))
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
      <div className="p-3 sm:p-4 bg-white border-t border-slate-100 safe-area-bottom">
        
        {/* Grabación de voz activa - Responsive */}
        {isRecording && (
          <div className="mb-3 sm:mb-4 bg-red-50 border border-red-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-red-700 font-medium text-sm">Grabando...</span>
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

        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 sm:px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all">
          
          {/* Botón de emoji - Touch optimized */}
          <button
            onClick={() => setShowEmojiPicker(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Smile size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Botón de micrófono - Touch optimized */}
          <button
            onClick={isRecording ? handleStopVoiceRecording : handleStartVoiceRecording}
            className={`transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${
              isRecording 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title={isRecording ? 'Detener grabación' : 'Iniciar grabación de voz'}
          >
            {isRecording ? <MicOff size={18} className="sm:w-5 sm:h-5" /> : <Mic size={18} className="sm:w-5 sm:h-5" />}
          </button>

          <input 
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t('typeSomethingCool')}
            className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm outline-none placeholder-slate-400 min-h-[44px]"
            disabled={isRecording}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isRecording}
            className={`p-2 rounded-full transition-all min-w-[44px] min-h-[44px] flex items-center justify-center ${
              inputValue.trim() && !isRecording
                ? 'text-white bg-rose-500 hover:bg-rose-600 shadow-md' 
                : 'text-slate-300'
            }`}
          >
            <Send size={16} className="sm:w-4.5 sm:h-4.5" />
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

      {/* Call Interface */}
      {currentCall && (
        <CallInterface
          call={currentCall}
          isIncoming={currentCall?.receiverId === currentUserId}
          onAnswer={() => {
            // Llamada respondida
          }}
          onDecline={() => {
            setCurrentCall(null);
          }}
          onEnd={() => {
            setCurrentCall(null);
          }}
          otherUserName={match.user.name}
          otherUserImage={match.user.images[0]}
        />
      )}
    </div>
  );
};

export default ChatView;