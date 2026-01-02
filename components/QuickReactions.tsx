// cita-rd/components/QuickReactions.tsx
import React, { useState } from 'react';
import { Heart, Smile, Laugh, Surprised, Sad, Angry } from 'lucide-react';

interface QuickReactionsProps {
  onReaction: (reaction: string) => void;
  className?: string;
}

const REACTIONS = [
  { emoji: '❤️', icon: Heart, label: 'Me encanta', color: 'text-red-500' },
  { emoji: '😍', icon: Smile, label: 'Me gusta', color: 'text-yellow-500' },
  { emoji: '😂', icon: Laugh, label: 'Divertido', color: 'text-blue-500' },
  { emoji: '😮', icon: Surprised, label: 'Sorprendido', color: 'text-purple-500' },
  { emoji: '😢', icon: Sad, label: 'Triste', color: 'text-gray-500' },
  { emoji: '🔥', emoji2: '🔥', label: 'Increíble', color: 'text-orange-500' }
];

const QuickReactions: React.FC<QuickReactionsProps> = ({ onReaction, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const handleReaction = (reaction: string) => {
    setSelectedReaction(reaction);
    onReaction(reaction);
    
    // Ocultar después de un momento
    setTimeout(() => {
      setIsVisible(false);
      setSelectedReaction(null);
    }, 1000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Botón para mostrar reacciones */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
        title="Reacciones rápidas"
      >
        <Heart size={16} className="text-gray-600" />
      </button>

      {/* Panel de reacciones */}
      {isVisible && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 flex gap-2 animate-in slide-in-from-bottom-2 duration-200">
          {REACTIONS.map((reaction, index) => (
            <button
              key={index}
              onClick={() => handleReaction(reaction.emoji)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg
                hover:scale-125 transition-all duration-200 hover:bg-gray-50
                ${selectedReaction === reaction.emoji ? 'scale-125 bg-gray-100' : ''}
              `}
              title={reaction.label}
            >
              {reaction.emoji2 || reaction.emoji}
            </button>
          ))}
        </div>
      )}

      {/* Overlay para cerrar */}
      {isVisible && (
        <div 
          className="fixed inset-0 z-[-1]" 
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  );
};

export default QuickReactions;