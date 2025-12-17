import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  X,
  Maximize2,
  Play,
  Pause
} from 'lucide-react';

const PhotoViewer = ({ 
  photos = [], 
  currentIndex = 0, 
  onIndexChange, 
  onClose,
  showControls = true,
  autoPlay = false,
  className = ""
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [touchStart, setTouchStart] = useState(null);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && photos.length > 1) {
      const interval = setInterval(() => {
        handleNext();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentIndex, photos.length, handleNext]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onIndexChange(currentIndex - 1);
      resetZoom();
    }
  };

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onIndexChange(currentIndex + 1);
      resetZoom();
    } else if (isPlaying) {
      // Loop back to first photo in autoplay
      onIndexChange(0);
      resetZoom();
    }
  }, [currentIndex, photos.length, onIndexChange, isPlaying]);

  const resetZoom = () => {
    setIsZoomed(false);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (isZoomed) {
      resetZoom();
    } else {
      setIsZoomed(true);
      setZoomLevel(2);
    }
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel * 1.5, 4);
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel / 1.5, 1);
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
    if (newZoom === 1) {
      setPanOffset({ x: 0, y: 0 });
    }
  };

  const handlePan = (event, info) => {
    if (isZoomed) {
      setPanOffset({
        x: panOffset.x + info.delta.x,
        y: panOffset.y + info.delta.y
      });
    }
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now()
    };

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const deltaTime = touchEnd.time - touchStart.time;

    // Double tap detection
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 300) {
      handleDoubleClick();
      return;
    }

    // Swipe detection (only if not zoomed)
    if (!isZoomed && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
      if (deltaX > 0) {
        handlePrevious();
      } else {
        handleNext();
      }
    }

    setTouchStart(null);
  };

  const currentPhoto = photos[currentIndex];
  const isVideo = currentPhoto?.type === 'video' || currentPhoto?.includes('.mp4');

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`} ref={containerRef}>
      {/* Photo Progress Indicators */}
      {photos.length > 1 && showControls && (
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-30">
          {photos.map((_, index) => (
            <motion.div
              key={index}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white' : 'bg-white/30'
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: index <= currentIndex ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}

      {/* Navigation Areas (Left/Right) */}
      {photos.length > 1 && !isZoomed && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 top-0 w-1/3 h-full z-20 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity disabled:opacity-0"
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-full p-2">
              <ChevronLeft className="text-white" size={24} />
            </div>
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === photos.length - 1 && !isPlaying}
            className="absolute right-0 top-0 w-1/3 h-full z-20 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity disabled:opacity-0"
          >
            <div className="bg-black/20 backdrop-blur-sm rounded-full p-2">
              <ChevronRight className="text-white" size={24} />
            </div>
          </button>
        </>
      )}

      {/* Main Photo/Video */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {isVideo ? (
            <video
              ref={imageRef}
              src={currentPhoto}
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
            />
          ) : (
            <motion.img
              ref={imageRef}
              src={currentPhoto}
              alt={`Photo ${currentIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              style={{
                scale: zoomLevel,
                x: panOffset.x,
                y: panOffset.y
              }}
              drag={isZoomed}
              onPan={handlePan}
              dragConstraints={containerRef}
              dragElastic={0.1}
              onDoubleClick={handleDoubleClick}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Zoom Controls */}
      {showControls && !isVideo && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomIn}
            disabled={zoomLevel >= 4}
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-50"
          >
            <ZoomIn size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleZoomOut}
            disabled={zoomLevel <= 1}
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white disabled:opacity-50"
          >
            <ZoomOut size={18} />
          </motion.button>

          {isZoomed && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={resetZoom}
              className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
            >
              <Maximize2 size={18} />
            </motion.button>
          )}
        </div>
      )}

      {/* Auto-play Controls */}
      {photos.length > 1 && showControls && (
        <div className="absolute bottom-4 left-4 z-30">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </motion.button>
        </div>
      )}

      {/* Photo Counter */}
      {photos.length > 1 && showControls && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
            {currentIndex + 1} / {photos.length}
          </div>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-40 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default PhotoViewer;