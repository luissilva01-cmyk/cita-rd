// cita-rd/components/CreateStoryModal.tsx
import React, { useState, useRef } from 'react';
import { X, Camera, Type, Upload, Palette } from 'lucide-react';
import { storiesService } from '../services/storiesService';
import { useTranslation } from '../hooks/useTranslation';

interface CreateStoryModalProps {
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
  onStoryCreated?: () => void;
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  currentUserId,
  onClose,
  onStoryCreated
}) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'select' | 'text' | 'image'>('select');
  const [textContent, setTextContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState('#FF6B6B');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [isCreating, setIsCreating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setMode('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStory = async () => {
    if (isCreating) return;
    
    try {
      setIsCreating(true);
      
      if (mode === 'text' && textContent.trim()) {
        await storiesService.createStory(
          currentUserId,
          'text',
          textContent.trim(),
          { backgroundColor, textColor }
        );
        
        console.log('✅ Story de texto creada');
        
      } else if (mode === 'image' && selectedImage) {
        await storiesService.createStory(
          currentUserId,
          'image',
          selectedImage
        );
        
        console.log('✅ Story de imagen creada');
      } else {
        console.log('❌ Contenido inválido para crear story');
        return;
      }
      
      // Resetear estado
      setTextContent('');
      setSelectedImage(null);
      setMode('select');
      
      // Notificar que se creó la story
      if (onStoryCreated) {
        onStoryCreated();
      }
      
      // Cerrar modal
      onClose();
      
      // Mostrar feedback
      alert('✅ ¡Story creada exitosamente!\n\n🎉 Tu story estará visible por 24 horas.');
      
    } catch (error) {
      console.error('❌ Error creando story:', error);
      alert('❌ Error creando la story. Inténtalo de nuevo.');
    } finally {
      setIsCreating(false);
    }
  };

  const resetModal = () => {
    setMode('select');
    setTextContent('');
    setSelectedImage(null);
    setBackgroundColor('#FF6B6B');
    setTextColor('#FFFFFF');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{t('createStoryTitle')}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          
          {/* Mode Selection */}
          {mode === 'select' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                {t('whatTypeOfStory')}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Text Story */}
                <button
                  onClick={() => setMode('text')}
                  className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all"
                >
                  <Type size={32} className="text-rose-500 mb-2" />
                  <span className="font-semibold text-gray-900">{t('text')}</span>
                  <span className="text-sm text-gray-500">{t('writeMessage')}</span>
                </button>
                
                {/* Image Story */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all"
                >
                  <Camera size={32} className="text-rose-500 mb-2" />
                  <span className="font-semibold text-gray-900">{t('photo')}</span>
                  <span className="text-sm text-gray-500">{t('uploadImage')}</span>
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          {/* Text Story Mode */}
          {mode === 'text' && (
            <div className="space-y-4">
              {/* Preview */}
              <div 
                className="w-full h-64 rounded-xl flex items-center justify-center p-4 relative overflow-hidden"
                style={{ backgroundColor }}
              >
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder={t('writeYourMessage')}
                  className="w-full h-full bg-transparent resize-none outline-none text-center text-xl font-bold placeholder-white/70"
                  style={{ color: textColor }}
                  maxLength={200}
                />
              </div>
              
              {/* Color Palette */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Palette size={16} />
                  {t('backgroundColor')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {backgroundColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBackgroundColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        backgroundColor === color ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Text Color */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">{t('textColor')}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTextColor('#FFFFFF')}
                    className={`w-8 h-8 rounded-full border-2 bg-white ${
                      textColor === '#FFFFFF' ? 'border-gray-900' : 'border-gray-300'
                    }`}
                  />
                  <button
                    onClick={() => setTextColor('#000000')}
                    className={`w-8 h-8 rounded-full border-2 bg-black ${
                      textColor === '#000000' ? 'border-gray-900' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setMode('select')}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t('back')}
                </button>
                <button
                  onClick={handleCreateStory}
                  disabled={!textContent.trim() || isCreating}
                  className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? t('creating') : t('publish')}
                </button>
              </div>
            </div>
          )}

          {/* Image Story Mode */}
          {mode === 'image' && selectedImage && (
            <div className="space-y-4">
              {/* Preview */}
              <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={selectedImage}
                  alt="Story preview"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setMode('select');
                  }}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t('changePhoto')}
                </button>
                <button
                  onClick={handleCreateStory}
                  disabled={isCreating}
                  className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-xl font-semibold hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isCreating ? t('creating') : t('publish')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;