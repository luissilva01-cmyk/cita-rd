# Fix LikesReceived - Usuario no desaparece después de match/pass
**Fecha:** 09 de Marzo 2026  
**Estado:** ✅ RESUELTO

## Problema Reportado
El usuario reportó que en la pantalla "Te Gustaron", después de hacer click en el corazón (match) o la X (pass), el usuario no desaparecía de la lista y el contador seguía mostrando "1 persona le gusta tu perfil".

## Diagnóstico
1. **Problema en LikesReceived.tsx**: Los usuarios no se eliminaban del array local después de like/pass
2. **Problema en handleLike**: Error de permisos al intentar eliminar likes de Firestore
3. **Problema en reglas de Firestore**: 
   - Colección `likes`: No permitía eliminar likes recibidos
   - Colección `matches`: Tenía `allow create: if false`

## Solución Implementada

### 1. Fix en LikesReceived.tsx
```typescript
const handleLike = async () => {
  // ... lógica existente ...
  
  // Remover el like actual del array
  const updatedLikes = likes.filter((_, index) => index !== selectedIndex);
  setLikes(updatedLikes);

  // Si no hay más likes, volver
  if (updatedLikes.length === 0) {
    onBack();
  }
  // Manejar índices correctamente
  else if (selectedIndex >= updatedLikes.length) {
    setSelectedIndex(updatedLikes.length - 1);
  }
};
```

### 2. Fix en App.tsx - handleLike
```typescript
// Eliminar el like recibido (reverseLikeRef) ya que se convirtió en match
try {
  await deleteDoc(reverseLikeRef);
  logger.match.info('Like recibido eliminado después del match');
} catch (deleteError) {
  logger.match.warn('No se pudo eliminar el like recibido, pero el match se creó correctamente');
}
```

### 3. Fix en firestore.rules
```javascript
// Colección: likes
allow delete: if isAuthenticated() && 
              (resource.data.fromUserId == request.auth.uid || 
               resource.data.toUserId == request.auth.uid);

// Colección: matches  
allow create: if isAuthenticated() && 
              request.auth.uid in request.resource.data.users &&
              request.resource.data.users is list &&
              request.resource.data.users.size() == 2;
```

### 4. Fix en Home.tsx - Listener en tiempo real
```typescript
// Listener en tiempo real para actualizar el contador
const unsubscribe = listenToReceivedLikes(currentUser.id, (likes) => {
  setLikesCount(likes.length);
});
```

## Archivos Modificados
- `cita-rd/views/views/LikesReceived.tsx`
- `cita-rd/App.tsx`
- `cita-rd/views/views/Home.tsx`
- `cita-rd/firestore.rules`

## Resultado
✅ Los usuarios desaparecen inmediatamente después de like/pass  
✅ El contador "Te Gustaron" se actualiza en tiempo real  
✅ Los matches se crean correctamente sin errores de permisos  
✅ La navegación funciona correctamente cuando no quedan más likes  

## Deploy
- Build: ✅ Exitoso
- Hosting: ✅ Desplegado
- Firestore Rules: ✅ Desplegadas
- URL: https://citard-fbc26.web.app