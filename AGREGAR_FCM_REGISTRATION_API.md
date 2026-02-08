# ✅ Agregar FCM Registration API a la API Key

## 🔍 Problema Identificado

La API `FCM Registration API` está habilitada en el proyecto, pero **la API Key no tiene permiso para usarla**.

Error actual:
```
POST https://fcmregistrations.googleapis.com/v1/projects/citard-fbc26/registrations 403 (Forbidden)
Requests to this API fcmregistrations.googleapis.com method are blocked
```

## 📋 Solución: Actualizar Restricciones de API Key

### Paso 1: Ir a la configuración de la API Key

1. Abre: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. Busca tu API Key: **"Ta Pa Ti - Web App - Producción"** (`AIzaSyB-w84pDXdqj_73Z16FM7aehFTQQy1RnXs`)
3. Click en el **ícono de lápiz** (editar) ✏️

### Paso 2: Agregar FCM Registration API

En la sección **"Restricciones de API"**:

1. Click en **"Editar restricciones de API"**
2. Verás las 7 APIs actuales seleccionadas
3. **Busca y agrega**: `FCM Registration API`
4. Ahora deberías tener **8 APIs** seleccionadas:
   - ✅ Cloud Firestore API
   - ✅ Cloud Storage for Firebase API
   - ✅ Firebase Cloud Messaging API
   - ✅ Firebase Installations API
   - ✅ Firebase Management API
   - ✅ Identity Toolkit API
   - ✅ Token Service API
   - ✅ **FCM Registration API** ← NUEVA

### Paso 3: Guardar y Esperar

1. Click en **"GUARDAR"**
2. **Espera 2-3 minutos** para que los cambios se propaguen
3. **Recarga la app** (F5)
4. Intenta activar las notificaciones de nuevo

---

## 🎯 Verificación

Después de agregar la API y esperar, deberías ver en la consola:

```
✅ [AccountSettings] Token obtenido y guardado: SÍ
📄 [AccountSettings] Token existe en Firestore: true
```

Sin errores 403.

---

## 📝 Nota

Este es el último paso para que las notificaciones funcionen correctamente. La API Key necesita acceso explícito a **FCM Registration API** para poder generar tokens FCM.
