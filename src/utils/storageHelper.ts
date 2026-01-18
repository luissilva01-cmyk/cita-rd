// cita-rd/src/utils/storageHelper.ts - Helper para manejar problemas de storage
export const checkStorageAvailability = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    console.warn('localStorage no está disponible:', error);
    return false;
  }
};

export const getStorageErrorMessage = (): string => {
  return `
    Tu navegador está bloqueando el almacenamiento local necesario para Firebase Auth.
    
    Para solucionarlo:
    
    • Safari: Ve a Preferencias → Privacidad → Desactiva "Prevenir seguimiento entre sitios"
    • Firefox: Ve a Configuración → Privacidad → Cambia a "Estándar" 
    • Chrome: Desactiva extensiones de privacidad temporalmente
    
    O intenta usar el navegador en modo incógnito/privado.
  `;
};

export const showStorageWarning = (): void => {
  if (!checkStorageAvailability()) {
    console.error('Storage bloqueado por Tracking Prevention');
    
    // Mostrar alerta al usuario
    const message = getStorageErrorMessage();
    alert(`⚠️ Problema de Privacidad del Navegador\n\n${message}`);
  }
};