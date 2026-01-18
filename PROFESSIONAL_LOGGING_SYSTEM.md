# Sistema de Logging Profesional - Ta' Pa' Ti

## 📋 Resumen

Hemos implementado un sistema de logging profesional que reemplaza los 4,136 `console.log/error/warn` dispersos en el código.

### Estadísticas Anteriores:
- **console.log**: 1,616 mensajes
- **console.error**: 2,285 mensajes  
- **console.warn**: 235 mensajes
- **TOTAL**: 4,136 mensajes

## ✨ Características del Nuevo Sistema

### 1. Niveles de Log
- `debug` - Información detallada para debugging
- `info` - Información general
- `warn` - Advertencias
- `error` - Errores (siempre se muestran, incluso en producción)
- `success` - Operaciones exitosas

### 2. Categorías
- `auth` 🔐 - Autenticación y sesiones
- `profile` 👤 - Perfiles de usuario
- `chat` 💬 - Mensajes y chats
- `stories` 📱 - Sistema de stories
- `match` 💕 - Sistema de matches
- `firebase` 🔥 - Operaciones de Firebase
- `api` 🌐 - Llamadas a APIs
- `ui` 🎨 - Interacciones de UI
- `privacy` 🔒 - Configuración de privacidad
- `verification` ✅ - Verificación de identidad
- `general` 📋 - General

### 3. Comportamiento Inteligente
- ✅ **Desarrollo**: Todos los logs visibles
- ✅ **Producción**: Solo errores críticos
- ✅ **Timestamps**: Hora exacta de cada log
- ✅ **Colores**: Código de colores por nivel
- ✅ **Emojis**: Identificación visual por categoría
- ✅ **Filtros**: Filtrar por categoría desde consola

## 🚀 Uso Básico

### Importar el Logger

```typescript
import { logger } from '../utils/logger';
```

### Ejemplos por Categoría

#### Autenticación
```typescript
// Antes
console.log('👤 Cargando perfil para usuario:', user.uid);
console.error('❌ No hay usuario autenticado');

// Ahora
logger.auth.info('Cargando perfil para usuario', { userId: user.uid });
logger.auth.error('No hay usuario autenticado');
```

#### Stories
```typescript
// Antes
console.log('📱 Cargando stories para usuario:', currentUserId);
console.log('✅ Stories cargadas:', groups.length, 'grupos');

// Ahora
logger.stories.info('Cargando stories para usuario', { userId: currentUserId });
logger.stories.success('Stories cargadas', { count: groups.length });
```

#### Chat
```typescript
// Antes
console.log('💬 Mensaje inicial enviado');
console.error('Error sending message:', error);

// Ahora
logger.chat.success('Mensaje inicial enviado');
logger.chat.error('Error enviando mensaje', error);
```

#### Matches
```typescript
// Antes
console.log('🔥 Haciendo like a:', user.name);
console.log('✅ ¡Es un match! Creando chat...');

// Ahora
logger.match.info('Haciendo like', { userName: user.name });
logger.match.success('¡Es un match! Creando chat');
```

#### Firebase
```typescript
// Antes
console.log('🔍 Cargando chats para usuario:', userId);
console.error('Error cargando perfil:', error);

// Ahora
logger.firebase.info('Cargando chats para usuario', { userId });
logger.firebase.error('Error cargando perfil', error);
```

## 🎯 Métodos Disponibles

### Por Nivel
```typescript
logger.debug('general', 'Mensaje de debug', data);
logger.info('general', 'Mensaje informativo', data);
logger.warn('general', 'Advertencia', data);
logger.error('general', 'Error', error);
logger.success('general', 'Operación exitosa', data);
```

### Por Categoría (Recomendado)
```typescript
logger.auth.debug('mensaje', data);
logger.auth.info('mensaje', data);
logger.auth.warn('mensaje', data);
logger.auth.error('mensaje', error);
logger.auth.success('mensaje', data);

// Disponible para todas las categorías:
// auth, profile, chat, stories, match, firebase, api, ui, privacy, verification
```

### Utilidades
```typescript
// Agrupar logs relacionados
logger.group('Proceso de Login');
logger.auth.info('Validando credenciales');
logger.auth.info('Consultando Firebase');
logger.auth.success('Login exitoso');
logger.groupEnd();

// Medir tiempo de ejecución
logger.time('Carga de perfiles');
// ... código ...
logger.timeEnd('Carga de perfiles');

// Mostrar datos en tabla
logger.table(users);
```

## ⚙️ Configuración

### Desde la Consola del Navegador

```javascript
// Acceder al logger
window.tapatiLogger

// Deshabilitar todos los logs
window.tapatiLogger.disable()

// Habilitar logs
window.tapatiLogger.enable()

// Filtrar solo categorías específicas
window.tapatiLogger.filterCategories(['auth', 'firebase'])

// Ver solo stories y chat
window.tapatiLogger.filterCategories(['stories', 'chat'])

// Limpiar filtros (ver todas las categorías)
window.tapatiLogger.clearFilters()

// Configuración personalizada
window.tapatiLogger.configure({
  enabled: true,
  showTimestamp: true,
  showCategory: true,
  categories: ['auth', 'chat'] // Solo estas categorías
})
```

### Desde el Código

```typescript
import { logger } from '../utils/logger';

// Configurar al inicio de la app
logger.configure({
  enabled: true,
  showTimestamp: true,
  showCategory: true,
  categories: [] // Vacío = todas las categorías
});
```

## 📝 Guía de Migración

### Paso 1: Identificar el Contexto

Antes de migrar un `console.log`, identifica a qué categoría pertenece:

```typescript
// ❌ Antes
console.log('👤 Cargando perfil...');

// ✅ Después - Identificar: es sobre perfiles
logger.profile.info('Cargando perfil');
```

### Paso 2: Elegir el Nivel Correcto

- **debug**: Información muy detallada (ej: valores de variables)
- **info**: Información general (ej: "Iniciando proceso")
- **success**: Operación completada exitosamente
- **warn**: Algo inusual pero no crítico
- **error**: Error que debe ser atendido

### Paso 3: Pasar Datos Estructurados

```typescript
// ❌ Antes
console.log('Usuario:', userId, 'Perfil:', profile);

// ✅ Después
logger.profile.info('Cargando perfil de usuario', { 
  userId, 
  profile 
});
```

## 🔄 Ejemplos de Migración Completa

### Ejemplo 1: App.tsx

```typescript
// ❌ ANTES
console.error('❌ No hay usuario autenticado');
console.log('👤 Cargando perfil para usuario:', user.uid);
console.log('✅ Perfil cargado:', profile);
console.error('❌ Error cargando perfil:', error);

// ✅ DESPUÉS
logger.auth.error('No hay usuario autenticado');
logger.profile.info('Cargando perfil para usuario', { userId: user.uid });
logger.profile.success('Perfil cargado', { profile });
logger.profile.error('Error cargando perfil', error);
```

### Ejemplo 2: storiesService.ts

```typescript
// ❌ ANTES
console.log('📱 === OBTENIENDO STORY GROUPS ===');
console.log('📱 Usuario actual:', currentUserId);
console.log('✅ Story groups filtrados:', filteredGroups.length);
console.error('🚨 === ERROR EN getStoryGroups ===');

// ✅ DESPUÉS
logger.stories.info('Obteniendo story groups', { userId: currentUserId });
logger.stories.success('Story groups filtrados', { count: filteredGroups.length });
logger.stories.error('Error en getStoryGroups', error);
```

### Ejemplo 3: chatService.ts

```typescript
// ❌ ANTES
console.log('🔍 Buscando/creando chat...');
console.log('✅ Chat encontrado/creado:', chatId);
console.error('❌ Error:', error);

// ✅ DESPUÉS
logger.chat.info('Buscando/creando chat');
logger.chat.success('Chat encontrado/creado', { chatId });
logger.chat.error('Error en chat', error);
```

## 🎨 Ventajas del Nuevo Sistema

### 1. Consola Más Limpia
- Logs organizados por categoría
- Colores consistentes
- Timestamps automáticos

### 2. Mejor Debugging
- Filtrar por categoría específica
- Agrupar logs relacionados
- Medir tiempos de ejecución

### 3. Producción Segura
- Solo errores en producción
- No contamina la consola del usuario
- Preparado para integración con Sentry

### 4. Mantenibilidad
- Código más limpio
- Fácil de buscar y reemplazar
- Estándar consistente

## 🔮 Próximos Pasos

### Fase 1: Migración Gradual (Actual)
- ✅ Sistema de logging creado
- ⏳ Migrar archivos principales (App.tsx, services)
- ⏳ Migrar componentes

### Fase 2: Integración con Monitoreo
- [ ] Integrar Sentry para errores en producción
- [ ] Dashboard de logs
- [ ] Alertas automáticas

### Fase 3: Analytics
- [ ] Tracking de eventos de usuario
- [ ] Métricas de rendimiento
- [ ] Reportes automáticos

## 📚 Recursos

### Documentación
- [Archivo del Logger](./utils/logger.ts)
- [Ejemplos de Uso](#-uso-básico)

### Testing
```bash
# En la consola del navegador
window.tapatiLogger.auth.info('Test de logging')
window.tapatiLogger.stories.success('Story creada')
window.tapatiLogger.chat.error('Error de prueba')
```

## 🤝 Contribuir

Al agregar nuevos logs:

1. **Usa el logger** en lugar de console.log
2. **Elige la categoría correcta**
3. **Usa el nivel apropiado**
4. **Pasa datos estructurados** (objetos, no strings concatenados)

```typescript
// ✅ BIEN
logger.match.success('Match creado', { userId, matchId });

// ❌ MAL
console.log('Match creado para usuario ' + userId + ' con ID ' + matchId);
```

---

**Creado para Ta' Pa' Ti** 🇩🇴
Sistema de logging profesional - 2026
