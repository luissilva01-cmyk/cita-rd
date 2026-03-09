# Contador de Mensajes No Leídos - Implementado
**Fecha**: 6 de marzo de 2026  
**Estado**: ✅ Completado

## 📋 Resumen

Se implementó un sistema completo de contador de mensajes no leídos que muestra en tiempo real la cantidad de mensajes sin leer en el badge del botón de "Mensajes" en la navegación.

## 🎯 Funcionalidad Implementada

### 1. Hook `useUnreadMessages`
**Archivo**: `cita-rd/hooks/useUnreadMessages.ts`

- Escucha cambios en tiempo real de todos los chats del usuario
- Lee el campo `unreadCount_${userId}` de cada documento de chat en Firestore
- Retorna:
  - `unreadCounts`: Objeto con contadores por chat individual
  - `totalUnread`: Suma total de mensajes no leídos

### 2. Actualización de `chatService.ts`
**Archivo**: `cita-rd/services/chatService.ts`

#### Función `sendMessage` (actualizada)
- Al enviar un mensaje, incrementa automáticamente el contador `unreadCount_${receiverId}` en el documento del chat
- Identifica al receptor del mensaje y actualiza su contador específico

#### Función `markMessagesAsRead` (actualizada)
- Al marcar mensajes como leídos, resetea el contador `unreadCount_${userId}` a 0
- Se ejecuta automáticamente cuando el usuario abre un chat

### 3. Integración en `App.tsx`
**Archivo**: `cita-rd/App.tsx`

- Importa y usa el hook `useUnreadMessages(currentUser?.id)`
- Obtiene `totalUnread` del hook
- Pasa `totalUnread` al componente `Layout` como prop

### 4. Actualización de `Layout.tsx`
**Archivo**: `cita-rd/components/components/Layout.tsx`

- Acepta prop `totalUnreadMessages`
- Pasa el contador al `DesktopLayout` (versión desktop)
- Muestra el contador en el `NavItem` de mensajes (versión móvil)
- Prioriza `totalUnreadMessages` sobre el contador antiguo de `notifications.totalMessages`

### 5. Actualización de `DesktopLayout.tsx`
**Archivo**: `cita-rd/components/DesktopLayout.tsx`

- Acepta prop `totalUnreadMessages`
- Pasa el contador al `DesktopSidebar`

### 6. Actualización de `DesktopSidebar.tsx`
**Archivo**: `cita-rd/components/DesktopSidebar.tsx`

- Acepta prop `totalUnreadMessages`
- Calcula `messagesCount` usando `totalUnreadMessages` si está disponible
- Muestra el badge rojo con el número de mensajes no leídos en el botón "Mensajes"

### 7. Marcado automático como leído en `ChatView.tsx`
**Archivo**: `cita-rd/views/views/ChatView.tsx`

- Ya existía la lógica para marcar mensajes como leídos al abrir un chat
- Ahora también resetea el contador gracias a la actualización en `markMessagesAsRead`

## 🔄 Flujo Completo

### Cuando se envía un mensaje:
1. Usuario A envía mensaje a Usuario B
2. `sendMessage()` guarda el mensaje en Firestore
3. `sendMessage()` incrementa `unreadCount_B` en el documento del chat
4. El hook `useUnreadMessages` de Usuario B detecta el cambio en tiempo real
5. El badge en "Mensajes" se actualiza automáticamente mostrando el nuevo contador

### Cuando se abre un chat:
1. Usuario B abre el chat con Usuario A
2. `ChatView` detecta mensajes no leídos
3. Llama a `markMessagesAsRead()` con los IDs de los mensajes
4. `markMessagesAsRead()` marca los mensajes como leídos Y resetea `unreadCount_B` a 0
5. El hook `useUnreadMessages` detecta el cambio
6. El badge desaparece o se actualiza con el nuevo total

## 📊 Estructura de Datos en Firestore

### Documento de Chat
```javascript
{
  participants: ['userId1', 'userId2'],
  lastMessage: 'Último mensaje...',
  timestamp: 1234567890,
  unreadCount_userId1: 3,  // ← NUEVO: Contador para userId1
  unreadCount_userId2: 0   // ← NUEVO: Contador para userId2
}
```

### Documento de Mensaje
```javascript
{
  senderId: 'userId1',
  text: 'Hola!',
  type: 'text',
  timestamp: 1234567890,
  isRead: false,           // Se actualiza a true cuando se lee
  readBy: ['userId2'],     // Array de usuarios que leyeron
  readAt: 1234567891       // Timestamp de lectura
}
```

## 🎨 UI/UX

### Badge en Navegación Desktop
- Aparece en el botón "Mensajes" del sidebar izquierdo
- Color rojo (`bg-red-500`) para llamar la atención
- Muestra el número total de mensajes no leídos
- Desaparece cuando el contador llega a 0

### Badge en Navegación Móvil
- Aparece en el botón "Mensajes" de la barra inferior
- Mismo comportamiento que la versión desktop
- Responsive y optimizado para touch

## ✅ Ventajas de esta Implementación

1. **Tiempo Real**: Usa listeners de Firestore para actualizaciones instantáneas
2. **Escalable**: Cada usuario tiene su propio contador independiente
3. **Eficiente**: No requiere contar mensajes manualmente, solo lee un campo
4. **Preciso**: Se actualiza automáticamente al enviar y leer mensajes
5. **Multiplataforma**: Funciona en desktop y móvil
6. **Sin Duplicados**: Un solo hook centralizado para todo el contador

## 🔍 Testing

Para probar la funcionalidad:

1. **Abrir dos navegadores** (o modo incógnito + normal)
2. **Iniciar sesión** con dos usuarios diferentes
3. **Usuario A**: Enviar mensaje a Usuario B
4. **Usuario B**: Ver que aparece el badge con "1" en Mensajes
5. **Usuario B**: Abrir el chat
6. **Usuario B**: Ver que el badge desaparece
7. **Usuario A**: Enviar 3 mensajes más
8. **Usuario B**: Ver que el badge muestra "3"

## 📝 Archivos Modificados

1. ✅ `cita-rd/hooks/useUnreadMessages.ts` - Creado
2. ✅ `cita-rd/services/chatService.ts` - Actualizado
3. ✅ `cita-rd/App.tsx` - Actualizado
4. ✅ `cita-rd/components/components/Layout.tsx` - Actualizado
5. ✅ `cita-rd/components/DesktopLayout.tsx` - Actualizado
6. ✅ `cita-rd/components/DesktopSidebar.tsx` - Actualizado
7. ✅ `cita-rd/views/views/ChatView.tsx` - Ya tenía la lógica necesaria

## 🚀 Próximos Pasos (Opcional)

- [ ] Agregar contador individual por chat en la lista de mensajes
- [ ] Agregar sonido de notificación cuando llega un mensaje nuevo
- [ ] Agregar vibración en móvil cuando llega un mensaje
- [ ] Persistir el estado del contador en localStorage como backup
- [ ] Agregar animación al badge cuando se actualiza

## 🎉 Resultado Final

El usuario ahora puede ver en tiempo real cuántos mensajes no leídos tiene, tanto en la navegación desktop como móvil. El badge aparece automáticamente cuando hay mensajes nuevos y desaparece cuando se leen.

---

**Implementado por**: Kiro AI  
**Fecha**: 6 de marzo de 2026  
**Versión**: 1.0.0
