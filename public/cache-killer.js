// 🔥 CACHE KILLER - Fuerza limpieza de caché agresiva
(function() {
  const CURRENT_VERSION = '18feb2026-v1-timestamp';
  const storedVersion = localStorage.getItem('app_version');
  
  console.log('🔥 [CACHE KILLER] Verificando versión...', { stored: storedVersion, current: CURRENT_VERSION });
  
  if (storedVersion !== CURRENT_VERSION) {
    console.log('🔥 [CACHE KILLER] Nueva versión detectada, limpiando TODO...');
    
    // 1. Limpiar localStorage (preservar datos de usuario)
    const userToken = localStorage.getItem('userToken');
    const userId = localStorage.getItem('userId');
    localStorage.clear();
    if (userToken) localStorage.setItem('userToken', userToken);
    if (userId) localStorage.setItem('userId', userId);
    localStorage.setItem('app_version', CURRENT_VERSION);
    console.log('✅ [CACHE KILLER] localStorage limpiado');
    
    // 2. Limpiar sessionStorage
    sessionStorage.clear();
    console.log('✅ [CACHE KILLER] sessionStorage limpiado');
    
    // 3. Desregistrar service workers
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
          registration.unregister();
          console.log('✅ [CACHE KILLER] Service worker desregistrado');
        }
      });
    }
    
    // 4. Limpiar caché de la API de Cache
    if ('caches' in window) {
      caches.keys().then(function(names) {
        for (let name of names) {
          caches.delete(name);
          console.log('✅ [CACHE KILLER] Caché eliminado:', name);
        }
      });
    }
    
    // 5. Forzar recarga completa con timestamp
    console.log('🔄 [CACHE KILLER] Recargando con timestamp...');
    setTimeout(function() {
      window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
    }, 500);
  } else {
    console.log('✅ [CACHE KILLER] Versión correcta, continuando...');
  }
})();
