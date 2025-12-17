// src/components/GaleriaFotos.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import SubirFoto from "./SubirFoto";

export default function GaleriaFotos({ fotos = [], onFotosChange, editable = false, maxFotos = 6 }) {
  const [fotoActual, setFotoActual] = useState(0);
  const [mostrarSubir, setMostrarSubir] = useState(false);

  const agregarFoto = (nuevaFoto) => {
    if (fotos.length < maxFotos) {
      onFotosChange([...fotos, nuevaFoto]);
      setMostrarSubir(false);
    }
  };

  const eliminarFoto = (index) => {
    const nuevasFotos = fotos.filter((_, i) => i !== index);
    onFotosChange(nuevasFotos);
    if (fotoActual >= nuevasFotos.length && nuevasFotos.length > 0) {
      setFotoActual(nuevasFotos.length - 1);
    }
  };

  const siguiente = () => {
    setFotoActual((prev) => (prev + 1) % fotos.length);
  };

  const anterior = () => {
    setFotoActual((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  if (fotos.length === 0 && !editable) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">Sin fotos</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Galería Principal */}
      <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden">
        {fotos.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.img
                key={fotoActual}
                src={fotos[fotoActual]}
                alt={`Foto ${fotoActual + 1}`}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Controles de navegación */}
            {fotos.length > 1 && (
              <>
                <button
                  onClick={anterior}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={siguiente}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Indicadores */}
            {fotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {fotos.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setFotoActual(index)}
                    className={`w-2 h-2 rounded-full transition ${
                      index === fotoActual ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Botón eliminar (solo en modo editable) */}
            {editable && (
              <button
                onClick={() => eliminarFoto(fotoActual)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <X size={16} />
              </button>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <span>Sin fotos</span>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
        {fotos.map((foto, index) => (
          <button
            key={index}
            onClick={() => setFotoActual(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
              index === fotoActual ? "border-orange-500" : "border-gray-300"
            }`}
          >
            <img src={foto} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}

        {/* Botón agregar foto */}
        {editable && fotos.length < maxFotos && (
          <button
            onClick={() => setMostrarSubir(true)}
            className="flex-shrink-0 w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-orange-500 transition"
          >
            <Plus size={24} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* Modal subir foto */}
      {mostrarSubir && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Agregar Foto</h3>
              <button
                onClick={() => setMostrarSubir(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <SubirFoto onImagenSubida={agregarFoto} />
          </div>
        </div>
      )}

      {/* Contador de fotos */}
      {editable && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          {fotos.length} / {maxFotos} fotos
        </p>
      )}
    </div>
  );
}