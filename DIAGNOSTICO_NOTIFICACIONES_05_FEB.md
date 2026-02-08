# 🔴 DIAGNÓSTICO: Notificaciones NO Funcionan

**Fecha:** 5 de Febrero 2026  
**Hora:** 8:00 PM  
**Estado:** ❌ Sistema de notificaciones NO operativo

---

## 📊 EVIDENCIA DEL PROBLEMA

### 1. Logs del Navegador
```
✅ Firebase inicializado correctamente
✅ Chat funcionando (mensajes enviados)
✅ Typing indicators funcionando
✅ Presence system funcionando
❌ NO hay logs de notificaciones
❌ NO hay logs de "🔔 NOTIFICATION"
❌ NO hay logs de "FCM Token"
❌ NO hay logs de "Service Worker"
```

### 2. Logs de Cloud Functions
```bash
firebase functions:log
```
**Resultado:**
- ✅ Functions desplegadas (sendMessageNotification, sendMatchNotification, sendStoryNotification)
- ❌ NO hay logs de ejecución
- ❌ NO hay logs de "✅ Notificación enviada"
- ❌ NO hay logs de errores de envío

### 3. Comportamiento Esperado vs Real

| Acción | Esperado | Real |
|--------|----------|------|
| Login completo | Prompt de notificaciones después de 3s | ❌ No aparece |
| Activar notificaciones | Token guardado en Firestore | ❌ No se guarda |
| Enviar mensaje | Notificación al receptor | ❌ No llega |
| Crear match | Notificación a ambos usuarios | ❌ No llega |

---

## 🔍 CAUSAS RAÍZ

### Causa 1: Service Worker No Registrado

El archivo `firebase-messaging-sw.js` debe estar en la carpeta `public/` pero puede no estar registrado correctamente.

**Verificar:**
1. Abrir DevTools (F12)
2. Ir a Application → Service Workers
3. Buscar `firebase-messaging-sw.js`

**Estado esperado:** `activated and is running`  
**Estado real:** Probablemente `not found` o `error`

### Causa 2: Permisos de Notificaciones No Solicitados

El prompt de notificaciones solo aparece si:
- ✅ Perfil está completo (foto, bio, provincia)
- ✅ Han pasado 3 segundos desde el login
- ✅ No se ha rechazado antes (localStorage)

**Problema:** El usuario puede haber rechazado antes y quedó guardado en localStorage.

### Causa 3: Tokens FCM No Guardados

Sin tokens FCM en Firestore, las Cloud Functions no pueden enviar notificaciones.

**Verificar en Firestore:**
```
Colección: fcmTokens
Documentos: Debe haber uno por cada usuario con notificaciones activas
```

---

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Verificar Service Worker (2 minutos)

1. Abre http://localhost:3000
2. Abre DevTools (F12)
3. Ve a **Application** → **Service Workers**
4. Busca `firebase-messaging-sw.js`

**Si NO aparece:**
```bash
# Verificar que el archivo existe
dir cita-rd\public\firebase-messaging-sw.js
```

**Si el archivo NO existe, créalo:**
```javascript
// cita-rd/public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDUBPZfJPvXqKGLqJqKGLqJqKGLqJqKGLq",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.firebasestorage.app",
  messagingSenderId: "564769541768",
  appId: "1:564769541768:web:abc123def456"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### PASO 2: Limpiar localStorage (1 minuto)

1. Abre DevTools (F12)
2. Ve a **Console**
3. Ejecuta:
```javascript
localStorage.removeItem('notification-declined');
console.log('✅ localStorage limpiado');
```

4. Recarga la página (Ctrl + R)

### PASO 3: Forzar Registro del Service Worker (2 minutos)

1. En DevTools → Application → Service Workers
2. Haz clic en **"Unregister"** si hay alguno
3. Recarga la página (Ctrl + R)
4. El Service Worker debería registrarse automáticamente

### PASO 4: Activar Notificaciones Manualmente (3 minutos)

**Opción A: Desde Configuración**
1. Ve a **Profile** (icono de usuario)
2. Haz clic en **⚙️ Configuración**
3. Busca la sección **"Notificaciones Push"**
4. Haz clic en **"Activar Notificaciones"**
5. Acepta el permiso del navegador

**Opción B: Esperar el Prompt Automático**
1. Asegúrate de que el perfil esté completo
2. Cierra sesión y vuelve a iniciar
3. Espera 3 segundos
4. Debe aparecer el prompt en la esquina inferior derecha

### PASO 5: Verificar Token en Firestore (2 minutos)

1. Abre Firebase Console
2. Ve a **Firestore Database**
3. Busca la colección **`fcmTokens`**
4. Debe haber un documento con tu `userId`
5. Verifica que tenga:
   - `token`: [string largo]
   - `platform`: "web"
   - `createdAt`: [timestamp]

### PASO 6: Probar Envío de Mensaje (3 minutos)

1. Abre 2 navegadores (Chrome normal + Chrome incógnito)
2. Inicia sesión con 2 usuarios diferentes
3. Activa notificaciones en ambos
4. Usuario A envía mensaje a Usuario B
5. Usuario B debe recibir notificación

**Verificar en Console:**
```javascript
// Debe aparecer:
🔔 NOTIFICATION Foreground message received
```

**Verificar en Cloud Functions:**
```bash
firebase functions:log
```
Debe aparecer:
```
✅ Notificación de mensaje enviada a: [userId]
```

---

## 🧪 TESTING COMPLETO

### Test 1: Service Worker Activo
```
DevTools → Application → Service Workers
Estado: ✅ activated and is running
```

### Test 2: Permisos Concedidos
```javascript
console.log(Notification.permission);
// Debe mostrar: "granted"
```

### Test 3: Token Guardado
```
Firestore → fcmTokens → [userId]
Campo token: ✅ Existe y tiene valor
```

### Test 4: Notificación de Prueba
```javascript
// En Console del navegador:
new Notification('Test', { body: 'Prueba de notificación' });
// Debe aparecer notificación
```

### Test 5: Mensaje Real
```
Usuario A envía mensaje → Usuario B recibe notificación
✅ Notificación aparece
✅ Click abre el chat correcto
```

---

## 📝 CHECKLIST DE VERIFICACIÓN

Marca cada item cuando esté completo:

- [ ] Service Worker registrado y activo
- [ ] localStorage limpiado
- [ ] Permisos de notificaciones concedidos
- [ ] Token FCM guardado en Firestore
- [ ] Notificación de prueba funciona
- [ ] Notificación de mensaje funciona
- [ ] Notificación de match funciona
- [ ] Cloud Functions ejecutándose correctamente
- [ ] Logs de éxito en `firebase functions:log`

---

## 🚨 SI NADA FUNCIONA

### Opción 1: Reinstalar Service Worker

```bash
# 1. Eliminar Service Worker actual
# DevTools → Application → Service Workers → Unregister

# 2. Limpiar cache
# DevTools → Application → Clear storage → Clear site data

# 3. Recargar página
# Ctrl + Shift + R (hard reload)
```

### Opción 2: Verificar Configuración de Firebase

```bash
# Verificar que las Cloud Functions estén desplegadas
firebase functions:list

# Debe mostrar:
# - sendMessageNotification
# - sendMatchNotification
# - sendStoryNotification
```

### Opción 3: Revisar Firestore Rules

```javascript
// Verificar que las reglas permitan escribir en fcmTokens
match /fcmTokens/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## 📞 PRÓXIMOS PASOS

1. **Ejecutar PASO 1-6** en orden
2. **Marcar checklist** conforme avances
3. **Reportar resultados** de cada paso
4. **Si falla algún paso**, detente y reporta el error específico

---

**Creado:** 5 de Febrero 2026, 8:00 PM  
**Última actualización:** 5 de Febrero 2026, 8:00 PM  
**Estado:** Pendiente de ejecución
