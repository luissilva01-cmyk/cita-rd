// cita-rd/components/EmojiPicker.tsx
import React, { useState } from 'react';
import { Smile, Heart, Flame, Star, Coffee, Music, Camera, Plane } from 'lucide-react';

interface EmojiPickerProps {
  isOpen: boolean;
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

// Categorías de emojis populares para citas
const EMOJI_CATEGORIES = {
  frequent: {
    name: 'Frecuentes',
    icon: <Star size={16} />,
    emojis: ['😊', '😍', '🥰', '😘', '💕', '❤️', '🔥', '✨', '👋', '😂', '🤗', '😉']
  },
  hearts: {
    name: 'Corazones',
    icon: <Heart size={16} />,
    emojis: ['❤️', '💕', '💖', '💗', '💓', '💝', '💘', '💞', '💟', '♥️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '🤎']
  },
  faces: {
    name: 'Caras',
    icon: <Smile size={16} />,
    emojis: ['😊', '😍', '🥰', '😘', '😗', '😙', '😚', '🤗', '🤭', '😉', '😌', '😏', '😋', '😛', '😜', '🤪', '😝', '🤑']
  },
  gestures: {
    name: 'Gestos',
    icon: <Coffee size={16} />,
    emojis: ['👋', '🤚', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️']
  },
  activities: {
    name: 'Actividades',
    icon: <Music size={16} />,
    emojis: ['🎵', '🎶', '🎤', '🎧', '🎸', '🎹', '🥁', '🎺', '🎷', '🎻', '🎭', '🎨', '🎪', '🎬', '🎮', '🎯', '🎲', '🎳']
  },
  food: {
    name: 'Comida',
    icon: <Coffee size={16} />,
    emojis: ['☕', '🍕', '🍔', '🌮', '🌯', '🥙', '🥗', '🍝', '🍜', '🍲', '🍱', '🍣', '🍤', '🍰', '🧁', '🍫', '🍷', '🥂']
  },
  travel: {
    name: 'Viajes',
    icon: <Plane size={16} />,
    emojis: ['✈️', '🚗', '🏖️', '🏝️', '🗺️', '🧳', '📸', '🌅', '🌄', '🏔️', '🌊', '🌴', '🌺', '🌸', '🌼', '🌻', '🌹', '🌷']
  },
  flags: {
    name: 'Banderas',
    icon: <Camera size={16} />,
    emojis: ['🇩🇴', '🇺🇸', '🇪🇸', '🇫🇷', '🇮🇹', '🇧🇷', '🇲🇽', '🇨🇴', '🇦🇷', '🇨🇱', '🇵🇪', '🇻🇪', '🇨🇺', '🇵🇷', '🇭🇹', '🇯🇲']
  }
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ isOpen, onEmojiSelect, onClose }) => {
  const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('frequent');

  if (!isOpen) return null;

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 z-40" 
        onClick={onClose}
      />
      
      {/* Emoji Picker */}
      <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl z-50 max-w-md mx-auto border border-gray-200">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Emojis</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex overflow-x-auto border-b border-gray-100 px-2">
          {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key as keyof typeof EMOJI_CATEGORIES)}
              className={`flex-shrink-0 p-3 rounded-lg m-1 transition-colors ${
                activeCategory === key 
                  ? 'bg-rose-100 text-rose-600' 
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
              title={category.name}
            >
              {category.icon}
            </button>
          ))}
        </div>

        {/* Emojis Grid */}
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-8 gap-2">
            {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-100 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            Toca un emoji para enviarlo
          </p>
        </div>
      </div>
    </>
  );
};

export default EmojiPicker;