// cita-rd/components/NotificationBadge.tsx
import React from 'react';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'blue' | 'green' | 'orange';
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'md',
  color = 'red',
  className = ''
}) => {
  if (count <= 0) return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  };

  const colorClasses = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white'
  };

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${colorClasses[color]} 
      rounded-full 
      flex items-center justify-center 
      font-bold 
      border-2 border-white 
      shadow-lg 
      animate-pulse
      ${className}
    `}>
      {displayCount}
    </div>
  );
};

export default NotificationBadge;