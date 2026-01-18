# Fix Rápido CORS - Sin Instalar Nada

## El Error
```
Access to XMLHttpRequest blocked by CORS policy
```

## Solución Rápida: Usar Firebase Console

### Paso 1: Ir a Google Cloud Console
1. Ve a: https://console.cloud.google.com/storage/browser
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto: **citard-fbc26**

### Paso 2: Encontrar tu bucket
1. Busca el bucket: `citard-fbc26.firebasestorage.app`
2. Click en el nombre del bucket

### Paso 3: Configurar CORS
1. Click en la pestaña **"Configuration"** (Configuración)
2. Scroll hasta **"CORS configuration"**
3. Click en **"Edit"** (Editar)
4. Pega este JSON:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:5173", "https://citard-fbc26.web.app", "https://citard-fbc26.firebaseapp.com"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Authorization", "Content-Length", "User-Agent", "X-Requested-With"]
  }
]
```

5. Click en **"Save"** (Guardar)

### Paso 4: Probar
1. Reinicia tu servidor: `npm run dev`
2. Limpia caché del navegador: `Ctrl + Shift + R`
3. Intenta subir una foto

---

## ¿No tienes acceso a Google Cloud Console?

### Alternativa: Usar el Emulador de Firebase (Solo Desarrollo)

#### 1. Actualizar firebase.ts
Edita `cita-rd/services/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// ... tu configuración actual ...

export const storage = getStorage(app);

// 🔥 AGREGAR ESTO: Usar emulador en desarrollo
if (window.location.hostname === 'localhost') {
  console.log('🧪 Usando Storage Emulator para desarrollo');
  connectStorageEmulator(storage, 'localhost', 9199);
}
```

#### 2. Iniciar emulador
```bash
cd cita-rd
firebase emulators:start --only storage
```

En otra terminal:
```bash
npm run dev
```

#### 3. Probar
Ahora las fotos se subirán al emulador local (no al Storage real).

---

## ¿Cuál usar?

### Google Cloud Console (Recomendado)
- ✅ Solución permanente
- ✅ Funciona en producción
- ✅ No requiere instalar nada
- ⏱️ 2-3 minutos

### Emulador de Firebase
- ✅ Rápido para desarrollo
- ❌ Solo local
- ❌ No prueba Storage real
- ⏱️ 5 minutos

---

## Después de Aplicar

1. **Reinicia el servidor**
   ```bash
   npm run dev
   ```

2. **Limpia caché del navegador**
   - `Ctrl + Shift + R` (Windows)
   - O modo incógnito

3. **Prueba subir foto**
   - Ve a Perfil → Gestionar Fotos
   - Sube una imagen
   - Debería funcionar ✅

---

## Si Sigue Sin Funcionar

Avísame y te ayudo con otra solución.
