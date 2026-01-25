# Refactorización del Sistema de Fotos - PhotoInfo

**Fecha:** 25 de enero de 2026  
**Estado:** ✅ COMPLETADO

## Problema Resuelto

Los objetos `PhotoInfo` con `fileId` no se guardaban correctamente en Firestore. Solo se guardaban las URLs como strings, lo que impedía eliminar fotos físicamente de ImageKit.

### Causa Raíz

Firestore no serializaba correctamente objetos con `Timestamp`. El array de objetos se convertía automáticamente a array de strings.

## Solución Implementada

### 1. Tipo PhotoInfo Dedicado

**Archivo:** `cita-rd/types/PhotoInfo.ts`

```typescript
export type PhotoInfo = {
  url: string;           // URL pública de la foto
  fileId: string;        // ID de ImageKit para eliminar
  isMain: boolean;       // Si es la foto principal
  createdAt: number;     // Unix timestamp (Date.now())
  analyzed?: boolean;    // Si fue analizada por IA
};
```

**Cambios clave:**
- ✅ `createdAt: number` en lugar de `Timestamp` o `Date`
- ✅ Campo `isMain` para identificar foto principal
- ✅ Campo `analyzed` para sistema de análisis de fotos
- ✅ Funciones helper: `normalizePhotos()` y `extractUrls()`

### 2. Servicio de Fotos Actualizado

**Archivo:** `cita-rd/services/photoUploadService.ts`

**Cambios:**
- ✅ Importa `PhotoInfo` desde `types/PhotoInfo.ts`
- ✅ `updateUserPhotos()` ahora acepta solo `PhotoInfo[]`
- ✅ Usa `Date.now()` en lugar de `Timestamp.now()`
- ✅ Convierte PhotoInfo a objetos planos antes de guardar en Firestore
- ✅ Guarda tanto `images` (URLs) como `photosInfo` (objetos completos)

### 3. Componente PhotoUploader Actualizado

**Archivo:** `cita-rd/components/PhotoUploader.tsx`

**Cambios:**
- ✅ Importa `PhotoInfo` y helpers desde `types/PhotoInfo.ts`
- ✅ Usa `normalizePhotos()` para compatibilidad con fotos antiguas
- ✅ Crea objetos `PhotoInfo` completos al subir fotos
- ✅ Usa `Date.now()` para `createdAt`
- ✅ Establece `isMain: true` para la primera foto
- ✅ Establece `analyzed: false` inicialmente
- ✅ Busca `fileId` correctamente al eliminar

## Estructura en Firestore

### Antes (❌ No funcionaba)
```javascript
{
  images: ["url1", "url2"],
  photosInfo: ["url1", "url2"]  // Se convertía a strings!
}
```

### Ahora (✅ Funciona)
```javascript
{
  images: ["url1", "url2"],  // Para compatibilidad
  photosInfo: [
    {
      url: "url1",
      fileId: "abc123",
      isMain: true,
      createdAt: 1737849600000,
      analyzed: false
    },
    {
      url: "url2",
      fileId: "def456",
      isMain: false,
      createdAt: 1737849700000,
      analyzed: false
    }
  ]
}
```

## Flujo Completo

### Subir Foto
1. Usuario selecciona archivo
2. Se redimensiona la imagen
3. Se sube a ImageKit → obtiene `url` y `fileId`
4. Se crea objeto `PhotoInfo` con:
   - `url`: URL de ImageKit
   - `fileId`: ID de ImageKit
   - `isMain`: `true` si es índice 0
   - `createdAt`: `Date.now()`
   - `analyzed`: `false`
5. Se guarda en Firestore en `photosInfo[index]`
6. Se actualiza UI

### Eliminar Foto
1. Usuario hace clic en botón eliminar
2. Se obtiene `photosInfo` de Firestore
3. Se normaliza con `normalizePhotos()` (compatibilidad)
4. Se busca foto por URL → obtiene `fileId`
5. Se llama a Cloud Function `deleteImageKitPhoto` con `fileId`
6. Se elimina físicamente de ImageKit
7. Se actualiza `photosInfo` en Firestore
8. Se actualiza UI

## Compatibilidad con Fotos Antiguas

La función `normalizePhotos()` convierte automáticamente fotos antiguas (strings) al nuevo formato:

```typescript
// Foto antigua (string)
"https://ik.imagekit.io/tapapati/photo.jpg"

// Se convierte a:
{
  url: "https://ik.imagekit.io/tapapati/photo.jpg",
  fileId: "",  // Vacío para fotos antiguas
  isMain: false,
  createdAt: Date.now(),
  analyzed: false
}
```

**Nota:** Fotos antiguas sin `fileId` no se pueden eliminar físicamente de ImageKit, pero sí se eliminan de Firestore.

## Archivos Modificados

1. ✅ `cita-rd/types/PhotoInfo.ts` - NUEVO
2. ✅ `cita-rd/services/photoUploadService.ts` - ACTUALIZADO
3. ✅ `cita-rd/components/PhotoUploader.tsx` - ACTUALIZADO

## Archivos Sin Cambios

- ✅ `cita-rd/services/imagekitService.ts` - Sin cambios
- ✅ `cita-rd/functions/index.js` - Sin cambios (Cloud Functions)

## Próximos Pasos

1. ✅ Probar subida de foto nueva
2. ✅ Verificar que `photosInfo` se guarde como array de objetos
3. ✅ Probar eliminación de foto
4. ✅ Verificar que se elimine físicamente de ImageKit
5. ⏳ Implementar análisis automático de fotos (campo `analyzed`)
6. ⏳ Implementar sistema de foto principal (campo `isMain`)

## Comandos de Prueba

```bash
# Iniciar servidor
cd cita-rd
npm run dev

# Verificar Cloud Functions
firebase functions:list

# Ver logs de Cloud Functions
firebase functions:log
```

## Notas Importantes

- ✅ **NUNCA usar `Timestamp` o `Date` en objetos que se guardan en Firestore**
- ✅ **Usar `Date.now()` para timestamps (número)**
- ✅ **Convertir objetos a planos antes de guardar en Firestore**
- ✅ **Mantener campo `images` para compatibilidad con código antiguo**
- ✅ **Private Key de ImageKit solo en Cloud Functions**
- ✅ **Colección correcta: `perfiles` (no `users`)**

---

**Documentación relacionada:**
- `SESION_23_ENE_2026_CLOUD_FUNCTIONS.md` - Cloud Functions
- `PHOTO_DELETION_COMPLETE.md` - Sistema de eliminación
- `IMAGEKIT_IMPLEMENTADO.md` - Configuración de ImageKit
