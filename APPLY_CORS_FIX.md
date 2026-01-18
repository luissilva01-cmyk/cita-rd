# Aplicar Configuración CORS a Firebase Storage

## El Problema
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

Este error significa que Firebase Storage no permite peticiones desde `localhost:3000`.

## La Solución: Aplicar CORS

Ya tenemos el archivo `cors.json` configurado. Ahora necesitas aplicarlo al bucket de Storage.

---

## OPCIÓN 1: Usar gsutil (Recomendado) ⭐

### Paso 1: Instalar Google Cloud SDK

**Windows:**
1. Descarga el instalador: https://cloud.google.com/sdk/docs/install
2. Ejecuta el instalador `GoogleCloudSDKInstaller.exe`
3. Sigue las instrucciones del instalador
4. Reinicia tu terminal/PowerShell

**Verificar instalación:**
```bash
gsutil version
```

### Paso 2: Autenticarte con Google Cloud

```bash
gcloud auth login
```

Esto abrirá tu navegador para que inicies sesión con tu cuenta de Google (la misma que usas para Firebase).

### Paso 3: Configurar el proyecto

```bash
gcloud config set project citard-fbc26
```

### Paso 4: Aplicar CORS al bucket

```bash
cd cita-rd
gsutil cors set cors.json gs://citard-fbc26.firebasestorage.app
```

**Deberías ver:**
```
Setting CORS on gs://citard-fbc26.firebasestorage.app/...
```

### Paso 5: Verificar que se aplicó

```bash
gsutil cors get gs://citard-fbc26.firebasestorage.app
```

**Deberías ver el contenido de tu `cors.json`**

---

## OPCIÓN 2: Firebase Console (Manual) 🔧

Desafortunadamente, Firebase Console no tiene una interfaz para configurar CORS directamente. Necesitas usar `gsutil` (Opción 1) o la API REST de Google Cloud Storage.

---

## OPCIÓN 3: Usar Firebase Emulator (Para Desarrollo) 🧪

Si solo necesitas desarrollo local, puedes usar el emulador de Firebase:

### Paso 1: Instalar emuladores
```bash
cd cita-rd
firebase init emulators
```

Selecciona: **Storage Emulator**

### Paso 2: Configurar emulador
Edita `firebase.json`:
```json
{
  "emulators": {
    "storage": {
      "port": 9199
    }
  }
}
```

### Paso 3: Actualizar configuración de Firebase
En `cita-rd/services/firebase.ts`, agrega:
```typescript
import { connectStorageEmulator } from 'firebase/storage';

// Después de inicializar storage
if (window.location.hostname === 'localhost') {
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

### Paso 4: Iniciar emulador
```bash
firebase emulators:start --only storage
```

---

## OPCIÓN 4: Cambiar a Firebase SDK v9 Modular (Alternativa)

Si las opciones anteriores no funcionan, podemos cambiar la implementación para usar el SDK modular de Firebase que maneja CORS de forma diferente.

---

## ¿Cuál Opción Elegir?

### Para Producción: **OPCIÓN 1** (gsutil)
- ✅ Solución permanente
- ✅ Funciona en producción y desarrollo
- ✅ Configuración profesional
- ⏱️ Requiere instalar Google Cloud SDK (5-10 minutos)

### Para Desarrollo Rápido: **OPCIÓN 3** (Emulator)
- ✅ No requiere configurar CORS
- ✅ Rápido de configurar
- ❌ Solo funciona en desarrollo local
- ❌ No prueba el Storage real

---

## Después de Aplicar CORS

### 1. Reinicia el servidor de desarrollo
```bash
# Detén el servidor (Ctrl+C)
npm run dev
```

### 2. Limpia la caché del navegador
- Presiona `Ctrl + Shift + R` (Windows)
- O abre DevTools → Network → Disable cache

### 3. Prueba subir una foto
1. Ve a tu perfil
2. Click en "Gestionar Fotos"
3. Sube una imagen
4. **Debería funcionar sin errores CORS**

### 4. Verifica en la consola
Deberías ver:
```
🔄 Redimensionando imagen...
📤 Subiendo foto...
📸 Subiendo foto: [userId]_0_[timestamp].jpg
✅ Foto subida exitosamente
🔗 URL obtenida: https://...
✅ Fotos del perfil actualizadas
```

---

## Troubleshooting

### Error: "gsutil: command not found"
- Solución: Instala Google Cloud SDK (Opción 1, Paso 1)

### Error: "AccessDeniedException: 403"
- Solución: Asegúrate de estar autenticado con `gcloud auth login`
- Verifica que tu cuenta tiene permisos en el proyecto Firebase

### Error: "BucketNotFoundException"
- Solución: Verifica el nombre del bucket: `citard-fbc26.firebasestorage.app`
- Usa `gsutil ls` para listar tus buckets

### Sigue sin funcionar después de aplicar CORS
1. Verifica que aplicaste CORS: `gsutil cors get gs://citard-fbc26.firebasestorage.app`
2. Limpia caché del navegador completamente
3. Reinicia el servidor de desarrollo
4. Prueba en modo incógnito

---

## Contenido del archivo cors.json

```json
[
  {
    "origin": [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://citard-fbc26.web.app",
      "https://citard-fbc26.firebaseapp.com"
    ],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "User-Agent",
      "X-Requested-With"
    ]
  }
]
```

Esto permite:
- ✅ Peticiones desde localhost:3000 (tu servidor de desarrollo)
- ✅ Peticiones desde localhost:5173 (Vite por defecto)
- ✅ Peticiones desde tu dominio de producción
- ✅ Todos los métodos HTTP necesarios
- ✅ Headers necesarios para Firebase Storage

---

## Resumen

**Pasos Rápidos:**
1. Instala Google Cloud SDK
2. Ejecuta: `gcloud auth login`
3. Ejecuta: `gcloud config set project citard-fbc26`
4. Ejecuta: `gsutil cors set cors.json gs://citard-fbc26.firebasestorage.app`
5. Reinicia tu servidor
6. ¡Prueba subir una foto!

**Tiempo estimado:** 10-15 minutos

---

¿Necesitas ayuda con algún paso? Avísame y te guío.
