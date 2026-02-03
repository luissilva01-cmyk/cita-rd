# 📊 Plan de Optimización de Queries

**Fecha:** 4 de Febrero 2026  
**Estado:** 🟡 EN PROGRESO  
**Tiempo estimado:** 2-3 horas

---

## 🎯 OBJETIVO

Optimizar queries de Firestore agregando:
- Límites (limit) para reducir lecturas
- Paginación (startAfter) para cargar más datos
- Uso eficiente de índices desplegados

---

## 📋 QUERIES A OPTIMIZAR

### 1. Discovery/Swipe - CRÍTICO ⏳
**Archivo:** `services/profileService.ts`  
**Función:** `getDiscoveryProfiles()`

**Problema actual:**
```typescript
// Sin límite - carga TODOS los perfiles
const q = query(
  collection(db, "perfiles"),
  orderBy("timestamp", "desc")
);
```

**Solución:**
```typescript
// Con límite - solo 20 perfiles a la vez
const q = query(
  collection(db, "perfiles"),
  orderBy("timestamp", "desc"),
  limit(20)
);
```

**Beneficios:**
- Reduce lecturas de Firestore (menos costos)
- Carga más rápida
- Mejor UX (no esperar a cargar 1000 perfiles)

---

### 2. Chat Messages - IMPORTANTE ⏳
**Archivo:** `services/chatService.ts`  
**Función:** `listenToMessages()`

**Problema actual:**
```typescript
// Sin límite - carga TODOS los mensajes
const q = query(
  collection(db, "chats", chatId, "messages"), 
  orderBy("timestamp", "asc")
);
```

**Solución:**
```typescript
// Con límite - últimos 50 mensajes
const q = query(
  collection(db, "chats", chatId, "messages"), 
  orderBy("timestamp", "desc"),
  limit(50)
);
```

**Beneficios:**
- Carga inicial más rápida
- Menos memoria usada
- Scroll infinito para mensajes antiguos

---

### 3. User Chats - IMPORTANTE ⏳
**Archivo:** `services/chatService.ts`  
**Función:** `getUserChats()`

**Problema actual:**
```typescript
// Sin límite - carga TODOS los chats
const q = query(
  collection(db, "chats"), 
  where("participants", "array-contains", userId)
);
```

**Solución:**
```typescript
// Con límite - últimos 20 chats
const q = query(
  collection(db, "chats"), 
  where("participants", "array-contains", userId),
  orderBy("timestamp", "desc"),
  limit(20)
);
```

**Beneficios:**
- Lista de chats más rápida
- Paginación para chats antiguos

---

### 4. Stories - MEDIA ⏳
**Archivo:** `services/storiesService.ts`  
**Función:** `getStoryGroups()`

**Estado actual:** Ya tiene límite implícito (24h)

**Mejora opcional:**
```typescript
// Agregar límite adicional por seguridad
const q = query(
  collection(db, "stories"),
  where("expiresAt", ">", now),
  orderBy("expiresAt"),
  orderBy("createdAt", "desc"),
  limit(50) // Máximo 50 stories activas
);
```

---

## 🔄 IMPLEMENTACIÓN DE PAGINACIÓN

### Patrón General

```typescript
// Estado para paginación
const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
const [hasMore, setHasMore] = useState(true);

// Query inicial
const q = query(
  collection(db, "perfiles"),
  orderBy("timestamp", "desc"),
  limit(20)
);

// Query para cargar más
const loadMore = async () => {
  if (!lastDoc || !hasMore) return;
  
  const q = query(
    collection(db, "perfiles"),
    orderBy("timestamp", "desc"),
    startAfter(lastDoc),
    limit(20)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    setHasMore(false);
    return;
  }
  
  setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
  // Agregar nuevos perfiles a la lista
};
```

---

## 📊 IMPACTO ESTIMADO

### Lecturas de Firestore

| Query | Antes | Después | Ahorro |
|-------|-------|---------|--------|
| **Discovery** | 1000 docs | 20 docs | -98% |
| **Messages** | 500 docs | 50 docs | -90% |
| **Chats** | 100 docs | 20 docs | -80% |
| **Stories** | 50 docs | 50 docs | 0% |

**Total ahorro:** ~90% en lecturas iniciales

### Costos

**Antes (sin límites):**
- 1000 usuarios × 10 sesiones/día = 10,000 lecturas/día
- 10,000 × $0.06/100k = $0.006/día
- $0.18/mes

**Después (con límites):**
- 20 usuarios × 10 sesiones/día = 200 lecturas/día
- 200 × $0.06/100k = $0.00012/día
- $0.0036/mes

**Ahorro:** ~$0.18/mes por usuario (95% menos)

---

## 🎯 PRIORIDADES

### Alta Prioridad (Hacer ahora)
1. ✅ Discovery profiles - limit(20)
2. ✅ Chat messages - limit(50)
3. ✅ User chats - limit(20)

### Media Prioridad (Opcional)
4. ⏳ Stories - limit(50)
5. ⏳ Search profiles - limit(20)

### Baja Prioridad (Futuro)
6. ⏳ Implementar scroll infinito en Discovery
7. ⏳ Implementar scroll infinito en Messages
8. ⏳ Cache de perfiles ya vistos

---

## 🔧 CAMBIOS NECESARIOS

### 1. profileService.ts
```typescript
// Agregar parámetro de límite
export const getDiscoveryProfiles = async (
  currentUserId: string, 
  callback: (profiles: UserProfile[]) => void,
  limit: number = 20  // NUEVO
) => {
  const q = query(
    collection(db, "perfiles"),
    orderBy("timestamp", "desc"),
    limit(limit)  // NUEVO
  );
  // ... resto del código
};
```

### 2. chatService.ts
```typescript
// Agregar límite a mensajes
export const listenToMessages = (
  chatId: string, 
  callback: (messages: Message[]) => void,
  messageLimit: number = 50  // NUEVO
) => {
  const q = query(
    collection(db, "chats", chatId, "messages"), 
    orderBy("timestamp", "desc"),  // CAMBIO: desc para últimos primero
    limit(messageLimit)  // NUEVO
  );
  // ... resto del código
};

// Agregar límite a chats
export const getUserChats = (
  userId: string, 
  callback: (chats: Chat[]) => void,
  chatLimit: number = 20  // NUEVO
) => {
  const q = query(
    collection(db, "chats"), 
    where("participants", "array-contains", userId),
    orderBy("timestamp", "desc"),  // NUEVO
    limit(chatLimit)  // NUEVO
  );
  // ... resto del código
};
```

### 3. Discovery.tsx
```typescript
// Agregar estado para paginación
const [hasMoreProfiles, setHasMoreProfiles] = useState(true);

// Función para cargar más perfiles
const loadMoreProfiles = () => {
  if (!hasMoreProfiles) return;
  // Implementar lógica de paginación
};
```

---

## ✅ TESTING

### Verificar que funciona:

1. **Discovery:**
   - Solo carga 20 perfiles inicialmente
   - Puede cargar más al hacer swipe
   - No hay errores en consola

2. **Chat:**
   - Solo carga últimos 50 mensajes
   - Puede cargar mensajes antiguos al scroll
   - Mensajes se ordenan correctamente

3. **Chats List:**
   - Solo carga últimos 20 chats
   - Chats ordenados por más reciente
   - Puede cargar chats antiguos

---

## 📈 MÉTRICAS DE ÉXITO

- ✅ Tiempo de carga inicial < 2 segundos
- ✅ Lecturas de Firestore reducidas en 90%
- ✅ Costos reducidos en 95%
- ✅ UX mejorada (carga más rápida)
- ✅ Escalable a miles de usuarios

---

## 🚀 PRÓXIMOS PASOS

1. **Implementar límites básicos** (30 min)
2. **Testing de funcionalidad** (30 min)
3. **Implementar paginación** (1-2h)
4. **Testing de paginación** (30 min)
5. **Documentar cambios** (15 min)

**Total:** 2-3 horas

---

**Creado por:** Kiro AI  
**Fecha:** 4 de Febrero 2026  
**Estado:** En progreso

