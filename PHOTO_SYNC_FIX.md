# 🔧 Fix: Sincronización de Fotos (images vs photosInfo)

**Fecha:** 25 de enero de 2026  
**Problema:** No se pueden agregar más de 2 fotos debido a desincronización entre `images` y `photosInfo`

---

## 🔍 Problema Identificado

### Síntoma
Al intentar subir una tercera foto, se sustituye la segunda en lugar de agregarse.

### Causa Raíz
**Desincronización entre dos arrays en Firestore:**

```javascript
// Estado en Firestore:
{
  images: [
    'https://firebasestorage.googleapis.com/...',  // Foto 1 (Firebase Storage)
    'https://ik.imagekit.io/tapapati/...'          // Foto 2 (ImageKit)
  ],
  photosInfo: [
    { url: 'https://firebasestorage.googleapis.com/...', fileId: '', ... }  // Solo Foto 1
    // ❌ Falta Foto 2
  ]
}
```

**Resultado:**
- `images` tiene 2 fotos ✅
- `photosInfo` tiene 1 foto ❌
- Código lee `photosInfo` (1 foto) → Agrega nueva foto → Total: 2 fotos en lugar de 3

### ¿Por Qué Pasó Esto?

En algún momento anterior, una foto se guardó en `images` pero no en `photosInfo`. Esto puede pasar si:
1. Se usó código antiguo que solo guardaba en `images`
2. Hubo un error al guardar `photosInfo`
3. Se editó manualmente en Firestore Console

---

## ✅ Solución Implementada

### Detección Automática de Desincronización

El código ahora detecta cuando `images` y `photosInfo` tienen diferente longitud:

```typescript
if (hasPhotosInfo && hasImages && data.photosInfo.length !== data.images.length) {
  console.warn('⚠️ DESINCRONIZACIÓN DETECTADA');
  // Sincronizar automáticamente...
}
```

### Sincronización Automática

Cuando detecta desincronización, usa `images` como "fuente de verdad" y reconstruye `photosInfo`:

```typescript
// 1. Crear mapa de photosInfo existente (por URL)
const photosInfoMap = new Map(data.photosInfo.map(p => [p.url, p]));

// 2. Para cada URL en images:
photosInfo = imagesArray.map(url => {
  // Si existe en photosInfo, usar ese objeto (tiene fileId)
  if (photosInfoMap.has(url)) {
    return photosInfoMap.get(url);
  }
  // Si no existe, crear PhotoInfo nuevo (foto antigua sin fileId)
  return {
    url,
    fileId: '',
    isMain: false,
    createdAt: Date.now(),
    analyzed: false
  };
});
```

### Resultado

Ahora cuando subes una foto:
1. ✅ Detecta que `images` tiene 2 fotos pero `photosInfo` solo 1
2. ✅ Sincroniza automáticamente: crea `photosInfo` para la foto faltante
3. ✅ Agrega la nueva foto al array sincronizado
4. ✅ Guarda correctamente: 3 fotos en ambos arrays

---

## 🧪 Logs Esperados

### Antes del Fix
```
📊 Datos de Firestore:
   - photosInfo: [{…}]
   - images: (2) [...]
   ✅ Usando photosInfo de Firestore: 1 fotos  ← PROBLEMA
   
📝 ANTES de agregar:
   - Fotos existentes: 1  ← Solo ve 1 cuando hay 2
```

### Después del Fix
```
📊 Datos de Firestore:
   - photosInfo: [{…}]
   - images: (2) [...]
   ⚠️ DESINCRONIZACIÓN DETECTADA:
   - photosInfo tiene 1 elementos
   - images tiene 2 elementos
   - Sincronizando usando images como fuente de verdad...
   ✅ Sincronizado: 2 fotos  ← CORREGIDO
   
📝 ANTES de agregar:
   - Fotos existentes: 2  ← Ahora ve las 2 fotos correctamente
```

---

## 🎯 Beneficios

1. **Auto-reparación:** Detecta y corrige desincronización automáticamente
2. **Sin pérdida de datos:** Preserva fotos existentes en `images`
3. **Preserva fileId:** Mantiene `fileId` de fotos que lo tienen
4. **Compatibilidad:** Funciona con fotos antiguas (Firebase Storage) y nuevas (ImageKit)

---

## 📋 Casos de Uso

### Caso 1: Fotos Sincronizadas (Normal)
```javascript
images: [url1, url2]
photosInfo: [info1, info2]
// ✅ No hace nada, usa photosInfo directamente
```

### Caso 2: Desincronización (Tu Caso)
```javascript
images: [url1, url2]
photosInfo: [info1]
// ⚠️ Detecta desincronización
// ✅ Sincroniza: photosInfo = [info1, {url: url2, fileId: '', ...}]
```

### Caso 3: Solo images (Migración)
```javascript
images: [url1, url2]
photosInfo: undefined
// ⚠️ Normaliza: photosInfo = [{url: url1, ...}, {url: url2, ...}]
```

### Caso 4: Solo photosInfo (Ideal)
```javascript
images: undefined
photosInfo: [info1, info2]
// ✅ Usa photosInfo directamente
```

---

## 🔄 Próximos Pasos

1. **Reiniciar servidor:**
   ```bash
   cd cita-rd
   npm run dev
   ```

2. **Probar subir tercera foto:**
   - Deberías ver el log "⚠️ DESINCRONIZACIÓN DETECTADA"
   - Luego "✅ Sincronizado: 2 fotos"
   - La tercera foto se agregará correctamente

3. **Verificar resultado:**
   - Deberías tener 3 fotos en el grid
   - Todas las fotos se mantienen después de recargar

---

## 🚀 Mejora Futura

Para evitar desincronización en el futuro, considera:

1. **Usar solo `photosInfo`:** Deprecar `images` y usar solo `photosInfo`
2. **Migración de datos:** Script para sincronizar todos los perfiles existentes
3. **Validación en Cloud Functions:** Trigger que valide sincronización al guardar

---

## 📝 Archivos Modificados

- `cita-rd/components/PhotoUploader.tsx` - Agregada lógica de sincronización automática
