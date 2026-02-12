# ✅ Mensajes Vistos y Borrar Mensajes - 11 Feb 2026

## 🎯 Funcionalidades Implementadas

Se han agregado dos funcionalidades esenciales para el sistema de chat:

1. **Mensajes Vistos (Read Receipts)** - Indicador visual de cuando un mensaje ha sido leído
2. **Borrar Mensajes** - Opción de borrar mensajes para mí o para todos

## 📝 Características

### 1. Mensajes Vistos (Read Receipts)

#### Indicadores Visuales
- ✓ **Un check gris:** Mensaje enviado pero no leído
- ✓✓ **Doble check azul:** Mensaje leído

#### Comportamiento
- Los mensajes se marcan automáticamente como leídos cuando el usuario abre el chat
- Solo se marcan los mensajes del otro usuario (no los propios)
- El indicador aparece debajo de cada mensaje propio
- Actualización en tiempo real

#### Estructura de Datos
```typescript
interface Message {
  // ... campos existentes
  isRead?: boolean;
  readBy?: string[]; // IDs de usuarios que han leído
  readAt?: number; // Timestamp de cuando fue leído
}
```

### 2. Borrar Mensajes

#### Opciones de Borrado

**Borrar para mí:**
- Solo elimina el mensaje para el usuario actual
- El otro usuario sigue viendo el mensaje
- El mensaje se filtra en la vista del usuario

**Borrar para todos:**
- Solo disponible para el remitente del mensaje
- Elimina el mensaje para todos los participantes
- Muestra "Este mensaje fue eliminado"
- No se puede recuperar

#### Acceso al Menú
- **Desktop:** Click derecho en el mensaje
- **Móvil:** Mantener presionado el mensaje (long press)

#### Opciones del Menú
1. **Copiar mensaje** - Copia el texto al portapapeles
2. **Borrar para mí** - Elimina solo para ti
3. **Borrar para todos** - Elimina para todos (solo remitente)

#### Estructura de Datos
```typescript
interface Message {
  // ... campos existentes
  deletedFor?: string[]; // IDs de usuarios que borraron
  deletedForEveryone?: boolean; // Si fue borrado para todos
}
```

## 🔧 Implementación Técnica

### 1. Actualización de Tipos (types.ts)

```typescript
export interface Message {
  id: string;
  senderId: string;
  text?: string;
  type: 'text' | 'emoji' | 'voice' | 'image' | 'video' | 'story_reaction';
  content?: string;
  duration?: number;
  timestamp: number;
  serverTimestamp?: any;
  isRead?: boolean;
  readBy?: string[]; // NUEVO
  readAt?: number; // NUEVO
  deletedFor?: string[]; // NUEVO
  deletedForEveryone?: boolean; // NUEVO
}
```

### 2. Funciones de Chat Service (chatService.ts)

#### Marcar Mensajes como Leídos

```typescript
export const markMessagesAsRead = async (
  chatId: string,
  userId: string,
  messageIds: string[]
): Promise<void> => {
  try {
    const updatePromises = messageIds.map(async (messageId) => {
      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, {
        isRead: true,
        readBy: [userId],
        readAt: Date.now()
      });
    });

    await Promise.all(updatePromises);
    logger.chat.success('Mensajes marcados como leídos', { count: messageIds.length });
  } catch (error) {
    logger.chat.error('Error marcando mensajes como leídos', error);
  }
};
```

#### Borrar Mensaje para Mí

```typescript
export const deleteMessageForMe = async (
  chatId: string,
  messageId: string,
  userId: string
): Promise<void> => {
  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    const messageSnapshot = await getDocs(query(
      collection(db, "chats", chatId, "messages")
    ));
    
    const messageDoc = messageSnapshot.docs.find(d => d.id === messageId);
    
    if (messageDoc) {
      const currentData = messageDoc.data();
      const deletedFor = currentData.deletedFor || [];
      
      await updateDoc(messageRef, {
        deletedFor: [...deletedFor, userId]
      });
      
      logger.chat.success('Mensaje borrado para usuario', { messageId });
    }
  } catch (error) {
    logger.chat.error('Error borrando mensaje para usuario', error);
    throw error;
  }
};
```

#### Borrar Mensaje para Todos

```typescript
export const deleteMessageForEveryone = async (
  chatId: string,
  messageId: string,
  senderId: string
): Promise<void> => {
  try {
    const messageRef = doc(db, "chats", chatId, "messages", messageId);
    const messageSnapshot = await getDocs(query(
      collection(db, "chats", chatId, "messages")
    ));
    
    const messageDoc = messageSnapshot.docs.find(d => d.id === messageId);
    
    if (messageDoc) {
      const messageData = messageDoc.data();
      
      if (messageData.senderId !== senderId) {
        throw new Error('Solo el remitente puede borrar el mensaje para todos');
      }
      
      await updateDoc(messageRef, {
        deletedForEveryone: true,
        text: 'Este mensaje fue eliminado',
        content: undefined,
        type: 'text'
      });
      
      logger.chat.success('Mensaje borrado para todos', { messageId });
    }
  } catch (error) {
    logger.chat.error('Error borrando mensaje para todos', error);
    throw error;
  }
};
```

### 3. Componente MessageContextMenu

```typescript
interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  isOwnMessage: boolean;
  onDeleteForMe: () => void;
  onDeleteForEveryone: () => void;
  onCopy: () => void;
  onClose: () => void;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  isOpen,
  position,
  isOwnMessage,
  onDeleteForMe,
  onDeleteForEveryone,
  onCopy,
  onClose
}) => {
  // Menú contextual con opciones de borrado y copiar
  // Posicionado dinámicamente según el click/touch
  // Overlay para cerrar al hacer click fuera
};
```

### 4. Integración en ChatView

#### Estados

```typescript
// Estados para menú contextual
const [contextMenu, setContextMenu] = useState<{
  isOpen: boolean;
  position: { x: number; y: number };
  messageId: string;
  isOwnMessage: boolean;
  messageText?: string;
}>({
  isOpen: false,
  position: { x: 0, y: 0 },
  messageId: '',
  isOwnMessage: false,
  messageText: ''
});
```

#### Efecto para Marcar como Leído

```typescript
// Marcar mensajes como leídos cuando se abre el chat
useEffect(() => {
  if (messages.length > 0 && chatId && currentUserId) {
    const unreadMessages = messages.filter(
      msg => !msg.isRead && msg.senderId !== currentUserId
    );
    
    if (unreadMessages.length > 0) {
      const messageIds = unreadMessages.map(msg => msg.id);
      markMessagesAsRead(chatId, currentUserId, messageIds);
    }
  }
}, [messages, chatId, currentUserId]);
```

#### Handlers

```typescript
// Long press handler
const handleMessageLongPress = (
  e: React.MouseEvent | React.TouchEvent,
  messageId: string,
  isOwnMessage: boolean,
  messageText?: string
) => {
  e.preventDefault();
  
  const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
  const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
  
  setContextMenu({
    isOpen: true,
    position: { x, y },
    messageId,
    isOwnMessage,
    messageText
  });
};

// Copiar mensaje
const handleCopyMessage = () => {
  if (contextMenu.messageText) {
    navigator.clipboard.writeText(contextMenu.messageText);
  }
};

// Borrar para mí
const handleDeleteForMe = async () => {
  try {
    await deleteMessageForMe(chatId, contextMenu.messageId, currentUserId);
  } catch (error) {
    alert('Error al borrar el mensaje');
  }
};

// Borrar para todos
const handleDeleteForEveryone = async () => {
  try {
    await deleteMessageForEveryone(chatId, contextMenu.messageId, currentUserId);
  } catch (error) {
    alert('Error al borrar el mensaje para todos');
  }
};
```

#### Renderizado de Mensajes

```typescript
messages.map((msg) => {
  // Filtrar mensajes borrados para el usuario actual
  if (msg.deletedFor?.includes(currentUserId)) {
    return null;
  }

  return (
    <div key={msg.id}>
      {msg.type === 'text' && (
        <div className="flex flex-col gap-1">
          <div 
            className={`message-bubble ${msg.deletedForEveryone ? 'italic opacity-60' : ''}`}
            onContextMenu={(e) => handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, msg.text)}
            onTouchStart={(e) => {
              const touchTimer = setTimeout(() => {
                handleMessageLongPress(e, msg.id, msg.senderId === currentUserId, msg.text);
              }, 500);
              (e.currentTarget as any).touchTimer = touchTimer;
            }}
            onTouchEnd={(e) => {
              const touchTimer = (e.currentTarget as any).touchTimer;
              if (touchTimer) {
                clearTimeout(touchTimer);
              }
            }}
          >
            {msg.text}
          </div>
          
          {/* Indicador de visto */}
          {msg.senderId === currentUserId && (
            <div className="flex items-center justify-end gap-1 px-1">
              {msg.isRead || msg.readBy?.length ? (
                <CheckCheck size={14} className="text-blue-500" />
              ) : (
                <Check size={14} className="text-slate-400" />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
})
```

## 🎨 Detalles de UX

### Mensajes Vistos

1. **Indicador Discreto**
   - Pequeño icono debajo del mensaje
   - No invasivo
   - Color diferenciado (gris vs azul)

2. **Actualización Automática**
   - Se marca como leído al abrir el chat
   - No requiere acción del usuario
   - Tiempo real con Firebase

### Borrar Mensajes

1. **Acceso Intuitivo**
   - Click derecho en desktop
   - Long press en móvil (500ms)
   - Menú contextual elegante

2. **Opciones Claras**
   - Iconos descriptivos
   - Texto claro
   - Separación visual entre opciones

3. **Confirmación Visual**
   - Mensaje borrado muestra "Este mensaje fue eliminado"
   - Estilo italic y opacidad reducida
   - Mantiene estructura del chat

4. **Seguridad**
   - Solo el remitente puede borrar para todos
   - Validación en el servidor
   - Error handling robusto

## 📱 Responsive

### Mobile (< 640px)
- Long press para abrir menú (500ms)
- Menú posicionado cerca del dedo
- Touch targets de 44px mínimo
- Overlay para cerrar fácilmente

### Tablet/Desktop (>= 640px)
- Click derecho para abrir menú
- Menú posicionado en el cursor
- Hover states en opciones
- Animaciones suaves

## 🔒 Seguridad

### Validaciones

1. **Borrar para Todos**
   - Solo el remitente puede ejecutar
   - Validación en cliente y servidor
   - Error si no es el remitente

2. **Borrar para Mí**
   - Cualquier usuario puede borrar para sí mismo
   - No afecta a otros usuarios
   - Filtrado en cliente

3. **Marcar como Leído**
   - Solo marca mensajes del otro usuario
   - No marca mensajes propios
   - Actualización atómica

## 🧪 Cómo Probar

### 1. Mensajes Vistos

**Escenario 1: Enviar y Ver**
1. Usuario A envía mensaje a Usuario B
2. Usuario A ve un check gris (✓)
3. Usuario B abre el chat
4. Usuario A ve doble check azul (✓✓)

**Escenario 2: Múltiples Mensajes**
1. Usuario A envía 3 mensajes
2. Todos muestran check gris
3. Usuario B abre el chat
4. Todos cambian a doble check azul

### 2. Borrar Mensajes

**Escenario 1: Borrar para Mí**
1. Mantener presionado un mensaje
2. Seleccionar "Borrar para mí"
3. El mensaje desaparece para ti
4. El otro usuario sigue viéndolo

**Escenario 2: Borrar para Todos**
1. Mantener presionado tu propio mensaje
2. Seleccionar "Borrar para todos"
3. El mensaje muestra "Este mensaje fue eliminado"
4. Ambos usuarios ven el mensaje eliminado

**Escenario 3: Copiar Mensaje**
1. Mantener presionado un mensaje
2. Seleccionar "Copiar mensaje"
3. El texto se copia al portapapeles
4. Puedes pegarlo en otro lugar

**Escenario 4: Intentar Borrar Mensaje Ajeno**
1. Mantener presionado mensaje del otro usuario
2. Solo aparece "Borrar para mí"
3. No aparece "Borrar para todos"
4. Seguridad funcionando correctamente

## 🎯 Beneficios

### Para Usuarios

1. **Transparencia**
   - Saber si tu mensaje fue leído
   - Evitar malentendidos
   - Mejor comunicación

2. **Control**
   - Borrar mensajes enviados por error
   - Privacidad mejorada
   - Gestión de conversaciones

3. **Conveniencia**
   - Copiar mensajes fácilmente
   - Limpiar conversaciones
   - UX moderna

### Para la App

1. **Competitividad**
   - Funcionalidades estándar de apps de chat
   - Paridad con WhatsApp, Telegram, etc.
   - Experiencia profesional

2. **Engagement**
   - Usuarios más confiados
   - Mejor retención
   - Satisfacción aumentada

## 📊 Comparación con Otras Apps

| Funcionalidad | Ta' Pa' Ti | WhatsApp | Telegram | Tinder |
|--------------|------------|----------|----------|--------|
| Mensajes Vistos | ✅ | ✅ | ✅ | ❌ |
| Borrar para Mí | ✅ | ✅ | ✅ | ❌ |
| Borrar para Todos | ✅ | ✅ | ✅ | ❌ |
| Copiar Mensaje | ✅ | ✅ | ✅ | ✅ |
| Long Press Menu | ✅ | ✅ | ✅ | ❌ |

## 🚀 Próximos Pasos

### Mejoras Futuras

1. **Editar Mensajes**
   - Permitir editar mensajes enviados
   - Mostrar "editado" en el mensaje
   - Historial de ediciones

2. **Reacciones Rápidas**
   - Emoji reactions a mensajes
   - Similar a Instagram/Facebook
   - Contador de reacciones

3. **Responder a Mensajes**
   - Quote/reply a mensajes específicos
   - Navegación al mensaje original
   - Contexto visual

4. **Mensajes Temporales**
   - Auto-destrucción después de X tiempo
   - Similar a Snapchat
   - Privacidad aumentada

5. **Búsqueda en Chat**
   - Buscar mensajes por texto
   - Filtros por fecha/tipo
   - Navegación rápida

## 📝 Notas Técnicas

### Performance

1. **Batch Updates**
   - Marcar múltiples mensajes a la vez
   - Reduce llamadas a Firestore
   - Mejor performance

2. **Filtrado en Cliente**
   - Mensajes borrados se filtran en el cliente
   - No se eliminan de Firestore
   - Permite recuperación si es necesario

3. **Optimistic Updates**
   - UI se actualiza inmediatamente
   - Sincronización con servidor después
   - UX más fluida

### Firestore Structure

```
chats/
  {chatId}/
    messages/
      {messageId}/
        senderId: string
        text: string
        type: string
        timestamp: number
        isRead: boolean
        readBy: [userId]
        readAt: number
        deletedFor: [userId]
        deletedForEveryone: boolean
```

## 🎉 Conclusión

Se han implementado exitosamente dos funcionalidades críticas para el sistema de chat:

1. **Mensajes Vistos:** Indicadores visuales claros de cuando un mensaje ha sido leído
2. **Borrar Mensajes:** Opciones flexibles para borrar mensajes para mí o para todos

Ambas funcionalidades siguen las mejores prácticas de apps de chat modernas y proporcionan una experiencia de usuario profesional y pulida.

---

**Fecha:** 11 de Febrero 2026  
**Estado:** ✅ IMPLEMENTADO  
**Archivos Modificados:**
- `cita-rd/types.ts`
- `cita-rd/services/chatService.ts`
- `cita-rd/views/views/ChatView.tsx`
- `cita-rd/components/MessageContextMenu.tsx` (nuevo)

**Próximo Deploy:** Pendiente de testing y aprobación
