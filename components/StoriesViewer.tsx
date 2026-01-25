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
  onSendMessage?: (userId: string, message: string, type?: 'text' | 'story_reaction') => void;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({
  isOpen,
  storyGroup,
  currentUserId,
  onClose,
  onNext,
  onPrevious,
  onSendMessage
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactionInput, setShowReactionInput] = useState(false);
  const [reactionText, setReactionText] = useState('');
  const [canReply, setCanReply] = useState(true);
  
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const storyDuration = 5000; // 5 segundos por story

  // Resetear cuando cambia el grupo de stories con mejor manejo de errores
  useEffect(() => {
    if (storyGroup) {
      try {
        // Validar que el grupo tenga stories válidas
        if (!storyGroup.stories || storyGroup.stories.length === 0) {
          console.error('StoriesViewer: Grupo sin stories válidas');
          return;
        }
        
        setCurrentStoryIndex(0);
        setProgress(0);
        setShowReactionInput(false);
        setReactionText('');
        
        // Verificar permisos de respuesta
        checkReplyPermissions();
        
      } catch (error) {
        console.error('StoriesViewer: Error reseteando story group:', error);
      }
    }
  }, [storyGroup]);

  // Verificar si el usuario puede responder a las stories con mejor manejo de errores
  const checkReplyPermissions = async () => {
    if (!storyGroup || !storyGroup.userId || !currentUserId) {
      setCanReply(false);
      return;
    }
    
    try {
      const canReplyToStories = await privacyService.canReplyToStories(currentUserId, storyGroup.userId);
      setCanReply(canReplyToStories);
    } catch (error) {
      console.error('StoriesViewer: Error verificando permisos de respuesta:', error);
      setCanReply(false);
    }
  };

  // Manejar progreso automático con mejor manejo de errores
  useEffect(() => {
    // Validaciones antes de configurar el interval
    if (!isOpen || isPaused || !storyGroup || !storyGroup.stories || storyGroup.stories.length === 0 || currentStoryIndex >= storyGroup.stories.length) {
      return;
    }

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        try {
          const newProgress = prev + (100 / (storyDuration / 100));
          
          if (newProgress >= 100) {
            // Verificar que aún tenemos un storyGroup válido
            if (!storyGroup || !storyGroup.stories) {
              return 0;
            }
            
            // Avanzar a la siguiente story
            if (currentStoryIndex < storyGroup.stories.length - 1) {
              setCurrentStoryIndex(prev => prev + 1);
              return 0;
            } else {
              // Última story, cerrar o ir al siguiente grupo
              if (onNext) {
                try {
                  onNext();
                } catch (error) {
                  console.error('StoriesViewer: Error en onNext:', error);
                  onClose();
                }
              } else {
                onClose();
              }
              return 0;
            }
          }
          
          return newProgress;
        } catch (error) {
          console.error('StoriesViewer: Error en progreso automático:', error);
          return prev;
        }
      });
    }, 100);

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isOpen, isPaused, currentStoryIndex, storyGroup, onNext, onClose]);

  // Marcar story como vista con mejor manejo de errores
  useEffect(() => {
    if (!storyGroup || !storyGroup.stories || storyGroup.stories.length === 0) {
      return;
    }
    
    if (currentStoryIndex < 0 || currentStoryIndex >= storyGroup.stories.length) {
      console.error('StoriesViewer: Índice fuera de rango:', currentStoryIndex);
      return;
    }
    
    try {
      const currentStory = storyGroup.stories[currentStoryIndex];
      
      if (!currentStory || !currentStory.id) {
        return;
      }
      
      storiesService.markStoryAsViewed(currentStory.id, currentUserId);
      
    } catch (error) {
      console.error('StoriesViewer: Error marcando story como vista:', error);
    }
  }, [currentStoryIndex, storyGroup, currentUserId]);

  const handlePrevious = () => {
    try {
      if (currentStoryIndex > 0) {
        setCurrentStoryIndex(prev => prev - 1);
        setProgress(0);
      } else if (onPrevious) {
        try {
          onPrevious();
        } catch (error) {
          console.error('StoriesViewer: Error en onPrevious:', error);
        }
      }
    } catch (error) {
      console.error('StoriesViewer: Error en handlePrevious:', error);
    }
  };

  const handleNext = () => {
    try {
      if (!storyGroup || !storyGroup.stories || storyGroup.stories.length === 0) {
        onClose();
        return;
      }
      
      if (currentStoryIndex < storyGroup.stories.length - 1) {
        setCurrentStoryIndex(prev => prev + 1);
        setProgress(0);
      } else if (onNext) {
        try {
          onNext();
        } catch (error) {
          console.error('StoriesViewer: Error en onNext:', error);
          onClose();
        }
      } else {
        onClose();
      }
    } catch (error) {
      console.error('StoriesViewer: Error en handleNext:', error);
      onClose();
    }
  };

  const handleReaction = async (emoji: string) => {
    // Validaciones
    if (!storyGroup || !onSendMessage || !emoji || !emoji.trim() || !currentUserId || !storyGroup.userId) {
      return;
    }
    
    try {
      // Enviar solo el emoji como reacción a la historia
      await onSendMessage(storyGroup.userId, emoji, 'story_reaction');
      
      // Mostrar feedback visual
      showReactionFeedback(emoji);
      
    } catch (error) {
      console.error('StoriesViewer: Error enviando reacción:', error);
      showErrorFeedback('No se pudo enviar la reacción');
    }
  };

  const showReactionFeedback = (emoji: string) => {
    try {
      const reactionElement = document.createElement('div');
      reactionElement.textContent = emoji;
      reactionElement.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl z-50 pointer-events-none animate-ping';
      reactionElement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        z-index: 9999;
        pointer-events: none;
        animation: reactionPulse 1s ease-out;
      `;
      
      // Agregar animación CSS
      const style = document.createElement('style');
      style.textContent = `
        @keyframes reactionPulse {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(reactionElement);
      
      setTimeout(() => {
        try {
          if (reactionElement.parentNode) {
            document.body.removeChild(reactionElement);
          }
          if (style.parentNode) {
            document.head.removeChild(style);
          }
        } catch (e) {
          // Elemento ya removido
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error mostrando feedback visual:', error);
    }
  };

  const showErrorFeedback = (message: string) => {
    try {
      const errorElement = document.createElement('div');
      errorElement.textContent = message;
      errorElement.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50 text-sm';
      errorElement.style.cssText = `
        position: fixed;
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
        background-color: #ef4444;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        z-index: 9999;
        font-size: 0.875rem;
        max-width: 90%;
        text-align: center;
      `;
      
      document.body.appendChild(errorElement);
      
      setTimeout(() => {
        try {
          if (errorElement.parentNode) {
            document.body.removeChild(errorElement);
          }
        } catch (e) {
          // Elemento ya removido
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error mostrando feedback de error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!reactionText.trim() || !storyGroup || !onSendMessage) return;
    
    try {
      // Enviar mensaje al chat
      await onSendMessage(storyGroup.userId, reactionText, 'text');
      
      setReactionText('');
      setShowReactionInput(false);
      
    } catch (error) {
      console.error('StoriesViewer: Error enviando mensaje:', error);
    }
  };

  if (!isOpen || !storyGroup || storyGroup.stories.length === 0) {
    return null;
  }

  // Validación crítica: verificar que currentStoryIndex esté en rango válido
  if (currentStoryIndex < 0 || currentStoryIndex >= storyGroup.stories.length) {
    console.error('StoriesViewer: currentStoryIndex fuera de rango');
    const validIndex = Math.max(0, Math.min(currentStoryIndex, storyGroup.stories.length - 1));
    setCurrentStoryIndex(validIndex);
    return null;
  }

  const currentStory = storyGroup.stories[currentStoryIndex];
  
  // Validación adicional: verificar que currentStory existe y tiene propiedades requeridas
  if (!currentStory || !currentStory.createdAt) {
    console.error('StoriesViewer: Story inválida');
    return null;
  }
  
  // Cálculo seguro de timeAgo
  let timeAgo = 0;
  try {
    if (currentStory.createdAt instanceof Date) {
      timeAgo = Math.floor((Date.now() - currentStory.createdAt.getTime()) / (1000 * 60 * 60));
    } else if (typeof currentStory.createdAt === 'string' || typeof currentStory.createdAt === 'number') {
      const createdAtDate = new Date(currentStory.createdAt);
      if (!isNaN(createdAtDate.getTime())) {
        timeAgo = Math.floor((Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60));
      }
    }
  } catch (error) {
    console.error('StoriesViewer: Error calculando timeAgo:', error);
  }

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