// cita-rd/components/TypingIndicator.tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TypingIndicatorProps {
  userName: string;
  isVisible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ userName, isVisible }) => {
  const { t } = useLanguage();
  
  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 animate-in slide-in-from-bottom-2 duration-300">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-medium text-gray-600">
          {userName.charAt(0).toUpperCase()}
        </span>
      </div>
      
      <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-1">
        <span className="text-sm text-gray-600">{userName} {t('typing')}</span>
        <div className="flex gap-1 ml-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;