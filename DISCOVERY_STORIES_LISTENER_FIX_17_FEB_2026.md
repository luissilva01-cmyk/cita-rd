# Discovery Stories Listener Fix - 17 Feb 2026

## 🐛 PROBLEMAS IDENTIFICADOS

### 1. Listener de Stories se ejecuta múltiples veces
```
📡 Configurando listener en tiempo real para stories
🔍 Obteniendo verificación para usuario: je1Hdwss...
📡 Cambio detectado en stories: 0 documentos
```

**Causa:** `Discovery` se renderiza 3 veces, causando que `StoriesRing` se monte y desmonte múltiples veces, creando listeners duplicados.

### 2. Discovery se renderiza 3 veces
```
🔍 Discovery render: { usersLength: 5, currentIndex: 0 }
🔍 Estado actual: { usersCount: 5, currentIndex: 0 }
🔍 Discovery render: { usersLength: 5, currentIndex: 0 }
🔍 Estado actual: { usersCount: 5, currentIndex: 0 }
🔍 Discovery render: { usersLength: 5, currentIndex: 0 }
🔍 Estado actual: { usersCount: 5, currentIndex: 0 }
```

**Causa:** Múltiples `setState` en cascada:
- `setStories(...)` → render
- `setProfiles(...)` → render  
- `setGroups(...)` → render

### 3. Analytics inicializado 2 veces
```
Analytics initialized
Analytics initialized
Error tracking initialized
Error tracking initialized
```

**Causa:** `analyticsService.initialize()` y `errorTrackingService.initialize()` se llaman dos veces en `App.tsx`.

### 4. Flujo secuencial lento (N+1 queries)
```
🔍 Obteniendo verificación para usuario
📊 Usuarios con stories: 0
✅ Perfiles cargados en batch: 0
```

**Causa:** Queries en cadena en lugar de paralelo:
1. Query stories
2. Query perfiles uno por uno
3. Filtrar
4. Renderizar

## ✅ SOLUCIONES

### Fix 1: Optimizar useEffect de Stories en StoriesRing

**ANTES:**
```typescript
useEffect(() => {
  const unsubscribe = storiesService.listenToStoryGroups(currentUserId, callback);
  return () => unsubscribe();
}, [currentUserId]); // ❌ currentUserId puede ser un objeto
```

**DESPUÉS:**
```typescript
useEffect(() => {
  if (!currentUserId) return;
  
  logger.stories.info('📡 Configurando listener ÚNICO para stories', { userId: currentUserId });
  
  const unsubscribe = storiesService.listenToStoryGroups(currentUserId, callback);
  
  return () => {
    logger.stories.info('🧹 Limpiando listener de stories', { userId: currentUserId });
    if (unsubscribe) unsubscribe();
  };
}, [currentUserId]); // ✅ Solo el string del ID
```

### Fix 2: Agrupar estados en Discovery

**ANTES:**
```typescript
setStories(stories);
setProfiles(profiles);
setGroups(groups);
// 3 renders
```

**DESPUÉS:**
```typescript
setDiscoveryData({
  stories,
  profiles,
  groups
});
// 1 render
```

O usar `useReducer`:
```typescript
const [state, dispatch] = useReducer(discoveryReducer, initialState);

dispatch({
  type: 'SET_ALL',
  payload: { stories, profiles, groups }
});
```

### Fix 3: Cargar Discovery en paralelo

**ANTES (Secuencial):**
```typescript
const stories = await getStories();
const profiles = await getProfiles();
const filtered = filterProfiles(profiles, stories);
```

**DESPUÉS (Paralelo):**
```typescript
const [storiesSnap, profilesSnap] = await Promise.all([
  getStoriesSnapshot(),
  getProfilesBatch()
]);

const filtered = processData(storiesSnap, profilesSnap);
```

### Fix 4: Inicializar Analytics una sola vez

**ANTES:**
```typescript
useEffect(() => {
  analyticsService.initialize(GA_ID);
  errorTrackingService.initialize();
}, []); // Se ejecuta 2 veces por StrictMode
```

**DESPUÉS:**
```typescript
// Usar flag para evitar doble inicialización
let analyticsInitialized = false;

useEffect(() => {
  if (analyticsInitialized) return;
  analyticsInitialized = true;
  
  analyticsService.initialize(GA_ID);
  errorTrackingService.initialize();
}, []);
```

O mover fuera del componente:
```typescript
// Fuera de App.tsx
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  analyticsService.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  errorTrackingService.initialize();
}
```

## 🎯 IMPLEMENTACIÓN

### Paso 1: Optimizar StoriesRing

Agregar logs y validación:

```typescript
useEffect(() => {
  if (!currentUserId) {
    logger.stories.warn('⚠️ currentUserId es null, no configurar listener');
    return;
  }
  
  logger.stories.info('📡 [ÚNICO] Configurando listener de stories', { 
    userId: currentUserId,
    timestamp: Date.now()
  });
  
  const unsubscribe = storiesService.listenToStoryGroups(currentUserId, (groups) => {
    logger.stories.debug('✅ [CALLBACK] Stories actualizadas', { 
      groupCount: groups.length,
      timestamp: Date.now()
    });
    setStoryGroups(groups);
    setLoading(false);
  });
  
  return () => {
    logger.stories.info('🧹 [CLEANUP] Limpiando listener de stories', { 
      userId: currentUserId,
      timestamp: Date.now()
    });
    if (unsubscribe) unsubscribe();
  };
}, [currentUserId]); // ✅ Solo depende del string del ID
```

### Paso 2: Reducir renders de Discovery

Usar `useMemo` para evitar re-renders innecesarios:

```typescript
const displayUsers = useMemo(() => {
  return sortedUsers.length > 0 ? sortedUsers : availableUsers;
}, [sortedUsers.length, availableUsers.length]); // Solo depende de lengths
```

### Paso 3: Optimizar carga de perfiles

En `profileService.ts`, cargar en paralelo:

```typescript
export const getDiscoveryProfiles = async (
  currentUserId: string,
  callback: (profiles: UserProfile[]) => void
) => {
  try {
    // Cargar perfiles y verificaciones en paralelo
    const [profilesSnap, verificationsSnap] = await Promise.all([
      getDocs(query(collection(db, "perfiles"), limit(10))),
      getDocs(query(collection(db, "verifications")))
    ]);
    
    // Procesar en un solo paso
    const profiles = processProfiles(profilesSnap, verificationsSnap, currentUserId);
    
    callback(profiles);
  } catch (error) {
    logger.profile.error('Error cargando perfiles', error);
    callback([]);
  }
};
```

## 📊 RESULTADO ESPERADO

### ANTES:
```
📡 Configurando listener en tiempo real para stories (x3)
🔍 Obteniendo verificación para usuario (x3)
📡 Cambio detectado en stories (x3)
🔍 Discovery render (x3)
⏱️ Tiempo total: 10-60 segundos
```

### DESPUÉS:
```
📡 [ÚNICO] Configurando listener de stories (x1)
🔍 Obteniendo verificación para usuario (x1)
✅ [CALLBACK] Stories actualizadas (x1)
🔍 Discovery render (x1)
⏱️ Tiempo total: <2 segundos
```

## 🔍 DEBUGGING

Para verificar que el fix funcionó:

1. **Abrir consola (F12)**
2. **Buscar logs con `[ÚNICO]`** - Debe aparecer solo 1 vez
3. **Buscar logs con `[CALLBACK]`** - Debe aparecer solo cuando hay cambios
4. **Buscar logs con `[CLEANUP]`** - Debe aparecer solo al desmontar
5. **Contar "Discovery render"** - Debe ser 1 o 2 máximo

## 📅 METADATA

- **Fecha:** 17 de Febrero 2026
- **Hora:** ~9:30 PM
- **Problema:** Listeners duplicados de Stories
- **Causa:** Discovery se renderiza 3 veces
- **Solución:** Optimizar useEffect y agrupar estados
