# 🔧 Habilitar Firebase Storage - Paso a Paso

**Fecha:** 21 de enero de 2026  
**Problema:** Storage no está habilitado en Firebase Console

---

## 🎯 EL PROBLEMA REAL

El error "Service storage is not available" significa que **Storage NO está habilitado** en tu proyecto de Firebase, a pesar de que el bucket existe.

---

## ✅ SOLUCIÓN: Habilitar Storage en Firebase Console

### Paso 1: Ir a Firebase Console
1. Abre tu navegador
2. Ve a: https://console.firebase.google.com/
3. Selecciona el proyecto: **citard-fbc26**

### Paso 2: Ir a Storage
1. En el menú lateral izquierdo, busca **"Storage"**
2. Haz clic en **"Storage"**

### Paso 3: Verificar Estado
Verás una de estas pantallas:

#### Opción A: Storage NO Habilitado
Si ves un botón que dice **"Get Started"** o **"Comenzar"**:
1. Haz clic en ese botón
2. Aparecerá un modal con opciones de seguridad
3. Selecciona **"Start in production mode"** (modo producción)
4. Haz clic en **"Next"** o **"Siguiente"**
5. Selecciona la ubicación: **us-east1** (o la más cercana a República Dominicana)
6. Haz clic en **"Done"** o **"Listo"**

#### Opción B: Storage YA Habilitado
Si ya ves archivos y carpetas (como `profile-photos/`):
- Storage está habilitado ✅
- El problema puede ser de permisos o configuración

### Paso 4: Verificar Reglas de Storage
1. En la página de Storage, ve a la pestaña **"Rules"**
2. Deberías ver algo como:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Si las reglas están vacías o diferentes, cópialas de `cita-rd/storage.rules`

### Paso 5: Publicar Reglas
1. Haz clic en **"Publish"** o **"Publicar"**
2. Espera confirmación

### Paso 6: Verificar en la App
1. Espera 2-3 minutos (propagación de cambios)
2. Reinicia el servidor:
   ```bash
   # Detener servidor (Ctrl+C)
   cd cita-rd
   npm run dev
   ```
3. Abre http://localhost:3000/
4. Abre DevTools (F12) → Console
5. Busca: `✅ Firebase Storage inicializado correctamente`

---

## 🔍 DIAGNÓSTICO ALTERNATIVO

### Si Storage está habilitado pero sigue sin funcionar:

#### Verificar API de Storage en Google Cloud
1. Ve a: https://console.cloud.google.com/
2. Selecciona proyecto: **citard-fbc26**
3. Ve a **"APIs & Services"** → **"Library"**
4. Busca: **"Cloud Storage for Firebase API"**
5. Verifica que esté **"Enabled"** (habilitada)
6. Si dice "Enable", haz clic para habilitarla

#### Verificar Permisos de Proyecto
1. En Firebase Console, ve a **"Project Settings"** (⚙️)
2. Ve a la pestaña **"Service accounts"**
3. Verifica que el service account tenga permisos de Storage

---

## 🎯 SOLUCIÓN TEMPORAL: Usar URLs Externas

Si Storage sigue sin funcionar, puedes usar un servicio externo temporalmente:

### Opción 1: Cloudinary (Recomendado)
- Gratis hasta 25GB
- Fácil de integrar
- Optimización automática de imágenes

### Opción 2: ImgBB
- Gratis ilimitado
- API simple
- Bueno para desarrollo

### Opción 3: Supabase Storage
- Gratis hasta 1GB
- Compatible con Firebase
- Fácil migración

---

## 📝 CHECKLIST DE VERIFICACIÓN

Marca cada paso que completes:

- [ ] Abrí Firebase Console
- [ ] Fui a Storage
- [ ] Vi el botón "Get Started" o ya estaba habilitado
- [ ] Habilité Storage (si era necesario)
- [ ] Verifiqué las reglas de Storage
- [ ] Publiqué las reglas
- [ ] Esperé 2-3 minutos
- [ ] Reinicié el servidor
- [ ] Verifiqué el mensaje en consola

---

## 🚨 SI NADA FUNCIONA

### Opción Final: Recrear Storage
1. En Firebase Console → Storage
2. Si hay un botón de configuración (⚙️), haz clic
3. Busca opción para "Disable" o "Delete"
4. Deshabilita Storage
5. Espera 5 minutos
6. Vuelve a habilitarlo siguiendo Paso 3

---

## 💡 NOTA IMPORTANTE

**La app funciona perfectamente sin Storage.** Todas las features core están operativas:
- ✅ Login/Register
- ✅ Chat en tiempo real
- ✅ Matches
- ✅ Typing indicator
- ✅ Stories (sin imágenes)
- ✅ Navegación completa

Storage solo es necesario para:
- ⏳ Subir fotos de perfil
- ⏳ Stories con imágenes
- ⏳ Fotos en chat

**Puedes lanzar la app sin Storage y agregarlo después.**

---

## 📞 INFORMACIÓN

- **Proyecto:** citard-fbc26
- **Storage Bucket:** citard-fbc26.firebasestorage.app
- **Región Recomendada:** us-east1
- **Firebase Console:** https://console.firebase.google.com/project/citard-fbc26/storage

---

**Prioridad:** 🟡 MEDIA (No bloquea lanzamiento)  
**Tiempo estimado:** 5-10 minutos  
**Dificultad:** Fácil

