# Fix: Lógica de Matching - 11 Febrero 2026 🔥

## 🐛 Problema Encontrado

Los usuarios reportaron que cuando hacían match con otro usuario, **aparecía inmediatamente que estaban emparejados**, sin que el otro usuario hubiera dado like también.

## 🔍 Causa Raíz

En `App.tsx`, línea 283, había código de testing que quedó en producción:

```typescript
// 100% chance of match for testing purposes
if (Math.random() > 0.0) {  // ← ESTO SIEMPRE ES TRUE!
  // Crear match inmediatamente
  const chatId = await findOrCreateChat(currentUser.id, user.id);
  await sendMessage(chatId, currentUser.id, '¡Hola! Me gustó tu perfil 😊');
  return true;
}
```

**Problema:** `Math.random()` devuelve un número entre 0 y 1, que **SIEMPRE** es mayor que 0.0, por lo que **SIEMPRE** creaba un match inmediatamente cuando alguien daba like, sin verificar si el otro usuario también dio like.

## ✅ Solución Implementada

Implementé la lógica correcta de matching mutuo:

```typescript
const handleLike = async (user: UserProfile) => {
  if (!currentUser) return false;
  
  try {
    const db = getFirestore();
    
    // 1. Guardar el like del usuario actual
    const likeRef = doc(db, 'likes', `${currentUser.id}_${user.id}`);
    await setDoc(likeRef, {
      fromUserId: currentUser.id,
      toUserId: user.id,
      timestamp: Date.now(),
      createdAt: serverTimestamp()
    });
    
    logger.match.info('Like guardado', { from: currentUser.id, to: user.id });
    
    // 2. Verificar si el otro usuario ya dio like (match mutuo)
    const reverseLikeRef = doc(db, 'likes', `${user.id}_${currentUser.id}`);
    const reverseLikeSnap = await getDoc(reverseLikeRef);
    
    if (reverseLikeSnap.exists()) {
      // ¡ES UN MATCH! Ambos se dieron like
      logger.match.success('¡MATCH MUTUO!', { user1: currentUser.id, user2: user.id });
      
      // Crear o encontrar chat existente
      const chatId = await findOrCreateChat(currentUser.id, user.id);
      
      // Crear documento de match en Firestore
      const matchRef = doc(db, 'matches', chatId);
      await setDoc(matchRef, {
        users: [currentUser.id, user.id],
        timestamp: Date.now(),
        createdAt: serverTimestamp(),
        chatId: chatId
      });
      
      logger.match.success('Match creado en Firestore', { matchId: chatId });
      
      return true; // Hay match
    } else {
      // No hay match todavía, solo se guardó el like
      logger.match.info('Like guardado, esperando reciprocidad', { from: currentUser.id, to: user.id });
      return false; // No hay match
    }
  } catch (error) {
    logger.match.error('Error procesando like', error);
    return false;
  }
};
```

## 📊 Flujo Correcto de Matching

### Escenario 1: Usuario A da like a Usuario B (sin match previo)

1. Usuario A hace swipe derecha en Usuario B
2. Se guarda documento en `likes/A_B`
3. Se verifica si existe `likes/B_A` → **NO existe**
4. **Resultado:** Like guardado, NO hay match todavía
5. Usuario A continúa viendo perfiles

### Escenario 2: Usuario B da like a Usuario A (match mutuo)

1. Usuario B hace swipe derecha en Usuario A
2. Se guarda documento en `likes/B_A`
3. Se verifica si existe `likes/A_B` → **SÍ existe** ✅
4. **Resultado:** ¡MATCH! Se crea:
   - Documento en `matches/{chatId}`
   - Chat entre ambos usuarios
5. Ambos usuarios ven el modal de match

## 🗄️ Estructura de Firestore

### Colección `likes`

```
likes/
  ├── {userId1}_{userId2}/
  │   ├── fromUserId: string
  │   ├── toUserId: string
  │   ├── timestamp: number
  │   └── createdAt: Timestamp
  └── ...
```

### Colección `matches`

```
matches/
  ├── {chatId}/
  │   ├── users: [userId1, userId2]
  │   ├── timestamp: number
  │   ├── createdAt: Timestamp
  │   └── chatId: string
  └── ...
```

## 🔐 Reglas de Seguridad de Firestore

Asegúrate de tener estas reglas en `firestore.rules`:

```javascript
// Likes - solo el usuario puede crear su propio like
match /likes/{likeId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null && 
                   request.resource.data.fromUserId == request.auth.uid;
  allow delete: if request.auth != null && 
                   resource.data.fromUserId == request.auth.uid;
}

// Matches - ambos usuarios pueden leer
match /matches/{matchId} {
  allow read: if request.auth != null && 
                 request.auth.uid in resource.data.users;
  allow create: if request.auth != null && 
                   request.auth.uid in request.resource.data.users;
}
```

## 🧪 Testing

### Caso de Prueba 1: Like sin reciprocidad

1. Usuario A da like a Usuario B
2. Verificar en Firestore: existe `likes/A_B`
3. Verificar: NO aparece modal de match
4. Verificar: NO existe documento en `matches`

### Caso de Prueba 2: Match mutuo

1. Usuario A da like a Usuario B (paso anterior)
2. Usuario B da like a Usuario A
3. Verificar en Firestore: existe `likes/B_A`
4. Verificar: **SÍ aparece modal de match** para Usuario B
5. Verificar: existe documento en `matches/{chatId}`
6. Verificar: ambos usuarios pueden chatear

### Caso de Prueba 3: Like duplicado

1. Usuario A da like a Usuario B
2. Usuario A intenta dar like de nuevo a Usuario B
3. Verificar: se sobrescribe el documento (no hay duplicados)

## 📝 Archivos Modificados

- `cita-rd/App.tsx` - Función `handleLike` corregida
- Imports agregados: `setDoc`, `serverTimestamp`, `getFirestore`

## 🚀 Deploy

- Build: ✅ Exitoso
- Deploy: ✅ Exitoso
- URL: https://citard-fbc26.web.app

## ⚠️ Notas Importantes

1. **Código de testing eliminado:** El `Math.random() > 0.0` era para testing y quedó en producción
2. **Likes persistentes:** Los likes ahora se guardan en Firestore y persisten
3. **Match mutuo:** Solo hay match cuando AMBOS usuarios se dan like
4. **Sin mensaje automático:** Ya no se envía mensaje automático al hacer match
5. **Logs mejorados:** Se agregaron logs para debugging del flujo de matching

## 🔄 Próximos Pasos (Opcional)

1. **Notificaciones:** Enviar notificación push cuando hay match
2. **Límite de likes:** Implementar límite diario de likes (ej: 50 por día)
3. **Super Likes:** Implementar lógica especial para super likes
4. **Undo:** Permitir deshacer el último swipe
5. **Analytics:** Trackear tasa de match, likes dados/recibidos

## 📊 Métricas a Monitorear

- Tasa de match (matches / likes dados)
- Tiempo promedio hasta el primer match
- Likes dados por usuario por día
- Matches que resultan en conversación

---

**Fecha:** 11 de Febrero 2026  
**Prioridad:** Crítica (bug en producción)  
**Estado:** Resuelto ✅  
**Deploy:** https://citard-fbc26.web.app
