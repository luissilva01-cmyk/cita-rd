# 🔐 Crear API Key para Producción - Guía Definitiva

## 🎯 Objetivo

Crear una nueva API Key con todas las restricciones correctas para que las notificaciones push funcionen en producción.

---

## ⚠️ Por Qué Crear una Nueva API Key

La API Key actual (`AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg`) tiene un problema:
- ❌ No permite usar Firebase Cloud Messaging API
- ❌ Error 403 al intentar generar tokens FCM

**Solución**: Crear una nueva API Key desde cero con las restricciones correctas.

---

## 📋 Pasos Detallados

### Paso 1: Ir a Google Cloud Console

1. Abre tu navegador
2. Ve a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
3. Inicia sesión con tu cuenta de Google

### Paso 2: Crear Nueva API Key

1. Click en el botón **"+ CREAR CREDENCIALES"** (o "+ CREATE CREDENTIALS")
2. Selecciona **"Clave de API"** (o "API key")
3. Se creará una nueva API Key
4. **NO cierres la ventana todavía**

### Paso 3: Configurar Nombre (Opcional pero Recomendado)

1. En la ventana que aparece, click en **"EDITAR CLAVE DE API"** (o "EDIT API KEY")
2. En el campo **"Nombre"**, escribe: `Ta Pa Ti - Web App - Producción`
3. Esto te ayudará a identificarla después

### Paso 4: Configurar Restricciones de Aplicación

1. En la sección **"Restricciones de aplicación"** (Application restrictions)
2. Selecciona **"Referentes HTTP (sitios web)"** (HTTP referrers)
3. Click en **"AGREGAR UN ELEMENTO"** (ADD AN ITEM)
4. Agrega estos referentes:

```
http://localhost:3000/*
http://localhost:5173/*
https://tu-dominio.com/*
https://www.tu-dominio.com/*
```

**Nota**: Reemplaza `tu-dominio.com` con tu dominio real cuando lo tengas.

### Paso 5: Configurar Restricciones de API (CRÍTICO)

1. En la sección **"Restricciones de API"** (API restrictions)
2. Selecciona **"Restringir clave"** (Restrict key)
3. Click en el menú desplegable **"Seleccionar APIs"**
4. Busca y selecciona estas 7 APIs:

#### APIs Requeridas:

✅ **Cloud Firestore API**
- Busca: "Cloud Firestore API"
- Selecciona el checkbox

✅ **Cloud Storage for Firebase API**
- Busca: "Cloud Storage for Firebase API"
- Selecciona el checkbox

✅ **Firebase Cloud Messaging API** ← CRÍTICA para notificaciones
- Busca: "Firebase Cloud Messaging API"
- Selecciona el checkbox

✅ **Firebase Installations API** ← CRÍTICA para notificaciones
- Busca: "Firebase Installations API"
- Selecciona el checkbox

✅ **Firebase Management API**
- Busca: "Firebase Management API"
- Selecciona el checkbox

✅ **Identity Toolkit API**
- Busca: "Identity Toolkit API"
- Selecciona el checkbox

✅ **Token Service API**
- Busca: "Token Service API"
- Selecciona el checkbox

### Paso 6: Guardar la API Key

1. Verifica que las 7 APIs estén seleccionadas
2. Click en **"GUARDAR"** (SAVE)
3. **Copia la API Key** (algo como: AIzaSy...)
4. Guárdala en un lugar seguro temporalmente

---

## 🔧 Actualizar tu Aplicación

### Paso 1: Hacer Backup del .env.local Actual

```bash
# En la carpeta cita-rd
copy .env.local .env.local.backup
```

### Paso 2: Actualizar .env.local

Abre `cita-rd/.env.local` y actualiza la API Key:

**Antes:**
```env
VITE_FIREBASE_API_KEY=AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg
```

**Después:**
```env
# API Key de Producción con restricciones correctas
VITE_FIREBASE_API_KEY=TU_NUEVA_API_KEY_AQUI

# API Key antigua (con problemas - NO USAR)
# VITE_FIREBASE_API_KEY=AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg
```

### Paso 3: Reiniciar el Servidor

El servidor debería recargarse automáticamente. Si no:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
npm run dev
```

---

## ✅ Probar las Notificaciones

### Paso 1: Limpiar Caché del Navegador

1. Abre DevTools (F12)
2. Click derecho en el botón de recargar
3. Selecciona **"Empty Cache and Hard Reload"**

### Paso 2: Probar en la App

1. Ve a http://localhost:3000/
2. Inicia sesión
3. Ve a **Perfil** → **Configuración** (⚙️)
4. Click en **"Activar Notificaciones"**
5. Acepta el permiso del navegador

### Paso 3: Verificar en la Consola

Deberías ver estos logs:

```
🔔 [AccountSettings] Solicitando permiso de notificaciones...
🔔 [AccountSettings] Permiso concedido: true
🎫 [AccountSettings] Obteniendo y guardando token para userId: ...
✅ [AccountSettings] Token obtenido y guardado: SÍ
🔍 [AccountSettings] Verificando que el token se guardó en Firestore...
📄 [AccountSettings] Token existe en Firestore: true
📄 [AccountSettings] Datos del token: {token: "...", userId: "...", ...}
```

**Si ves el token**: ✅ ¡Perfecto! La API Key funciona correctamente

**Si ves error 403**: ❌ Algo salió mal en la configuración

---

## 🔍 Verificar en Firestore

1. Ve a Firebase Console: https://console.firebase.google.com/project/citard-fbc26/firestore
2. Busca la colección `fcmTokens`
3. Deberías ver un documento con tu `userId`
4. El documento debe tener:
   - `token`: (string largo del token FCM)
   - `userId`: (tu ID de usuario)
   - `createdAt`: (timestamp)
   - `platform`: "web"
   - `userAgent`: (información del navegador)

---

## 🚨 Troubleshooting

### Si Todavía Ves Error 403

1. **Verifica que las 7 APIs estén habilitadas**:
   - Ve a: https://console.cloud.google.com/apis/library?project=citard-fbc26
   - Busca cada una de las 7 APIs
   - Verifica que diga "API habilitada" (API enabled)
   - Si alguna dice "Habilitar" (Enable), click en ese botón

2. **Espera 5-10 minutos**:
   - Los cambios pueden tardar en propagarse
   - Limpia caché del navegador
   - Vuelve a probar

3. **Verifica la API Key en .env.local**:
   - Asegúrate de que copiaste la API Key correcta
   - No debe tener espacios al inicio o al final
   - Debe empezar con `AIzaSy...`

### Si el Servidor No Se Recarga

```bash
# Detener el servidor (Ctrl+C en la terminal)
# Reiniciar:
cd cita-rd
npm run dev
```

---

## 📊 Checklist Final

- [ ] Crear nueva API Key en Google Cloud Console
- [ ] Configurar nombre: "Ta Pa Ti - Web App - Producción"
- [ ] Agregar restricciones de referentes HTTP
- [ ] Seleccionar las 7 APIs en restricciones de API
- [ ] Guardar la API Key
- [ ] Copiar la nueva API Key
- [ ] Hacer backup de .env.local
- [ ] Actualizar VITE_FIREBASE_API_KEY en .env.local
- [ ] Reiniciar servidor
- [ ] Limpiar caché del navegador
- [ ] Probar activar notificaciones
- [ ] Verificar token en Firestore
- [ ] Confirmar que no hay error 403

---

## 🎯 Después de Resolver

Una vez que las notificaciones funcionen:

1. ✅ Elimina la API Key antigua de Google Cloud Console
2. ✅ Actualiza .env.example con un placeholder
3. ✅ Documenta la nueva API Key en tu gestor de contraseñas
4. ✅ Cuando tengas dominio, actualiza las restricciones de referentes

---

## 🔐 Seguridad para Producción

### Antes de Lanzar

1. **Actualiza las restricciones de referentes**:
   - Elimina `http://localhost:*`
   - Deja solo tu dominio de producción

2. **Verifica las 7 APIs**:
   - Todas deben estar habilitadas
   - Todas deben estar en las restricciones

3. **Monitorea el uso**:
   - Ve a Google Cloud Console → APIs y servicios → Panel
   - Revisa el uso de cada API
   - Configura alertas si es necesario

---

**Fecha**: 07 Febrero 2026  
**Estado**: Guía completa para crear API Key de producción  
**Próxima Acción**: Crear nueva API Key con restricciones correctas

¡Vamos a resolver esto correctamente! 🚀
