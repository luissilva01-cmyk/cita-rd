// src/utils/normalizarPerfil.js

// Leer variable de entorno de forma segura SOLO usando import.meta.env
// (evita completamente "process" para no romper Vite u otros bundlers modernos)
let CLOUDINARY_BASE = "";

// Vite u otros bundlers modernos
if (typeof import.meta !== "undefined" && import.meta.env) {
  CLOUDINARY_BASE =
    import.meta.env.VITE_CLOUDINARY_BASE ||
    import.meta.env.REACT_APP_CLOUDINARY_BASE ||
    "";
}

// Helper: si recibes un id de Cloudinary, construye la URL
function construirUrlImagen(maybeId) {
  if (!maybeId) return null;

  // Si ya es URL completa:
  if (/^https?:\/\//.test(maybeId)) return maybeId;

  // Si es un ID y tenemos una base válida:
  if (CLOUDINARY_BASE) {
    return `${CLOUDINARY_BASE}/${maybeId}.jpg`;
  }

  return null;
}

export function normalizarPerfil(docData) {
  const perfil = { ...docData };

  // Normalizar nombre
  perfil.nombre = (perfil.nombre || perfil.displayName || "Usuario").trim();

  perfil.descripcion =
    perfil.descripcion ||
    perfil.bio ||
    perfil.resumen ||
    "";

  // Intentar múltiples campos posibles
  const posiblesFotos = [
    perfil.foto,
    perfil.fotoPerfil,
    perfil.photoUrl,
    perfil.photoId,
    perfil.imageId,
    perfil.image
  ];

  let fotoUrl = null;

  for (const f of posiblesFotos) {
    if (!f) continue;

    // Si ya es URL completa
    if (/^https?:\/\//.test(f)) {
      fotoUrl = f;
      break;
    }

    // Intentar construir URL con Cloudinary
    const u = construirUrlImagen(f);
    if (u) {
      fotoUrl = u;
      break;
    }
  }

  perfil.foto = fotoUrl || "/placeholder.png";

  // uid
  perfil.uid = perfil.uid || perfil.id || perfil.userId || null;

  perfil.distancia = perfil.distancia ? Number(perfil.distancia) : null;
  perfil.similitud = perfil.similitud ? Number(perfil.similitud) : null;

  // Quitar email antes de mostrar en UI
  delete perfil.email;

  return perfil;
}
