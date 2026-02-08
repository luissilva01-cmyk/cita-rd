# 🐛 Bug Fix: Stories Solo Muestran Propias (No de Matches)

**Fecha:** 4 de Febrero 2026  
**Estado:** ✅ CÓDIGO MODIFICADO - PENDIENTE TESTING  
**Prioridad:** 🔴 CRÍTICA

---

## 📋 PROBLEMA IDENTIFICADO

**Síntoma:**
- Solo se pueden ver las propias historias
- No se ven las historias de los matches
- El usuario tiene 1 match confirmado (Luis Silva - `je1HdwssPigxtDyHKZpkXNMOGY32`)

**Causa Raíz:**
El `privacyService.ts` estaba usando datos hardcodeados (demo data) que no se sincronizaban con los matches reales almacenados en Firestore.

---

## ✅ SOLUCIÓN IMPLEMENTADA

### Archivos Modificados:

#### 1. `cita-rd/services/privacyService.ts`

**Función `getUserMatches()`:**
```typescript
async getUserMatches(userId: string): Promise<string[]> {
  console.log('👥 Obteniendo matches reales de Firestore para:', userId);
  
  try {
    // Importar Firestore
    const { db } = await import('./firebase');
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    // Buscar chats donde el usuario es participante
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId));
    const querySnapshot = await getDocs(q);
    
    // Extraer los IDs de los otros usuarios
    const matchedUserIds: string[] = [];
    querySnapshot.forEach((doc) => {
      const participants = doc.data().participants as string[];
      const otherUserId = participants.find(p => p !== userId);
      if (otherUserId && !matchedUserIds.includes(otherUserId)) {
        matchedUserIds.push(otherUserId);
      }
    });
    
    console.log('✅ Matches reales encontrados:', matchedUserIds.length, matchedUserIds);
    return matchedUserIds;
    
  } catch (error) {
    console.error('❌ Error obteniendo matches de Firestore:', error);
    // Fallback a matches demo si falla
    return [...]; // Demo data como fallback
  }
}
```

**Función `areUsersMatched()`:**
```typescript
async areUsersMatched(userId1: string, userId2: string): Promise<boolean> {
  console.log('🔍 Verificando match real en Firestore entre', userId1, 'y', userId2);
  
  try {
    const { db } = await import('./firebase');
    const { collection, query, where, getDocs } = await import('firebase/firestore');
    
    // Buscar chats donde ambos usuarios son participantes
    const chatsRef = collection(db, 'chats');
    const q = query(chatsRef, where('participants', 'array-contains', userId1));
    const querySnapshot = await getDocs(q);
    
    // Verificar si algún chat incluye a ambos usuarios
    let isMatched = false;
    querySnapshot.forEach((doc) => {
      const participants = doc.data().participants as string[];
      if (participants.includes(userId2)) {
        isMatched = true;
      }
    });
    
    console.log('✅ Match real encontrado:', isMatched);
    return isMatched;
    
  } catch (error) {
    console.error('❌ Error verificando match en Firestore:', error);
    // Fallback a matches demo
    return false;
  }
}
```

---

## 🧪 PASOS PARA TESTING

### 1. Recargar la Aplicación

**IMPORTANTE:** Hacer hard refresh para cargar el nuevo código:

```
Ctrl + Shift + R  (Windows/Linux)
Cmd + Shift + R   (Mac)
```

O cerrar y abrir el navegador completamente.

### 2. Abrir Consola del Navegador

Presionar `F12` y ir a la pestaña "Console"

### 3. Verificar Logs de Carga

Al cargar la app, deberías ver estos logs:

```
📊 === CARGANDO STORY GROUPS DESDE FIRESTORE ===
📊 Current User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📊 Stories encontradas en Firestore: X
✅ Stories activas cargadas: X
📊 Usuarios con stories: X
👥 Obteniendo matches reales de Firestore para: KU5ZalR92QcPV7RGbLFTjEjTXZm2
✅ Matches reales encontrados: 1 ["je1HdwssPigxtDyHKZpkXNMOGY32"]
```

### 4. Crear una Story de Prueba

**Como Luis Silva (tu match):**

1. Ir a la app con el usuario `je1HdwssPigxtDyHKZpkXNMOGY32`
2. Crear una story (texto o imagen)
3. Verificar que se creó correctamente

**Logs esperados:**
```
✅ Story creada en Firestore: [story-id]
```

### 5. Verificar Visibilidad

**Como tu usuario principal:**

1. Recargar la app (Ctrl + Shift + R)
2. Ir a la sección de Stories
3. Deberías ver:
   - ✅ Tu propia story (si tienes una)
   - ✅ La story de Luis Silva (tu match)

**Logs esperados en consola:**
```
🔍 Procesando usuario: je1HdwssPigxtDyHKZpkXNMOGY32 - Stories: 1
🔍 Verificando match real en Firestore entre KU5ZalR92QcPV7RGbLFTjEjTXZm2 y je1HdwssPigxtDyHKZpkXNMOGY32
✅ Match real encontrado: true
👁️ ¿Puede ver? true
✅ Agregando grupo: Luis Silva - No vistas: true
📊 === RESULTADO FINAL ===
📊 Grupos filtrados: 2
📊 Grupos: ["Tu nombre", "Luis Silva"]
```

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Si NO se ven las stories del match:

#### Problema 1: Código no recargado
**Síntoma:** Los logs siguen mostrando "Usando matches demo como fallback"
**Solución:** 
- Hacer hard refresh (Ctrl + Shift + R)
- Cerrar y abrir el navegador
- Verificar que Vite recargó el módulo (ver terminal del servidor)

#### Problema 2: No hay stories del match
**Síntoma:** Logs muestran "Stories encontradas en Firestore: 0"
**Solución:**
- Crear una story con el usuario match (Luis Silva)
- Verificar que la story se guardó en Firestore
- Verificar que `expiresAt` es mayor a la fecha actual

#### Problema 3: Configuración de privacidad
**Síntoma:** Logs muestran "🔒 No puede ver este grupo (privacidad)"
**Solución:**
- Verificar que la story tiene `storiesVisibility: 'matches_only'` o `'everyone'`
- Verificar en Firestore: `stories` collection → documento de la story → campo `userId`

#### Problema 4: Match no encontrado
**Síntoma:** Logs muestran "✅ Match real encontrado: false"
**Solución:**
- Verificar que existe un chat en Firestore con ambos usuarios
- Verificar estructura: `chats` collection → documento → campo `participants` debe ser array con ambos IDs
- Ejecutar en consola:
```javascript
// Verificar matches manualmente
const { db } = await import('./services/firebase');
const { collection, query, where, getDocs } = await import('firebase/firestore');
const chatsRef = collection(db, 'chats');
const q = query(chatsRef, where('participants', 'array-contains', 'KU5ZalR92QcPV7RGbLFTjEjTXZm2'));
const snapshot = await getDocs(q);
snapshot.forEach(doc => console.log(doc.id, doc.data()));
```

---

## 📊 LOGS CLAVE A BUSCAR

### ✅ Logs de Éxito:
```
👥 Obteniendo matches reales de Firestore para: [userId]
✅ Matches reales encontrados: 1 ["je1HdwssPigxtDyHKZpkXNMOGY32"]
🔍 Verificando match real en Firestore entre [userId1] y [userId2]
✅ Match real encontrado: true
👁️ ¿Puede ver? true
✅ Agregando grupo: Luis Silva - No vistas: true
📊 Grupos filtrados: 2
```

### ❌ Logs de Error:
```
❌ Error obteniendo matches de Firestore: [error]
⚠️ Usando matches demo como fallback
❌ Error verificando match en Firestore: [error]
🔒 No puede ver este grupo (privacidad)
```

---

## 🎯 RESULTADO ESPERADO

Después de aplicar el fix y recargar:

1. ✅ Se ven las propias stories
2. ✅ Se ven las stories de Luis Silva (match confirmado)
3. ✅ NO se ven stories de usuarios sin match
4. ✅ Los logs muestran "Matches reales encontrados" (no "fallback")

---

## 📝 NOTAS TÉCNICAS

### Estructura de Datos en Firestore:

**Collection: `chats`**
```json
{
  "participants": ["userId1", "userId2"],
  "lastMessage": "...",
  "lastMessageTimestamp": Timestamp,
  "createdAt": Timestamp
}
```

**Collection: `stories`**
```json
{
  "userId": "je1HdwssPigxtDyHKZpkXNMOGY32",
  "type": "image" | "text",
  "content": "...",
  "createdAt": Timestamp,
  "expiresAt": Timestamp,
  "viewedBy": ["userId1", "userId2"]
}
```

**Collection: `perfiles`**
```json
{
  "name": "Luis Silva",
  "images": ["url1", "url2"],
  "storiesVisibility": "matches_only" | "everyone" | "close_friends"
}
```

---

## 🚀 PRÓXIMOS PASOS

1. **Testing Manual:** Seguir los pasos de testing arriba
2. **Verificar Logs:** Confirmar que se ven los logs de "Matches reales encontrados"
3. **Crear Story de Prueba:** Con el usuario match
4. **Confirmar Visibilidad:** Verificar que se ve la story del match
5. **Reportar Resultado:** Compartir logs de consola si hay problemas

---

**Estado:** ⏳ ESPERANDO TESTING DEL USUARIO
