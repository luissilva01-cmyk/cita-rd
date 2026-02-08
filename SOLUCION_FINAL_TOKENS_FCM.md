# Solución Final - Tokens FCM Bloqueados

## Problema Persistente

Después de agregar todas las APIs necesarias a las restricciones de la API Key, el error 403 persiste:

```
POST https://fcmregistrations.googleapis.com/v1/projects/citard-fbc26/registrations 403 (Forbidden)
```

## Posibles Causas

1. **Propagación lenta**: Los cambios en Google Cloud pueden tardar más de 2 minutos
2. **Caché del navegador**: El navegador puede estar usando una versión cacheada de la configuración
3. **API Key incorrecta**: Puede que estés editando una API Key diferente a la que usa la app

## Soluciones a Intentar

### Opción 1: Esperar Más Tiempo ⏰
Los cambios en Google Cloud pueden tardar hasta **10-15 minutos** en propagarse completamente.

**Acción**: Espera 10 minutos más y vuelve a probar.

---

### Opción 2: Limpiar Caché del Navegador 🧹

1. Abre DevTools (F12)
2. Click derecho en el botón de recargar
3. Selecciona **"Empty Cache and Hard Reload"** o **"Vaciar caché y recargar de forma forzada"**
4. Vuelve a probar las notificaciones

---

### Opción 3: Verificar que Estás Editando la API Key Correcta 🔑

Es posible que tengas múltiples API Keys y estés editando la incorrecta.

#### Paso 1: Identificar la API Key que usa tu app

1. Ve a `cita-rd/services/firebase.ts`
2. Busca la línea `apiKey: "..."`
3. Copia el valor completo de la API Key

#### Paso 2: Buscar esa API Key en Google Cloud Console

1. Ve a https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. Busca la API Key que coincida con el valor de tu `firebase.ts`
3. Asegúrate de que ESA API Key tenga todas las restricciones correctas

---

### Opción 4: Crear una Nueva API Key Sin Restricciones (Temporal) 🆕

**SOLO PARA TESTING - NO PARA PRODUCCIÓN**

1. Ve a Google Cloud Console → APIs y servicios → Credenciales
2. Click en **"Crear credenciales"** → **"Clave de API"**
3. Copia la nueva API Key
4. **NO agregues restricciones** (déjala sin restricciones)
5. Actualiza `cita-rd/services/firebase.ts` con la nueva API Key
6. Prueba las notificaciones

Si funciona con la API Key sin restricciones, confirma que el problema es de restricciones.

---

### Opción 5: Remover TODAS las Restricciones de API (Temporal) 🔓

**SOLO PARA TESTING - NO PARA PRODUCCIÓN**

1. Ve a tu API Key actual en Google Cloud Console
2. En la sección **"Restricciones de API"**
3. Selecciona **"No restringir la clave"**
4. Guarda
5. Espera 2 minutos
6. Prueba las notificaciones

Si funciona, sabremos que el problema es con las restricciones específicas.

---

## APIs que DEBEN estar en las Restricciones

Para que FCM funcione correctamente, necesitas:

- ✅ Cloud Firestore API
- ✅ Cloud Storage for Firebase API
- ✅ **Firebase Cloud Messaging API** ← CRÍTICA
- ✅ **Firebase Installations API** ← CRÍTICA
- ✅ Firebase Management API
- ✅ Identity Toolkit API
- ✅ Token Service API

---

## Próximos Pasos Recomendados

1. **PRIMERO**: Espera 10 minutos más (propagación)
2. **SEGUNDO**: Limpia caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
3. **TERCERO**: Verifica que estás editando la API Key correcta
4. **CUARTO**: Si nada funciona, prueba con API Key sin restricciones temporalmente

---

## Documentación de Referencia

- [Firebase Cloud Messaging Web Setup](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Google Cloud API Key Restrictions](https://cloud.google.com/docs/authentication/api-keys)
- [Firebase Installations API](https://firebase.google.com/docs/projects/api-keys)

---

**Fecha**: 06 Febrero 2026  
**Estado**: Troubleshooting en progreso  
**Prioridad**: Alta

