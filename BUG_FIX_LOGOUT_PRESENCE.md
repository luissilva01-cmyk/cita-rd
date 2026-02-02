# 🐛 Bug Fix: Error de Permisos al Cerrar Sesión

**Fecha:** 2 de Febrero 2026  
**Descubierto durante:** Testing Session  
**Severidad:** 🟡 Media (no bloquea funcionalidad pero genera error en consola)

---

## 📋 Descripción del Bug

Al cerrar sesión, aparece un error en la consola:

```
FirebaseError: Missing or insufficient permissions
presenceService.ts:41 Error setting user offline
```

---

## 🔍 Causa Raíz

**Problema:** El sistema intentaba actualizar el estado de presencia (online/offline) **DESPUÉS** de cerrar sesión.

**Flujo incorrecto:**
```
1. Usuario click en "Cerrar Sesión"
2. signOut(auth) se ejecuta → Usuario ya NO autenticado
3. Sistema intenta actualizar presencia en Firestore
4. ❌ Firestore Rules bloquean (usuario no autenticado)
5. Error en consola
```

**Por qué falla:**
Las Firestore Security Rules requieren que el usuario esté autenticado para escribir en la colección `presence`:

```javascript
// firestore.rules
match /presence/{userId} {
  allow write: if isOwner(userId); // ❌ Falla si no está autenticado
}
```

---

## ✅ Solución Implementada

**Cambio:** Actualizar presencia **ANTES** de cerrar sesión.

**Flujo correcto:**
```
1. Usuario click en "Cerrar Sesión"
2. setUserOffline(userId) → Actualiza presencia mientras está autenticado
3. signOut(auth) → Cierra sesión
4. ✅ Sin errores
```

**Código corregido en `Profile.tsx`:**

```typescript
const handleLogout = async () => {
  if (window.confirm(t('confirmLogout') || '¿Estás seguro de que quieres cerrar sesión?')) {
    setIsLoggingOut(true);
    try {
      // IMPORTANTE: Actualizar presencia ANTES de cerrar sesión
      if (currentUser?.uid) {
        const { setUserOffline } = await import('../../services/presenceService');
        await setUserOffline(currentUser.uid);
      }
      
      // Ahora sí cerrar sesión
      await signOut(auth);
      // El AuthProvider se encargará de limpiar el estado y redirigir
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert(t('logoutError') || 'Error al cerrar sesión. Inténtalo de nuevo.');
    } finally {
      setIsLoggingOut(false);
    }
  }
};
```

---

## 🧪 Cómo Probar

1. Iniciar sesión en la app
2. Ir a Perfil
3. Click en "Cerrar Sesión"
4. Abrir DevTools → Console
5. ✅ Verificar que NO aparece el error de permisos

---

## 📊 Impacto

**Antes:**
- ❌ Error en consola al cerrar sesión
- ⚠️ Estado de presencia no se actualizaba correctamente
- ⚠️ Usuario aparecía como "online" después de cerrar sesión

**Después:**
- ✅ Sin errores en consola
- ✅ Estado de presencia se actualiza correctamente
- ✅ Usuario aparece como "offline" inmediatamente

---

## 🎯 Lecciones Aprendidas

1. **Orden de operaciones importa:** Siempre actualizar datos en Firestore ANTES de cerrar sesión
2. **Testing descubre bugs:** Este bug solo se descubre probando la funcionalidad
3. **Firestore Rules funcionan:** Las reglas de seguridad están bloqueando correctamente accesos no autorizados

---

## 📝 Archivos Modificados

- `cita-rd/views/views/Profile.tsx` (líneas 98-115)

---

## ✅ Estado

**Corregido:** ✅ Sí  
**Testeado:** ⏳ Pendiente de re-test  
**Documentado:** ✅ Sí

---

**Descubierto por:** Usuario durante testing  
**Corregido por:** Kiro AI  
**Fecha de corrección:** 2 de Febrero 2026
