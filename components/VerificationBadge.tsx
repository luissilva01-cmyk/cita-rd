// cita-rd/components/VerificationBadge.tsx
import React from 'react';
import { Shield, Star, CheckCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  verificationLevel?: 'basic' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  isVerified,
  verificationLevel = 'basic',
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

  const isPremium = verificationLevel === 'premium';

  const BadgeIcon = () => {
    if (isPremium) {
      return (
        <div className="relative">
          <Shield 
            className={`${sizeClasses[size]} text-yellow-500`}
            fill="currentColor"
          />
          <Star 
            className="absolute -top-0.5 -right-0.5 w-2 h-2 text-yellow-400"
            fill="currentColor"
          />
        </div>
      );
    }
    
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
        <span className={`font-semibold ${
          isPremium ? 'text-yellow-600' : 'text-blue-600'
        } ${textSizeClasses[size]}`}>
          {isPremium ? 'Premium Verificado' : 'Verificado'}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className}`} title={isPremium ? 'Premium Verificado' : 'Verificado'}>
      <BadgeIcon />
    </div>
  );
};

export default VerificationBadge;