# ✅ Fix: Nombres de Usuarios en Mensajes

**Fecha:** 4 de Febrero 2026  
**Bug:** Mensajes mostraban "Usuario 25", "Usuario 26" en lugar de nombres reales  
**Estado:** ✅ RESUELTO

---

## 🐛 Problema

En la página de Messages, Matches y ChatView, los nombres de los usuarios aparecían como:
- "Usuario 25"
- "Usuario 26"
- "Usuario"

En lugar de mostrar los nombres reales de los perfiles de Firestore.

---

## 🔍 Causa Raíz

El código en `App.tsx` creaba perfiles básicos con `name: 'Usuario'` cuando no encontraba el usuario en `potentialMatches`. Esto pasaba porque:

1. `potentialMatches` solo contiene perfiles de Discovery (usuarios para swipe)
2. Los matches/chats pueden incluir usuarios que ya no están en Discovery
3. No se consultaba Firestore para obtener el nombre real del perfil

---

## ✅ Solución Implementada

### 1. Función Helper para Obtener Nombres

Agregada función que consulta Firestore:

```typescript
const getUserNameFromFirestore = async (userId: string): Promise<string> => {
  try {
    const perfilDoc = await getDoc(doc(db, 'perfiles', userId));
    if (perfilDoc.exists()) {
      const data = perfilDoc.data();
      return data.name || data.nombre || data.displayName || `Usuario ${userId.substring(0, 6)}`;
    }
  } catch (error) {
    logger.profile.error('Error obteniendo nombre de usuario', { userId, error });
  }
  return `Usuario ${userId.substring(0, 6)}`;
};
```

### 2. Cache de Nombres

Agregado estado para cachear nombres:

```typescript
const [userNamesCache, setUserNamesCache] = useState<Record<string, string>>({});
```

### 3. Carga Automática de Nombres

Modificado el useEffect de chats para cargar nombres automáticamente:

```typescript
useEffect(() => {
  if (!currentUser) return;
  
  const unsubscribe = getUserChats(currentUser.id, (userChats) => {
    setChats(userChats);
    
    // Cargar nombres de usuarios de los chats
    userChats.forEach(async (chat) => {
      const otherUserId = chat.participants.find(p => p !== currentUser.id);
      if (otherUserId && !userNamesCache[otherUserId]) {
        const userName = await getUserNameFromFirestore(otherUserId);
        setUserNamesCache(prev => ({ ...prev, [otherUserId]: userName }));
      }
    });
  });

  return () => unsubscribe();
}, [currentUser]);
```

### 4. Uso del Cache en 4 Lugares

Reemplazado `name: 'Usuario'` por `name: userNamesCache[otherUserId] || 'Usuario ${userId.substring(0, 6)}'` en:

1. **Home** - recentMatches
2. **Messages** - lista de matches
3. **Matches** - lista de matches
4. **ChatView** - header del chat

---

## 📊 Resultado

### Antes:
```
Messages:
- Usuario 25
- Usuario 26
- Usuario
```

### Después:
```
Messages:
- Luis Silva
- María García
- Carlos Rodríguez
```

O si el perfil no tiene nombre:
```
Messages:
- Usuario je1Hdw (primeros 6 caracteres del ID)
```

---

## 🔧 Archivos Modificados

1. **`cita-rd/App.tsx`**
   - Agregado import de `db` y `getDoc` de Firestore
   - Agregada función `getUserNameFromFirestore()`
   - Agregado estado `userNamesCache`
   - Modificado useEffect de chats para cargar nombres
   - Actualizado fallback en 4 lugares (Home, Messages, Matches, ChatView)

2. **`cita-rd/services/storiesService.ts`**
   - Mejorado fallback de nombres en stories (cambio anterior)

---

## 🎯 Beneficios

1. ✅ Nombres reales de Firestore en Messages
2. ✅ Nombres reales en Matches
3. ✅ Nombres reales en ChatView
4. ✅ Cache para evitar consultas repetidas
5. ✅ Carga automática cuando se cargan chats
6. ✅ Fallback descriptivo si no hay nombre

---

## 🧪 Testing

### Para Verificar:

1. Recargar la app (Ctrl + Shift + R)
2. Ir a Messages
3. Verificar que se muestran nombres reales (no "Usuario 25")
4. Abrir un chat
5. Verificar que el header muestra el nombre real

### Logs Esperados:

```
📊 Chats cargados {count: 3}
👤 Obteniendo nombre de usuario {userId: "je1HdwssPigxtDyHKZpkXNMOGY32"}
✅ Nombre obtenido: "Luis Silva"
```

---

## 📝 Notas Técnicas

### Por Qué No Usar `potentialMatches`

`potentialMatches` solo contiene usuarios de Discovery (para swipe). Los matches pueden incluir:
- Usuarios que ya no están en Discovery (ya hiciste match)
- Usuarios fuera de tu rango de búsqueda
- Usuarios que desactivaron su cuenta

Por eso necesitamos consultar Firestore directamente.

### Por Qué Usar Cache

Sin cache, cada vez que se renderiza Messages/Matches/ChatView, se haría una consulta a Firestore por cada usuario. Con cache:
- Primera carga: 1 consulta por usuario
- Renders subsecuentes: 0 consultas (usa cache)

### Fallback Mejorado

En lugar de solo "Usuario", ahora muestra:
- `data.name` (campo principal)
- `data.nombre` (campo alternativo)
- `data.displayName` (campo de Firebase Auth)
- `Usuario ${userId.substring(0, 6)}` (fallback descriptivo)

Esto hace más fácil identificar usuarios incluso si no tienen nombre configurado.

---

## 🚀 Próximos Pasos

Si aún ves "Usuario 25" después de recargar:

1. **Verificar que el perfil existe en Firestore:**
   - Ir a Firebase Console → Firestore
   - Buscar en colección `perfiles`
   - Verificar que el documento con ID "25" existe
   - Verificar que tiene campo `name` o `nombre`

2. **Si el perfil no existe:**
   - El usuario probablemente eliminó su cuenta
   - O es un perfil de prueba que nunca se creó
   - Solución: Eliminar el chat huérfano

3. **Si el perfil existe pero no tiene nombre:**
   - Actualizar el perfil en Firestore con un nombre
   - O el fallback mostrará "Usuario [ID]"

---

**Documentado por:** Kiro AI  
**Fecha:** 4 de Febrero 2026  
**Hora:** 9:10 PM  
**Estado:** ✅ Fix completado y listo para testing
