// src/services/uploadService.js
import axios from "axios";

/**
 * Subir imagen a Cloudinary
 * @param {File} file - Archivo de imagen
 * @param {string} folder - Carpeta en Cloudinary (opcional)
 */
export async function subirImagenCloudinary(file, folder = "citard") {
  try {
    if (!file) {
      return { ok: false, msg: "No se proporcionó archivo" };
    }

    // Validar tipo de archivo
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!tiposPermitidos.includes(file.type)) {
      return { ok: false, msg: "Tipo de archivo no permitido. Solo JPG, PNG o WEBP" };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { ok: false, msg: "La imagen es muy grande. Máximo 5MB" };
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error("Faltan credenciales de Cloudinary");
      return { ok: false, msg: "Error de configuración" };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return {
      ok: true,
      url: response.data.secure_url,
      publicId: response.data.public_id
    };
  } catch (error) {
    console.error("Error al subir imagen:", error);
    return { ok: false, msg: "Error al subir imagen" };
  }
}

/**
 * Comprimir imagen antes de subir
 * @param {File} file - Archivo de imagen
 * @param {number} maxWidth - Ancho máximo
 * @param {number} quality - Calidad (0-1)
 */
export function comprimirImagen(file, maxWidth = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: "image/jpeg" }));
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
  });
}
