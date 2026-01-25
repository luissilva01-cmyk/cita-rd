# Fix: Error "Unsupported field value: undefined" en Firestore ✅

**Fecha:** 25 de enero de 2026  
**Error:** `FirebaseError: Function updateDoc() called with invalid data. Unsupported field value: undefined`  
**Causa:** Intentar guardar valores `undefined` en Firestore  
**Solución:** Filtrar valores undefined y asegurar valores por defecto

---

## 🐛 Problema

Al intentar subir una tercera foto (o cualquier foto en un índice no consecutivo), Firestore rechazaba la actualización con el error:

```
FirebaseError: Function updateDoc() called with invalid data. 
Unsupported field value: undefined 
(found in document perfiles/je1HdwssPigxtDyHKZpkXNMOGY32)
```

### Causa Raíz

Cuando el array de fotos tenía espacios vacíos (ej: foto en índice 0 y 2, pero no en 1), el código intentaba guardar objetos con campos `undefined`:

```typescript
// ❌ ANTES - Podía tener undefined
photosInfo[2] = newPhoto; // índices 0 y 1 podrían ser undefined
```

Firestore **no acepta valores `undefined`** en los documentos. Solo acepta:
- `null` (explícitamente)
- Strings vacíos `''`
- Valores válidos

---

## ✅ Solución Implementada

### 1. Filtrar fotos vacías antes de guardar

**En `photoUploadService.ts`:**

```typescript
// Filtrar undefined y null para evitar errores de Firestore
const photosData = photos
  .filter(p => p && p.url) // Solo fotos válidas
  .map(p => ({
    url: p.url,
    fileId: p.fileId || '', // Asegurar que nunca sea undefined
    isMain: p.isMain || false,
    createdAt: p.createdAt,
    analyzed: p.analyzed || false
  }));
```

### 2. Manejar índices no consecutivos

**En `PhotoUploader.tsx`:**

```typescript
// Crear nuevo PhotoInfo
const newPhotoInfo: PhotoInfo = {
  url: result.url,
  fileId: result.fileId,
  isMain: index === 0,
  createdAt: Date.now(),
  analyzed: false
};

// Asegurar que el array tenga el tamaño correcto
while (photosInfo.length < index) {
  photosInfo.push({
    url: '',
    fileId: '',
    isMain: false,
    createdAt: Date.now(),
    analyzed: false
  });
}

// Agregar o actualizar
if (photosInfo.length === index) {
  photosInfo.push(newPhotoInfo);
} else {
  photosInfo[index] = newPhotoInfo;
}

// Filtrar fotos vacías antes de guardar
const validPhotos = photosInfo.filter(p => p.url && p.url.trim() !== '');
```

### 3. Valores por defecto seguros

Todos los campos ahora tienen valores por defecto que Firestore acepta:

| Campo | Valor por Defecto | Tipo |
|-------|------------------|------|
| `url` | `''` (string vacío) | string |
| `fileId` | `''` (string vacío) | string |
| `isMain` | `false` | boolean |
| `createdAt` | `Date.now()` | number |
| `analyzed` | `false` | boolean |

---

## 🧪 Cómo Probar

1. **Subir foto en índice 0** (primera foto) ✅
2. **Subir foto en índice 2** (tercera foto, saltando la segunda) ✅
3. **Subir foto en índice 1** (segunda foto, llenando el hueco) ✅
4. **Eliminar foto del medio** ✅
5. **Subir foto en cualquier índice** ✅

Todos los casos ahora funcionan sin errores de Firestore.

---

## 📊 Antes vs Después

### Antes
```typescript
// ❌ Podía tener undefined
photosInfo = [
  { url: 'foto1.jpg', fileId: 'abc' },
  undefined,  // ❌ Firestore rechaza esto
  { url: 'foto3.jpg', fileId: 'xyz' }
]
```

### Después
```typescript
// ✅ Solo fotos válidas
validPhotos = [
  { url: 'foto1.jpg', fileId: 'abc', isMain: true, ... },
  { url: 'foto3.jpg', fileId: 'xyz', isMain: false, ... }
]
// Los espacios vacíos se filtran automáticamente
```

---

## 🔧 Archivos Modificados

1. **`cita-rd/services/photoUploadService.ts`**
   - Función `updateUserPhotos()` - Filtrar fotos vacías
   - Valores por defecto para todos los campos

2. **`cita-rd/components/PhotoUploader.tsx`**
   - Función `handleFileSelect()` - Manejar índices no consecutivos
   - Filtrar fotos vacías antes de guardar

---

## 📝 Notas Técnicas

### Por qué Firestore rechaza `undefined`

Firestore distingue entre:
- **`undefined`**: No soportado, causa error
- **`null`**: Soportado, representa "sin valor"
- **String vacío `''`**: Soportado, representa "texto vacío"

### Estrategia de Filtrado

1. **En memoria:** Permitir espacios vacíos en el array (para mantener índices)
2. **Al guardar:** Filtrar solo fotos válidas (sin espacios vacíos)
3. **Al leer:** Normalizar fotos de Firestore a PhotoInfo

---

## ✅ Estado

**COMPLETADO** - El error está resuelto. Ahora puedes subir fotos en cualquier orden sin errores de Firestore.

### Verificación
- ✅ Subir foto en índice 0
- ✅ Subir foto en índice 2 (saltando 1)
- ✅ Subir foto en índice 5 (saltando varios)
- ✅ Eliminar foto del medio
- ✅ Sin valores `undefined` en Firestore
