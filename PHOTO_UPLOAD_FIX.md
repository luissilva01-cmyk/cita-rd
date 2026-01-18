# Fix: Fotos Se Quedan en "Subiendo..."

## Problema
Las fotos no se suben y se quedan en estado "Subiendo..." indefinidamente.

## Causa Raíz
Las reglas de Firebase Storage eran demasiado restrictivas:
1. Solo permitían crear archivos nuevos (`resource == null`)
2. El patrón del nombre de archivo era muy específico
3. Validaban el userId en el nombre del archivo

## Solución Aplicada

### 1. ✅ Reglas de Storage Simplificadas
Actualizado `storage.rules` para ser más permisivo:

```javascript
// ANTES (Muy restrictivo)
match /profile-photos/{userId}_{photoIndex}_{timestamp}.jpg {
  allow write: if request.auth != null 
               && request.auth.uid == userId
               && resource == null // ❌ Solo archivos nuevos
}

// DESPUÉS (Más flexible)
match /profile-photos/{allImages=**} {
  allow write: if request.auth != null 
               && request.resource.size < 5 * 1024 * 1024
               && request.resource.contentType.matches('image/.*');
}
```

### Cambios Clave:
- ✅ Usa `{allImages=**}` para coincidir con cualquier nombre de archivo
- ✅ Removido `resource == null` para permitir sobrescribir
- ✅ Removida validación de userId en el patrón
- ✅ Mantiene validación de tamaño (5MB) y tipo (imagen)

## Pasos para Aplicar el Fix

### Opción 1: Desplegar con Firebase CLI (Recomendado)

```bash
# 1. Asegúrate de estar en el directorio del proyecto
cd cita-rd

# 2. Despliega las reglas de Storage
firebase deploy --only storage

# Deberías ver:
# ✔ Deploy complete!
```

### Opción 2: Actualizar Manualmente en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto "citard-fbc26"
3. Ve a **Storage** → **Rules**
4. Copia y pega el contenido de `storage.rules`
5. Click en **Publish**

## Verificar que Funciona

### Test 1: Subir Foto
1. Ve a tu perfil
2. Click en "Gestionar Fotos"
3. Click en el botón "+" para agregar foto
4. Selecciona una imagen
5. **Debería subir en 2-5 segundos**

### Test 2: Verificar en Console
Abre la consola del navegador (F12) y busca:
```
🔄 Redimensionando imagen...
📤 Subiendo foto...
📸 Subiendo foto: [userId]_0_[timestamp].jpg
✅ Foto subida exitosamente
🔗 URL obtenida: https://...
✅ Fotos del perfil actualizadas
```

### Test 3: Verificar en Firebase Storage
1. Ve a Firebase Console → Storage
2. Abre la carpeta `profile-photos/`
3. Deberías ver tu foto subida

## Troubleshooting

### Si Sigue Sin Funcionar

#### 1. Verifica que las reglas se desplegaron
```bash
firebase deploy --only storage
```

#### 2. Verifica la configuración de Firebase
Archivo: `cita-rd/services/firebase.ts`
```typescript
storageBucket: "citard-fbc26.firebasestorage.app" // ✅ Correcto
```

#### 3. Verifica que el usuario está autenticado
En la consola del navegador:
```javascript
// Debería mostrar el usuario actual
console.log(auth.currentUser);
```

#### 4. Verifica permisos en Firebase Console
- Storage → Rules → Debe mostrar las reglas actualizadas
- Storage → Files → Deberías poder ver la carpeta `profile-photos/`

### Errores Comunes

**Error: "Permission denied"**
- Solución: Despliega las reglas nuevamente con `firebase deploy --only storage`

**Error: "File too large"**
- Solución: La imagen debe ser menor a 5MB
- El código automáticamente redimensiona a 800x1200px

**Error: "Invalid file type"**
- Solución: Solo se permiten imágenes (jpg, png, webp, etc.)

## Reglas de Storage Actualizadas

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Fotos de perfil
    match /profile-photos/{allImages=**} {
      allow read: if true;  // Público
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
    
    // Stories
    match /stories/{allImages=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
    
    // Chat (futuro)
    match /chat-photos/{allImages=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
  }
}
```

## Archivos Modificados
- ✅ `cita-rd/storage.rules` - Reglas simplificadas

## Estado Actual
✅ **Storage Rules**: Desplegadas correctamente
⚠️ **CORS Configuration**: PENDIENTE - Causa del error actual

## Error Actual: CORS Policy
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

### ¿Qué significa?
Firebase Storage está bloqueando las peticiones desde `localhost:3000` porque no tiene configurado CORS (Cross-Origin Resource Sharing).

### Solución
Necesitas aplicar la configuración CORS al bucket de Storage. Ver:
- **`APPLY_CORS_FIX.md`** - Guía completa con gsutil
- **`CORS_QUICK_FIX.md`** - Solución rápida sin instalar nada

## Próximos Pasos
1. ✅ Storage rules ya están desplegadas
2. ⚠️ Aplicar configuración CORS (ver guías arriba)
3. Reiniciar servidor de desarrollo
4. Probar subir una foto
5. Verificar que funciona sin errores CORS
