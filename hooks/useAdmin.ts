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
      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const adminStatus = await isUserAdmin(userId);
        setIsAdmin(adminStatus);
        logger.firebase.info('Estado de admin verificado', { userId, isAdmin: adminStatus });
      } catch (err) {
        logger.firebase.error('Error verificando estado de admin', err);
        setError('Error verificando permisos de administrador');
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdmin();
  }, [userId]);

  return { isAdmin, loading, error };
}
