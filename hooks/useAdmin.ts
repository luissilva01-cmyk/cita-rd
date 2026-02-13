// cita-rd/hooks/useAdmin.ts
// Hook para verificar permisos de administrador

import { useState, useEffect } from 'react';
import { isUserAdmin } from '../services/adminService';
import { logger } from '../utils/logger';

export function useAdmin(userId: string | undefined) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      console.log('🔍 useAdmin - Verificando admin para userId:', userId);
      
      if (!userId) {
        console.log('❌ useAdmin - No hay userId');
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const adminStatus = await isUserAdmin(userId);
        console.log('✅ useAdmin - Admin status:', adminStatus);
        setIsAdmin(adminStatus);
        logger.firebase.info('Estado de admin verificado', { userId, isAdmin: adminStatus });
      } catch (err) {
        console.error('❌ useAdmin - Error:', err);
        logger.firebase.error('Error verificando estado de admin', err);
        setError('Error verificando permisos de administrador');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [userId]);

  console.log('🎯 useAdmin - Estado actual:', { isAdmin, loading, error });
  return { isAdmin, loading, error };
}
