// src/components/GifPicker.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Smile } from "lucide-react";

// Stickers predefinidos por categorías
const STICKERS_CATEGORIAS = {
  emociones: [
    { id: "happy", emoji: "😊", nombre: "Feliz" },
    { id: "love", emoji: "😍", nombre: "Enamorado" },
    { id: "laugh", emoji: "😂", nombre: "Risa" },
    { id: "wink", emoji: "😉", nombre: "Guiño" },
    { id: "kiss", emoji: "😘", nombre: "Beso" },
    { id: "heart_eyes", emoji: "🥰", nombre: "Ojos de corazón" },
    { id: "thinking", emoji: "🤔", nombre: "Pensando" },
    { id: "cool", emoji: "😎", nombre: "Cool" }
  ],
  corazones: [
    { id: "red_heart", emoji: "❤️", nombre: "Corazón rojo" },
    { id: "orange_heart", emoji: "🧡", nombre: "Corazón naranja" },
    { id: "yellow_heart", emoji: "💛", nombre: "Corazón amarillo" },
    { id: "green_heart", emoji: "💚", nombre: "Corazón verde" },
    { id: "blue_heart", emoji: "💙", nombre: "Corazón azul" },
    { id: "purple_heart", emoji: "💜", nombre: "Corazón morado" },
    { id: "sparkling_heart", emoji: "💖", nombre: "Corazón brillante" },
    { id: "heartbeat", emoji: "💓", nombre: "Latido" }
  ],
  gestos: [
    { id: "thumbs_up", emoji: "👍", nombre: "Pulgar arriba" },
    { id: "clap", emoji: "👏", nombre: "Aplausos" },
    { id: "wave", emoji: "👋", nombre: "Saludo" },
    { id: "peace", emoji: "✌️", nombre: "Paz" },
    { id: "ok_hand", emoji: "👌", nombre: "OK" },
    { id: "muscle", emoji: "💪", nombre: "Músculo" },
    { id: "pray", emoji: "🙏", nombre: "Oración" },
    { id: "fire", emoji: "🔥", nombre: "Fuego" }
  ],
  actividades: [
    { id: "coffee", emoji: "☕", nombre: "Café" },
    { id: "pizza", emoji: "🍕", nombre: "Pizza" },
    { id: "music", emoji: "🎵", nombre: "Música" },
    { id: "camera", emoji: "📸", nombre: "Cámara" },
    { id: "plane", emoji: "✈️", nombre: "Avión" },
    { id: "beach", emoji: "🏖️", nombre: "Playa" },
    { id: "movie", emoji: "🎬", nombre: "Película" },
    { id: "book", emoji: "📚", nombre: "Libro" }
  ]
};

// GIFs populares simulados (en producción usarías Giphy API)
const GIFS_POPULARES = [
  { id: "1", url: "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", titulo: "Hello" },
  { id: "2", url: "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", titulo: "Love" },
  { id: "3", url: "https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif", titulo: "Happy" },
  { id: "4", url: "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif", titulo: "Excited" },
  { id: "5", url: "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif", titulo: "Thumbs Up" },
  { id: "6", url: "https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy.gif", titulo: "Kiss" }
];

export default function GifPicker({ isOpen, onClose, onSelect, tipo = "stickers" }) {
  const [categoriaActiva, setCategoriaActiva] = useState("emociones");
  const [busqueda, setBusqueda] = useState("");
  const [gifs, setGifs] = useState(GIFS_POPULARES);
  const [cargando, setCargando] = useState(false);

  const categorias = Object.keys(STICKERS_CATEGORIAS);

  // Simular búsqueda de GIFs
  const buscarGifs = async (termino) => {
    if (!termino.trim()) {
      setGifs(GIFS_POPULARES);
      return;
    }

    setCargando(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En producción, aquí harías la llamada a Giphy API
    const resultados = GIFS_POPULARES.filter(gif => 
      gif.titulo.toLowerCase().includes(termino.toLowerCase())
    );
    
    setGifs(resultados);
    setCargando(false);
  };

  useEffect(() => {
    if (tipo === "gifs") {
      const timer = setTimeout(() => {
        buscarGifs(busqueda);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [busqueda, tipo]);

  const handleSelect = (item) => {
    if (tipo === "stickers") {
      onSelect({
        tipo: "sticker",
        contenido: item.emoji,
        nombre: item.nombre
      });
    } else {
      onSelect({
        tipo: "gif",
        contenido: item.url,
        titulo: item.titulo
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-96 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {tipo === "stickers" ? "Stickers" : "GIFs"}
              </h3>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            {/* Búsqueda (solo para GIFs) */}
            {tipo === "gifs" && (
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar GIFs..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Categorías (solo para stickers) */}
            {tipo === "stickers" && (
              <div className="flex gap-2 p-4 border-b overflow-x-auto">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    onClick={() => setCategoriaActiva(categoria)}
                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                      categoriaActiva === categoria
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* Contenido */}
            <div className="p-4 overflow-y-auto max-h-64">
              {tipo === "stickers" ? (
                <div className="grid grid-cols-4 gap-3">
                  {STICKERS_CATEGORIAS[categoriaActiva]?.map(sticker => (
                    <button
                      key={sticker.id}
                      onClick={() => handleSelect(sticker)}
                      className="aspect-square flex items-center justify-center text-3xl hover:bg-gray-100 rounded-lg transition"
                    >
                      {sticker.emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {cargando ? (
                    <div className="col-span-2 text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Buscando GIFs...</p>
                    </div>
                  ) : gifs.length > 0 ? (
                    gifs.map(gif => (
                      <button
                        key={gif.id}
                        onClick={() => handleSelect(gif)}
                        className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition"
                      >
                        <img 
                          src={gif.url} 
                          alt={gif.titulo}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-gray-500">
                      No se encontraron GIFs
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}