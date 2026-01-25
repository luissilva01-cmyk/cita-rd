# 🔥 Habilitar Firebase Storage - Guía Paso a Paso

**Proyecto:** citard-fbc26  
**Fecha:** 20 de enero de 2026

---

## 📋 PASOS PARA HABILITAR STORAGE

### 1️⃣ Abrir Firebase Console

1. Ve a: **https://console.firebase.google.com/**
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto: **citard-fbc26**

---

### 2️⃣ Navegar a Storage

1. En el menú lateral izquierdo, busca **"Storage"** (icono de carpeta 📁)
2. Click en **"Storage"**
3. Verás un botón que dice **"Get Started"** o **"Comenzar"**

---

### 3️⃣ Iniciar Storage

1. Click en **"Get Started"** / **"Comenzar"**
2. Aparecerá un modal con información sobre las reglas de seguridad
3. **IMPORTANTE:** Selecciona **"Start in production mode"** (Modo producción)
   - Las reglas personalizadas ya están en `storage.rules`
   - Las aplicaremos en el siguiente paso
4. Click **"Next"** / **"Siguiente"**

---

### 4️⃣ Seleccionar Ubicación

1. Selecciona la ubicación: **us-east1** (ya configurada para tu proyecto)
   - Esta es la mejor ubicación para República Dominicana
2. Click **"Done"** / **"Listo"**
3. Espera unos segundos mientras Firebase crea el bucket de Storage

---

### 5️⃣ Aplicar Reglas de Seguridad

Una vez habilitado Storage:

1. Ve a la pestaña **"Rules"** en Storage
2. Verás las reglas por defecto
3. **Reemplaza TODO el contenido** con las reglas de `cita-rd/storage.rules`

**Reglas a copiar:**

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Reglas para fotos de perfil
    match /profile-photos/{allImages=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
    
    // Reglas para fotos de stories
    match /stories/{allImages=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
    
    // Reglas para fotos de chat
    match /chat-photos/{allImages=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
      allow delete: if request.auth != null;
    }
    
    // Denegar acceso a cualquier otro archivo
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click **"Publish"** / **"Publicar"**
5. Confirma la publicación

---

### 6️⃣ Verificar Configuración

En la consola de Firebase Storage, deberías ver:

- **Bucket name:** `citard-fbc26.appspot.com` ✅
- **Location:** `us-east1` ✅
- **Rules:** Publicadas ✅

---

## 🔄 DESPUÉS DE HABILITAR STORAGE

### Opción A: Reiniciar el Servidor (Recomendado)

```bash
# En la terminal donde corre el servidor
Ctrl + C

# Reiniciar
npm run dev
```

### Opción B: Solo Refrescar el Navegador

1. Ve a http://localhost:3000/
2. Presiona `Ctrl + Shift + R` (hard refresh)
3. El error de Storage debería desaparecer

---

## ✅ VERIFICAR QUE FUNCIONA

1. Abre la consola del navegador (F12)
2. Ya NO deberías ver el error: `Service storage is not available`
3. Intenta subir una foto de perfil
4. Verifica en Firebase Console > Storage que la foto se subió

---

## 📁 ESTRUCTURA DE CARPETAS EN STORAGE

Una vez habilitado, Storage tendrá esta estructura:

```
citard-fbc26.appspot.com/
├── profile-photos/
│   ├── {userId}/
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── ...
├── stories/
│   ├── {userId}/
│   │   ├── story1.jpg
│   │   └── ...
└── chat-photos/
    ├── {chatId}/
    │   ├── photo1.jpg
    │   └── ...
```

---

## 🚨 SI TIENES PROBLEMAS

### Error: "Storage bucket not configured"

**Solución:** Verifica que el `storageBucket` en `firebase.ts` sea:
```typescript
storageBucket: "citard-fbc26.appspot.com"
```

### Error: "Permission denied"

**Solución:** Verifica que las reglas de Storage estén publicadas correctamente.

### Error persiste después de habilitar

**Solución:**
1. Limpia la caché del navegador
2. Reinicia el servidor
3. Hard refresh (Ctrl + Shift + R)

---

## 📞 AVÍSAME CUANDO TERMINES

Una vez que hayas habilitado Storage, avísame y verificaré que todo esté funcionando correctamente.

**Comandos útiles:**

```bash
# Ver si Storage está habilitado
firebase projects:list

# Desplegar reglas desde CLI (opcional)
firebase deploy --only storage
```

---

**Estado Actual:**
- ⚠️ Storage: NO habilitado
- ✅ Auth: Funcionando
- ✅ Firestore: Funcionando
- ✅ Servidor: http://localhost:3000/

**Después de habilitar:**
- ✅ Storage: Funcionando
- ✅ Subida de fotos: Funcionando
- ✅ Stories con imágenes: Funcionando
- ✅ Chat con fotos: Funcionando
