// cita-rd/components/ReactiveToggle.tsx
import React, { useState, useEffect } from 'react';

interface ReactiveToggleProps {
  initialValue: boolean;
  onChange: (value: boolean) => Promise<void>;
  label: string;
  description: string;
  disabled?: boolean;
  color?: 'blue' | 'purple' | 'green';
}

const ReactiveToggle: React.FC<ReactiveToggleProps> = ({
  initialValue,
  onChange,
  label,
  description,
  disabled = false,
  color = 'blue'
}) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Sync with external changes
  useEffect(() => {
    setIsEnabled(initialValue);
  }, [initialValue]);

  const handleToggle = async () => {
    if (disabled || isUpdating) return;

    const newValue = !isEnabled;
    
    // Optimistic update for immediate feedback
    setIsEnabled(newValue);
    setIsUpdating(true);

    try {
      await onChange(newValue);
      
      // Show success feedback
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1000);
      
    } catch (error) {
      // Revert on error
      setIsEnabled(!newValue);
      console.error('Error updating setting:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'purple':
        return {
          active: 'bg-purple-600',
          inactive: 'bg-gray-300'
        };
      case 'green':
        return {
          active: 'bg-green-600',
          inactive: 'bg-gray-300'
        };
      default:
        return {
          active: 'bg-blue-600',
          inactive: 'bg-gray-300'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex-1 min-w-0 pr-4">
        <div className="font-medium text-gray-900 text-sm sm:text-base">{label}</div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">{description}</div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Feedback indicator */}
        {showFeedback && (
          <div className="text-green-500 text-xs animate-pulse">
            ✓
          </div>
        )}
        
        {/* Loading indicator */}
        {isUpdating && (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        )}
        
        {/* Toggle switch */}
        <button
          onClick={handleToggle}
          disabled={disabled || isUpdating}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isEnabled ? colors.active : colors.inactive
          } ${disabled || isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
              isEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default ReactiveToggle;