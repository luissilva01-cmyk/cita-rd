// src/components/CrearStory.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Type, X, Send } from "lucide-react";
import { crearStory, COLORES_STORY } from "../services/storiesService";
import { subirImagenCloudinary } from "../services/uploadService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function CrearStory({ isOpen, onClose, onStoryCreated }) {
  const { user } = useAuth();
  const [tipo, setTipo] = useState("texto"); // "texto" o "imagen"
  const [contenido, setContenido] = useState("");
  const [colorFondo, setColorFondo] = useState(COLORES_STORY[0]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleImagenChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
        setTipo("imagen");
      };
      reader.readAsDataURL(file);
    }
  };

  const publicarStory = async () => {
    if (!contenido.trim() && !imagenPreview) {
      toast.error("Agrega contenido a tu story");
      return;
    }

    setSubiendo(true);

    try {
      let urlContenido = contenido;

      if (tipo === "imagen" && imagenPreview) {
        // Convertir preview a File
        const response = await fetch(imagenPreview);
        const blob = await response.blob();
        const file = new File([blob], 'story.jpg', { type: 'image/jpeg' });

        // Subir a Cloudinary
        const resultado = await subirImagenCloudinary(file, "citard/stories");
        
        if (!resultado.ok) {
          throw new Error("Error al subir imagen");
        }
        
        urlContenido = resultado.url;
      }

      // Crear story
      const resultado = await crearStory(user.uid, tipo, urlContenido, colorFondo);

      if (resultado.ok) {
        toast.success("Story publicada");
        onStoryCreated?.();
        cerrar();
      } else {
        toast.error("Error al publicar story");
      }
    } catch (error) {
      console.error("Error al publicar story:", error);
      toast.error("Error al publicar story");
    } finally {
      setSubiendo(false);
    }
  };

  const cerrar = () => {
    setTipo("texto");
    setContenido("");
    setColorFondo(COLORES_STORY[0]);
    setImagenPreview(null);
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
            onClick={cerrar}
            className="fixed inset-0 bg-black/60 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold">Crear Story</h2>
                <button onClick={cerrar} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              {/* Selector de tipo */}
              <div className="flex border-b">
                <button
                  onClick={() => setTipo("texto")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 ${
                    tipo === "texto" ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500" : "text-gray-600"
                  }`}
                >
                  <Type size={20} />
                  Texto
                </button>
                <button
                  onClick={() => setTipo("imagen")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 ${
                    tipo === "imagen" ? "bg-orange-50 text-orange-600 border-b-2 border-orange-500" : "text-gray-600"
                  }`}
                >
                  <Camera size={20} />
                  Imagen
                </button>
              </div>

              {/* Preview */}
              <div className="p-4">
                <div 
                  className="w-full h-64 rounded-lg flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: tipo === "texto" ? colorFondo : "#f3f4f6" }}
                >
                  {tipo === "texto" ? (
                    <textarea
                      value={contenido}
                      onChange={(e) => setContenido(e.target.value)}
                      placeholder="Escribe algo..."
                      className="w-full h-full bg-transparent text-white text-center text-xl font-bold placeholder-white/70 resize-none border-none outline-none p-4"
                      maxLength={200}
                    />
                  ) : imagenPreview ? (
                    <img src={imagenPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                      <Camera size={48} />
                      <span>Seleccionar imagen</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImagenChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Selector de colores (solo para texto) */}
                {tipo === "texto" && (
                  <div className="flex gap-2 mt-4 justify-center">
                    {COLORES_STORY.map(color => (
                      <button
                        key={color}
                        onClick={() => setColorFondo(color)}
                        className={`w-8 h-8 rounded-full border-2 ${
                          colorFondo === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}

                {/* Contador de caracteres */}
                {tipo === "texto" && (
                  <p className="text-sm text-gray-500 text-center mt-2">
                    {contenido.length}/200
                  </p>
                )}
              </div>

              {/* Botones */}
              <div className="flex gap-3 p-4 border-t">
                <button
                  onClick={cerrar}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={publicarStory}
                  disabled={subiendo || (!contenido.trim() && !imagenPreview)}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {subiendo ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Send size={20} />
                      Publicar
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}