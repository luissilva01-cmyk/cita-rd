// cita-rd/services/adminService.ts
// Servicio de Administración para Ta' Pa' Ti

import { db } from './firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, orderBy, limit } from 'firebase/firestore';
import { logger } from '../utils/logger';

export interface AdminUser {
  uid: string;
  email: string;
  isAdmin: boolean;
  addedAt: Date;
}

export interface ReportWithDetails {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  reporterName: string;
  category: string;
  description: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
  reviewedBy?: string;
  reviewedAt?: Date;
  action?: string;
  reportCount: number; // Total de reportes contra este usuario
}

/**
 * Verifica si un usuario es administrador
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    console.log('🔍 isUserAdmin - Buscando en colección users para:', userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    console.log('📄 isUserAdmin - Documento existe?:', userDoc.exists());
    
    if (!userDoc.exists()) {
      logger.firebase.warn('Usuario no encontrado en users', { userId });
      
      // Intentar en perfiles
      console.log('🔍 isUserAdmin - Intentando en colección perfiles...');
      const perfilDoc = await getDoc(doc(db, 'perfiles', userId));
      console.log('📄 isUserAdmin - Perfil existe?:', perfilDoc.exists());
      
      if (perfilDoc.exists()) {
        const perfilData = perfilDoc.data();
        console.log('📊 isUserAdmin - Datos COMPLETOS del perfil:', JSON.stringify(perfilData, null, 2));
        console.log('📊 isUserAdmin - Campo isAdmin específico:', perfilData?.isAdmin);
        console.log('📊 isUserAdmin - Tipo de isAdmin:', typeof perfilData?.isAdmin);
        
        // BUGFIX: Buscar tanto "isAdmin" como "isAdmin " (con espacio) por si hay error de tipeo en Firestore
        const isAdmin = perfilData.isAdmin === true || perfilData['isAdmin '] === true;
        
        console.log('✅ isUserAdmin - isAdmin en perfiles:', isAdmin);
        return isAdmin;
      }
      
      console.log('❌ isUserAdmin - No se encontró en users ni en perfiles');
      return false;
    }
    
    const userData = userDoc.data();
    console.log('📊 isUserAdmin - Datos COMPLETOS del usuario:', JSON.stringify(userData, null, 2));
    console.log('📊 isUserAdmin - Campo isAdmin específico:', userData?.isAdmin);
    console.log('📊 isUserAdmin - Tipo de isAdmin:', typeof userData?.isAdmin);
    console.log('📊 isUserAdmin - Todas las claves del documento:', Object.keys(userData || {}));
    
    // BUGFIX: Buscar tanto "isAdmin" como "isAdmin " (con espacio) por si hay error de tipeo en Firestore
    const isAdmin = userData.isAdmin === true || userData['isAdmin '] === true;
    
    console.log('✅ isUserAdmin - isAdmin:', isAdmin);
    logger.firebase.info('Verificación de admin', { userId, isAdmin });
    return isAdmin;
  } catch (error) {
    console.error('❌ isUserAdmin - Error:', error);
    logger.firebase.error('Error verificando admin', error);
    return false;
  }
}

/**
 * Obtiene el nombre de un usuario desde users o perfiles
 */
async function getUserName(userId: string): Promise<string> {
  try {
    // Intentar primero en users
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists() && userDoc.data().name) {
      return userDoc.data().name;
    }
    
    // Si no existe, intentar en perfiles
    const perfilDoc = await getDoc(doc(db, 'perfiles', userId));
    if (perfilDoc.exists()) {
      const perfilData = perfilDoc.data();
      // Intentar diferentes campos de nombre
      return perfilData.name || perfilData.nombre || 'Usuario desconocido';
    }
    
    return 'Usuario desconocido';
  } catch (error) {
    logger.firebase.error('Error obteniendo nombre de usuario', { userId, error });
    return 'Usuario desconocido';
  }
}

/**
 * Obtiene todos los reportes pendientes
 */
export async function getPendingReports(): Promise<ReportWithDetails[]> {
  try {
    const reportsQuery = query(
      collection(db, 'reports'),
      where('status', '==', 'pending'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );
    
    const snapshot = await getDocs(reportsQuery);
    const reports: ReportWithDetails[] = [];
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      // Obtener nombres de usuarios y conteo de reportes
      const [reporterName, reportedUserName, reportCount] = await Promise.all([
        getUserName(data.reporterId),
        getUserName(data.reportedUserId),
        getReportCountByUser(data.reportedUserId)
      ]);
      
      reports.push({
        id: docSnap.id,
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        reportedUserName,
        reporterName,
        category: data.category,
        description: data.description,
        timestamp: data.timestamp.toDate(),
        status: data.status,
        reviewedBy: data.reviewedBy,
        reviewedAt: data.reviewedAt?.toDate(),
        action: data.action,
        reportCount
      });
    }
    
    logger.firebase.success('Reportes pendientes obtenidos', { count: reports.length });
    return reports;
  } catch (error) {
    logger.firebase.error('Error obteniendo reportes pendientes', error);
    throw error;
  }
}

/**
 * Obtiene todos los reportes (pendientes, revisados y resueltos)
 */
export async function getAllReports(): Promise<ReportWithDetails[]> {
  try {
    const reportsQuery = query(
      collection(db, 'reports'),
      orderBy('timestamp', 'desc'),
      limit(200)
    );
    
    const snapshot = await getDocs(reportsQuery);
    const reports: ReportWithDetails[] = [];
    
    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      
      // Obtener nombres de usuarios y conteo de reportes
      const [reporterName, reportedUserName, reportCount] = await Promise.all([
        getUserName(data.reporterId),
        getUserName(data.reportedUserId),
        getReportCountByUser(data.reportedUserId)
      ]);
      
      reports.push({
        id: docSnap.id,
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        reportedUserName,
        reporterName,
        category: data.category,
        description: data.description,
        timestamp: data.timestamp.toDate(),
        status: data.status,
        reviewedBy: data.reviewedBy,
        reviewedAt: data.reviewedAt?.toDate(),
        action: data.action,
        reportCount
      });
    }
    
    logger.firebase.success('Todos los reportes obtenidos', { count: reports.length });
    return reports;
  } catch (error) {
    logger.firebase.error('Error obteniendo todos los reportes', error);
    throw error;
  }
}

/**
 * Marca un reporte como revisado
 */
export async function markReportAsReviewed(
  reportId: string,
  adminId: string,
  action: string
): Promise<void> {
  try {
    const reportRef = doc(db, 'reports', reportId);
    
    await updateDoc(reportRef, {
      status: 'reviewed',
      reviewedBy: adminId,
      reviewedAt: new Date(),
      action
    });
    
    logger.firebase.success('Reporte marcado como revisado', { reportId, adminId, action });
  } catch (error) {
    logger.firebase.error('Error marcando reporte como revisado', error);
    throw error;
  }
}

/**
 * Obtiene estadísticas de reportes
 */
export async function getReportStats(): Promise<{
  total: number;
  pending: number;
  reviewed: number;
  resolved: number;
}> {
  try {
    const reportsQuery = query(collection(db, 'reports'));
    const snapshot = await getDocs(reportsQuery);
    
    const stats = {
      total: snapshot.size,
      pending: 0,
      reviewed: 0,
      resolved: 0
    };
    
    snapshot.forEach(doc => {
      const status = doc.data().status;
      if (status === 'pending') stats.pending++;
      else if (status === 'reviewed') stats.reviewed++;
      else if (status === 'resolved') stats.resolved++;
    });
    
    logger.firebase.success('Estadísticas de reportes obtenidas', stats);
    return stats;
  } catch (error) {
    logger.firebase.error('Error obteniendo estadísticas de reportes', error);
    throw error;
  }
}

/**
 * Obtiene el conteo de reportes por usuario
 */
export async function getReportCountByUser(userId: string): Promise<number> {
  try {
    const reportsQuery = query(
      collection(db, 'reports'),
      where('reportedUserId', '==', userId)
    );
    
    const snapshot = await getDocs(reportsQuery);
    return snapshot.size;
  } catch (error) {
    logger.firebase.error('Error obteniendo conteo de reportes por usuario', error);
    return 0;
  }
}

/**
 * Bloquea o desbloquea un usuario
 */
export async function toggleUserBlock(userId: string, block: boolean, adminId: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isBlocked: block,
      blockedBy: block ? adminId : null,
      blockedAt: block ? new Date() : null
    });
    
    logger.firebase.success(`Usuario ${block ? 'bloqueado' : 'desbloqueado'}`, { userId, adminId });
  } catch (error) {
    logger.firebase.error('Error bloqueando/desbloqueando usuario', error);
    throw error;
  }
}
