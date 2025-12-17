// src/components/StoriesViewer.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { obtenerStoriesUsuario, marcarStoryVista } from "../services/storiesService";
import { useAuth } from "../context/AuthContext";

export default function StoriesViewer({ isOpen, onClose, userId, userName, userPhoto }) {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [storyActual, setStoryActual] = useState(0);
  const [progreso, setProgreso] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      cargarStories();
    }
  }, [isOpen, userId]);

  useEffect(() => {
    if (stories.length > 0 && isOpen) {
      const timer = setInterval(() => {
        setProgreso(prev => {
          if (prev >= 100) {
            siguienteStory();
            return 0;
          }
          return prev + 2; // 5 segundos por story
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [storyActual, stories, isOpen]);

  const cargarStories = async () => {
    setLoading(true);
    const resultado = await obtenerStoriesUsuario(userId);
    
    if (resultado.ok) {
      setStories(resultado.data);
      if (resultado.data.length > 0) {
        // Marcar primera story como vista
        await marcarStoryVista(resultado.data[0].id, user.uid);
      }
    }
    setLoading(false);
  };

  const siguienteStory = async () => {
    if (storyActual < stories.length - 1) {
      const nuevoIndice = storyActual + 1;
      setStoryActual(nuevoIndice);
      setProgreso(0);
      
      // Marcar como vista
      if (stories[nuevoIndice]) {
        await marcarStoryVista(stories[nuevoIndice].id, user.uid);
      }
    } else {
      cerrar();
    }
  };

  const storyAnterior = () => {
    if (storyActual > 0) {
      setStoryActual(storyActual - 1);
      setProgreso(0);
    }
  };

  const cerrar = () => {
    setStoryActual(0);
    setProgreso(0);
    setStories([]);
    onClose();
  };

  if (!isOpen) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white">Cargando stories...</div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="mb-4">No hay stories disponibles</p>
          <button onClick={cerrar} className="bg-white text-black px-4 py-2 rounded-lg">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  const story = stories[storyActual];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-50"
      >
        {/* Barras de progreso */}
        <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
          {stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < storyActual ? '100%' : 
                         index === storyActual ? `${progreso}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 mt-6">
          <div className="flex items-center gap-3">
            <img 
              src={userPhoto || "/default-avatar.png"} 
              alt={userName}
              className="w-10 h-10 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-white font-semibold">{userName}</p>
              <p className="text-white/70 text-sm">
                {story?.fechaCreacion?.toDate().toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          <button onClick={cerrar} className="text-white p-2">
            <X size={24} />
          </button>
        </div>

        {/* Contenido de la story */}
        <div className="flex items-center justify-center h-full">
          {story?.tipo === "imagen" ? (
            <img 
              src={story.contenido} 
              alt="Story"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-white text-2xl font-bold p-8 text-center"
              style={{ backgroundColor: story?.backgroundColor || "#FF6B6B" }}
            >
              {story?.contenido}
            </div>
          )}
        </div>

        {/* Controles de navegación */}
        <div className="absolute inset-0 flex">
          {/* Zona anterior */}
          <button 
            onClick={storyAnterior}
            className="flex-1 flex items-center justify-start pl-4"
            disabled={storyActual === 0}
          >
            {storyActual > 0 && (
              <ChevronLeft className="text-white/50" size={32} />
            )}
          </button>
          
          {/* Zona siguiente */}
          <button 
            onClick={siguienteStory}
            className="flex-1 flex items-center justify-end pr-4"
          >
            <ChevronRight className="text-white/50" size={32} />
          </button>
        </div>

        {/* Info de vistas */}
        {story?.vistas && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/70">
            <Eye size={16} />
            <span className="text-sm">{story.vistas.length} vistas</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}