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
    console.log('🔄 === RESETEO DE STORY GROUP ===');
    console.log('🔄 Nuevo storyGroup:', storyGroup);
    
    if (storyGroup) {
      try {
        console.log('🔄 Reseteando estado para nuevo grupo');
        console.log('🔄 Grupo:', storyGroup.user?.name || 'Sin nombre');
        console.log('🔄 Stories count:', storyGroup.stories?.length || 0);
        
        // Validar que el grupo tenga stories válidas
        if (!storyGroup.stories || storyGroup.stories.length === 0) {
          console.error('❌ Grupo sin stories válidas');
          return;
        }
        
        setCurrentStoryIndex(0);
        setProgress(0);
        setShowReactionInput(false);
        setReactionText('');
        
        console.log('✅ Estado reseteado correctamente');
        
        // Verificar permisos de respuesta
        checkReplyPermissions();
        
      } catch (error) {
        console.error('❌ Error reseteando story group:', error);
        console.error('❌ Error stack:', (error as Error).stack);
      }
    } else {
      console.log('🔄 storyGroup es null, no resetear');
    }
  }, [storyGroup]);

  // Verificar si el usuario puede responder a las stories con mejor manejo de errores
  const checkReplyPermissions = async () => {
    console.log('🔐 === VERIFICANDO PERMISOS DE RESPUESTA ===');
    
    if (!storyGroup) {
      console.log('🔐 No hay storyGroup, no verificar permisos');
      setCanReply(false);
      return;
    }
    
    if (!storyGroup.userId) {
      console.error('❌ storyGroup sin userId');
      setCanReply(false);
      return;
    }
    
    if (!currentUserId) {
      console.error('❌ currentUserId no definido');
      setCanReply(false);
      return;
    }
    
    console.log('🔐 Verificando permisos entre:', currentUserId, 'y', storyGroup.userId);
    
    try {
      const canReplyToStories = await privacyService.canReplyToStories(currentUserId, storyGroup.userId);
      console.log('🔐 Resultado permisos:', canReplyToStories);
      setCanReply(canReplyToStories);
    } catch (error) {
      console.error('❌ Error verificando permisos de respuesta:', error);
      console.error('❌ Error stack:', (error as Error).stack);
      console.error('❌ Parámetros:', { currentUserId, storyGroupUserId: storyGroup.userId });
      
      // En caso de error, denegar por seguridad
      setCanReply(false);
    }
  };

  // Manejar progreso automático con mejor manejo de errores
  useEffect(() => {
    console.log('🎬 === CONFIGURANDO PROGRESO AUTOMÁTICO ===');
    console.log('🎬 isOpen:', isOpen);
    console.log('🎬 isPaused:', isPaused);
    console.log('🎬 storyGroup:', storyGroup);
    console.log('🎬 currentStoryIndex:', currentStoryIndex);
    
    // Validaciones antes de configurar el interval
    if (!isOpen) {
      console.log('🎬 Stories viewer no está abierto, no configurar progreso');
      return;
    }
    
    if (isPaused) {
      console.log('🎬 Stories pausadas, no configurar progreso');
      return;
    }
    
    if (!storyGroup) {
      console.log('🎬 No hay storyGroup, no configurar progreso');
      return;
    }
    
    if (!storyGroup.stories || storyGroup.stories.length === 0) {
      console.log('🎬 No hay stories en el grupo, no configurar progreso');
      return;
    }
    
    if (currentStoryIndex >= storyGroup.stories.length) {
      console.log('🎬 Índice fuera de rango, no configurar progreso');
      return;
    }

    console.log('✅ Configurando progreso automático para story', currentStoryIndex + 1, 'de', storyGroup.stories.length);

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        try {
          const newProgress = prev + (100 / (storyDuration / 100));
          
          if (newProgress >= 100) {
            console.log('📈 Story completada, avanzando...');
            
            // Verificar que aún tenemos un storyGroup válido
            if (!storyGroup || !storyGroup.stories) {
              console.error('❌ storyGroup inválido durante progreso');
              return 0;
            }
            
            // Avanzar a la siguiente story
            if (currentStoryIndex < storyGroup.stories.length - 1) {
              console.log('➡️ Avanzando a la siguiente story:', currentStoryIndex + 1);
              setCurrentStoryIndex(prev => {
                const nextIndex = prev + 1;
                console.log('📊 Nuevo índice de story:', nextIndex);
                return nextIndex;
              });
              return 0;
            } else {
              console.log('🏁 Última story del grupo');
              // Última story, cerrar o ir al siguiente grupo
              if (onNext) {
                console.log('➡️ Llamando onNext para siguiente grupo');
                try {
                  onNext();
                } catch (error) {
                  console.error('❌ Error en onNext:', error);
                  onClose();
                }
              } else {
                console.log('🚪 Cerrando stories viewer');
                onClose();
              }
              return 0;
            }
          }
          
          return newProgress;
        } catch (error) {
          console.error('❌ Error en progreso automático:', error);
          console.error('❌ Error stack:', (error as Error).stack);
          console.error('❌ Estado actual:', {
            currentStoryIndex,
            storyGroupExists: !!storyGroup,
            storiesLength: storyGroup?.stories?.length || 0,
            progress: prev
          });
          
          // En caso de error, detener el progreso
          return prev;
        }
      });
    }, 100);

    return () => {
      if (progressInterval.current) {
        console.log('🧹 Limpiando interval de progreso');
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [isOpen, isPaused, currentStoryIndex, storyGroup, onNext, onClose]);

  // Marcar story como vista con mejor manejo de errores
  useEffect(() => {
    console.log('👁️ === MARCANDO STORY COMO VISTA ===');
    console.log('👁️ storyGroup:', storyGroup);
    console.log('👁️ currentStoryIndex:', currentStoryIndex);
    
    if (!storyGroup) {
      console.log('👁️ No hay storyGroup, no marcar como vista');
      return;
    }
    
    if (!storyGroup.stories || storyGroup.stories.length === 0) {
      console.log('👁️ No hay stories en el grupo');
      return;
    }
    
    if (currentStoryIndex < 0 || currentStoryIndex >= storyGroup.stories.length) {
      console.error('❌ Índice fuera de rango:', currentStoryIndex, 'de', storyGroup.stories.length);
      return;
    }
    
    try {
      const currentStory = storyGroup.stories[currentStoryIndex];
      
      if (!currentStory) {
        console.error('❌ Story actual es null/undefined');
        return;
      }
      
      if (!currentStory.id) {
        console.error('❌ Story sin ID:', currentStory);
        return;
      }
      
      console.log('👁️ Marcando story como vista:', currentStory.id);
      storiesService.markStoryAsViewed(currentStory.id, currentUserId);
      console.log('✅ Story marcada como vista exitosamente');
      
    } catch (error) {
      console.error('❌ Error marcando story como vista:', error);
      console.error('❌ Error stack:', (error as Error).stack);
      console.error('❌ Estado actual:', {
        currentStoryIndex,
        storyGroupExists: !!storyGroup,
        storiesLength: storyGroup?.stories?.length || 0,
        currentUserId
      });
    }
  }, [currentStoryIndex, storyGroup, currentUserId]);

  const handlePrevious = () => {
    console.log('⬅️ === NAVEGACIÓN ANTERIOR ===');
    console.log('⬅️ currentStoryIndex:', currentStoryIndex);
    console.log('⬅️ storyGroup:', storyGroup);
    
    try {
      if (currentStoryIndex > 0) {
        console.log('⬅️ Retrocediendo a story anterior:', currentStoryIndex - 1);
        setCurrentStoryIndex(prev => {
          const newIndex = prev - 1;
          console.log('📊 Nuevo índice anterior:', newIndex);
          return newIndex;
        });
        setProgress(0);
        console.log('✅ Navegación anterior exitosa');
      } else if (onPrevious) {
        console.log('⬅️ Primera story del grupo, llamando onPrevious');
        try {
          onPrevious();
        } catch (error) {
          console.error('❌ Error en onPrevious:', error);
        }
      } else {
        console.log('⬅️ Primera story y no hay onPrevious, no hacer nada');
      }
    } catch (error) {
      console.error('❌ Error en handlePrevious:', error);
      console.error('❌ Error stack:', (error as Error).stack);
    }
  };

  const handleNext = () => {
    console.log('➡️ === NAVEGACIÓN SIGUIENTE ===');
    console.log('➡️ currentStoryIndex:', currentStoryIndex);
    console.log('➡️ storyGroup:', storyGroup);
    console.log('➡️ stories length:', storyGroup?.stories?.length || 0);
    
    try {
      if (!storyGroup) {
        console.error('❌ storyGroup es null en handleNext');
        onClose();
        return;
      }
      
      if (!storyGroup.stories || storyGroup.stories.length === 0) {
        console.error('❌ No hay stories en el grupo');
        onClose();
        return;
      }
      
      if (currentStoryIndex < storyGroup.stories.length - 1) {
        console.log('➡️ Avanzando a story siguiente:', currentStoryIndex + 1);
        setCurrentStoryIndex(prev => {
          const newIndex = prev + 1;
          console.log('📊 Nuevo índice siguiente:', newIndex);
          return newIndex;
        });
        setProgress(0);
        console.log('✅ Navegación siguiente exitosa');
      } else if (onNext) {
        console.log('➡️ Última story del grupo, llamando onNext');
        try {
          onNext();
        } catch (error) {
          console.error('❌ Error en onNext:', error);
          onClose();
        }
      } else {
        console.log('🚪 Última story y no hay onNext, cerrando');
        onClose();
      }
    } catch (error) {
      console.error('❌ Error en handleNext:', error);
      console.error('❌ Error stack:', (error as Error).stack);
      console.error('❌ Estado actual:', {
        currentStoryIndex,
        storyGroupExists: !!storyGroup,
        storiesLength: storyGroup?.stories?.length || 0
      });
      
      // En caso de error, cerrar el viewer
      onClose();
    }
  };

  const handleReaction = async (emoji: string) => {
    console.log('🚀 === INICIO handleReaction ===');
    console.log('❤️ emoji:', emoji);
    console.log('❤️ storyGroup:', storyGroup);
    console.log('❤️ onSendMessage función existe:', !!onSendMessage);
    console.log('❤️ currentUserId:', currentUserId);
    
    // Validaciones más estrictas
    if (!storyGroup) {
      console.error('⚠️ storyGroup es null o undefined');
      return;
    }
    
    if (!onSendMessage) {
      console.error('⚠️ onSendMessage función no está disponible');
      return;
    }
    
    if (!emoji || emoji.trim() === '') {
      console.error('⚠️ emoji está vacío');
      return;
    }
    
    if (!currentUserId) {
      console.error('⚠️ currentUserId no está definido');
      return;
    }
    
    if (!storyGroup.userId) {
      console.error('⚠️ storyGroup.userId no está definido');
      return;
    }
    
    console.log('✅ Todas las validaciones pasaron');
    console.log('🔍 Datos a enviar:');
    console.log('  - Emoji:', emoji, '(length:', emoji.length, ')');
    console.log('  - Usuario destino:', storyGroup.userId);
    console.log('  - Nombre destino:', storyGroup.user?.name || 'N/A');
    console.log('  - Usuario actual:', currentUserId);
    
    try {
      console.log('📤 Llamando onSendMessage...');
      console.log('📤 Parámetros:', {
        userId: storyGroup.userId,
        message: emoji,
        type: 'story_reaction'
      });
      
      // Enviar solo el emoji como reacción a la historia
      await onSendMessage(storyGroup.userId, emoji, 'story_reaction');
      
      console.log('✅ onSendMessage completado exitosamente');
      
      // Mostrar feedback visual mejorado
      console.log('🎨 Mostrando feedback visual...');
      showReactionFeedback(emoji);
      
      console.log('🏁 === FIN handleReaction EXITOSO ===');
      
    } catch (error) {
      console.error('🚨 === ERROR en handleReaction ===');
      console.error('❌ Error completo:', error);
      console.error('❌ Error message:', error?.message || 'Sin mensaje');
      console.error('❌ Error name:', error?.name || 'Sin nombre');
      console.error('❌ Error stack:', error?.stack || 'Sin stack');
      console.error('❌ Datos que causaron el error:', {
        emoji,
        storyGroupUserId: storyGroup?.userId,
        storyGroupUserName: storyGroup?.user?.name,
        currentUserId,
        onSendMessageType: typeof onSendMessage
      });
      console.error('🚨 === FIN ERROR ===');
      
      // Mostrar feedback de error más detallado
      showErrorFeedback('No se pudo enviar la reacción. Revisa la consola para más detalles.');
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
          console.log('🎨 Feedback visual removido');
        } catch (e) {
          console.log('🎨 Elemento de reacción ya removido o error:', e.message);
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
          console.log('🎨 Elemento de error ya removido');
        }
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error mostrando feedback de error:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!reactionText.trim() || !storyGroup || !onSendMessage) return;
    
    console.log('💬 Enviando mensaje:', reactionText, 'a', storyGroup.user.name);
    
    try {
      // Enviar mensaje al chat
      await onSendMessage(storyGroup.userId, reactionText, 'text');
      
      console.log('✅ Mensaje enviado al chat');
      
      setReactionText('');
      setShowReactionInput(false);
      
      // Mostrar feedback más sutil
      console.log(`💬 Mensaje enviado a ${storyGroup.user.name}: "${reactionText}"`);
      
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
      // Mostrar feedback de error al usuario
      console.log('❌ No se pudo enviar el mensaje. Inténtalo de nuevo.');
    }
  };

  if (!isOpen || !storyGroup || storyGroup.stories.length === 0) {
    return null;
  }

  // Validación crítica: verificar que currentStoryIndex esté en rango válido
  if (currentStoryIndex < 0 || currentStoryIndex >= storyGroup.stories.length) {
    console.error('❌ CRITICAL: currentStoryIndex fuera de rango:', {
      currentStoryIndex,
      storiesLength: storyGroup.stories.length,
      storyGroupId: storyGroup.id,
      storyGroupUser: storyGroup.user?.name
    });
    
    // Resetear a índice válido
    const validIndex = Math.max(0, Math.min(currentStoryIndex, storyGroup.stories.length - 1));
    console.log('🔧 Corrigiendo índice a:', validIndex);
    setCurrentStoryIndex(validIndex);
    return null; // Re-render con índice corregido
  }

  const currentStory = storyGroup.stories[currentStoryIndex];
  
  // Validación adicional: verificar que currentStory existe y tiene propiedades requeridas
  if (!currentStory) {
    console.error('❌ CRITICAL: currentStory es null/undefined:', {
      currentStoryIndex,
      storiesLength: storyGroup.stories.length,
      stories: storyGroup.stories
    });
    return null;
  }
  
  if (!currentStory.createdAt) {
    console.error('❌ CRITICAL: currentStory.createdAt es null/undefined:', {
      currentStory,
      storyId: currentStory.id,
      storyType: currentStory.type
    });
    return null;
  }
  
  // Cálculo seguro de timeAgo
  let timeAgo = 0;
  try {
    if (currentStory.createdAt instanceof Date) {
      timeAgo = Math.floor((Date.now() - currentStory.createdAt.getTime()) / (1000 * 60 * 60));
    } else if (typeof currentStory.createdAt === 'string' || typeof currentStory.createdAt === 'number') {
      // Manejar diferentes formatos de fecha
      const createdAtDate = new Date(currentStory.createdAt);
      if (!isNaN(createdAtDate.getTime())) {
        timeAgo = Math.floor((Date.now() - createdAtDate.getTime()) / (1000 * 60 * 60));
      } else {
        console.error('❌ Fecha inválida en createdAt:', currentStory.createdAt);
        timeAgo = 0;
      }
    } else {
      console.error('❌ Tipo de createdAt no soportado:', typeof currentStory.createdAt, currentStory.createdAt);
      timeAgo = 0;
    }
  } catch (error) {
    console.error('❌ Error calculando timeAgo:', error);
    timeAgo = 0;
  }
  
  console.log('✅ Story válida renderizada:', {
    storyId: currentStory.id,
    storyIndex: currentStoryIndex,
    timeAgo: timeAgo + 'h',
    storyType: currentStory.type
  });

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