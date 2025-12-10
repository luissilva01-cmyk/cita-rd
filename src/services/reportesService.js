// src/services/reportesService.js
import { db } from "../utils/firebase";
import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";

/**
 * Reportar a un usuario
 * @param {string} reportadorUid - ID del usuario que reporta
 * @param {string} reportadoUid - ID del usuario reportado
 * @param {string} motivo - Motivo del reporte
 * @param {string} descripcion - Descripción adicional
 */
export async function reportarUsuario(reportadorUid, reportadoUid, motivo, descripcion = "") {
  try {
    if (!reportadorUid || !reportadoUid || !motivo) {
      return { ok: false, msg: "Datos incompletos" };
    }

    if (reportadorUid === reportadoUid) {
      return { ok: false, msg: "No puedes reportarte a ti mismo" };
    }

    await addDoc(collection(db, "reportes"), {
      reportador: reportadorUid,
      reportado: reportadoUid,
      motivo,
      descripcion,
      timestamp: serverTimestamp(),
      estado: "pendiente"
    });

    return { ok: true, msg: "Reporte enviado exitosamente" };
  } catch (error) {
    console.error("Error al reportar usuario:", error);
    return { ok: false, msg: "Error al enviar reporte" };
  }
}

export const MOTIVOS_REPORTE = [
  "Contenido inapropiado",
  "Acoso o intimidación",
  "Spam o publicidad",
  "Perfil falso",
  "Comportamiento sospechoso",
  "Lenguaje ofensivo",
  "Otro"
];
