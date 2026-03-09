# Diagnóstico: Badge de Mensajes No Leídos No Visible
**Fecha**: 6 de marzo de 2026  
**Problema**: El badge no se visualiza en el botón de Mensajes

## 🔧 Correcciones Aplicadas

### 1. Lógica de Cálculo Corregida
**Archivo**: `cita-rd/components/DesktopSidebar.tsx`

**ANTES** (incorrecto):
```typescript
const messagesCount = totalUnreadMessages > 0 ? totalUnreadMessages : chats.length;
```

**DESPUÉS** (correcto):
```typescript
const messagesCount = totalUnreadMessages;
```

**Problema**: La lógica anterior mostraba `chats.length` cuando no había mensajes no leídos, lo que hacía que el badge siempre mostrara un número.

### 2. Layout Móvil Corregido
**Archivo**: `cita-rd/components/components/Layout.tsx`

**ANTES** (incorrecto):
```typescript
notificationCount={totalUnreadMessages > 0 ? totalUnreadMessages : notifications.totalMessages}
```

**DESPUÉS** (correcto):
```typescript
notificationCount={totalUnreadMessages}
```

### 3. Logs de Debugging Agregados
**Archivo**: `cita-rd/hooks/useUnreadMessages.ts`

Se agregaron logs detallados para diagnosticar:
- Cuántos chats se están analizando
- Qué campos tiene cada documento de chat
- Valor del campo `unreadCount_${userId}` para cada chat
- Total de mensajes no leídos calculado

## 🔍 Cómo Verificar que Funciona

### Paso 1: Abrir la Consola del Navegador
1. Presiona `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
2. Ve a la pestaña "Console"

### Paso 2: Buscar los Logs
Busca logs que digan:
```
🔍 [UNREAD] Snapshot recibido
📊 [UNREAD] Chat analizado
✅ [UNREAD] Contadores actualizados
```

### Paso 3: Verificar los Datos
Los logs mostrarán:
- `totalChats`: Cuántos chats tienes
- `unreadCount`: El valor del contador para cada chat
- `allFields`: Todos los campos que tiene el documento del chat
- `totalUnread`: Total de mensajes no leídos

## 🐛 Posibles Causas del Problema

### Causa 1: Campo `unreadCount_${userId}` No Existe
**Síntoma**: Los logs muestran `unreadCount: 0` para todos los chats

**Solución**: El campo se crea automáticamente cuando alguien te envía un mensaje. Para probarlo:

1. **Opción A - Enviar mensaje desde otra cuenta**:
   - Abre un navegador en modo incógnito
   - Inicia sesión con otra cuenta
   - Envía un mensaje a tu cuenta principal
   - El campo `unreadCount_${tuUserId}` se creará automáticamente

2. **Opción B - Crear el campo manualmente en Firestore**:
   - Ve a Firebase Console → Firestore Database
   - Busca un documento en la colección `chats`
   - Agrega un campo nuevo:
     - Nombre: `unreadCount_${tuUserId}` (reemplaza con tu ID real)
     - Tipo: `number`
     - Valor: `3` (o cualquier número)
   - Guarda y recarga la app

### Causa 2: Usuario No Autenticado
**Síntoma**: No aparecen logs en la consola

**Solución**: Asegúrate de estar autenticado en la app

### Causa 3: No Hay Chats
**Síntoma**: Los logs muestran `totalChats: 0`

**Solución**: Crea un match con otro usuario primero

## 📝 Estructura Esperada en Firestore

### Documento de Chat (colección `chats`)
```javascript
{
  participants: ['userId1', 'userId2'],
  lastMessage: 'Hola!',
  timestamp: 1234567890,
  unreadCount_userId1: 0,    // ← Este campo debe existir
  unreadCount_userId2: 3     // ← Este campo debe existir
}
```

## 🧪 Prueba Completa

### Escenario de Prueba:
1. **Usuario A** (tu cuenta principal)
2. **Usuario B** (cuenta de prueba en incógnito)

### Pasos:
1. Usuario B envía mensaje a Usuario A
2. En la consola de Usuario A, deberías ver:
   ```
   ✅ [UNREAD] Contadores actualizados
   totalUnread: 1
   chatsWithUnread: 1
   ```
3. El badge rojo con "1" debe aparecer en el botón "Mensajes"
4. Usuario A abre el chat
5. El badge debe desaparecer
6. En la consola deberías ver:
   ```
   ✅ [UNREAD] Contadores actualizados
   totalUnread: 0
   chatsWithUnread: 0
   ```

## 🔄 Próximos Pasos

1. **Recargar la app** para aplicar los cambios
2. **Abrir la consola** del navegador
3. **Revisar los logs** para ver qué está pasando
4. **Enviar un mensaje de prueba** desde otra cuenta
5. **Verificar que el badge aparece**

## 📸 Cómo Debe Verse

### Cuando HAY mensajes no leídos:
```
┌─────────────────────────┐
│ 💬 Mensajes        [3]  │  ← Badge rojo con número
└─────────────────────────┘
```

### Cuando NO HAY mensajes no leídos:
```
┌─────────────────────────┐
│ 💬 Mensajes             │  ← Sin badge
└─────────────────────────┘
```

## 🆘 Si Sigue Sin Funcionar

Comparte los logs de la consola que dicen `[UNREAD]` para diagnosticar el problema específico.

---

**Correcciones aplicadas**: ✅  
**Logs de debugging**: ✅  
**Listo para probar**: ✅
