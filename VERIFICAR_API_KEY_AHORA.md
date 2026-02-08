# ✅ Verificar API Key - Paso a Paso

## 🎯 Objetivo

Confirmar que estás editando la API Key correcta en Google Cloud Console.

---

## 📋 Tu API Key Actual

La API Key que usa tu app **Ta' Pa' Ti** es:

```
AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg
```

Esta es la que está en tu archivo `cita-rd/.env.local`.

---

## 🔍 Pasos para Verificar

### Paso 1: Ir a Google Cloud Console

1. Abre tu navegador
2. Ve a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
3. Inicia sesión con tu cuenta de Google (si no lo has hecho)

### Paso 2: Buscar la API Key

1. En la página de **Credenciales**, busca la sección **"API Keys"** (Claves de API)
2. Deberías ver una o más API Keys listadas
3. Busca la que termine en: **...CRhg** (las últimas 4 letras de tu API Key)

### Paso 3: Verificar las Restricciones

1. Click en el **nombre** de la API Key (no en el ícono de copiar)
2. Esto abrirá la página de edición de la API Key
3. Desplázate hacia abajo hasta la sección **"Restricciones de API"** (API restrictions)

### Paso 4: Confirmar que Están las 7 APIs

Verifica que estén seleccionadas estas 7 APIs:

- ✅ **Cloud Firestore API**
- ✅ **Cloud Storage for Firebase API**
- ✅ **Firebase Cloud Messaging API** ← CRÍTICA para notificaciones
- ✅ **Firebase Installations API** ← CRÍTICA para notificaciones
- ✅ **Firebase Management API**
- ✅ **Identity Toolkit API**
- ✅ **Token Service API**

### Paso 5: Si Falta Alguna API

Si falta alguna de las 7 APIs:

1. Click en **"Editar clave de API"** (Edit API key)
2. En la sección **"Restricciones de API"**, selecciona **"Restringir clave"** (Restrict key)
3. Busca y selecciona las APIs que falten
4. Click en **"Guardar"** (Save)
5. **Espera 10-15 minutos** para que los cambios se propaguen

---

## ⏰ Tiempo de Propagación

Los cambios en Google Cloud pueden tardar entre **5 y 15 minutos** en propagarse completamente.

**¿Cuánto tiempo ha pasado desde que guardaste los cambios?**

- ✅ **Más de 15 minutos**: Deberías poder probar ahora
- ⏳ **Menos de 15 minutos**: Espera un poco más

---

## 🧪 Probar las Notificaciones

Una vez que hayas verificado la API Key y esperado el tiempo de propagación:

### 1. Limpiar Caché del Navegador

**Opción A: Recarga Forzada**
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Opción B: Vaciar Caché Completo**
1. Abre DevTools (F12)
2. Click derecho en el botón de recargar del navegador
3. Selecciona **"Empty Cache and Hard Reload"** o **"Vaciar caché y recargar de forma forzada"**

### 2. Ir a la App

1. Ve a: http://localhost:3000/
2. Inicia sesión con tu cuenta
3. Ve a **Perfil** (última pestaña del menú inferior)
4. Click en el ícono de **engranaje** (⚙️) en la esquina superior derecha

### 3. Activar Notificaciones

1. En la sección **"Notificaciones Push"**, click en **"Activar Notificaciones"**
2. Acepta el permiso del navegador cuando te lo pida
3. Observa la consola del navegador (F12)

### 4. Verificar en la Consola

Deberías ver estos logs:

```
🔔 [AccountSettings] Solicitando permiso de notificaciones...
🔔 [AccountSettings] Permiso concedido: true
🎫 [AccountSettings] Obteniendo y guardando token para userId: ...
✅ [AccountSettings] Token obtenido y guardado: SÍ
🔍 [AccountSettings] Verificando que el token se guardó en Firestore...
📄 [AccountSettings] Token existe en Firestore: true
```

### 5. Si Ves el Error 403

Si todavía ves el error:
```
POST https://fcmregistrations.googleapis.com/v1/projects/citard-fbc26/registrations 403 (Forbidden)
```

Entonces:
1. Verifica que editaste la API Key correcta (la que termina en ...CRhg)
2. Confirma que las 7 APIs estén seleccionadas
3. Espera 5 minutos más y vuelve a probar

---

## 🆘 Si Nada Funciona

Si después de verificar todo y esperar 15 minutos el error persiste, prueba esto:

### Opción Temporal: API Key Sin Restricciones

**⚠️ SOLO PARA DIAGNÓSTICO - NO PARA PRODUCCIÓN**

1. Ve a tu API Key en Google Cloud Console
2. En **"Restricciones de API"**, selecciona **"No restringir la clave"** (Don't restrict key)
3. Guarda
4. Espera 2 minutos
5. Limpia caché del navegador
6. Prueba las notificaciones

**Si funciona sin restricciones:**
- Confirma que el problema es de restricciones
- Vuelve a poner las restricciones con las 7 APIs
- Espera 10 minutos y prueba de nuevo

**Si NO funciona sin restricciones:**
- El problema es otro (posiblemente configuración de Firebase)
- Avísame para investigar más

---

## 📊 Estado del Servidor

✅ Servidor corriendo en: http://localhost:3000/  
✅ Sin errores de compilación  
✅ Todas las funcionalidades operativas (excepto notificaciones push)

---

## 📁 Archivos de Referencia

- `cita-rd/.env.local` - Contiene la API Key
- `cita-rd/services/firebase.ts` - Configuración de Firebase
- `cita-rd/services/notificationService.ts` - Servicio de notificaciones
- `cita-rd/components/AccountSettings.tsx` - UI de configuración

---

## 🎯 Checklist Rápido

- [ ] Verificar que la API Key en Google Cloud termina en ...CRhg
- [ ] Confirmar que las 7 APIs están seleccionadas
- [ ] Esperar 10-15 minutos desde el último cambio
- [ ] Limpiar caché del navegador
- [ ] Probar activar notificaciones en http://localhost:3000/
- [ ] Revisar logs en DevTools (F12)

---

**Fecha**: 07 Febrero 2026  
**Estado**: Servidor corriendo, listo para testing  
**Próxima Acción**: Verificar API Key en Google Cloud Console

¡Vamos a resolver esto! 🚀
