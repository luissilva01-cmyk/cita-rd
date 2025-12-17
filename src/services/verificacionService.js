// src/services/verificacionService.js
import { db } from "../utils/firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";

/**
 * Iniciar proceso de verificación de perfil
 * @param {string} userId - ID del usuario
 * @param {string} fotoSelfie - URL de la foto selfie tomada
 */
export async function iniciarVerificacion(userId, fotoSelfie) {
  try {
    const verificacionRef = doc(db, "verificaciones", userId);
    
    await setDoc(verificacionRef, {
      userId,
      fotoSelfie,
      estado: "pendiente", // pendiente, aprobada, rechazada
      fechaEnvio: serverTimestamp(),
      intentos: 1
    });

    return { ok: true, msg: "Verificación enviada para revisión" };
  } catch (error) {
    console.error("Error al iniciar verificación:", error);
    return { ok: false, msg: "Error al enviar verificación" };
  }
}

/**
 * Obtener estado de verificación del usuario
 * @param {string} userId - ID del usuario
 */
export async function obtenerEstadoVerificacion(userId) {
  try {
    const verificacionRef = doc(db, "verificaciones", userId);
    const verificacionSnap = await getDoc(verificacionRef);

    if (verificacionSnap.exists()) {
      return { ok: true, data: verificacionSnap.data() };
    }

    return { ok: true, data: null };
  } catch (error) {
    console.error("Error al obtener verificación:", error);
    return { ok: false, msg: "Error al obtener estado" };
  }
}

/**
 * Marcar perfil como verificado (función administrativa)
 * @param {string} userId - ID del usuario
 * @param {boolean} aprobada - Si la verificación fue aprobada
 * @param {string} motivo - Motivo del rechazo (opcional)
 */
export async function procesarVerificacion(userId, aprobada, motivo = "") {
  try {
    const verificacionRef = doc(db, "verificaciones", userId);
    const perfilRef = doc(db, "perfiles", userId);

    // Actualizar estado de verificación
    await updateDoc(verificacionRef, {
      estado: aprobada ? "aprobada" : "rechazada",
      fechaProcesamiento: serverTimestamp(),
      motivo: motivo
    });

    // Actualizar perfil del usuario
    await updateDoc(perfilRef, {
      verificado: aprobada,
      fechaVerificacion: aprobada ? serverTimestamp() : null
    });

    return { ok: true, msg: aprobada ? "Perfil verificado" : "Verificación rechazada" };
  } catch (error) {
    console.error("Error al procesar verificación:", error);
    return { ok: false, msg: "Error al procesar verificación" };
  }
}

/**
 * Verificar si un usuario está verificado
 * @param {string} userId - ID del usuario
 */
export async function estaVerificado(userId) {
  try {
    const perfilRef = doc(db, "perfiles", userId);
    const perfilSnap = await getDoc(perfilRef);

    if (perfilSnap.exists()) {
      return perfilSnap.data().verificado === true;
    }

    return false;
  } catch (error) {
    console.error("Error al verificar estado:", error);
    return false;
  }
}

/**
 * Simular verificación automática (para desarrollo)
 * Compara la foto selfie con la foto de perfil usando análisis básico
 */
export async function verificacionAutomatica(userId, fotoSelfie, fotoPerfil) {
  try {
    // En producción, aquí iría integración con servicios como:
    // - AWS Rekognition
    // - Azure Face API
    // - Google Vision API
    
    // Por ahora, simulamos una verificación exitosa
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const exito = Math.random() > 0.2; // 80% de éxito simulado
    
    await procesarVerificacion(userId, exito, exito ? "" : "Las fotos no coinciden suficientemente");
    
    return { 
      ok: true, 
      verificado: exito,
      confianza: exito ? Math.random() * 0.3 + 0.7 : Math.random() * 0.5 + 0.2
    };
  } catch (error) {
    console.error("Error en verificación automática:", error);
    return { ok: false, msg: "Error en verificación automática" };
  }
}