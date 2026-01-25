# 🔍 Diagnóstico: PhotoInfo no se guarda con fileId

**Fecha:** 25 de enero de 2026  
**Problema:** El `fileId` no se encuentra al intentar eliminar fotos

## 🐛 Síntoma

```
📋 photosInfo normalizado: [{…}]
⚠️ No se encontró fileId para esta URL
🗑️ Eliminando foto con fileId: no disponible
```

## 🔬 Logs Agregados

He agregado logs detallados en 3 puntos clave:

### 1. ImageKit Service (`imagekitService.ts`)
```typescript
console.log('🆔 File ID:', data.fileId);
```
**Verifica:** Que ImageKit está retornando el `fileId`

### 2. PhotoUploader Component (`PhotoUploader.tsx`)
```typescript
console.log('📝 JSON del objeto:', JSON.stringify(photosInfo[index], null, 2));
console.log('📝 Array completo:', JSON.stringify(photosInfo, null, 2));
```
**Verifica:** Que el objeto `PhotoInfo` se crea correctamente con `fileId`

### 3. Photo Upload Service (`photoUploadService.ts`)
```typescript
console.log('📤 Enviando a Firestore:');
console.log('   - images:', photoUrls);
console.log('   - photosInfo:', JSON.stringify(photosData, null, 2));
```
**Verifica:** Que los datos enviados a Firestore incluyen `fileId`

## 🧪 Pasos para Diagnosticar

1. **Reiniciar servidor** (ya hecho)
2. **Subir una foto nueva**
3. **Revisar logs en consola:**

### ✅ Lo que DEBES ver:

```
🆔 File ID: abc123xyz
📝 JSON del objeto: {
  "url": "https://ik.imagekit.io/...",
  "fileId": "abc123xyz",
  "isMain": true,
  "createdAt": 1769355496124,
  "analyzed": false
}
📤 Enviando a Firestore:
   - photosInfo: [
       {
         "url": "https://ik.imagekit.io/...",
         "fileId": "abc123xyz",
         "isMain": true,
         "createdAt": 1769355496124,
         "analyzed": false
       }
     ]
✅ Fotos del perfil actualizadas en Firestore
```

### ❌ Si NO ves el fileId:

**Posibles causas:**
1. ImageKit no está retornando `fileId` en la respuesta
2. El objeto se está serializando incorrectamente
3. Firestore está rechazando el campo `fileId`

## 🔍 Verificación en Firestore

Después de subir la foto:

1. Ir a Firebase Console
2. Firestore Database
3. Colección `perfiles`
4. Tu usuario
5. **Verificar campo `photosInfo`:**

### ✅ Correcto:
```javascript
photosInfo: [
  {
    url: "https://...",
    fileId: "abc123xyz",  // ← DEBE ESTAR AQUÍ
    isMain: true,
    createdAt: 1769355496124,
    analyzed: false
  }
]
```

### ❌ Incorrecto:
```javascript
photosInfo: [
  {
    url: "https://...",
    fileId: "",  // ← VACÍO
    isMain: true,
    createdAt: 1769355496124,
    analyzed: false
  }
]
```

O peor:
```javascript
photosInfo: ["https://..."]  // ← SOLO STRING
```

## 🎯 Próximos Pasos

1. Sube una foto nueva
2. Copia TODOS los logs de la consola
3. Verifica en Firestore Console el valor de `photosInfo`
4. Comparte los resultados

## 💡 Hipótesis

Sospecho que el problema puede ser uno de estos:

1. **ImageKit no retorna `fileId`** en la respuesta
   - Solución: Verificar respuesta de ImageKit

2. **Firestore serializa mal el objeto**
   - Solución: Usar `JSON.parse(JSON.stringify())` antes de guardar

3. **El campo se guarda pero se pierde al leer**
   - Solución: Verificar función `normalizePhotos()`

---

**Servidor reiniciado y listo para probar con logs detallados.**
