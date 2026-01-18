// cita-rd/hooks/usePrivacyDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  privacyDashboardService, 
  PrivacySettings, 
  DataExportRequest, 
  PrivacyAuditLog 
} from '../services/privacyDashboardService';

interface UsePrivacyDashboardReturn {
  // Estados
  privacySettings: PrivacySettings | null;
  privacySummary: {
    privacyScore: number;
    recommendations: string[];
    risksDetected: string[];
    dataShared: string[];
  } | null;
  auditLog: PrivacyAuditLog[];
  dataExportRequests: DataExportRequest[];
  isLoading: boolean;
  error: string | null;

  // Funciones
  loadPrivacySettings: (userId: string) => Promise<void>;
  updatePrivacySetting: <K extends keyof PrivacySettings>(
    category: K,
    updates: Partial<PrivacySettings[K]>
  ) => Promise<void>;
  requestDataExport: (dataTypes: string[]) => Promise<DataExportRequest | null>;
  deleteAccount: (reason?: string) => Promise<void>;
  loadPrivacySummary: () => Promise<void>;
  loadAuditLog: () => Promise<void>;
  canPerformAction: (action: string, targetUserId?: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

export const usePrivacyDashboard = (userId?: string): UsePrivacyDashboardReturn => {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [privacySummary, setPrivacySummary] = useState<{
    privacyScore: number;
    recommendations: string[];
    risksDetected: string[];
    dataShared: string[];
  } | null>(null);
  const [auditLog, setAuditLog] = useState<PrivacyAuditLog[]>([]);
  const [dataExportRequests, setDataExportRequests] = useState<DataExportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración de privacidad
  const loadPrivacySettings = useCallback(async (targetUserId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const settings = await privacyDashboardService.getPrivacySettings(targetUserId);
      setPrivacySettings(settings);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando configuración');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Actualizar configuración específica
  const updatePrivacySetting = useCallback(async <K extends keyof PrivacySettings>(
    category: K,
    updates: Partial<PrivacySettings[K]>
  ) => {
    if (!userId || !privacySettings) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await privacyDashboardService.updatePrivacySetting(userId, category, updates);
      
      // Actualizar estado local
      setPrivacySettings(prev => {
        if (!prev) return prev;
        
        const updatedCategory = {
          ...(prev[category] as object),
          ...(updates as object)
        };
        
        return {
          ...prev,
          [category]: updatedCategory
        };
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando configuración');
    } finally {
      setIsLoading(false);
    }
  }, [userId, privacySettings]);

  // Solicitar exportación de datos
  const requestDataExport = useCallback(async (dataTypes: string[]): Promise<DataExportRequest | null> => {
    if (!userId) {
      console.error('❌ No hay userId disponible');
      return null;
    }

    console.log('📤 usePrivacyDashboard - Solicitando exportación:', dataTypes);
    setIsLoading(true);
    setError(null);

    try {
      const request = await privacyDashboardService.requestDataExport(userId, dataTypes);
      
      // Agregar a la lista de solicitudes
      setDataExportRequests(prev => [request, ...prev]);

      console.log('✅ Exportación solicitada:', request.id);
      return request;

    } catch (err) {
      console.error('❌ Error solicitando exportación:', err);
      setError(err instanceof Error ? err.message : 'Error solicitando exportación');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Eliminar cuenta
  const deleteAccount = useCallback(async (reason?: string) => {
    if (!userId) {
      console.error('❌ No hay userId disponible');
      return;
    }

    console.log('🗑️ usePrivacyDashboard - Eliminando cuenta:', userId, reason);
    setIsLoading(true);
    setError(null);

    try {
      await privacyDashboardService.deleteAccount(userId, reason);
      
      // Limpiar estados
      setPrivacySettings(null);
      setPrivacySummary(null);
      setAuditLog([]);
      setDataExportRequests([]);

      console.log('✅ Cuenta eliminada exitosamente');

    } catch (err) {
      console.error('❌ Error eliminando cuenta:', err);
      setError(err instanceof Error ? err.message : 'Error eliminando cuenta');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Cargar resumen de privacidad
  const loadPrivacySummary = useCallback(async () => {
    if (!userId) {
      console.error('❌ No hay userId disponible');
      return;
    }

    console.log('📊 usePrivacyDashboard - Cargando resumen de privacidad');
    setIsLoading(true);
    setError(null);

    try {
      const summary = await privacyDashboardService.getPrivacySummary(userId);
      setPrivacySummary(summary);

      console.log('✅ Resumen cargado:', {
        score: summary.privacyScore,
        recommendations: summary.recommendations.length,
        risks: summary.risksDetected.length
      });

    } catch (err) {
      console.error('❌ Error cargando resumen:', err);
      setError(err instanceof Error ? err.message : 'Error cargando resumen');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Cargar audit log
  const loadAuditLog = useCallback(async () => {
    if (!userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const logs = await privacyDashboardService.getPrivacyAuditLog(userId);
      setAuditLog(logs);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando audit log');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Verificar si puede realizar una acción
  const canPerformAction = useCallback(async (action: string, targetUserId?: string): Promise<boolean> => {
    if (!userId) {
      return false;
    }

    try {
      return await privacyDashboardService.canPerformAction(userId, action, targetUserId);
    } catch (err) {
      return false;
    }
  }, [userId]);

  // Refrescar todos los datos
  const refreshData = useCallback(async () => {
    if (!userId) return;

    console.log('🔄 usePrivacyDashboard - Refrescando todos los datos');
    
    await Promise.all([
      loadPrivacySettings(userId),
      loadPrivacySummary(),
      loadAuditLog()
    ]);
  }, [userId, loadPrivacySettings, loadPrivacySummary, loadAuditLog]);

  // Cargar datos iniciales cuando cambia el userId
  useEffect(() => {
    if (userId) {
      console.log('🚀 usePrivacyDashboard - Inicializando para usuario:', userId);
      refreshData();
    }
  }, [userId, refreshData]);

  return {
    // Estados
    privacySettings,
    privacySummary,
    auditLog,
    dataExportRequests,
    isLoading,
    error,

    // Funciones
    loadPrivacySettings,
    updatePrivacySetting,
    requestDataExport,
    deleteAccount,
    loadPrivacySummary,
    loadAuditLog,
    canPerformAction,
    refreshData
  };
};

export default usePrivacyDashboard;