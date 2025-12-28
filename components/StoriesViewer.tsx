// cita-rd/components/StoriesViewer.tsx
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send } from 'lucide-react';
import { Story, StoryGroup, storiesService } from '../services/storiesService';
import { privacyService } from '../services/privacyService';

interface StoriesViewerProps {
  isOpen: boolean;
  storyGroup: StoryGroup | null;
  currentUserId: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({
  isOpen,
  storyGroup,
  currentUserId,
  onClose,
  onNext,
  onPrevious
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactionInput, setShowReactionInput] = useState(false);
  const [reactionText, setReactionText] = useState('');
  const [canReply, setCanReply] = useState(true);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const storyDuration = 5000; // 5 segundos por story

  // Resetear cuando cambia el grupo de stories
  useEffect(() => {
    if (storyGroup) {
      setCurrentStoryIndex(0);
      setProgress(0);
      setShowReactionInput(false);
      setReactionText('');
      
      // Verificar permisos de respuesta
      checkReplyPermissions();
    }
  }, [storyGroup]);

  // Verificar si el usuario puede responder a las stories
  const checkReplyPermissions = async () => {
    if (!storyGroup) return;
    
    try {
      const canReplyToStories = await privacyService.canReplyToStories(currentUserId, storyGroup.userId);
      setCanReply(canReplyToStories);
      console.log('💬 Permisos de respuesta:', canReplyToStories);
    } catch (error) {
      console.error('Error verificando permisos de respuesta:', error);
      setCanReply(false);
    }
  };

  // Manejar progreso automático
  useEffect(() => {
    if (!isOpen || isPaused || !storyGroup) return;

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (storyDuration / 100));
        
        if (newProgress >= 100) {
          // Avanzar a la siguiente story
          if (currentStoryIndex < storyGroup.stories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            return 0;
          } else {
            // Última story, cerrar o ir al siguiente grupo
            if (onNext) {
              onNext();
            } else {
              onClose();
            }
            return 0;
          }
        }
        
        return newProgress;
      });
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isOpen, isPaused, currentStoryIndex, storyGroup, onNext, onClose]);

  // Marcar story como vista
  useEffect(() => {
    if (storyGroup && currentStoryIndex < storyGroup.stories.length) {
      const currentStory = storyGroup.stories[currentStoryIndex];
      storiesService.markStoryAsViewed(currentStory.id, currentUserId);
    }
  }, [currentStoryIndex, storyGroup, currentUserId]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setProgress(0);
    } else if (onPrevious) {
      onPrevious();
    }
  };

  const handleNext = () => {
    if (storyGroup && currentStoryIndex < storyGroup.stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setProgress(0);
    } else if (onNext) {
      onNext();
    } else {
      onClose();
    }
  };

  const handleReaction = (emoji: string) => {
    console.log('❤️ Reacción enviada:', emoji, 'a story de', storyGroup?.user.name);
    // Aquí se enviaría la reacción al backend
    
    // Mostrar feedback visual
    const reactionElement = document.createElement('div');
    reactionElement.textContent = emoji;
    reactionElement.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl z-50 pointer-events-none animate-ping';
    document.body.appendChild(reactionElement);
    
    setTimeout(() => {
      document.body.removeChild(reactionElement);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (reactionText.trim()) {
      console.log('💬 Mensaje enviado:', reactionText, 'a', storyGroup?.user.name);
      // Aquí se enviaría el mensaje al chat
      setReactionText('');
      setShowReactionInput(false);
      
      // Mostrar feedback
      alert(`💬 Mensaje enviado a ${storyGroup?.user.name}: "${reactionText}"`);
    }
  };

  if (!isOpen || !storyGroup || storyGroup.stories.length === 0) {
    return null;
  }

  const currentStory = storyGroup.stories[currentStoryIndex];
  const timeAgo = Math.floor((Date.now() - currentStory.createdAt.getTime()) / (1000 * 60 * 60));

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
        {storyGroup.stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index < currentStoryIndex ? '100%' : 
                       index === currentStoryIndex ? `${progress}%` : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <img
            src={storyGroup.user.avatar}
            alt={storyGroup.user.name}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <p className="text-white font-semibold">{storyGroup.user.name}</p>
            <p className="text-white/70 text-sm">{timeAgo}h</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Story content */}
      <div 
        className="w-full h-full flex items-center justify-center relative"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {currentStory.type === 'image' ? (
          <img
            src={currentStory.content}
            alt="Story"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{ 
              backgroundColor: currentStory.backgroundColor || '#FF6B6B',
              color: currentStory.textColor || '#FFFFFF'
            }}
          >
            <p className="text-3xl font-bold text-center leading-relaxed">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Navigation areas */}
        <button
          onClick={handlePrevious}
          className="absolute left-0 top-0 w-1/3 h-full z-10 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-0 top-0 w-1/3 h-full z-10 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronRight size={32} className="text-white" />
        </button>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-8 left-4 right-4 z-20">
        {showReactionInput ? (
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full p-2">
            <input
              type="text"
              value={reactionText}
              onChange={(e) => setReactionText(e.target.value)}
              placeholder={`Responder a ${storyGroup.user.name}...`}
              className="flex-1 bg-transparent text-white placeholder-white/70 px-3 py-2 outline-none"
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <Send size={20} />
            </button>
            <button
              onClick={() => setShowReactionInput(false)}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            {/* Quick reactions */}
            <div className="flex gap-2">
              {['❤️', '😍', '😂', '😮', '👏'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-2xl p-2 hover:scale-110 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
            
            {/* Message button */}
            {canReply ? (
              <button
                onClick={() => setShowReactionInput(true)}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 text-white hover:bg-white/30 transition-colors"
              >
                <Send size={16} />
                <span className="text-sm">Enviar mensaje</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/60">
                <X size={16} />
                <span className="text-sm">Respuestas deshabilitadas</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesViewer;