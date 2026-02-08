# 🔍 Diagnóstico: Tokens FCM No Se Guardan

## 📋 Problema Identificado

Aunque las notificaciones están activas y el usuario puede activarlas desde `AccountSettings`, **los tokens FCM no se están guardando en Firestore**. La colección `fcmTokens` no existe o está vacía.

## 🎯 Causa Probable

Hay varias posibles causas:

1. **Error silencioso al guardar**: El método `saveTokenToFirestore` puede estar fallando sin mostrar error al usuario
2. **Permisos de Firestore**: Las reglas pueden estar bloqueando la escritura
3. **Service Worker no registrado**: El SW puede no estar activo cuando se intenta obtener el token
4. **Token no se obtiene**: El método `getToken` puede estar fallando antes de llegar a guardar

## 🔧 Herramienta de Diagnóstico

He creado un archivo HTML de prueba completo para diagnosticar el problema:

### 📁 Archivo: `test-fcm-token-debug.html`

Este archivo te permite:

✅ Verificar soporte del navegador  
✅ Verificar autenticación  
✅ Solicitar permisos de notificaciones  
✅ Obtener token FCM paso a paso  
✅ Guardar token en Firestore manualmente  
✅ Verificar si el token se guardó correctamente  
✅ Ver logs detallados de cada paso  

## 🚀 Cómo Usar la Herramienta

### Paso 1: Abrir el archivo
```bash
cd cita-rd
# Abrir test-fcm-token-debug.html en el navegador
```

### Paso 2: Seguir el flujo
1. **Verificar Estado del Sistema**: Debe mostrar todo en verde ✅
2. **Autenticación**: 
   - Opción A: Inicia sesión en la app y usa el userId real
   - Opción B: Ingresa un userId de prueba manualmente
3. **Solicitar Permiso**: Click en "Solicitar Permiso"
4. **Obtener Token**: Click en "Obtener Token"
5. **Guardar Token**: Click en "Guardar Token en Firestore"
6. **Verificar**: Click en "Verificar Colección fcmTokens"

### Paso 3: Revisar los logs
Los logs te dirán exactamente dónde está fallando el proceso.

## 🔍 Posibles Resultados

### ✅ Caso 1: Todo funciona
Si el token se guarda correctamente, el problema está en el flujo de `AccountSettings.tsx`.

**Solución**: Revisar el código de `AccountSettings.tsx` línea 115 y agregar mejor manejo de errores.

### ❌ Caso 2: Error de permisos
Si ves error `permission-denied` al guardar:

**Solución**: Las reglas de Firestore están correctas, pero verifica que el usuario esté autenticado.

### ❌ Caso 3: Token no se obtiene
Si el token FCM no se obtiene:

**Solución**: 
- Verificar que el Service Worker esté registrado
- Verificar que la VAPID key sea correcta
- Verificar que Firebase Messaging esté habilitado en la consola

### ❌ Caso 4: Service Worker no se registra
Si el SW falla al registrarse:

**Solución**: Verificar que el archivo `firebase-messaging-sw.js` exista en `/public/`

## 🛠️ Soluciones Propuestas

### Solución 1: Mejorar manejo de errores en `notificationService.ts`

```typescript
private async saveTokenToFirestore(userId: string, token: string): Promise<void> {
  try {
    logger.notification.info('Intentando guardar token en Firestore', { userId });
    
    await setDoc(doc(db, 'fcmTokens', userId), {
      token,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      platform: 'web',
      userAgent: navigator.userAgent
    }, { merge: true });

    logger.notification.success('FCM token saved to Firestore', { userId });
    
    // Verificar que se guardó
    const savedDoc = await getDoc(doc(db, 'fcmTokens', userId));
    if (savedDoc.exists()) {
      logger.notification.success('Token verificado en Firestore');
    } else {
      logger.notification.error('Token no se encontró después de guardar');
    }
  } catch (error: any) {
    logger.notification.error('Error saving FCM token to Firestore', { 
      error: error.message,
      code: error.code,
      userId 
    });
    throw error; // Re-lanzar para que AccountSettings lo maneje
  }
}
```

### Solución 2: Mejorar feedback en `AccountSettings.tsx`

```typescript
const handleToggleNotifications = async () => {
  // ... código existente ...
  
  setIsEnablingNotifications(true);
  try {
    const granted = await notificationService.requestPermission();
    
    if (granted) {
      // Agregar más logging
      logger.notification.info('Guardando token para usuario', { userId: currentUserId });
      
      const token = await notificationService.getAndSaveToken(currentUserId);
      
      if (token) {
        logger.notification.success('Token guardado exitosamente');
        await notificationService.showTestNotification();
        setNotificationsEnabled(true);
      } else {
        throw new Error('No se pudo obtener el token FCM');
      }
    } else {
      alert('Permiso de notificaciones denegado.');
    }
  } catch (error: any) {
    logger.notification.error('Error completo al activar notificaciones', error);
    alert(`Error al activar las notificaciones: ${error.message}`);
  } finally {
    setIsEnablingNotifications(false);
  }
};
```

### Solución 3: Verificar Service Worker

Asegúrate de que el archivo `public/firebase-messaging-sw.js` existe y tiene el contenido correcto:

```javascript
// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "TU_API_KEY",
  authDomain: "citard-f7f7f.firebaseapp.com",
  projectId: "citard-f7f7f",
  storageBucket: "citard-f7f7f.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'Ta\' Pa\' Ti';
  const notificationOptions = {
    body: payload.notification?.body || 'Tienes una nueva notificación',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## 📊 Checklist de Verificación

- [ ] El navegador soporta notificaciones push
- [ ] El usuario está autenticado
- [ ] El permiso de notificaciones está concedido
- [ ] El Service Worker se registra correctamente
- [ ] El token FCM se obtiene correctamente
- [ ] Las reglas de Firestore permiten escritura en `fcmTokens`
- [ ] El método `saveTokenToFirestore` se ejecuta sin errores
- [ ] El token se verifica en Firestore después de guardar

## 🎯 Próximos Pasos

1. **Ejecutar la herramienta de diagnóstico** (`test-fcm-token-debug.html`)
2. **Identificar el paso exacto donde falla**
3. **Aplicar la solución correspondiente**
4. **Verificar que los tokens se guardan correctamente**
5. **Probar el flujo completo en la app**

## 📝 Notas Importantes

- Los tokens FCM son específicos por navegador y dispositivo
- Si cambias de navegador, necesitas un nuevo token
- Los tokens pueden expirar y necesitan renovarse
- Firebase Cloud Functions necesitan estos tokens para enviar notificaciones

## 🆘 Si Nada Funciona

Si después de todo el diagnóstico los tokens aún no se guardan:

1. Verifica en Firebase Console que Cloud Messaging esté habilitado
2. Verifica que la VAPID key sea correcta
3. Revisa los logs de la consola del navegador
4. Revisa los logs de Firebase Console
5. Contacta a soporte de Firebase si es necesario

---

**Creado**: 6 de febrero de 2026  
**Última actualización**: 6 de febrero de 2026
