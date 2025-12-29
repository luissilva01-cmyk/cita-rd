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
  StopCircle
} from 'lucide-react';
import { Match, Message, Call } from '../../types';
import { getIcebreakerSuggestions } from '../../services/geminiService';
import { useLanguage } from '../../contexts/LanguageContext';
import { sendMessage } from '../../services/chatService';
import { callManager, listenToIncomingCalls } from '../../services/callService';
import { VoiceRecorder, uploadVoiceMessage } from '../../services/voiceMessageService';
import EmojiPicker from '../../components/EmojiPicker';
import CallInterface from '../../components/CallInterface';
import VoiceMessage from '../../components/VoiceMessage';

interface ChatViewProps {
  match: Match;
  messages: Message[];
  onSendMessage: (text?: string, type?: Message['type'], content?: string, duration?: number) => void;
  onBack: () => void;
  currentUserId: string;
}

const ChatView: React.FC<ChatViewProps> = ({ 
  match, 
  messages, 
  onSendMessage, 
  onBack, 
  currentUserId 
}) => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIce, setLoadingIce] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Estados para nuevas funcionalidades
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [voiceRecorder] = useState(() => new VoiceRecorder(
    undefined, // onDataAvailable se configurará después
    undefined  // onError se configurará después
  ));
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [incomingCalls, setIncomingCalls] = useState<Call[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Escuchar llamadas entrantes
  useEffect(() => {
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

    return () => unsubscribe();
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
    }
  };

  const handleSendEmoji = (emoji: string) => {
    onSendMessage(undefined, 'emoji', emoji);
  };

  const handleStartVoiceRecording = async () => {
    try {
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Configurar grabador de voz
      voiceRecorder.onDataAvailable = async (duration, audioBlob) => {
        try {
          console.log('🎤 Subiendo mensaje de voz...');
          const audioUrl = await uploadVoiceMessage(audioBlob, match.id, currentUserId);
          onSendMessage(undefined, 'voice', audioUrl, duration);
          console.log('✅ Mensaje de voz enviado');
        } catch (error) {
          console.error('❌ Error enviando mensaje de voz:', error);
        }
      };

      voiceRecorder.onError = (error) => {
        console.error('❌ Error en grabación:', error);
        setIsRecording(false);
        setRecordingDuration(0);
      };

      await voiceRecorder.startRecording();
      
      // Contador de duración
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error iniciando grabación:', error);
      setIsRecording(false);
    }
  };

  const handleStopVoiceRecording = () => {
    if (voiceRecorder.isRecording()) {
      voiceRecorder.stopRecording();
    }
    setIsRecording(false);
    setRecordingDuration(0);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleCancelVoiceRecording = () => {
    voiceRecorder.cancelRecording();
    setIsRecording(false);
    setRecordingDuration(0);
    
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleStartCall = async (type: 'voice' | 'video') => {
    try {
      console.log('📞 Iniciando llamada:', type);
      await callManager.startCall(match.id, currentUserId, match.user.id, type);
    } catch (error) {
      console.error('❌ Error iniciando llamada:', error);
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
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <img 
            src={match.user.images[0]} 
            alt={match.user.name}
            className="w-10 h-10 rounded-full object-cover shadow-sm" 
          />
          <div>
            <h3 className="font-bold text-sm">{match.user.name}</h3>
            <p className="text-[10px] text-emerald-500 font-bold uppercase">Online</p>
          </div>
        </div>
        <div className="flex gap-2 text-slate-400">
          <button 
            onClick={() => handleStartCall('voice')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Phone size={20} className="cursor-pointer hover:text-slate-600 transition-colors" />
          </button>
          <button 
            onClick={() => handleStartCall('video')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Video size={20} className="cursor-pointer hover:text-slate-600 transition-colors" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 no-scrollbar"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Send className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">{t('newMatchExclamation')}</h3>
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
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
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
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-3xl ${
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
            </div>
          ))
        )}

        {/* AI Icebreakers Section */}
        <div className="pt-4 flex flex-col items-center">
          {!icebreakers.length && !loadingIce && (
            <button 
              onClick={loadIcebreakers}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black shadow-sm border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              <Sparkles size={14} /> Romper el hielo con IA
            </button>
          )}

          {loadingIce && (
            <div className="flex items-center gap-2 text-indigo-400">
              <Loader2 className="animate-spin" size={16} />
              <span className="text-xs">Generando sugerencias...</span>
            </div>
          )}

          {icebreakers.length > 0 && (
            <div className="w-full space-y-2">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-2">
                Sugerencias bacanas
              </p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {icebreakers.map((ice, i) => (
                  <button 
                    key={i}
                    onClick={() => setInputValue(ice)}
                    className="shrink-0 bg-white border border-indigo-100 text-[11px] px-4 py-3 rounded-2xl text-slate-700 shadow-sm hover:bg-indigo-50 transition-colors"
                  >
                    {ice}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        
        {/* Grabación de voz activa */}
        {isRecording && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Grabando...</span>
              <span className="text-red-600 text-sm">{formatRecordingDuration(recordingDuration)}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCancelVoiceRecording}
                className="px-3 py-1 text-red-600 text-sm hover:bg-red-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleStopVoiceRecording}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
              >
                <StopCircle size={14} />
                Enviar
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all">
          
          {/* Botón de emoji */}
          <button
            onClick={() => setShowEmojiPicker(true)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Smile size={20} />
          </button>

          {/* Botón de micrófono */}
          <button
            onClick={isRecording ? handleStopVoiceRecording : handleStartVoiceRecording}
            className={`transition-colors ${
              isRecording 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typeSomethingCool')}
            className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm outline-none placeholder-slate-400"
            disabled={isRecording}
          />
          
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isRecording}
            className={`p-1 rounded-full transition-all ${
              inputValue.trim() && !isRecording
                ? 'text-white bg-rose-500 hover:bg-rose-600 shadow-md' 
                : 'text-slate-300'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onEmojiSelect={handleSendEmoji}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* Call Interface */}
      <CallInterface
        call={currentCall}
        isIncoming={currentCall?.receiverId === currentUserId}
        onAnswer={() => console.log('Llamada respondida')}
        onDecline={() => setCurrentCall(null)}
        onEnd={() => setCurrentCall(null)}
        otherUserName={match.user.name}
        otherUserImage={match.user.images[0]}
      />
    </div>
  );
};

export default ChatView;