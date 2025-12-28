import { useState, useRef, useCallback, useEffect } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

interface SwipeState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
}

export const useSwipeGesture = (options: SwipeGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 100,
    preventDefaultTouchmoveEvent = false
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0
  });

  const elementRef = useRef<HTMLDivElement>(null);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    setSwipeState({
      isDragging: true,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      deltaX: 0,
      deltaY: 0
    });
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    setSwipeState(prev => {
      if (!prev.isDragging) return prev;
      
      const deltaX = clientX - prev.startX;
      const deltaY = clientY - prev.startY;
      
      return {
        ...prev,
        currentX: clientX,
        currentY: clientY,
        deltaX,
        deltaY
      };
    });
  }, []);

  const handleEnd = useCallback(() => {
    setSwipeState(prev => {
      if (!prev.isDragging) return prev;
      
      const { deltaX } = prev;
      
      // Determinar dirección del swipe con threshold más bajo
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          setTimeout(() => onSwipeRight(), 100); // Pequeño delay para animación
        } else if (deltaX < 0 && onSwipeLeft) {
          setTimeout(() => onSwipeLeft(), 100);
        }
      }
      
      return {
        ...prev,
        isDragging: false,
        deltaX: 0,
        deltaY: 0
      };
    });
  }, [threshold, onSwipeLeft, onSwipeRight]);

  // Global mouse events
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (swipeState.isDragging) {
        e.preventDefault();
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (swipeState.isDragging) {
        e.preventDefault();
        handleEnd();
      }
    };

    if (swipeState.isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [swipeState.isDragging, handleMove, handleEnd]);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  }, [handleStart]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  }, [handleStart, preventDefaultTouchmoveEvent]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    if (swipeState.isDragging) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  }, [swipeState.isDragging, handleMove, preventDefaultTouchmoveEvent]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
    handleEnd();
  }, [handleEnd, preventDefaultTouchmoveEvent]);

  // Calcular transformaciones CSS
  const getTransform = () => {
    if (!swipeState.isDragging) return '';
    
    const { deltaX, deltaY } = swipeState;
    const rotation = Math.max(-15, Math.min(15, deltaX * 0.1)); // Limitar rotación
    const verticalOffset = Math.abs(deltaX) * 0.05; // Efecto sutil vertical
    
    return `translate(${deltaX}px, ${verticalOffset}px) rotate(${rotation}deg)`;
  };

  const getOpacity = () => {
    if (!swipeState.isDragging) return 1;
    
    const { deltaX } = swipeState;
    const maxDistance = 150;
    const opacity = Math.max(0.5, 1 - Math.abs(deltaX) / maxDistance);
    
    return opacity;
  };

  const getSwipeDirection = () => {
    if (!swipeState.isDragging) return null;
    
    const { deltaX } = swipeState;
    if (Math.abs(deltaX) < 30) return null; // Reducir sensibilidad
    
    return deltaX > 0 ? 'right' : 'left';
  };

  return {
    swipeState,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      ref: elementRef
    },
    transform: getTransform(),
    opacity: getOpacity(),
    swipeDirection: getSwipeDirection(),
    isDragging: swipeState.isDragging
  };
};