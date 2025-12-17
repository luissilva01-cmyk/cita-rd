// src/components/Icebreakers.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Coffee, Music, Camera, Plane } from "lucide-react";

const PROMPTS_DISPONIBLES = [
  {
    id: "comida_favorita",
    pregunta: "Mi comida favorita es...",
    icono: "🍕",
    categoria: "lifestyle"
  },
  {
    id: "nunca_sin",
    pregunta: "Nunca podría vivir sin...",
    icono: "💫",
    categoria: "personal"
  },
  {
    id: "domingo_perfecto",
    pregunta: "Mi domingo perfecto incluye...",
    icono: "☀️",
    categoria: "lifestyle"
  },
  {
    id: "superpoder",
    pregunta: "Si tuviera un superpoder sería...",
    icono: "⚡",
    categoria: "diversion"
  },
  {
    id: "viaje_soñado",
    pregunta: "Mi viaje soñado es a...",
    icono: "✈️",
    categoria: "viajes"
  },
  {
    id: "cancion_favorita",
    pregunta: "La canción que me define es...",
    icono: "🎵",
    categoria: "musica"
  },
  {
    id: "hobby_secreto",
    pregunta: "Mi hobby secreto es...",
    icono: "🎭",
    categoria: "personal"
  },
  {
    id: "primera_cita",
    pregunta: "Mi primera cita ideal sería...",
    icono: "💕",
    categoria: "romance"
  },
  {
    id: "pelicula_favorita",
    pregunta: "Una película que podría ver mil veces es...",
    icono: "🎬",
    categoria: "entretenimiento"
  },
  {
    id: "talento_oculto",
    pregunta: "Un talento que pocos conocen de mí es...",
    icono: "🌟",
    categoria: "personal"
  }
];

export default function Icebreakers({ prompts = [], onPromptsChange, editable = false, maxPrompts = 3 }) {
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");

  const categorias = ["todos", "personal", "lifestyle", "romance", "viajes", "musica", "entretenimiento", "diversion"];

  const promptsFiltrados = PROMPTS_DISPONIBLES.filter(prompt => {
    if (categoriaFiltro === "todos") return true;
    return prompt.categoria === categoriaFiltro;
  });

  const agregarPrompt = (prompt) => {
    if (prompts.length < maxPrompts) {
      const nuevoPrompt = {
        ...prompt,
        respuesta: ""
      };
      onPromptsChange([...prompts, nuevoPrompt]);
      setMostrarSelector(false);
    }
  };

  const actualizarRespuesta = (index, respuesta) => {
    const nuevosPrompts = [...prompts];
    nuevosPrompts[index].respuesta = respuesta;
    onPromptsChange(nuevosPrompts);
  };

  const eliminarPrompt = (index) => {
    const nuevosPrompts = prompts.filter((_, i) => i !== index);
    onPromptsChange(nuevosPrompts);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Icebreakers</h3>
        {editable && prompts.length < maxPrompts && (
          <button
            onClick={() => setMostrarSelector(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            + Agregar
          </button>
        )}
      </div>

      {/* Prompts actuales */}
      <div className="space-y-3">
        {prompts.map((prompt, index) => (
          <motion.div
            key={prompt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-100"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{prompt.icono}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800 mb-2">{prompt.pregunta}</p>
                {editable ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={prompt.respuesta}
                      onChange={(e) => actualizarRespuesta(index, e.target.value)}
                      placeholder="Tu respuesta..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => eliminarPrompt(index)}
                      className="text-red-500 hover:text-red-700 px-2"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  prompt.respuesta && (
                    <p className="text-gray-700 bg-white rounded-lg px-3 py-2 text-sm">
                      {prompt.respuesta}
                    </p>
                  )
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {prompts.length === 0 && !editable && (
        <p className="text-gray-500 text-center py-8">No hay icebreakers configurados</p>
      )}

      {/* Modal selector de prompts */}
      {mostrarSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Selecciona un Icebreaker</h3>
                <button
                  onClick={() => setMostrarSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Filtros por categoría */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setCategoriaFiltro(categoria)}
                    className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                      categoriaFiltro === categoria
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid gap-3">
                {promptsFiltrados
                  .filter(prompt => !prompts.find(p => p.id === prompt.id))
                  .map(prompt => (
                    <button
                      key={prompt.id}
                      onClick={() => agregarPrompt(prompt)}
                      className="text-left p-4 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{prompt.icono}</span>
                        <div>
                          <p className="font-medium text-gray-800">{prompt.pregunta}</p>
                          <p className="text-sm text-gray-500 capitalize">{prompt.categoria}</p>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {editable && (
        <p className="text-sm text-gray-500 text-center">
          {prompts.length} / {maxPrompts} icebreakers
        </p>
      )}
    </div>
  );
}