import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Phone, Video, Mic, Sparkles, Loader2, MoreHorizontal } from 'lucide-react';
import { Match, Message } from '../../types';
import { getIcebreakerSuggestions } from '../../services/geminiService';

interface ChatViewProps {
  match: Match;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ match, messages, onSendMessage, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [icebreakers, setIcebreakers] = useState<string[]>([]);
  const [loadingIce, setLoadingIce] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
      onSendMessage(inputValue);
      setInputValue('');
    }
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
          <Phone size={20} className="cursor-pointer hover:text-slate-600 transition-colors" />
          <Video size={20} className="cursor-pointer hover:text-slate-600 transition-colors" />
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
            <h3 className="text-lg font-bold text-slate-800 mb-2">¡Nuevo Match!</h3>
            <p className="text-slate-600 text-sm mb-4">Envía el primer mensaje a {match.user.name}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  msg.senderId === 'me' 
                    ? 'bg-rose-500 text-white rounded-tr-none shadow-md shadow-rose-100' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                }`}
              >
                {msg.text}
              </div>
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
        <div className="flex items-center gap-2 bg-slate-100 rounded-full px-4 py-1 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all">
          <Mic className="text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" size={20} />
          <input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe algo bacano..."
            className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm outline-none placeholder-slate-400"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-1 rounded-full transition-all ${
              inputValue.trim() 
                ? 'text-white bg-rose-500 hover:bg-rose-600 shadow-md' 
                : 'text-slate-300'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;