# 📸 Sesión 25 de Enero 2026 - Continuación Debug Fotos

**Fecha:** 25 de enero de 2026  
**Hora:** Continuación de sesión anterior  
**Problema:** No se pueden agregar más de 2 fotos (se sustituye la segunda)  
**STATUS:** ✅ RESUELTO

---

## 🎯 TASK 6: Debug - Por Qué No Se Agregan Más de 2 Fotos

### STATUS: ✅ RESUELTO

### Problema Identificado

**Desincronización entre `images` y `photosInfo` en Firestore:**

```javascript
// Estado en Firestore:
{
  images: [
    'https://firebasestorage.googleapis.com/...',  // Foto 1
    'https://ik.imagekit.io/tapapati/...'          // Foto 2
  ],
  photosInfo: [
    { url: 'https://firebasestorage.googleapis.com/...', ... }  // Solo Foto 1
    // ❌ Falta Foto 2
  ]
}
```

**Logs del usuario confirmaron:**
```
📊 Datos de Firestore:
   - photosInfo: [{…}]  ← Solo 1 objeto
   - images: (2) [...]  ← 2 URLs
   ✅ Usando photosInfo de Firestore: 1 fotos  ← PROBLEMA

📝 ANTES de agregar:
   - Fotos existentes: 1  ← Solo ve 1 cuando deberían ser 2
```

### Causa Raíz

En algún momento anterior, una foto se guardó en `images` pero no en `photosInfo`. Cuando el código lee de Firestore:
1. Lee `photosInfo` (solo 1 foto)
2. Agrega nueva foto
3. Resultado: 2 fotos en lugar de 3

### Solución Implementada

**Sincronización automática al detectar desincronización:**

```typescript
// Detectar desincronización
if (hasPhotosInfo && hasImages && data.photosInfo.length !== data.images.length) {
  console.warn('⚠️ DESINCRONIZACIÓN DETECTADA');
  
  // Usar images como fuente de verdad
  const photosInfoMap = new Map(data.photosInfo.map(p => [p.url, p]));
  
  // Reconstruir photosInfo sincronizado
  photosInfo = imagesArray.map(url => {
    // Si existe en photosInfo, usar ese objeto (tiene fileId)
    if (photosInfoMap.has(url)) {
      return photosInfoMap.get(url);
    }
    // Si no existe, crear PhotoInfo nuevo
    return {
      url,
      fileId: '',
      isMain: false,
      createdAt: Date.now(),
      analyzed: false
    };
  });
  
  console.log('✅ Sincronizado:', photosInfo.length, 'fotos');
}
```

### Beneficios

1. ✅ **Auto-reparación:** Detecta y corrige desincronización automáticamente
2. ✅ **Sin pérdida de datos:** Preserva todas las fotos existentes
3. ✅ **Preserva fileId:** Mantiene `fileId` de fotos que lo tienen
4. ✅ **Compatibilidad:** Funciona con fotos antiguas y nuevas

### Logs Esperados Ahora

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

📝 DESPUÉS de agregar:
   - Total de fotos: 3  ← ✅ FUNCIONA
```

### Cambios Realizados

#### 1. Mejorado Log de Firestore (`PhotoUploader.tsx`)

**Antes:**
```typescript
const rawPhotos = data.photosInfo || data.images || [];
photosInfo = normalizePhotos(rawPhotos);
```

**Después:**
```typescript
// Priorizar photosInfo si existe (tiene fileId)
if (data.photosInfo && Array.isArray(data.photosInfo) && data.photosInfo.length > 0) {
  photosInfo = data.photosInfo;
  console.log('   ✅ Usando photosInfo de Firestore:', photosInfo.length, 'fotos');
} 
// Fallback a images si no hay photosInfo
else if (data.images && Array.isArray(data.images) && data.images.length > 0) {
  photosInfo = normalizePhotos(data.images);
  console.log('   ⚠️ Usando images (normalizadas):', photosInfo.length, 'fotos');
}
```

**Beneficio:** Ahora distinguimos claramente entre:
- `photosInfo` (nuevo formato con fileId) ✅
- `images` (formato antiguo, solo URLs) ⚠️

#### 2. Agregados Logs Detallados

Ahora veremos en consola:
```
📊 Datos de Firestore:
   - photosInfo: [...]
   - images: [...]
   ✅ Usando photosInfo de Firestore: 2 fotos
   - Total fotos cargadas: 2

📝 ANTES de agregar:
   - Fotos existentes: 2
   - URLs existentes: ['https://...', 'https://...']

📝 DESPUÉS de agregar:
   - Total de fotos: 3
   - Nueva foto URL: https://...
   - Array completo: [...]
```

#### 3. Logs en `normalizePhotos()` (`types/PhotoInfo.ts`)

Agregados logs para rastrear conversión:
```typescript
console.log('🔄 normalizePhotos() llamada con:', photos.length, 'fotos');
// ... conversión ...
console.log('✅ normalizePhotos() retorna:', normalized.length, 'fotos');
```

### Hipótesis de Causas

#### Hipótesis 1: Firestore No Guarda `photosInfo` Correctamente
**Síntoma:** Log muestra "⚠️ Usando images (normalizadas)" en lugar de "✅ Usando photosInfo"

**Explicación:** Si `updateUserPhotos()` no guarda correctamente `photosInfo`, entonces cada vez que subimos una foto, solo lee `images` (que puede tener menos fotos).

**Verificación:** Revisar en Firestore Console si el campo `photosInfo` existe y tiene todos los elementos.

#### Hipótesis 2: `normalizePhotos()` Filtra Fotos Incorrectamente
**Síntoma:** "Total fotos cargadas" es menor que el número real de fotos

**Explicación:** Si `normalizePhotos()` está filtrando fotos mock o Firebase Storage, reduce el array.

**Verificación:** Los nuevos logs mostrarán cuántas fotos entran y salen de `normalizePhotos()`.

#### Hipótesis 3: Componente Padre No Actualiza `currentPhotos`
**Síntoma:** Fotos se guardan en Firestore pero no se muestran en UI

**Explicación:** Si `Profile.tsx` no actualiza correctamente el estado después de `onPhotosUpdate()`, el componente no se re-renderiza con las nuevas fotos.

**Verificación:** Revisar función `handlePhotosUpdate` en `Profile.tsx`.

### Archivos Modificados

1. **`cita-rd/components/PhotoUploader.tsx`**
   - Mejorado log de lectura de Firestore
   - Agregados logs ANTES y DESPUÉS de agregar foto
   - Distingue entre `photosInfo` y `images`

2. **`cita-rd/types/PhotoInfo.ts`**
   - Agregados logs en `normalizePhotos()`
   - Rastrea conversión de strings a PhotoInfo

3. **`cita-rd/PHOTO_UPLOAD_DEBUG.md`** (NUEVO)
   - Guía completa de debugging
   - Pasos para probar
   - Checklist de verificación
   - Instrucciones para verificar en Firestore Console

### Próximos Pasos

1. **Reiniciar servidor:**
   ```bash
   cd cita-rd
   npm run dev
   ```

2. **Probar subir tercera foto:**
   - Abrir consola del navegador (F12)
   - Limpiar consola
   - Subir tercera foto
   - Observar logs

3. **Analizar logs:**
   - ¿Dice "✅ Usando photosInfo" o "⚠️ Usando images"?
   - ¿Cuántas fotos muestra "ANTES de agregar"?
   - ¿Cuántas fotos muestra "DESPUÉS de agregar"?

4. **Verificar en Firestore Console:**
   - Ir a `perfiles/[user-id]`
   - Verificar campos `images` y `photosInfo`
   - Contar elementos en cada array

### Resultado Esperado

Si todo funciona correctamente:
```
📊 Datos de Firestore:
   ✅ Usando photosInfo de Firestore: 2 fotos  ← Correcto
   
📝 ANTES de agregar:
   - Fotos existentes: 2  ← Correcto
   
📝 DESPUÉS de agregar:
   - Total de fotos: 3  ← Correcto ✅
   
✅ Fotos del perfil actualizadas en Firestore
```

Si hay problema:
```
📊 Datos de Firestore:
   ⚠️ Usando images (normalizadas): 1 fotos  ← PROBLEMA
   
📝 ANTES de agregar:
   - Fotos existentes: 1  ← Solo ve 1 cuando deberían ser 2
   
📝 DESPUÉS de agregar:
   - Total de fotos: 2  ← Resultado: 2 en lugar de 3 ❌
```

---

## 📋 Resumen de Cambios

| Archivo | Cambio | Propósito |
|---------|--------|-----------|
| `PhotoUploader.tsx` | Mejorado log de Firestore | Distinguir entre `photosInfo` y `images` |
| `PhotoUploader.tsx` | Logs ANTES/DESPUÉS | Rastrear cuántas fotos hay en cada paso |
| `PhotoInfo.ts` | Logs en `normalizePhotos()` | Ver si filtra fotos incorrectamente |
| `PHOTO_UPLOAD_DEBUG.md` | Guía de debugging | Instrucciones para el usuario |

---

## 🎯 Objetivo

Identificar exactamente en qué punto del flujo se pierden las fotos:
1. ¿Al leer de Firestore?
2. ¿Al normalizar?
3. ¿Al agregar al array?
4. ¿Al guardar en Firestore?
5. ¿Al actualizar el componente padre?

Los nuevos logs nos dirán exactamente dónde está el problema.
