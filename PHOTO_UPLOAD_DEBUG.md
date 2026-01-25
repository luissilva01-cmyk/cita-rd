# 🔍 Debug: Por Qué No Se Agregan Más de 2 Fotos

**Fecha:** 25 de enero de 2026  
**Problema:** Al intentar subir una tercera foto, se sustituye la segunda en lugar de agregarse

---

## 🎯 Cambios Realizados

### 1. Mejorado el Log de Firestore (PhotoUploader.tsx)

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

**Por qué:** Ahora distinguimos claramente entre:
- `photosInfo` (nuevo formato con fileId) ✅
- `images` (formato antiguo, solo URLs) ⚠️

### 2. Agregados Logs Detallados

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

---

## 🧪 Pasos para Probar

### 1. Reiniciar Servidor
```bash
cd cita-rd
npm run dev
```

### 2. Abrir Consola del Navegador
- Presiona F12
- Ve a la pestaña "Console"
- Limpia la consola (icono 🚫)

### 3. Subir Tercera Foto
1. Ve a tu perfil
2. Click en "Gestionar Fotos"
3. Click en el botón "+" de la tercera posición
4. Selecciona una imagen

### 4. Observar Logs

**Busca estos logs específicos:**

#### ✅ Si funciona correctamente:
```
📊 Datos de Firestore:
   ✅ Usando photosInfo de Firestore: 2 fotos
   - Total fotos cargadas: 2

📝 ANTES de agregar:
   - Fotos existentes: 2

📝 DESPUÉS de agregar:
   - Total de fotos: 3

✅ Fotos del perfil actualizadas en Firestore
```

#### ❌ Si hay problema:
```
📊 Datos de Firestore:
   ⚠️ Usando images (normalizadas): 1 fotos  ← PROBLEMA AQUÍ
   - Total fotos cargadas: 1

📝 ANTES de agregar:
   - Fotos existentes: 1  ← Solo ve 1 foto cuando deberían ser 2

📝 DESPUÉS de agregar:
   - Total de fotos: 2  ← Resultado: 2 fotos en lugar de 3
```

---

## 🔍 Posibles Causas

### Causa 1: Firestore No Guarda `photosInfo` Correctamente
**Síntoma:** Log muestra "Usando images (normalizadas)" en lugar de "Usando photosInfo"

**Solución:** Verificar que `updateUserPhotos()` esté guardando correctamente:
```typescript
await updateDoc(userRef, {
  images: photoUrls,      // ✅ Array de URLs
  photosInfo: photosData, // ✅ Array de PhotoInfo con fileId
  updatedAt: Date.now()
});
```

### Causa 2: `normalizePhotos()` Filtra Fotos Incorrectamente
**Síntoma:** "Total fotos cargadas" es menor que el número real de fotos

**Solución:** Revisar función `normalizePhotos()` en `types/PhotoInfo.ts`

### Causa 3: Componente Padre No Actualiza `currentPhotos`
**Síntoma:** Fotos se guardan en Firestore pero no se muestran en UI

**Solución:** Verificar que `Profile.tsx` llame correctamente a `onPhotosUpdate()`

---

## 📋 Checklist de Verificación

Después de subir la tercera foto, verifica:

- [ ] ¿La consola muestra "✅ Usando photosInfo de Firestore: 2 fotos"?
- [ ] ¿"ANTES de agregar" muestra 2 fotos existentes?
- [ ] ¿"DESPUÉS de agregar" muestra 3 fotos totales?
- [ ] ¿Se muestra "✅ Fotos del perfil actualizadas en Firestore"?
- [ ] ¿La tercera foto aparece en el grid de fotos?
- [ ] ¿Las 3 fotos se mantienen después de recargar la página?

---

## 📸 Verificar en Firestore Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona proyecto: `citard-fbc26`
3. Ve a Firestore Database
4. Busca tu documento en `perfiles/[tu-user-id]`
5. Verifica que tenga:
   - `images`: Array con 3 URLs ✅
   - `photosInfo`: Array con 3 objetos (cada uno con `url`, `fileId`, etc.) ✅

---

## 🚨 Si Aún No Funciona

Copia y pega TODOS los logs de la consola que empiecen con:
- 📊 Datos de Firestore
- 📝 ANTES de agregar
- 📝 DESPUÉS de agregar
- ✅ Fotos del perfil actualizadas

Y también verifica en Firestore Console cuántos elementos hay en:
- `images`: ¿Cuántos?
- `photosInfo`: ¿Cuántos?

---

## 💡 Teoría Actual

Sospecho que el problema está en uno de estos puntos:

1. **Firestore no está guardando `photosInfo` correctamente** → Solo guarda `images`
2. **`normalizePhotos()` está filtrando fotos mock** → Reduce el array
3. **Componente padre no actualiza el prop `currentPhotos`** → UI desincronizada

Los nuevos logs nos dirán exactamente cuál es el problema.
