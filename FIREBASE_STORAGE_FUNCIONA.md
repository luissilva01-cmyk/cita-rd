# ✅ Firebase Storage FUNCIONA - Diagnóstico de Visualización

**Fecha:** 21 de enero de 2026  
**Estado:** Las fotos se suben correctamente, pero no se visualizan en la app

## 🎯 Problema Actual

Las fotos se están subiendo exitosamente a Firebase Storage:
- ✅ Bucket: `gs://citard-fbc26.appspot.com/profile-photos/`
- ✅ 2 fotos subidas: `je1H4wssPlgxtDyHKZpkXNMOGY32_0_1768750621465.jpg` y `je1H4wssPlgxtDyHKZpkXNMOGY32_0_1768750820449.jpg`
- ✅ Tamaño: 76.7 KB cada una

**PERO:** Las fotos no se muestran en la interfaz de la app.

## 🔍 Diagnóstico

### Flujo de Subida (FUNCIONA ✅)
1. Usuario selecciona foto en `PhotoUploader.tsx`
2. Foto se redimensiona con `resizeImage()`
3. Foto se sube a Firebase Storage con `uploadPhoto()`
4. Se obtiene la URL de descarga
5. Se llama a `updateUserPhotos()` para guardar en Firestore

### Posibles Causas del Problema de Visualización

#### 1. **Las URLs no se guardan en Firestore** ❓
- El código llama a `updateUserPhotos()` que hace `updateDoc()` en `perfiles/[userId]`
- Actualiza el campo `images` con el array de URLs
- **VERIFICAR:** ¿Las URLs están en Firestore Console?

#### 2. **El componente no se actualiza** ❓
- `Profile.tsx` recibe `user` como prop
- Cuando se suben fotos, actualiza `editedUser` y llama a `onUpdate()`
- **VERIFICAR:** ¿El componente padre actualiza el estado correctamente?

#### 3. **Problema de permisos de lectura** ❓
- Las fotos se suben (write funciona)
- Pero tal vez no se pueden leer (read falla)
- **VERIFICAR:** `storage.rules` permite lectura pública

## 📋 Pasos para Verificar

### Paso 1: Verificar Firestore Console
1. Ir a Firebase Console → Firestore Database
2. Buscar colección `perfiles`
3. Buscar documento con ID: `je1H4wssPlgxtDyHKZpkXNMOGY32`
4. **Verificar que el campo `images` contiene las URLs:**
   ```
   images: [
     "https://firebasestorage.googleapis.com/v0/b/citard-fbc26.appspot.com/o/profile-photos%2Fje1H4wssPlgxtDyHKZpkXNMOGY32_0_1768750621465.jpg?alt=media&token=...",
     ...
   ]
   ```

### Paso 2: Verificar Consola del Navegador
Cuando subes una foto, deberías ver estos logs en orden:
```
🔄 Redimensionando imagen...
📤 Subiendo foto...
📸 Subiendo foto a Firebase Storage: je1H4wssPlgxtDyHKZpkXNMOGY32_0_[timestamp].jpg
✅ Foto subida exitosamente a Firebase
🔗 URL obtenida: https://firebasestorage.googleapis.com/...
✅ Fotos del perfil actualizadas
✅ Foto subida y perfil actualizado
```

**Si falta el log "✅ Fotos del perfil actualizadas"**, el problema está en `updateUserPhotos()`.

### Paso 3: Verificar Storage Rules
Archivo: `cita-rd/storage.rules`

Debe permitir lectura pública:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{fileName} {
      allow read: if true;  // ← Lectura pública
      allow write: if request.auth != null;
    }
  }
}
```

### Paso 4: Verificar que el Componente se Actualiza
En `Profile.tsx`, cuando se llama a `handlePhotosUpdate()`:
1. Actualiza `editedUser` con las nuevas fotos
2. Llama a `onUpdate(updatedUser)` para notificar al padre
3. El padre debe actualizar su estado y pasar el nuevo `user` como prop

**VERIFICAR:** ¿El componente padre (`App.tsx` o similar) actualiza correctamente el estado del usuario?

## 🔧 Solución Propuesta

### Opción 1: Verificar y Corregir Firestore
Si las URLs NO están en Firestore:
- El problema está en `updateUserPhotos()`
- Revisar permisos de Firestore en `firestore.rules`

### Opción 2: Forzar Recarga del Perfil
Si las URLs SÍ están en Firestore pero no se muestran:
- El problema está en la actualización del estado
- Agregar un `useEffect` en `Profile.tsx` para recargar cuando cambien las fotos

### Opción 3: Verificar Storage Rules
Si las URLs están en Firestore pero las imágenes no cargan:
- El problema son los permisos de lectura
- Actualizar `storage.rules` para permitir lectura pública

## 🎯 Próximos Pasos

1. **Usuario debe verificar Firestore Console:**
   - ¿El campo `images` tiene las URLs?
   - Si SÍ → Problema de visualización/permisos
   - Si NO → Problema de guardado

2. **Verificar logs en consola del navegador:**
   - ¿Aparece "✅ Fotos del perfil actualizadas"?
   - Si SÍ → Problema de actualización del componente
   - Si NO → Problema en `updateUserPhotos()`

3. **Probar URL directamente:**
   - Copiar una URL de Storage Console
   - Pegarla en el navegador
   - Si carga → Permisos OK
   - Si no carga → Problema de Storage Rules

## 📝 Notas

- Cloudinary está deshabilitado (errores 401)
- Firebase Storage es la solución actual
- Las fotos se suben correctamente (confirmado en Storage Console)
- El problema está en la visualización, no en la subida
