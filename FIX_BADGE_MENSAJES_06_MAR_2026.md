# Fix: Badge de Mensajes No Leídos - Corregido
**Fecha**: 6 de marzo de 2026  
**Estado**: ✅ Corregido

## 🐛 Problema Identificado

El badge de mensajes no leídos no se mostraba visualmente debido a una lógica incorrecta en el cálculo del contador.

## 🔧 Solución Aplicada

### 1. Corregida Lógica en `DesktopSidebar.tsx`

**ANTES** (incorrecto):
```typescript
const messagesCount = totalUnreadMessages > 0 ? totalUnreadMessages : chats.length;
```
- Problema: Cuando `totalUnreadMessages` era 0, mostraba `chats.length`
- Resultado: El badge siempre mostraba un número, incluso sin mensajes no leídos

**DESPUÉS** (correcto):
```typescript
const messagesCount = totalUnreadMessages;
```
- Solución: Solo muestra el contador real de mensajes no leídos
- Resultado: El badge solo aparece cuando hay mensajes sin leer

### 2. Corregida Lógica en `Layout.tsx` (Móvil)

**ANTES** (incorrecto):
```typescript
notificationCount={totalUnreadMessages > 0 ? totalUnreadMessages : notifications.totalMessages}
```

**DESPUÉS** (correcto):
```typescript
notificationCount={totalUnreadMessages}
```

### 3. Agregados Logs de Debugging

Se agregaron logs detallados en `useUnreadMessages.ts` para diagnosticar:
- 🔍 Snapshot recibido con total de chats
- 📊 Análisis de cada chat individual
- ✅ Contadores finales actualizados

## 📋 Archivos Modificados

1. ✅ `cita-rd/components/DesktopSidebar.tsx`
2. ✅ `cita-rd/components/components/Layout.tsx`
3. ✅ `cita-rd/hooks/useUnreadMessages.ts`

## 🧪 Cómo Probar

### Paso 1: Recargar la App
```bash
# Si estás en desarrollo
npm run dev

# O simplemente recarga el navegador (Ctrl+R o Cmd+R)
```

### Paso 2: Abrir Consola del Navegador
- Presiona `F12` o `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- Ve a la pestaña "Console"

### Paso 3: Buscar Logs
Deberías ver logs como:
```
🔍 [UNREAD] Snapshot recibido { userId: "abc123", totalChats: 2 }
📊 [UNREAD] Chat analizado { chatId: "xyz", unreadCount: 0, ... }
✅ [UNREAD] Contadores actualizados { totalUnread: 0, chatsWithUnread: 0 }
```

### Paso 4: Enviar Mensaje de Prueba
1. Abre un navegador en modo incógnito
2. Inicia sesión con otra cuenta
3. Envía un mensaje a tu cuenta principal
4. En tu cuenta principal, deberías ver:
   - Badge rojo con el número "1" en el botón "Mensajes"
   - Log en consola: `totalUnread: 1`

### Paso 5: Abrir el Chat
1. Haz clic en "Mensajes"
2. Abre el chat con el mensaje nuevo
3. El badge debe desaparecer
4. Log en consola: `totalUnread: 0`

## ⚠️ Nota Importante

Para que el badge funcione, los documentos de chat en Firestore deben tener el campo `unreadCount_${userId}`. Este campo se crea automáticamente cuando:

1. Alguien te envía un mensaje (implementado en `sendMessage()`)
2. Abres un chat (se resetea a 0 en `markMessagesAsRead()`)

Si tienes chats antiguos creados antes de esta implementación, no tendrán este campo y el badge no aparecerá hasta que recibas un mensaje nuevo.

## 🔄 Migración de Chats Antiguos (Opcional)

Si quieres que los chats antiguos también muestren el badge, puedes:

### Opción A: Esperar a recibir mensajes nuevos
Los campos se crearán automáticamente cuando recibas mensajes.

### Opción B: Crear los campos manualmente en Firestore
1. Ve a Firebase Console → Firestore Database
2. Colección `chats`
3. Para cada documento de chat:
   - Agrega campo: `unreadCount_userId1` = `0`
   - Agrega campo: `unreadCount_userId2` = `0`
   - (Reemplaza userId1 y userId2 con los IDs reales de los participantes)

### Opción C: Script de migración (avanzado)
Crear un script que recorra todos los chats y agregue los campos faltantes.

## ✅ Resultado Esperado

### Desktop (Sidebar)
```
┌─────────────────────────┐
│ 🏠 Inicio               │
│ 🔍 Explorar             │
│ 👥 Matches         [2]  │
│ 💬 Mensajes        [3]  │  ← Badge rojo con número
│ 👤 Mi Perfil            │
└─────────────────────────┘
```

### Móvil (Bottom Nav)
```
┌─────┬─────┬─────┬─────┐
│ 🏠  │ ❤️  │ 💬  │ 👤  │
│Inicio│Expl│Mens │Perf │
│     │     │ [3] │     │  ← Badge rojo
└─────┴─────┴─────┴─────┘
```

## 🎯 Comportamiento Correcto

| Situación | Badge Visible | Número Mostrado |
|-----------|---------------|-----------------|
| Sin mensajes no leídos | ❌ No | - |
| 1 mensaje no leído | ✅ Sí | 1 |
| 5 mensajes no leídos | ✅ Sí | 5 |
| Después de abrir chat | ❌ No | - |

## 📊 Logs de Debugging

Los logs te ayudarán a diagnosticar si:
- El hook se está ejecutando correctamente
- Los chats tienen el campo `unreadCount_${userId}`
- El contador se está calculando bien
- El badge debería aparecer o no

---

**Fix aplicado**: ✅  
**Logs agregados**: ✅  
**Listo para probar**: ✅  
**Documentación**: ✅
