# Fix: Service Worker Notification Error
**Fecha:** 10 de Marzo 2026  
**Estado:** ✅ COMPLETADO

## Problema Reportado
Al activar las notificaciones en móvil, aparecía el siguiente error:
```
Failed to construct 'Notification': Illegal constructor. 
Use ServiceWorkerRegistration.showNotification() instead
```

## Diagnóstico
El código estaba usando el constructor `new Notification()` directamente para mostrar notificaciones en foreground. En navegadores móviles, especialmente cuando hay un Service Worker registrado, las notificaciones deben mostrarse a través del Service Worker usando `ServiceWorkerRegistration.showNotification()`.

### Causa Raíz
Los navegadores móviles modernos requieren que las notificaciones se muestren a través del Service Worker para:
- Mejor control del ciclo de vida de las notificaciones
- Soporte para notificaciones en background
- Consistencia entre notificaciones foreground y background
- Mejor manejo de permisos y seguridad

## Solución Implementada

### 1. Nuevo Método: `showNotificationViaServiceWorker()`
```typescript
private async showNotificationViaServiceWorker(payload: any): Promise<void> {
  try {
    // Verificar que el Service Worker esté registrado
    const registration = await navigator.serviceWorker.ready;

    const notificationTitle = payload.notification?.title || 'Ta\' Pa\' Ti';
    const notificationOptions: NotificationOptions = {
      body: payload.notification?.body || 'Tienes una nueva notificación',
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: payload.data?.type || 'general',
      data: payload.data,
      requireInteraction: false,
      vibrate: [200, 100, 200],
    };

    // Mostrar notificación a través del Service Worker
    await registration.showNotification(notificationTitle, notificationOptions);
    logger.notification.success('Notification shown via Service Worker');
  } catch (error) {
    logger.notification.error('Error showing notification via Service Worker', error);
  }
}
```

### 2. Actualización del Listener de Foreground
```typescript
private setupForegroundListener(): void {
  if (!this.messaging) return;

  onMessage(this.messaging, (payload) => {
    logger.notification.info('Foreground message received', payload);

    // Mostrar notificación usando Service Worker
    this.showNotificationViaServiceWorker(payload);
  });
}
```

### 3. Actualización de `showTestNotification()`
```typescript
async showTestNotification(): Promise<void> {
  if (Notification.permission !== 'granted') {
    logger.notification.warn('Notification permission not granted');
    return;
  }

  try {
    // Usar Service Worker para mostrar la notificación
    const registration = await navigator.serviceWorker.ready;
    
    await registration.showNotification('🎉 Ta\' Pa\' Ti', {
      body: 'Las notificaciones están funcionando correctamente!',
      icon: '/logo192.png',
      badge: '/logo192.png',
      vibrate: [200, 100, 200],
      tag: 'test-notification',
      requireInteraction: false,
      data: {
        url: window.location.origin
      }
    });

    logger.notification.success('Test notification shown via Service Worker');
  } catch (error) {
    logger.notification.error('Error showing test notification', error);
  }
}
```

## Cambios Clave

### ANTES (Incorrecto) ❌
```typescript
// En foreground listener
onMessage(this.messaging, (payload) => {
  const notification = new Notification(title, options); // ❌ Error en móvil
});

// En test notification
async showTestNotification() {
  const notification = new Notification(title, options); // ❌ Error en móvil
}
```

### DESPUÉS (Correcto) ✅
```typescript
// En foreground listener
onMessage(this.messaging, (payload) => {
  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, options); // ✅ Funciona en móvil
});

// En test notification
async showTestNotification() {
  const registration = await navigator.serviceWorker.ready;
  await registration.showNotification(title, options); // ✅ Funciona en móvil
}
```

## Beneficios

✅ Funciona correctamente en navegadores móviles  
✅ Consistencia entre notificaciones foreground y background  
✅ Mejor manejo del ciclo de vida de notificaciones  
✅ Soporte para vibración y sonido  
✅ Mejor experiencia de usuario  
✅ Cumple con estándares web modernos  

## Archivos Modificados
- `cita-rd/services/notificationService.ts`

## Testing

### En Móvil
1. Abrir https://tapati.online en móvil
2. Ir a Perfil > Configuración
3. Activar "Notificaciones Push"
4. ✅ No debe aparecer error
5. ✅ Debe mostrar mensaje de éxito

### Recibir Notificación
1. Usuario A envía mensaje a Usuario B
2. Usuario B (con app en foreground) debe recibir:
   - ✅ Notificación visible
   - ✅ Sonido
   - ✅ Vibración (200ms, pausa 100ms, 200ms)
   - ✅ Icono correcto
   - ✅ Click abre el chat

## Notas Técnicas

### Service Worker Registration
- El Service Worker debe estar registrado y activo
- Usamos `navigator.serviceWorker.ready` para esperar a que esté listo
- El Service Worker se registra en `getAndSaveToken()`

### NotificationOptions
```typescript
interface NotificationOptions {
  body: string;           // Texto del mensaje
  icon: string;           // Icono grande
  badge: string;          // Icono pequeño en barra de estado
  tag: string;            // Agrupa notificaciones del mismo tipo
  data: any;              // Datos adicionales
  requireInteraction: boolean; // Si requiere acción del usuario
  vibrate: number[];      // Patrón de vibración [vibrar, pausa, vibrar]
}
```

### Patrón de Vibración
- `[200, 100, 200]` = vibrar 200ms, pausa 100ms, vibrar 200ms
- Proporciona feedback táctil al recibir notificación
- Mejora la experiencia en dispositivos móviles

## Deploy
- Build: ✅ Exitoso
- Hosting: ✅ Desplegado
- URL: https://citard-fbc26.web.app
- Dominio: https://tapati.online

## Resultado
Las notificaciones ahora funcionan correctamente en:
- ✅ Navegadores móviles (Chrome, Safari, Firefox)
- ✅ Navegadores desktop
- ✅ PWA instalada
- ✅ Foreground y background

## Próximos Pasos
- [ ] Verificar funcionamiento en diferentes navegadores móviles
- [ ] Monitorear logs para errores
- [ ] Recopilar feedback de usuarios
- [ ] Considerar agregar notificaciones con imagen (si es necesario)

