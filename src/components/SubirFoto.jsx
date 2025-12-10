// src/components/SubirFoto.jsx
import React, { useState, useRef } from "react";
import { subirImagenCloudinary, comprimirImagen } from "../services/uploadService";
import toast from "react-hot-toast";
import { Camera, Upload, X } from "lucide-react";

export default function SubirFoto({ onImagenSubida, imagenActual = null }) {
  const [subiendo, setSubiendo] = useState(false);
  const [preview, setPreview] = useState(imagenActual);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSubiendo(true);

      // Mostrar preview inmediato
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Comprimir imagen
      const imagenComprimida = await comprimirImagen(file);

      // Subir a Cloudinary
      const resultado = await subirImagenCloudinary(imagenComprimida, "citard/perfiles");

      if (resultado.ok) {
        toast.success("Imagen subida exitosamente");
        setPreview(resultado.url);
        onImagenSubida(resultado.url);
      } else {
        toast.error(resultado.msg);
        setPreview(imagenActual);
      }
    } catch (error) {
      console.error("Error al procesar imagen:", error);
      toast.error("Error al procesar la imagen");
      setPreview(imagenActual);
    } finally {
      setSubiendo(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImagenSubida(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 transition">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {subiendo ? (
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
            ) : (
              <>
                <Camera size={48} className="text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click para subir</span> o arrastra
                </p>
                <p className="text-xs text-gray-500">PNG, JPG o WEBP (MAX. 5MB)</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={subiendo}
          />
        </label>
      )}
    </div>
  );
}
