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
}

/**
 * Verifica si un usuario es administrador
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      logger.firebase.warn('Usuario no encontrado', { userId });
      return false;
    }
    
    const userData = userDoc.data();
    const isAdmin = userData.isAdmin === true;
    
    logger.firebase.info('Verificación de admin', { userId, isAdmin });
    return isAdmin;
  } catch (error) {
    logger.firebase.error('Error verificando admin', error);
    return false;
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
      
      // Obtener nombres de usuarios
      const [reporterDoc, reportedDoc] = await Promise.all([
        getDoc(doc(db, 'users', data.reporterId)),
        getDoc(doc(db, 'users', data.reportedUserId))
      ]);
      
      reports.push({
        id: docSnap.id,
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        reportedUserName: reportedDoc.exists() ? reportedDoc.data().name : 'Usuario desconocido',
        reporterName: reporterDoc.exists() ? reporterDoc.data().name : 'Usuario desconocido',
        category: data.category,
        description: data.description,
        timestamp: data.timestamp.toDate(),
        status: data.status,
        reviewedBy: data.reviewedBy,
        reviewedAt: data.reviewedAt?.toDate(),
        action: data.action
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
      
      // Obtener nombres de usuarios
      const [reporterDoc, reportedDoc] = await Promise.all([
        getDoc(doc(db, 'users', data.reporterId)),
        getDoc(doc(db, 'users', data.reportedUserId))
      ]);
      
      reports.push({
        id: docSnap.id,
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        reportedUserName: reportedDoc.exists() ? reportedDoc.data().name : 'Usuario desconocido',
        reporterName: reporterDoc.exists() ? reporterDoc.data().name : 'Usuario desconocido',
        category: data.category,
        description: data.description,
        timestamp: data.timestamp.toDate(),
        status: data.status,
        reviewedBy: data.reviewedBy,
        reviewedAt: data.reviewedAt?.toDate(),
        action: data.action
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
