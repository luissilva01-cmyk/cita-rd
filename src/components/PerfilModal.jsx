import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Verified, 
  Heart, 
  Star, 
  ChevronLeft, 
  ChevronRight,
  Briefcase,
  GraduationCap,
  Calendar
} from 'lucide-react';

export default function PerfilModal({ perfil, isOpen, onClose, onLike, onSuperLike, onPass }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!perfil) return null;

  const fotos = perfil.fotos || [perfil.fotoUrl];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % fotos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-3xl max-w-sm w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/30 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Photo Indicators */}
              {fotos.length > 1 && (
                <div className="absolute top-4 left-4 right-16 flex gap-1 z-30">
                  {fotos.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-1 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Photo Navigation */}
              {fotos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                    disabled={currentPhotoIndex === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
                    disabled={currentPhotoIndex === fotos.length - 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Main Photo */}
              <div className="relative h-96">
                <img
                  src={fotos[currentPhotoIndex]}
                  alt={perfil.nombre}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Basic Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">
                      {perfil.nombre}, {perfil.edad}
                    </h2>
                    {perfil.verificado && (
                      <Verified className="text-blue-400" size={20} />
                    )}
                  </div>
                  
                  {perfil.ciudad && (
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      <span className="text-white/90 text-sm">{perfil.ciudad}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-60 overflow-y-auto">
              {/* Description */}
              {perfil.descripcion && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Sobre mí</h3>
                  <p className="text-gray-600 leading-relaxed">{perfil.descripcion}</p>
                </div>
              )}

              {/* Work & Education */}
              <div className="space-y-3 mb-6">
                {perfil.trabajo && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="text-gray-400" size={18} />
                    <span className="text-gray-700">{perfil.trabajo}</span>
                  </div>
                )}
                
                {perfil.educacion && (
                  <div className="flex items-center gap-3">
                    <GraduationCap className="text-gray-400" size={18} />
                    <span className="text-gray-700">{perfil.educacion}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={18} />
                  <span className="text-gray-700">{perfil.edad} años</span>
                </div>
              </div>

              {/* Interests */}
              {perfil.intereses && perfil.intereses.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Intereses</h3>
                  <div className="flex flex-wrap gap-2">
                    {perfil.intereses.map((interes, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {interes}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    onPass();
                    onClose();
                  }}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="text-gray-600" size={20} />
                </button>

                <button
                  onClick={() => {
                    onSuperLike();
                    onClose();
                  }}
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Star className="text-white" size={16} />
                </button>

                <button
                  onClick={() => {
                    onLike();
                    onClose();
                  }}
                  className="w-14 h-14 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Heart className="text-white" size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}