// src/components/OnboardingModal.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Users, Shield, X } from "lucide-react";

const pasos = [
  {
    icono: Heart,
    titulo: "Descubre personas increíbles",
    descripcion: "Desliza para dar like a perfiles que te interesen. Si hay match, ¡podrán chatear!",
    color: "text-pink-500"
  },
  {
    icono: MessageCircle,
    titulo: "Chatea en tiempo real",
    descripcion: "Cuando hagan match, podrán enviarse mensajes, fotos y audios instantáneamente.",
    color: "text-blue-500"
  },
  {
    icono: Users,
    titulo: "Personaliza tu búsqueda",
    descripcion: "Ajusta tus preferencias de edad, distancia y género para encontrar a tu persona ideal.",
    color: "text-orange-500"
  },
  {
    icono: Shield,
    titulo: "Tu seguridad es primero",
    descripcion: "Puedes reportar o bloquear usuarios en cualquier momento. Estamos aquí para ti.",
    color: "text-green-500"
  }
];

export default function OnboardingModal({ isOpen, onClose }) {
  const [pasoActual, setPasoActual] = useState(0);

  const siguiente = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(p => p + 1);
    } else {
      // Guardar en localStorage que ya vio el onboarding
      localStorage.setItem("onboarding_completado", "true");
      onClose();
    }
  };

  const saltar = () => {
    localStorage.setItem("onboarding_completado", "true");
    onClose();
  };

  const paso = pasos[pasoActual];
  const Icono = paso.icono;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              
              {/* Botón cerrar */}
              <button
                onClick={saltar}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>

              {/* Contenido */}
              <div className="text-center">
                <motion.div
                  key={pasoActual}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`${paso.color} mb-6 flex justify-center`}>
                    <Icono size={80} strokeWidth={1.5} />
                  </div>

                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {paso.titulo}
                  </h2>

                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {paso.descripcion}
                  </p>
                </motion.div>

                {/* Indicadores */}
                <div className="flex justify-center gap-2 mb-6">
                  {pasos.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === pasoActual 
                          ? "w-8 bg-orange-500" 
                          : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Botones */}
                <div className="flex gap-3">
                  {pasoActual > 0 && (
                    <button
                      onClick={() => setPasoActual(p => p - 1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition"
                    >
                      Atrás
                    </button>
                  )}
                  
                  <button
                    onClick={siguiente}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-xl hover:shadow-lg transition"
                  >
                    {pasoActual === pasos.length - 1 ? "¡Empezar!" : "Siguiente"}
                  </button>
                </div>

                {pasoActual < pasos.length - 1 && (
                  <button
                    onClick={saltar}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Saltar tutorial
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
