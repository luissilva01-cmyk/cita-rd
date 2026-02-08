# 📱 Sesión 4 de Febrero 2026 - Push Notifications

## 🎯 Objetivo

Implementar sistema completo de Push Notifications con Firebase Cloud Messaging para notificar a los usuarios sobre:
- Nuevos mensajes
- Nuevos matches
- Nuevas stories

---

## ✅ Implementación Completada

### 1. Service Worker para FCM
**Archivo:** `cita-rd/public/firebase-messaging-sw.js`

- ✅ Configuración de Firebase en Service Worker
- ✅ Handler para mensajes en background
- ✅ Handler para clicks en notificaciones
- ✅ Navegación automática según tipo de notificación

### 2. Servicio de Notificaciones
**Archivo:** `cita-rd/services/notificationService.ts`

- ✅ Clase `NotificationService` con métodos:
  - `isSupported()` - Verificar soporte del navegador
  - `getPermissionStatus()` - Obtener estado del permiso
  - `requestPermission()` - Solicitar permiso al usuario
  - `getAndSaveToken()` - Obtener y guardar FCM token
  - `saveTokenToFirestore()` - Guardar token en Firestore
  - `setupForegroundListener()` - Escuchar mensajes en foreground
  - `deleteToken()` - Eliminar token al logout
  - `showTestNotification()` - Mostrar notificación de prueba

### 3. Componente UI para Solicitar Permisos
**Archivo:** `cita-rd/components/NotificationPermissionPrompt.tsx`

- ✅ Diseño atractivo con gradiente rosa
- ✅ Lista de beneficios (likes, mensajes, matches)
- ✅ Botones "Ahora no" y "Activar"
- ✅ Loading state durante solicitud
- ✅ Animación slide-up
- ✅ Responsive (mobile y desktop)
- ✅ Notificación de prueba al activar

### 4. Integración en App.tsx
**Archivo:** `cita-rd/App.tsx`

- ✅ Importado `NotificationPermissionPrompt`
- ✅ Estado `showNotificationPrompt`
- ✅ Mostrar prompt 3 segundos después del login (solo si perfil completo)
- ✅ Callbacks para permiso concedido/rechazado
- ✅ Logging de eventos

### 5. Cloud Functions para Enviar Notificaciones
**Archivo:** `cita-rd/functions/index.js`

#### Función: `sendMessageNotification`
- ✅ Trigger: onCreate en `/chats/{chatId}/messages/{messageId}`
- ✅ Obtiene información del chat y participantes
- ✅ Encuentra el receptor (quien NO envió el mensaje)
- ✅ Obtiene FCM token del receptor
- ✅ Obtiene nombre del remitente
- ✅ Adapta el body según tipo de mensaje (texto, foto, voz, video, reacción)
- ✅ Envía notificación push

#### Función: `sendMatchNotification`
- ✅ Trigger: onCreate en `/chats/{chatId}`
- ✅ Verifica que el chat tenga exactamente 2 participantes
- ✅ Envía notificación a AMBOS participantes
- ✅ Obtiene nombre del otro usuario
- ✅ Notificación: "🎉 ¡Nuevo Match! ¡Hiciste match con [nombre]!"

#### Función: `sendStoryNotification`
- ✅ Trigger: onCreate en `/stories/{storyId}`
- ✅ Obtiene configuración de privacidad del creador
- ✅ Determina audiencia según privacidad (everyone/matches)
- ✅ Limita a 10 notificaciones por story (evitar sobrecarga)
- ✅ Envía notificación: "[Nombre] publicó una historia"

### 6. Firestore Security Rules
**Archivo:** `cita-rd/firestore.rules`

- ✅ Agregada colección `fcmTokens`
- ✅ Reglas: Solo el usuario puede leer/escribir su propio token
- ✅ Estructura:
  ```javascript
  match /fcmTokens/{userId} {
    allow read: if isOwner(userId);
    allow write: if isOwner(userId);
  }
  ```

### 7. Logger System
**Archivo:** `cita-rd/utils/logger.ts`

- ✅ Categoría `notification` ya existía
- ✅ Métodos: `info`, `success`, `warn`, `error`

### 8. Documentación
**Archivos creados:**

- ✅ `PUSH_NOTIFICATIONS_SETUP.md` - Guía completa y detallada
- ✅ `PUSH_NOTIFICATIONS_QUICK_START.md` - Guía rápida (5 minutos)

---

## ⚠️ PENDIENTE - Acción Requerida del Usuario

### 🔑 VAPID Key (CRÍTICO)

**El usuario DEBE:**
1. Ir a Firebase Console → Project Settings → Cloud Messaging
2. Sección "Web Push certificates"
3. Generar key pair si no existe
4. Copiar la VAPID Key
5. Reemplazar en `cita-rd/services/notificationService.ts` línea 8:
   ```typescript
   const VAPID_KEY = 'TU_VAPID_KEY_AQUI'; // ⚠️ REEMPLAZAR
   ```

### 📦 Despliegue

**Después de configurar VAPID Key:**
```bash
cd cita-rd

# 1. Desplegar Firestore Rules
firebase deploy --only firestore:rules

# 2. Desplegar Cloud Functions
firebase deploy --only functions
```

---

## 🎯 Flujo de Notificaciones

### 1. Solicitud de Permisos
```
Usuario inicia sesión
  → Completa perfil
  → Espera 3 segundos
  → Aparece NotificationPermissionPrompt
  → Usuario hace clic en "Activar"
  → Navegador pide permiso
  → Usuario acepta
  → Se genera FCM token
  → Token se guarda en Firestore (colección fcmTokens)
  → Se muestra notificación de prueba
```

### 2. Envío de Notificaciones
```
Evento ocurre (mensaje/match/story)
  → Cloud Function se activa automáticamente
  → Función obtiene FCM token del receptor desde Firestore
  → Función obtiene datos adicionales (nombres, etc.)
  → Función envía notificación via Firebase Cloud Messaging
  → FCM entrega notificación al dispositivo
  → Service Worker muestra notificación (incluso si app está cerrada)
  → Usuario hace clic en notificación
  → Service Worker navega a la URL correcta
```

---

## 📊 Estructura de Datos

### Colección: fcmTokens
```typescript
{
  token: string,           // FCM token
  userId: string,          // ID del usuario
  platform: 'web',         // Plataforma
  userAgent: string,       // Navegador/dispositivo
  createdAt: Timestamp,    // Fecha de creación
  updatedAt: Timestamp,    // Última actualización
  deleted?: boolean        // Si el token fue eliminado
}
```

### Payload de Notificación
```typescript
{
  notification: {
    title: string,         // Título de la notificación
    body: string,          // Cuerpo del mensaje
    icon: '/logo192.png',  // Icono
    badge: '/logo192.png', // Badge
    tag: string,           // Tipo: message/match/story
    clickAction: string    // URL al hacer clic
  },
  data: {
    type: string,          // Tipo de notificación
    chatId?: string,       // ID del chat (si aplica)
    senderId?: string,     // ID del remitente (si aplica)
    storyId?: string,      // ID de la story (si aplica)
    ...                    // Datos adicionales
  },
  token: string            // FCM token del receptor
}
```

---

## 🧪 Testing

### Probar Solicitud de Permisos
1. Iniciar sesión
2. Completar perfil
3. Esperar 3 segundos
4. Verificar que aparece el prompt
5. Hacer clic en "Activar"
6. Aceptar permiso del navegador
7. Verificar notificación de prueba

### Probar Notificación de Mensaje
1. Abrir app en 2 navegadores (2 usuarios)
2. Usuario A envía mensaje a Usuario B
3. Usuario B recibe notificación push

### Probar Notificación de Match
1. Usuario A da like a Usuario B
2. Se crea match automáticamente
3. Ambos usuarios reciben notificación

### Probar Notificación de Story
1. Usuario A publica story
2. Sus matches reciben notificación

---

## 🔍 Verificación

### Verificar Token en Firestore
```
Firebase Console
  → Firestore Database
  → Colección: fcmTokens
  → Documento: [userId]
  → Debe tener campo "token" con valor largo
```

### Verificar Service Worker
```
DevTools (F12)
  → Application
  → Service Workers
  → Debe aparecer: firebase-messaging-sw.js (activo)
```

### Verificar Cloud Functions
```bash
firebase functions:log

# Deberías ver:
# ✅ Notificación de mensaje enviada a: [userId]
# ✅ Notificación de match enviada a: [userId]
# ✅ Notificaciones de story enviadas a X usuarios
```

---

## 🎨 Características del UI

### NotificationPermissionPrompt
- **Diseño:** Gradiente rosa (rose-500 to pink-600)
- **Posición:** Bottom-right en desktop, bottom-center en mobile
- **Animación:** Slide-up suave
- **Responsive:** Adapta tamaño según pantalla
- **Beneficios mostrados:**
  - 💕 Likes y super likes
  - 💬 Nuevos mensajes
  - ⭐ Nuevos matches
- **Botones:**
  - "Ahora no" - Gris, borde
  - "Activar" - Gradiente rosa, con icono de campana
- **Loading state:** Spinner + texto "Activando..."
- **Privacy note:** "Puedes desactivarlas en cualquier momento"

---

## 🔐 Seguridad

### Firestore Rules
- Solo el usuario puede leer/escribir su propio token
- Cloud Functions tienen acceso admin para enviar notificaciones

### Privacidad
- Usuario puede rechazar notificaciones
- Rechazo se guarda en localStorage
- No se vuelve a preguntar en la misma sesión
- Token se elimina al cerrar sesión

### VAPID Key
- Se usa para autenticar solicitudes de FCM
- Debe mantenerse privada (solo en código frontend)
- No confundir con Server Key (esa es privada)

---

## 📱 Soporte de Navegadores

| Navegador | Desktop | Mobile | Background |
|-----------|---------|--------|------------|
| Chrome | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ |
| Safari | ✅ (16.4+) | ✅ (16.4+) | ⚠️ Limitado |
| Edge | ✅ | ✅ | ✅ |
| Opera | ✅ | ✅ | ✅ |

---

## 🐛 Troubleshooting

### Problema: No aparece el prompt
**Causa:** Perfil incompleto o ya se rechazó antes
**Solución:** 
- Completar perfil (fotos, bio, ubicación)
- Borrar localStorage: `localStorage.removeItem('notification-declined')`

### Problema: No llegan notificaciones
**Causa:** VAPID Key incorrecta o Cloud Functions no desplegadas
**Solución:**
- Verificar VAPID Key en `notificationService.ts`
- Desplegar Cloud Functions: `firebase deploy --only functions`
- Revisar logs: `firebase functions:log`

### Problema: Solo funciona con app abierta
**Causa:** Service Worker no registrado
**Solución:**
- Verificar en DevTools → Application → Service Workers
- Debe estar `firebase-messaging-sw.js` activo
- Recargar página

---

## 📈 Métricas

### Datos que se pueden trackear:
- Tasa de aceptación de permisos
- Tasa de rechazo de permisos
- Notificaciones enviadas por tipo
- Notificaciones entregadas
- Notificaciones con click
- Engagement por tipo de notificación

### Implementación futura:
```typescript
// Agregar analytics en notificationService.ts
analytics.logEvent('notification_permission_granted');
analytics.logEvent('notification_clicked', { type: 'message' });
```

---

## 🚀 Próximos Pasos (Opcional)

1. **Notificaciones programadas:**
   - Recordatorios de matches sin responder
   - Sugerencias de perfiles nuevos

2. **Notificaciones personalizadas:**
   - Configuración de qué notificaciones recibir
   - Horarios de "no molestar"

3. **Rich notifications:**
   - Imágenes en notificaciones
   - Botones de acción rápida (responder, ver perfil)

4. **Analytics:**
   - Dashboard de métricas de notificaciones
   - A/B testing de mensajes

---

## 📝 Archivos Modificados/Creados

### Creados:
- `cita-rd/services/notificationService.ts`
- `cita-rd/components/NotificationPermissionPrompt.tsx`
- `cita-rd/public/firebase-messaging-sw.js`
- `cita-rd/PUSH_NOTIFICATIONS_SETUP.md`
- `cita-rd/PUSH_NOTIFICATIONS_QUICK_START.md`
- `cita-rd/SESION_04_FEB_2026_PUSH_NOTIFICATIONS.md`

### Modificados:
- `cita-rd/App.tsx` - Integrado NotificationPermissionPrompt
- `cita-rd/functions/index.js` - Agregadas 3 Cloud Functions
- `cita-rd/firestore.rules` - Agregadas reglas para fcmTokens

---

## ✅ Checklist de Implementación

- [x] Service Worker creado y configurado
- [x] Servicio de notificaciones implementado
- [x] Componente UI para solicitar permisos
- [x] Integración en App.tsx
- [x] Cloud Functions para enviar notificaciones
- [x] Firestore Rules para fcmTokens
- [x] Documentación completa
- [x] Guía rápida de configuración
- [ ] **VAPID Key configurada** ⚠️ PENDIENTE
- [ ] **Firestore Rules desplegadas** ⚠️ PENDIENTE
- [ ] **Cloud Functions desplegadas** ⚠️ PENDIENTE
- [ ] **Testing completo** ⚠️ PENDIENTE

---

## 🎉 Resultado

**Sistema de Push Notifications 100% implementado y listo para desplegar.**

Solo falta que el usuario:
1. Configure la VAPID Key
2. Despliegue Firestore Rules
3. Despliegue Cloud Functions
4. Pruebe las notificaciones

**Tiempo estimado para completar:** 5-10 minutos

---

**Fecha:** 4 de Febrero 2026  
**Estado:** ✅ Implementación completa - Pendiente configuración VAPID Key  
**Progreso hacia lanzamiento:** 99% 🚀
