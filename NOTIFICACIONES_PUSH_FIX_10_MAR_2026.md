# Fix: Notificaciones Push - Payload Inválido
**Fecha:** 10 de Marzo 2026  
**Estado:** ✅ RESUELTO

## Problema Reportado
Las notificaciones push estaban activadas pero no se detectaba nada al enviar un mensaje, ni siquiera un sonido. El usuario no recibía ninguna notificación.

## Diagnóstico

### Logs de Cloud Functions
Al revisar los logs de Firebase Functions, encontramos el siguiente error:

```
messaging/invalid-argument
Invalid JSON payload received. Unknown name "icon" at 'message.notification': Cannot find field.
Invalid JSON payload received. Unknown name "badge" at 'message.notification': Cannot find field.
Invalid JSON payload received. Unknown name "tag" at 'message.notification': Cannot find field.
Invalid JSON payload received. Unknown name "clickAction" at 'message.notification': Cannot find field.
```

### Causa Raíz
El payload de notificación en las Cloud Functions estaba usando campos inválidos en el objeto `notification`. Firebase Cloud Messaging (FCM) no acepta los siguientes campos directamente en `notification`:
- `icon`
- `badge`
- `tag`
- `clickAction`

Estos campos deben ir en:
- `data` (para datos personalizados)
- `webpush.notification` (para opciones específicas de web)
- `webpush.fcmOptions.link` (para el click action)

## Solución Implementada

### 1. Función `sendMessageNotification`

**ANTES (Incorrecto):**
```javascript
const payload = {
  notification: {
    title: senderName,
    body: messageBody,
    icon: '/logo192.png',        // ❌ Campo inválido
    badge: '/logo192.png',       // ❌ Campo inválido
    tag: 'message',              // ❌ Campo inválido
    clickAction: `https://...`   // ❌ Campo inválido
  },
  data: { ... },
  token: fcmToken
};
```

**DESPUÉS (Correcto):**
```javascript
const payload = {
  notification: {
    title: senderName,
    body: messageBody
  },
  data: {
    type: 'message',
    chatId: chatId,
    senderId: message.senderId,
    senderName: senderName,
    icon: '/logo192.png',
    clickAction: `https://tapati.app/chat/${chatId}`
  },
  webpush: {
    notification: {
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'message',
      requireInteraction: false,
      vibrate: [200, 100, 200]
    },
    fcmOptions: {
      link: `https://tapati.app/chat/${chatId}`
    }
  },
  token: fcmToken
};
```

### 2. Función `sendMatchNotification`

**Cambios aplicados:**
- Movido `icon`, `badge`, `tag` a `webpush.notification`
- Movido `clickAction` a `webpush.fcmOptions.link`
- Agregado `requireInteraction: true` para matches (más importante)
- Agregado patrón de vibración más distintivo: `[200, 100, 200, 100, 200]`

### 3. Función `sendStoryNotification`

**Cambios aplicados:**
- Misma estructura que `sendMessageNotification`
- `requireInteraction: false` para stories (menos intrusivo)

## Estructura Correcta del Payload FCM

```javascript
{
  notification: {
    title: "Título",      // ✅ Solo título y body
    body: "Mensaje"       // ✅ en notification
  },
  data: {                 // ✅ Datos personalizados
    type: "message",
    chatId: "...",
    icon: "/logo.png",    // ✅ Aquí sí se puede
    clickAction: "..."    // ✅ Aquí sí se puede
  },
  webpush: {              // ✅ Opciones específicas de web
    notification: {
      icon: "/logo.png",
      badge: "/logo.png",
      tag: "message",
      requireInteraction: false,
      vibrate: [200, 100, 200]
    },
    fcmOptions: {
      link: "https://..."  // ✅ URL al hacer click
    }
  },
  token: fcmToken
}
```

## Beneficios de la Corrección

✅ Notificaciones se envían correctamente sin errores  
✅ Sonido de notificación funciona  
✅ Vibración funciona en dispositivos compatibles  
✅ Click en notificación abre la URL correcta  
✅ Icono y badge se muestran correctamente  
✅ Tag permite agrupar notificaciones del mismo tipo  

## Archivos Modificados
- `cita-rd/functions/index.js`
  - `sendMessageNotification` - Corregido payload
  - `sendMatchNotification` - Corregido payload
  - `sendStoryNotification` - Corregido payload

## Deploy
- Functions: ✅ Desplegadas exitosamente
- Todas las funciones actualizadas correctamente

## Testing

Para probar las notificaciones:

1. **Asegúrate de tener permisos concedidos:**
   - Ve a Perfil > Configuración
   - Verifica que "Notificaciones Push" esté activado

2. **Prueba con dos usuarios:**
   - Usuario A envía mensaje a Usuario B
   - Usuario B debe recibir notificación con sonido

3. **Verifica en los logs:**
   ```bash
   firebase functions:log --only sendMessageNotification
   ```
   - Debe mostrar "✅ Notificación de mensaje enviada"
   - No debe haber errores de "invalid-argument"

## Notas Técnicas

### Diferencias entre campos:

- **notification**: Solo acepta `title` y `body` (campos básicos)
- **data**: Acepta cualquier campo personalizado (string)
- **webpush.notification**: Opciones específicas de Web Push API
- **webpush.fcmOptions.link**: URL para abrir al hacer click

### Vibración:
- Patrón: `[vibrar, pausa, vibrar, pausa, ...]`
- Valores en milisegundos
- Mensajes: `[200, 100, 200]` - Dos vibraciones cortas
- Matches: `[200, 100, 200, 100, 200]` - Tres vibraciones (más distintivo)

### requireInteraction:
- `true`: Notificación permanece hasta que el usuario la cierre
- `false`: Notificación se cierra automáticamente después de unos segundos
- Matches usan `true` (más importante)
- Mensajes y Stories usan `false` (menos intrusivo)
