# 🚨 PROBLEMA: Tokens FCM No Se Guardan en Firestore

**Fecha:** 5 de Febrero 2026  
**Última actualización:** 6 de Febrero 2026  
**Estado:** 🟡 EN DIAGNÓSTICO - Herramientas Creadas

## ✅ HERRAMIENTAS DE DIAGNÓSTICO DISPONIBLES

1. **`test-fcm-token-debug.html`** - Herramienta interactiva de diagnóstico completo
2. **`DIAGNOSTICO_TOKENS_FCM.md`** - Guía detallada de diagnóstico
3. **`SOLUCION_TOKENS_FCM.md`** - Soluciones propuestas y mejoras al código

---

## 📊 SÍNTOMAS

1. ✅ Recuadro de confirmación aparece ("Las notificaciones están funcionando correctamente")
2. ✅ Permiso de notificaciones concedido (`Notification.permission === "granted"`)
3. ❌ Colección `fcmTokens` NO existe en Firestore
4. ❌ Notificaciones NO llegan cuando se envían mensajes

---

## 🔍 DIAGNÓSTICO

### Colecciones Actuales en Firestore
- calls
- chats
- likes
- matches
- perfiles
- presence
- stories
- user_consents
- users

### Colección Faltante
- ❌ **`fcmTokens`** (NO EXISTE)

---

## 🎯 CAUSA RAÍZ POSIBLE

El código está correcto, pero hay 3 posibles causas:

### 1. Error Silencioso en el Guardado
El método `saveTokenToFirestore` puede estar fallando sin mostrar error visible.

### 2. Reglas de Firestore Bloqueando la Escritura
Las reglas de seguridad pueden estar bloqueando la creación de la colección `fcmTokens`.

### 3. Token No Se Está Obteniendo
El token FCM puede no estarse obteniendo correctamente antes de intentar guardarlo.

---

## 🔧 SOLUCIÓN PASO A PASO

### PASO 1: Verificar Logs en Consola del Navegador

Abre DevTools (F12) en el navegador donde activaste las notificaciones y busca:

**Logs esperados:**
```
✅ Service Worker registered
✅ FCM Token obtained
✅ FCM token saved to Firestore
```

**Si ves errores:**
```
❌ Error saving FCM token to Firestore
❌ Error getting FCM token
```

### PASO 2: Verificar Reglas de Firestore

Las reglas actuales deben permitir escribir en `fcmTokens`:

```javascript
match /fcmTokens/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Verificar en Firebase Console:**
1. Ve a Firestore Database
2. Clic en "Rules"
3. Busca la regla para `fcmTokens`

### PASO 3: Prueba Manual de Guardado

Ejecuta este código en la consola del navegador (reemplaza `TU_USER_ID` con tu ID real):

```javascript
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './services/firebase';

// Reemplaza con tu userId real
const userId = 'TU_USER_ID';
const testToken = 'test-token-' + Date.now();

setDoc(doc(db, 'fcmTokens', userId), {
  token: testToken,
  userId: userId,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
  platform: 'web',
  userAgent: navigator.userAgent
}, { merge: true })
  .then(() => console.log('✅ Token guardado exitosamente'))
  .catch(error => console.error('❌ Error guardando token:', error));
```

### PASO 4: Verificar en Firestore

Después de ejecutar el código anterior:
1. Ve a Firebase Console
2. Firestore Database
3. Busca la colección `fcmTokens`
4. ¿Se creó? ¿Hay un documento con tu userId?

---

## 🧪 TESTING COMPLETO

### Test 1: Verificar Obtención de Token

```javascript
// En consola del navegador
import { notificationService } from './services/notificationService';

// Obtener token (reemplaza con tu userId)
notificationService.getAndSaveToken('TU_USER_ID')
  .then(token => {
    console.log('✅ Token obtenido:', token);
    console.log('Ahora verifica Firestore');
  })
  .catch(error => console.error('❌ Error:', error));
```

### Test 2: Verificar Permisos

```javascript
// Verificar estado de permisos
console.log('Permiso:', Notification.permission);
console.log('Soportado:', notificationService.isSupported());
console.log('Estado:', notificationService.getPermissionStatus());
```

### Test 3: Verificar Service Worker

```javascript
// Verificar Service Worker
navigator.serviceWorker.getRegistrations()
  .then(regs => {
    console.log('Service Workers:', regs.length);
    regs.forEach(reg => {
      console.log('- URL:', reg.active?.scriptURL);
      console.log('- Estado:', reg.active?.state);
    });
  });
```

---

## 📝 CHECKLIST DE VERIFICACIÓN

- [ ] Logs en consola muestran "FCM Token obtained"
- [ ] Logs en consola muestran "FCM token saved to Firestore"
- [ ] No hay errores en consola relacionados con Firestore
- [ ] Reglas de Firestore permiten escribir en `fcmTokens`
- [ ] Service Worker está registrado y activo
- [ ] Permiso de notificaciones está concedido
- [ ] Colección `fcmTokens` existe en Firestore
- [ ] Documento con userId existe en `fcmTokens`

---

## 🎯 PRÓXIMOS PASOS

1. **Ejecutar PASO 1-4** en orden
2. **Reportar resultados** de cada paso
3. **Si falla algún paso**, copiar el error exacto
4. **Verificar Firestore** después de cada intento

---

## 💡 SOLUCIÓN ALTERNATIVA

Si las reglas de Firestore están bloqueando, temporalmente puedes usar reglas más permisivas para testing:

```javascript
// ⚠️ SOLO PARA TESTING - NO USAR EN PRODUCCIÓN
match /fcmTokens/{userId} {
  allow read, write: if request.auth != null;
}
```

Después de verificar que funciona, volver a las reglas seguras:

```javascript
// ✅ REGLAS SEGURAS PARA PRODUCCIÓN
match /fcmTokens/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

**Creado:** 5 de Febrero 2026, 9:00 PM  
**Última actualización:** 5 de Febrero 2026, 9:00 PM  
**Estado:** Pendiente de testing

