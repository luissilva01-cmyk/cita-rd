# 🔔 Push Notifications - Guía de Configuración

## ✅ Estado Actual

**IMPLEMENTACIÓN COMPLETA** - Solo falta configurar la VAPID Key

### Archivos Creados/Modificados:
- ✅ `services/notificationService.ts` - Servicio de notificaciones
- ✅ `components/NotificationPermissionPrompt.tsx` - UI para solicitar permisos
- ✅ `public/firebase-messaging-sw.js` - Service Worker para FCM
- ✅ `App.tsx` - Integrado NotificationPermissionPrompt
- ✅ `functions/index.js` - Cloud Functions para enviar notificaciones
- ✅ `firestore.rules` - Reglas de seguridad para fcmTokens
- ✅ `utils/logger.ts` - Categoría 'notification' agregada

---

## 🚀 PASO 1: Obtener VAPID Key (CRÍTICO)

### Ir a Firebase Console:
1. Abre https://console.firebase.google.com/
2. Selecciona tu proyecto: **citard-fbc26**
3. Ve a **Project Settings** (⚙️ en la barra lateral)
4. Pestaña **Cloud Messaging**
5. Sección **Web Push certificates**
6. Si no existe, haz clic en **Generate key pair**
7. Copia la **VAPID Key** (empieza con "BN..." o similar)

### Actualizar el código:
```typescript
// cita-rd/services/notificationService.ts - Línea 8
const VAPID_KEY = 'TU_VAPID_KEY_AQUI'; // ⚠️ REEMPLAZAR CON LA KEY REAL
```

---

## 📋 PASO 2: Desplegar Firestore Rules

```bash
cd cita-rd
firebase deploy --only firestore:rules
```

Esto desplegará las reglas de seguridad para la colección `fcmTokens`.

---

## ☁️ PASO 3: Desplegar Cloud Functions

```bash
cd cita-rd/functions
npm install
cd ..
firebase deploy --only functions
```


Esto desplegará 3 Cloud Functions:
- `sendMessageNotification` - Notifica cuando hay nuevo mensaje
- `sendMatchNotification` - Notifica cuando hay nuevo match
- `sendStoryNotification` - Notifica cuando alguien publica una story

---

## 🧪 PASO 4: Probar las Notificaciones

### 4.1 Probar Solicitud de Permisos

1. Inicia sesión en la app
2. Completa tu perfil (si no está completo)
3. Después de 3 segundos, aparecerá el prompt de notificaciones
4. Haz clic en **"Activar"**
5. El navegador pedirá permiso - acepta
6. Deberías ver una notificación de prueba: "🎉 Ta' Pa' Ti - Las notificaciones están funcionando correctamente!"

### 4.2 Probar Notificación de Mensaje

1. Abre la app en 2 navegadores diferentes (o 2 usuarios)
2. Usuario A envía mensaje a Usuario B
3. Usuario B debería recibir notificación push (incluso si la app está en background)

### 4.3 Probar Notificación de Match

1. Usuario A da like a Usuario B
2. Se crea un match automáticamente
3. Ambos usuarios deberían recibir notificación: "🎉 ¡Nuevo Match!"

### 4.4 Probar Notificación de Story

1. Usuario A publica una story
2. Sus matches deberían recibir notificación: "Usuario A publicó una historia"

---

## 🔍 Verificar que Todo Funciona

### Verificar Token FCM en Firestore:
1. Ve a Firebase Console → Firestore Database
2. Busca la colección `fcmTokens`
3. Deberías ver un documento con tu userId
4. El documento debe tener:
   - `token`: String largo (el FCM token)
   - `userId`: Tu user ID
   - `platform`: "web"
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

### Verificar Service Worker:
1. Abre DevTools (F12)
2. Ve a la pestaña **Application**
3. En la barra lateral, **Service Workers**
4. Deberías ver `firebase-messaging-sw.js` activo

### Verificar Logs de Cloud Functions:
```bash
firebase functions:log
```

Deberías ver logs como:
- "✅ Notificación de mensaje enviada a: [userId]"
- "✅ Notificación de match enviada a: [userId]"

---

## 🎯 Cómo Funcionan las Notificaciones

### Flujo de Notificaciones:

1. **Usuario acepta permisos** → Se genera FCM token → Se guarda en Firestore
2. **Evento ocurre** (mensaje, match, story) → Cloud Function se activa
3. **Cloud Function** obtiene FCM token del receptor → Envía notificación
4. **Firebase Cloud Messaging** entrega la notificación al dispositivo
5. **Service Worker** muestra la notificación (incluso si app está cerrada)

### Tipos de Notificaciones:

| Tipo | Trigger | Título | Body |
|------|---------|--------|------|
| Mensaje | Nuevo mensaje en chat | Nombre del remitente | Contenido del mensaje |
| Match | Nuevo chat creado | "🎉 ¡Nuevo Match!" | "¡Hiciste match con [nombre]!" |
| Story | Nueva story publicada | "[Nombre] publicó una historia" | "¡Mírala antes de que desaparezca!" |

---

## 🛠️ Troubleshooting

### Problema: No aparece el prompt de notificaciones
**Solución:**
- Verifica que el perfil esté completo (fotos, bio, ubicación)
- Espera 3 segundos después del login
- Revisa la consola del navegador por errores

### Problema: El navegador no pide permiso
**Solución:**
- Verifica que estés en HTTPS (localhost está permitido)
- Limpia permisos del sitio en configuración del navegador
- Borra localStorage: `localStorage.removeItem('notification-declined')`

### Problema: Token FCM no se guarda en Firestore
**Solución:**
- Verifica que la VAPID Key sea correcta
- Verifica que las Firestore Rules estén desplegadas
- Revisa la consola del navegador por errores

### Problema: No llegan notificaciones
**Solución:**
- Verifica que las Cloud Functions estén desplegadas
- Revisa los logs: `firebase functions:log`
- Verifica que el token FCM exista en Firestore
- Verifica que el Service Worker esté activo

### Problema: Notificaciones solo funcionan con app abierta
**Solución:**
- Verifica que el Service Worker esté registrado correctamente
- Revisa `firebase-messaging-sw.js` en la pestaña Application de DevTools
- Asegúrate de que el navegador permita notificaciones en background

---

## 📱 Soporte de Navegadores

| Navegador | Desktop | Mobile | Background |
|-----------|---------|--------|------------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ✅ (16.4+) | ✅ (16.4+) | ⚠️ Limitado |
| Edge | ✅ | ✅ | ✅ |
| Opera | ✅ | ✅ | ✅ |

**Nota:** Safari en iOS requiere iOS 16.4+ y tiene limitaciones en notificaciones background.

---

## 🔐 Seguridad

### Firestore Rules:
```javascript
match /fcmTokens/{userId} {
  allow read: if isOwner(userId);
  allow write: if isOwner(userId);
}
```

- Solo el usuario puede leer/escribir su propio token
- Los tokens se almacenan de forma segura en Firestore
- Las Cloud Functions tienen acceso admin para enviar notificaciones

### Privacidad:
- Los usuarios pueden rechazar notificaciones en cualquier momento
- El rechazo se guarda en localStorage para no volver a preguntar
- Los tokens se eliminan al cerrar sesión

---

## 📊 Métricas y Analytics

### Datos que se guardan en fcmTokens:
```typescript
{
  token: string,           // FCM token
  userId: string,          // ID del usuario
  platform: 'web',         // Plataforma
  userAgent: string,       // Navegador/dispositivo
  createdAt: Timestamp,    // Fecha de creación
  updatedAt: Timestamp     // Última actualización
}
```

### Monitorear uso:
```bash
# Ver logs de Cloud Functions
firebase functions:log

# Ver métricas en Firebase Console
# Cloud Messaging → Reports
```

---

## 🎨 Personalización

### Cambiar el icono de las notificaciones:
```javascript
// cita-rd/services/notificationService.ts
icon: '/logo192.png',  // Cambiar por tu icono
badge: '/logo192.png', // Cambiar por tu badge
```

### Cambiar el sonido/vibración:
```javascript
// cita-rd/services/notificationService.ts
vibrate: [200, 100, 200], // Patrón de vibración
```

### Cambiar el tiempo de espera del prompt:
```javascript
// cita-rd/App.tsx - Línea ~90
setTimeout(() => {
  setShowNotificationPrompt(true);
}, 3000); // Cambiar 3000ms (3 segundos)
```

---

## ✅ Checklist Final

- [ ] VAPID Key configurada en `notificationService.ts`
- [ ] Firestore Rules desplegadas
- [ ] Cloud Functions desplegadas
- [ ] Service Worker registrado correctamente
- [ ] Probado en Chrome/Firefox
- [ ] Probado notificación de mensaje
- [ ] Probado notificación de match
- [ ] Probado notificación de story
- [ ] Verificado que funciona en background
- [ ] Verificado que funciona con app cerrada

---

## 🚀 Próximos Pasos (Opcional)

1. **Analytics de notificaciones:**
   - Trackear cuántos usuarios aceptan/rechazan
   - Medir engagement con notificaciones

2. **Notificaciones programadas:**
   - Recordatorios de matches sin responder
   - Sugerencias de perfiles nuevos

3. **Notificaciones personalizadas:**
   - Permitir al usuario elegir qué notificaciones recibir
   - Horarios de "no molestar"

4. **Rich notifications:**
   - Imágenes en notificaciones
   - Botones de acción rápida

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs de Cloud Functions: `firebase functions:log`
3. Verifica que todos los pasos se completaron
4. Contacta a tapapatisoporte@gmail.com

---

**Última actualización:** 4 de Febrero 2026
**Estado:** ✅ Implementación completa - Solo falta VAPID Key
