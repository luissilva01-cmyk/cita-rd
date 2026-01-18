# Ejemplo de Migración: App.tsx

Este documento muestra cómo migrar `console.log` al nuevo sistema de logging profesional.

## Antes vs Después

### 1. Importar el Logger

```typescript
// Agregar al inicio del archivo
import { logger } from './utils/logger';
```

### 2. Autenticación y Carga de Perfil

#### ❌ ANTES
```typescript
useEffect(() => {
  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.error('❌ No hay usuario autenticado');
      setLoading(false);
      return;
    }

    console.log('👤 Cargando perfil para usuario:', user.uid);

    try {
      const profile = await getUserProfile(user.uid);
      
      if (profile) {
        console.log('✅ Perfil cargado:', profile);
        setCurrentUser(profile);
      } else {
        console.log('⚠️ No se encontró perfil, creando perfil básico...');
        // ...
      }
    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  loadUserProfile();
}, []);
```

#### ✅ DESPUÉS
```typescript
useEffect(() => {
  const loadUserProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      logger.auth.error('No hay usuario autenticado');
      setLoading(false);
      return;
    }

    logger.profile.info('Cargando perfil para usuario', { userId: user.uid });

    try {
      const profile = await getUserProfile(user.uid);
      
      if (profile) {
        logger.profile.success('Perfil cargado', { profile });
        setCurrentUser(profile);
      } else {
        logger.profile.warn('No se encontró perfil, creando perfil básico');
        // ...
      }
    } catch (error) {
      logger.profile.error('Error cargando perfil', error);
    } finally {
      setLoading(false);
    }
  };

  loadUserProfile();
}, []);
```

### 3. Carga de Chats

#### ❌ ANTES
```typescript
useEffect(() => {
  if (!currentUser) return;
  
  console.log('🔍 Cargando chats para usuario:', currentUser!.id);
  
  const unsubscribe = getUserChats(currentUser.id, (userChats) => {
    console.log('📱 Chats recibidos:', userChats.length, userChats);
    setChats(userChats);
  });

  return () => unsubscribe();
}, [currentUser]);
```

#### ✅ DESPUÉS
```typescript
useEffect(() => {
  if (!currentUser) return;
  
  logger.firebase.info('Cargando chats para usuario', { userId: currentUser.id });
  
  const unsubscribe = getUserChats(currentUser.id, (userChats) => {
    logger.chat.success('Chats recibidos', { 
      count: userChats.length,
      chats: userChats 
    });
    setChats(userChats);
  });

  return () => unsubscribe();
}, [currentUser]);
```

### 4. Sistema de Matches

#### ❌ ANTES
```typescript
const handleLike = async (user: UserProfile) => {
  if (!currentUser) return false;
  
  console.log('🔥 Haciendo like a:', user.name);
  
  if (Math.random() > 0.0) {
    try {
      console.log('✅ ¡Es un match! Creando chat...');
      
      const chatId = await findOrCreateChat(currentUser.id, user.id);
      console.log('📱 Chat creado con ID:', chatId);
      
      await sendMessage(chatId, currentUser.id, '¡Hola! Me gustó tu perfil 😊');
      console.log('💬 Mensaje inicial enviado');
      
      return true;
    } catch (error) {
      console.error('❌ Error creating match:', error);
      return false;
    }
  } else {
    console.log('💔 No hubo match esta vez');
    return false;
  }
};
```

#### ✅ DESPUÉS
```typescript
const handleLike = async (user: UserProfile) => {
  if (!currentUser) return false;
  
  logger.match.info('Haciendo like', { 
    targetUser: user.name,
    targetUserId: user.id 
  });
  
  if (Math.random() > 0.0) {
    try {
      logger.match.success('¡Es un match! Creando chat');
      
      const chatId = await findOrCreateChat(currentUser.id, user.id);
      logger.chat.success('Chat creado', { chatId });
      
      await sendMessage(chatId, currentUser.id, '¡Hola! Me gustó tu perfil 😊');
      logger.chat.success('Mensaje inicial enviado');
      
      return true;
    } catch (error) {
      logger.match.error('Error creando match', error);
      return false;
    }
  } else {
    logger.match.info('No hubo match esta vez');
    return false;
  }
};
```

### 5. Envío de Mensajes

#### ❌ ANTES
```typescript
const handleSendMessage = async (
  chatId: string, 
  text?: string, 
  type: Message['type'] = 'text', 
  content?: string, 
  duration?: number
) => {
  if (!currentUser) return;
  
  try {
    await sendMessage(chatId, currentUser.id, text, type, content, duration);
  } catch (error) {
    console.error('Error sending message:', error);
  }
};
```

#### ✅ DESPUÉS
```typescript
const handleSendMessage = async (
  chatId: string, 
  text?: string, 
  type: Message['type'] = 'text', 
  content?: string, 
  duration?: number
) => {
  if (!currentUser) return;
  
  try {
    await sendMessage(chatId, currentUser.id, text, type, content, duration);
    logger.chat.success('Mensaje enviado', { chatId, type });
  } catch (error) {
    logger.chat.error('Error enviando mensaje', error);
  }
};
```

### 6. Sistema de Stories

#### ❌ ANTES
```typescript
const handleSendStoryMessage = async (
  userId: string, 
  message: string, 
  type: 'text' | 'story_reaction' = 'text'
) => {
  console.log('🚀 === INICIO handleSendStoryMessage ===');
  console.log('📱 userId:', userId);
  console.log('📱 message:', message);
  console.log('📱 type:', type);
  console.log('📱 currentUser.id:', currentUser!.id);
  
  try {
    console.log('✅ Validando parámetros...');
    
    if (!userId) {
      throw new Error('userId es requerido');
    }
    
    console.log('✅ Parámetros válidos');
    console.log('🔍 Buscando/creando chat...');
    
    const chatId = await findOrCreateChat(currentUser!.id, userId);
    console.log('✅ Chat encontrado/creado:', chatId);
    
    console.log('📤 Enviando mensaje...');
    
    await sendMessage(chatId, currentUser!.id, message, type);
    console.log('✅ Mensaje enviado exitosamente');
    console.log('🏁 === FIN handleSendStoryMessage ===');
    
  } catch (error) {
    console.error('🚨 === ERROR en handleSendStoryMessage ===');
    console.error('❌ Error:', error);
    console.error('❌ Error message:', (error as Error).message);
    console.error('❌ Error stack:', (error as Error).stack);
    console.error('❌ Parámetros que causaron el error:', { userId, message, type });
    console.error('🚨 === FIN ERROR ===');
    
    console.log('⚠️ Mensaje no enviado debido a un error.');
  }
};
```

#### ✅ DESPUÉS
```typescript
const handleSendStoryMessage = async (
  userId: string, 
  message: string, 
  type: 'text' | 'story_reaction' = 'text'
) => {
  logger.stories.info('Enviando mensaje de story', { 
    userId, 
    messageType: type,
    currentUserId: currentUser!.id 
  });
  
  try {
    // Validar parámetros
    if (!userId) {
      throw new Error('userId es requerido');
    }
    
    logger.stories.debug('Parámetros válidos, buscando/creando chat');
    
    const chatId = await findOrCreateChat(currentUser!.id, userId);
    logger.chat.success('Chat encontrado/creado', { chatId });
    
    await sendMessage(chatId, currentUser!.id, message, type);
    logger.stories.success('Mensaje de story enviado exitosamente');
    
  } catch (error) {
    logger.stories.error('Error enviando mensaje de story', {
      error,
      params: { userId, message, type, currentUserId: currentUser!.id }
    });
    
    logger.stories.warn('Mensaje no enviado debido a un error');
  }
};
```

### 7. Funciones de Stories

#### ❌ ANTES
```typescript
const handleStoryClick = (storyGroup: StoryGroup) => {
  console.log('📱 Abriendo stories de:', storyGroup.user.name);
  setSelectedStoryGroup(storyGroup);
  setShowStoriesViewer(true);
};

const handleCreateStory = () => {
  console.log('📸 Abriendo modal para crear story');
  setShowCreateStoryModal(true);
};
```

#### ✅ DESPUÉS
```typescript
const handleStoryClick = (storyGroup: StoryGroup) => {
  logger.stories.info('Abriendo stories', { 
    userName: storyGroup.user.name,
    storyCount: storyGroup.stories.length 
  });
  setSelectedStoryGroup(storyGroup);
  setShowStoriesViewer(true);
};

const handleCreateStory = () => {
  logger.ui.info('Abriendo modal para crear story');
  setShowCreateStoryModal(true);
};
```

### 8. Callback de Story Creada

#### ❌ ANTES
```typescript
<CreateStoryModal
  onStoryCreated={() => {
    console.log('✅ Story creada, recargando stories...');
    setShowCreateStoryModal(false);
    setStoriesRefreshKey(prev => prev + 1);
  }}
/>
```

#### ✅ DESPUÉS
```typescript
<CreateStoryModal
  onStoryCreated={() => {
    logger.stories.success('Story creada, recargando stories');
    setShowCreateStoryModal(false);
    setStoriesRefreshKey(prev => prev + 1);
  }}
/>
```

## Resumen de Cambios

### Categorías Usadas en App.tsx:
- `auth` - Autenticación de usuario
- `profile` - Carga y gestión de perfiles
- `firebase` - Operaciones de Firebase
- `chat` - Sistema de mensajería
- `match` - Sistema de matches
- `stories` - Sistema de stories
- `ui` - Interacciones de interfaz

### Niveles Usados:
- `info` - Información general de operaciones
- `success` - Operaciones completadas exitosamente
- `warn` - Advertencias (perfil no encontrado, etc.)
- `error` - Errores que deben ser atendidos
- `debug` - Información detallada para debugging

## Beneficios Observados

1. **Código más limpio**: Sin emojis hardcodeados en strings
2. **Datos estructurados**: Objetos en lugar de concatenación de strings
3. **Categorización clara**: Fácil identificar qué parte del sistema está loggeando
4. **Filtrado fácil**: Desde consola puedes filtrar por categoría
5. **Producción segura**: Solo errores se mostrarán en producción

## Próximo Paso

Aplicar esta misma migración a:
1. `services/storiesService.ts`
2. `services/chatService.ts`
3. `services/profileService.ts`
4. Componentes principales

---

**Nota**: Este es solo un ejemplo. El logger ya está listo para usar en todo el proyecto.
