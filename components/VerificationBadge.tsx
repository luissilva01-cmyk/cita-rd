// cita-rd/components/VerificationBadge.tsx
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  size = 'md',
  showText = false,
  className = ''
}) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const BadgeIcon = () => {
    return (
      <CheckCircle 
        className={`${sizeClasses[size]} text-blue-500`}
        fill="currentColor"
      />
    );
  };

  if (showText) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <BadgeIcon />
        <span className={`font-semibold text-blue-600 ${textSizeClasses[size]}`}>
          Verificado
        </span>
      </div>
    );
  }

  return (
    <div className={`${className}`} title="Verificado">
      <BadgeIcon />
    </div>
  );
};

export default VerificationBadge;