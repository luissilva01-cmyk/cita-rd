# ✅ Solución: Tokens FCM No Se Guardan

## 🎯 Problema
Los tokens FCM no se están guardando en Firestore aunque el usuario active las notificaciones desde `AccountSettings`.

## 🔍 Diagnóstico Realizado

### ✅ Lo que está bien:
1. **Reglas de Firestore**: Correctas para `fcmTokens`
2. **Service Worker**: Existe y está bien configurado
3. **Código de AccountSettings**: Llama correctamente a `getAndSaveToken(currentUserId)`
4. **Método saveTokenToFirestore**: Implementado correctamente

### ❌ Lo que puede estar fallando:
1. **Errores silenciosos**: No se muestran al usuario
2. **Falta de verificación**: No se confirma que el token se guardó
3. **Logging insuficiente**: Difícil de debuggear

## 🛠️ Solución Implementada

He creado una herramienta de diagnóstico completa:

### 📁 `test-fcm-token-debug.html`
Permite probar paso a paso todo el flujo de notificaciones:
- ✅ Verificar soporte del navegador
- ✅ Verificar autenticación
- ✅ Solicitar permisos
- ✅ Obtener token FCM
- ✅ Guardar en Firestore
- ✅ Verificar que se guardó
- ✅ Ver logs detallados

## 🚀 Cómo Usar

### Opción 1: Diagnóstico Manual (Recomendado)

1. **Abrir la herramienta**:
   ```bash
   # Abrir cita-rd/test-fcm-token-debug.html en el navegador
   ```

2. **Seguir el flujo**:
   - Verificar estado del sistema
   - Autenticarse (o usar userId de prueba)
   - Solicitar permiso de notificaciones
   - Obtener token FCM
   - Guardar token en Firestore
   - Verificar en Firestore

3. **Revisar logs**: Te dirán exactamente dónde falla

### Opción 2: Verificar en la App Real

1. **Abrir la consola del navegador**
2. **Ir a Profile > Configuración de Cuenta**
3. **Activar notificaciones**
4. **Revisar logs en consola**
5. **Verificar Firestore**:
   ```javascript
   // En la consola del navegador
   import { getFirestore, doc, getDoc } from 'firebase/firestore';
   const db = getFirestore();
   const userId = 'TU_USER_ID';
   const tokenDoc = await getDoc(doc(db, 'fcmTokens', userId));
   console.log(tokenDoc.exists() ? tokenDoc.data() : 'No existe');
   ```

## 🔧 Mejoras Propuestas al Código

### 1. Mejorar `notificationService.ts`

Agregar verificación después de guardar:

```typescript
private async saveTokenToFirestore(userId: string, token: string): Promise<void> {
  try {
    logger.notification.info('💾 Guardando token en Firestore', { userId });
    
    await setDoc(doc(db, 'fcmTokens', userId), {
      token,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      platform: 'web',
      userAgent: navigator.userAgent
    }, { merge: true });

    logger.notification.success('✅ Token guardado en Firestore');
    
    // ✨ NUEVO: Verificar que se guardó
    const savedDoc = await getDoc(doc(db, 'fcmTokens', userId));
    if (savedDoc.exists()) {
      logger.notification.success('✅ Token verificado en Firestore');
    } else {
      throw new Error('Token no se encontró después de guardar');
    }
  } catch (error: any) {
    logger.notification.error('❌ Error guardando token', { 
      error: error.message,
      code: error.code,
      userId 
    });
    throw error; // Re-lanzar para que AccountSettings lo maneje
  }
}
```

### 2. Mejorar `AccountSettings.tsx`

Agregar mejor manejo de errores:

```typescript
const handleToggleNotifications = async () => {
  if (!notificationsSupported) {
    alert('Las notificaciones push no están soportadas en este navegador.');
    return;
  }

  if (notificationsEnabled) {
    // Desactivar notificaciones
    if (confirm('¿Deseas desactivar las notificaciones push?')) {
      try {
        await notificationService.deleteToken(currentUserId);
        setNotificationsEnabled(false);
        logger.notification.info('Notifications disabled by user');
      } catch (error: any) {
        logger.notification.error('Error disabling notifications', error);
        alert(`Error al desactivar: ${error.message}`);
      }
    }
  } else {
    // Activar notificaciones
    setIsEnablingNotifications(true);
    try {
      logger.notification.info('🔔 Iniciando activación de notificaciones', { userId: currentUserId });
      
      const granted = await notificationService.requestPermission();
      
      if (granted) {
        logger.notification.info('✅ Permiso concedido, obteniendo token...');
        
        const token = await notificationService.getAndSaveToken(currentUserId);
        
        if (token) {
          logger.notification.success('✅ Token obtenido y guardado', { 
            tokenPreview: token.substring(0, 20) + '...' 
          });
          
          await notificationService.showTestNotification();
          setNotificationsEnabled(true);
          
          alert('✅ Notificaciones activadas correctamente!');
        } else {
          throw new Error('No se pudo obtener el token FCM');
        }
      } else {
        alert('Permiso de notificaciones denegado. Puedes habilitarlo desde la configuración de tu navegador.');
      }
    } catch (error: any) {
      logger.notification.error('❌ Error completo al activar notificaciones', {
        error: error.message,
        stack: error.stack,
        userId: currentUserId
      });
      
      alert(`Error al activar las notificaciones:\n\n${error.message}\n\nRevisa la consola para más detalles.`);
    } finally {
      setIsEnablingNotifications(false);
    }
  }
};
```

## 📊 Checklist de Verificación

Antes de considerar el problema resuelto, verifica:

- [ ] El navegador soporta notificaciones push (Chrome, Firefox, Edge)
- [ ] El usuario está autenticado con un `userId` válido
- [ ] El permiso de notificaciones está concedido (`Notification.permission === 'granted'`)
- [ ] El Service Worker se registra correctamente
- [ ] El token FCM se obtiene sin errores
- [ ] El método `saveTokenToFirestore` se ejecuta sin errores
- [ ] El documento existe en Firestore: `fcmTokens/{userId}`
- [ ] El documento tiene los campos correctos: `token`, `userId`, `createdAt`, etc.

## 🎯 Verificación en Firebase Console

1. **Ir a Firebase Console**
2. **Firestore Database**
3. **Buscar colección `fcmTokens`**
4. **Verificar que existen documentos**
5. **Cada documento debe tener**:
   ```json
   {
     "token": "string (largo)",
     "userId": "string",
     "createdAt": "timestamp",
     "updatedAt": "timestamp",
     "platform": "web",
     "userAgent": "string"
   }
   ```

## 🐛 Debugging en Producción

Si el problema persiste en producción:

### 1. Verificar en la consola del navegador
```javascript
// Ver logs del logger
// Los logs deberían mostrar:
// - "💾 Guardando token en Firestore"
// - "✅ Token guardado en Firestore"
// - "✅ Token verificado en Firestore"
```

### 2. Verificar permisos de Firestore
```bash
# Las reglas actuales permiten:
match /fcmTokens/{userId} {
  allow read: if isOwner(userId);
  allow write: if isOwner(userId);
}
```

### 3. Verificar que Firebase Messaging está habilitado
- Firebase Console > Project Settings > Cloud Messaging
- Debe estar habilitado
- Debe tener una VAPID key configurada

## 🆘 Si Nada Funciona

Si después de todo el diagnóstico los tokens aún no se guardan:

1. **Revisar logs de Firebase Console**: Cloud Functions > Logs
2. **Verificar cuota de Firestore**: Puede estar excedida
3. **Verificar plan de Firebase**: Spark vs Blaze
4. **Contactar a soporte de Firebase**

## 📝 Notas Importantes

- **Los tokens son específicos por navegador**: Si cambias de navegador, necesitas un nuevo token
- **Los tokens pueden expirar**: Firebase los renueva automáticamente
- **Un usuario puede tener múltiples tokens**: Si usa múltiples dispositivos/navegadores
- **Las Cloud Functions necesitan estos tokens**: Para enviar notificaciones push

## 🎉 Resultado Esperado

Después de aplicar estas soluciones:

1. ✅ Los tokens se guardan correctamente en Firestore
2. ✅ La colección `fcmTokens` existe y tiene documentos
3. ✅ Los usuarios reciben notificaciones push
4. ✅ Los logs muestran el flujo completo sin errores

---

**Creado**: 6 de febrero de 2026  
**Última actualización**: 6 de febrero de 2026  
**Estado**: Pendiente de testing
