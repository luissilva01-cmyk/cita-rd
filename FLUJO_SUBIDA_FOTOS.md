# 🔄 Flujo Completo de Subida de Fotos

**Documentación técnica del proceso de subida**

---

## 📊 DIAGRAMA DE FLUJO

```
Usuario selecciona imagen
         ↓
PhotoUploader.tsx (componente)
         ↓
resizeImage() - Redimensiona a 800x1200
         ↓
uploadPhoto() - Sube a Firebase Storage
         ↓
Firebase Storage (profile-photos/)
         ↓
getDownloadURL() - Obtiene URL permanente
         ↓
updateUserPhotos() - Guarda en Firestore
         ↓
Firestore (perfiles/{userId})
         ↓
onPhotosUpdate() - Actualiza UI
         ↓
Usuario ve la foto en su perfil
```

---

## 🔧 COMPONENTES INVOLUCRADOS

### **1. PhotoUploader.tsx**
**Ubicación:** `cita-rd/components/PhotoUploader.tsx`

**Responsabilidades:**
- UI para seleccionar fotos
- Manejo de eventos de archivo
- Mostrar progreso de subida
- Mostrar errores
- Actualizar UI después de subir

**Funciones principales:**
```typescript
handleFileSelect(event, index) {
  // 1. Obtener archivo
  // 2. Redimensionar
  // 3. Subir
  // 4. Actualizar Firestore
  // 5. Actualizar UI
}
```

---

### **2. photoUploadService.ts**
**Ubicación:** `cita-rd/services/photoUploadService.ts`

**Funciones exportadas:**

#### **uploadPhoto(file, userId, photoIndex)**
- Valida el archivo (tipo, tamaño)
- Crea referencia en Storage
- Sube bytes a Firebase
- Obtiene URL de descarga
- Retorna resultado

```typescript
const result = await uploadPhoto(file, userId, 0);
// { success: true, url: "https://..." }
```

#### **resizeImage(file, maxWidth, maxHeight, quality)**
- Redimensiona imagen antes de subir
- Mantiene aspect ratio
- Comprime con calidad especificada
- Retorna nuevo File

```typescript
const resized = await resizeImage(file, 800, 1200, 0.8);
```

#### **updateUserPhotos(userId, photos)**
- Actualiza array de fotos en Firestore
- Guarda en `perfiles/{userId}`
- Actualiza timestamp
- Retorna éxito/fallo

```typescript
const success = await updateUserPhotos(userId, [url1, url2]);
```

#### **deletePhoto(photoUrl)**
- Elimina foto de Storage
- Extrae path de la URL
- Borra archivo
- Retorna éxito/fallo

```typescript
const deleted = await deletePhoto(photoUrl);
```

---

### **3. firebase.ts**
**Ubicación:** `cita-rd/services/firebase.ts`

**Exports:**
```typescript
export const auth = getAuth(app);      // Autenticación
export const db = getFirestore(app);   // Base de datos
export const storage = getStorage(app); // Storage ✅
```

**Configuración:**
```typescript
const firebaseConfig = {
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.firebasestorage.app",
  // ...
};
```

---

## 📁 ESTRUCTURA DE STORAGE

### **Carpetas:**
```
citard-fbc26.firebasestorage.app/
├── profile-photos/
│   ├── userId1_0_1737584123456.jpg
│   ├── userId1_1_1737584234567.jpg
│   ├── userId2_0_1737584345678.jpg
│   └── ...
├── stories/
│   └── (futuro)
└── chat-photos/
    └── (futuro)
```

### **Formato de nombres:**
```
{userId}_{photoIndex}_{timestamp}.jpg

Ejemplo:
abc123_0_1737584123456.jpg
│      │ │
│      │ └─ Timestamp (Date.now())
│      └─── Índice de foto (0-5)
└────────── ID del usuario
```

---

## 🔒 REGLAS DE SEGURIDAD

**Archivo:** `cita-rd/storage.rules`

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{allImages=**} {
      // Lectura pública
      allow read: if true;
      
      // Escritura solo autenticados
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      
      // Eliminación solo autenticados
      allow delete: if request.auth != null;
    }
  }
}
```

**Validaciones:**
- ✅ Tamaño máximo: 5MB
- ✅ Solo imágenes
- ✅ Solo usuarios autenticados pueden escribir
- ✅ Lectura pública (para ver perfiles)

---

## 🔄 PROCESO DETALLADO

### **Paso 1: Usuario Selecciona Imagen**
```typescript
<input 
  type="file" 
  accept="image/*"
  onChange={(e) => handleFileSelect(e, index)}
/>
```

### **Paso 2: Validación Inicial**
```typescript
if (!file.type.startsWith('image/')) {
  return { success: false, error: 'Debe ser una imagen' };
}

if (file.size > 5 * 1024 * 1024) {
  return { success: false, error: 'Máximo 5MB' };
}
```

### **Paso 3: Redimensionar**
```typescript
const resizedFile = await resizeImage(file, 800, 1200, 0.8);
// Reduce tamaño manteniendo calidad
```

### **Paso 4: Subir a Storage**
```typescript
const fileName = `${userId}_${photoIndex}_${Date.now()}.jpg`;
const photoRef = ref(storage, `profile-photos/${fileName}`);
const snapshot = await uploadBytes(photoRef, resizedFile);
```

### **Paso 5: Obtener URL**
```typescript
const downloadURL = await getDownloadURL(snapshot.ref);
// https://firebasestorage.googleapis.com/v0/b/...
```

### **Paso 6: Guardar en Firestore**
```typescript
const userRef = doc(db, 'perfiles', userId);
await updateDoc(userRef, {
  images: [url1, url2, url3],
  updatedAt: new Date()
});
```

### **Paso 7: Actualizar UI**
```typescript
onPhotosUpdate(newPhotos);
// El componente padre actualiza el estado
```

---

## 📊 ESTRUCTURA DE DATOS

### **Firestore (perfiles/{userId}):**
```json
{
  "id": "abc123",
  "name": "Juan Pérez",
  "images": [
    "https://firebasestorage.googleapis.com/.../abc123_0_1737584123456.jpg",
    "https://firebasestorage.googleapis.com/.../abc123_1_1737584234567.jpg",
    "https://firebasestorage.googleapis.com/.../abc123_2_1737584345678.jpg"
  ],
  "updatedAt": "2026-01-22T19:30:00.000Z",
  "createdAt": "2026-01-20T10:00:00.000Z"
}
```

---

## 🎯 LÍMITES Y RESTRICCIONES

### **Firebase Storage (Plan Spark - Gratis):**
- ✅ 5 GB de almacenamiento
- ✅ 1 GB/día de descarga
- ✅ 20,000 operaciones/día

### **Aplicación:**
- ✅ Máximo 6 fotos por usuario
- ✅ Máximo 5 MB por foto
- ✅ Solo formatos de imagen
- ✅ Redimensionado automático a 800x1200

### **Estimaciones:**
- Foto promedio: ~200 KB (después de redimensionar)
- 6 fotos por usuario: ~1.2 MB
- 1000 usuarios: ~1.2 GB
- **Conclusión:** Plan gratuito es suficiente

---

## 🔍 LOGS Y DEBUGGING

### **Logs de Inicialización:**
```
🔧 Inicializando Firebase...
✅ Firebase App inicializada
✅ Firebase Storage inicializado
📦 Storage bucket: citard-fbc26.firebasestorage.app
```

### **Logs de Subida:**
```
📤 Iniciando subida de foto...
📋 Archivo: foto.jpg
📋 Tamaño: 123.45 KB
📋 Tipo: image/jpeg
🔄 Redimensionando imagen...
🔥 Subiendo a Firebase Storage...
📸 Subiendo archivo...
📁 Path: profile-photos/abc123_0_1737584123456.jpg
✅ Bytes subidos exitosamente
✅ URL obtenida: https://...
✅ Foto subida a Firebase Storage
💾 Actualizando fotos en Firestore...
✅ Fotos del perfil actualizadas en Firestore
```

### **Logs de Error:**
```
❌ Error subiendo foto: [mensaje]
❌ Error message: [detalles]
❌ Error name: [tipo]
```

---

## 🚀 OPTIMIZACIONES

### **Implementadas:**
- ✅ Redimensionado automático (reduce tamaño)
- ✅ Compresión con calidad 0.8
- ✅ Validación antes de subir
- ✅ Logs detallados para debugging

### **Futuras (Opcionales):**
- 🔄 Subida en background
- 🔄 Retry automático en caso de fallo
- 🔄 Progress bar con porcentaje
- 🔄 Thumbnail generation
- 🔄 Image cropping UI

---

## 📚 REFERENCIAS

### **Documentación:**
- Firebase Storage: https://firebase.google.com/docs/storage
- Firebase SDK v10: https://firebase.google.com/docs/web/modular-upgrade

### **Archivos del proyecto:**
- `components/PhotoUploader.tsx` - UI
- `services/photoUploadService.ts` - Lógica
- `services/firebase.ts` - Configuración
- `storage.rules` - Seguridad

### **Documentación de esta sesión:**
- `EMPIEZA_AQUI.md` - Inicio rápido
- `PROBAR_SUBIDA_FOTOS_AHORA.md` - Guía de prueba
- `SOLUCION_STORAGE_NULL.md` - Problema resuelto
- `RESUMEN_SESION_22_ENE_2026.md` - Resumen completo

---

**Flujo documentado y funcionando** ✅
