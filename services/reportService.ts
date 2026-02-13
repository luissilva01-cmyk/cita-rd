// cita-rd/services/reportService.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db } from './firebase';
import { logger } from '../utils/logger';

export type ReportCategory = 
  | 'fake_profile' 
  | 'inappropriate_content' 
  | 'harassment' 
  | 'spam'
  | 'underage'
  | 'other';

export interface Report {
  id?: string;
  reporterId: string;
  reportedUserId: string;
  category: ReportCategory;
  reason: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'resolved';
  reviewedBy?: string;
  reviewedAt?: number;
  action?: string;
}

/**
 * Reportar un usuario
 */
export const reportUser = async (
  reporterId: string,
  reportedUserId: string,
  category: ReportCategory,
  reason: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    logger.firebase.info('Reportando usuario', { 
      reporterId, 
      reportedUserId, 
      category 
    });

    // Verificar que no se reporte a sí mismo
    if (reporterId === reportedUserId) {
      return { 
        success: false, 
        error: 'No puedes reportarte a ti mismo' 
      };
    }

    // Verificar si ya reportó a este usuario
    const existingReport = await hasReportedUser(reporterId, reportedUserId);
    if (existingReport) {
      return { 
        success: false, 
        error: 'Ya has reportado a este usuario' 
      };
    }

    // Crear reporte
    const report: Omit<Report, 'id'> = {
      reporterId,
      reportedUserId,
      category,
      reason,
      timestamp: Date.now(),
      status: 'pending'
    };

    await addDoc(collection(db, 'reports'), report);

    // Incrementar contador de reportes del usuario
    const userRef = doc(db, 'perfiles', reportedUserId);
    await updateDoc(userRef, {
      reportCount: increment(1),
      lastReportedAt: serverTimestamp()
    });

    // Verificar si debe bloquearse automáticamente
    await checkAutoBlock(reportedUserId);

    logger.firebase.success('Usuario reportado exitosamente');
    return { success: true };

  } catch (error) {
    logger.firebase.error('Error reportando usuario', error);
    return { 
      success: false, 
      error: 'Error al enviar el reporte. Intenta de nuevo.' 
    };
  }
};

/**
 * Verificar si un usuario ya reportó a otro
 */
export const hasReportedUser = async (
  reporterId: string,
  reportedUserId: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('reporterId', '==', reporterId),
      where('reportedUserId', '==', reportedUserId)
    );

    const snapshot = await getDocs(q);
    return !snapshot.empty;

  } catch (error) {
    logger.firebase.error('Error verificando reporte existente', error);
    return false;
  }
};

/**
 * Obtener número de reportes de un usuario
 */
export const getReportCount = async (userId: string): Promise<number> => {
  try {
    const userRef = doc(db, 'perfiles', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().reportCount || 0;
    }

    return 0;

  } catch (error) {
    logger.firebase.error('Error obteniendo contador de reportes', error);
    return 0;
  }
};

/**
 * Verificar si un usuario debe bloquearse automáticamente
 * Se bloquea después de 3 reportes
 */
const checkAutoBlock = async (userId: string): Promise<void> => {
  try {
    const reportCount = await getReportCount(userId);

    logger.firebase.info('Verificando auto-bloqueo', { userId, reportCount });

    // Bloquear después de 3 reportes
    if (reportCount >= 3) {
      const userRef = doc(db, 'perfiles', userId);
      const userDoc = await getDoc(userRef);

      // Solo bloquear si no está ya bloqueado
      if (userDoc.exists() && !userDoc.data().isBlocked) {
        await updateDoc(userRef, {
          isBlocked: true,
          blockReason: 'Múltiples reportes de usuarios',
          blockedAt: serverTimestamp(),
          blockedBy: 'system'
        });

        logger.firebase.warn('Usuario bloqueado automáticamente', { 
          userId, 
          reportCount 
        });
      }
    }

  } catch (error) {
    logger.firebase.error('Error en auto-bloqueo', error);
  }
};

/**
 * Obtener reportes de un usuario (para moderadores)
 */
export const getReportsByUser = async (
  userId: string
): Promise<Report[]> => {
  try {
    const q = query(
      collection(db, 'reports'),
      where('reportedUserId', '==', userId)
    );

    const snapshot = await getDocs(q);
    const reports: Report[] = [];

    snapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      } as Report);
    });

    return reports;

  } catch (error) {
    logger.firebase.error('Error obteniendo reportes', error);
    return [];
  }
};

/**
 * Verificar si un usuario está bloqueado
 */
export const isUserBlocked = async (userId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'perfiles', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data().isBlocked || false;
    }

    return false;

  } catch (error) {
    logger.firebase.error('Error verificando bloqueo', error);
    return false;
  }
};

/**
 * Obtener categorías de reporte con descripciones
 */
export const getReportCategories = (): Array<{
  value: ReportCategory;
  label: string;
  description: string;
}> => {
  return [
    {
      value: 'fake_profile',
      label: 'Perfil Falso',
      description: 'Usa fotos de otra persona o celebridad'
    },
    {
      value: 'inappropriate_content',
      label: 'Contenido Inapropiado',
      description: 'Fotos o mensajes ofensivos'
    },
    {
      value: 'harassment',
      label: 'Acoso',
      description: 'Comportamiento acosador o amenazante'
    },
    {
      value: 'spam',
      label: 'Spam',
      description: 'Publicidad o contenido no deseado'
    },
    {
      value: 'underage',
      label: 'Menor de Edad',
      description: 'Parece ser menor de 18 años'
    },
    {
      value: 'other',
      label: 'Otro',
      description: 'Otra razón no listada'
    }
  ];
};

export default {
  reportUser,
  hasReportedUser,
  getReportCount,
  getReportsByUser,
  isUserBlocked,
  getReportCategories
};
