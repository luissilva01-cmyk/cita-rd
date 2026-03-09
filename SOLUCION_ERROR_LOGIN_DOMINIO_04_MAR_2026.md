# 🚨 SOLUCIÓN: Error al Iniciar Sesión en tapati.online
**Fecha**: 4 de marzo de 2026
**Problema**: "Error al iniciar sesión. Por favor verifica tus datos e intenta de nuevo."

## 🎯 Causa del Problema

Firebase Authentication NO tiene autorizado el dominio `tapati.online` en la lista de dominios permitidos.

**Por defecto, Firebase solo autoriza:**
- `localhost` (desarrollo)
- `citard-fbc26.web.app` (dominio de Firebase)
- `citard-fbc26.firebaseapp.com` (dominio alternativo)

**Falta agregar:**
- ❌ `tapati.online` (tu dominio personalizado)

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Ir a Firebase Console

1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: **citard-fbc26**

### Paso 2: Agregar Dominio Autorizado

1. En el menú lateral, ve a **Authentication** (Autenticación)
2. Haz clic en la pestaña **Settings** (Configuración)
3. Baja hasta la sección **Authorized domains** (Dominios autorizados)
4. Haz clic en **Add domain** (Agregar dominio)
5. Escribe: `tapati.online`
6. Haz clic en **Add** (Agregar)

### Paso 3: Verificar

Deberías ver en la lista:
```
✅ localhost
✅ citard-fbc26.web.app
✅ citard-fbc26.firebaseapp.com
✅ tapati.online  ← NUEVO
```

### Paso 4: Probar Login

1. Ve a https://tapati.online
2. Limpia el cache del navegador (`Ctrl + Shift + Delete`)
3. Recarga la página (`Ctrl + Shift + R`)
4. Intenta iniciar sesión nuevamente

## 📋 Instrucciones Visuales Detalladas

### Opción A: Desde Firebase Console (Web)

**1. Acceder a Firebase Console:**
```
https://console.firebase.google.com/project/citard-fbc26/authentication/settings
```

**2. Navegar a Authentication:**
- Click en "Authentication" en el menú lateral izquierdo
- Click en la pestaña "Settings" (arriba)
- Scroll down hasta "Authorized domains"

**3. Agregar el Dominio:**
- Click en "Add domain"
- Escribe: `tapati.online`
- Click en "Add"

**4. Confirmar:**
Verás el dominio agregado a la lista inmediatamente.

### Opción B: Verificar Dominios Actuales

En Firebase Console → Authentication → Settings → Authorized domains, deberías ver:

```
Authorized domains
These domains are allowed to use Firebase Authentication:

• localhost
• citard-fbc26.web.app
• citard-fbc26.firebaseapp.com
• tapati.online  ← Agregar este
```

## 🔍 ¿Por Qué Pasa Esto?

Firebase Authentication tiene una capa de seguridad que solo permite inicios de sesión desde dominios específicamente autorizados. Esto previene que alguien clone tu app y use tu configuración de Firebase.

Cuando configuraste el dominio personalizado en Firebase Hosting, solo se configuró el hosting, pero NO se agregó automáticamente a los dominios autorizados de Authentication.

## ⚡ Solución Alternativa Temporal

Mientras agregas el dominio en Firebase Console, puedes usar el dominio original:

```
https://citard-fbc26.web.app
```

Este dominio ya está autorizado y funcionará inmediatamente.

## 🎯 Después de Agregar el Dominio

Una vez agregado `tapati.online` a los dominios autorizados:

1. **Limpia el cache del navegador**
2. **Recarga la página**
3. **Inicia sesión normalmente**

El login debería funcionar instantáneamente.

## 📝 Notas Importantes

### ✅ Esto NO afecta:
- Tus datos existentes
- Cuentas de usuarios
- Configuración de Firebase
- El dominio en sí

### ✅ Solo necesitas:
- Agregar el dominio a la lista de autorizados
- Hacerlo UNA SOLA VEZ
- No requiere redeploy ni cambios de código

### ✅ Después de esto:
- El login funcionará en `tapati.online`
- También seguirá funcionando en `citard-fbc26.web.app`
- Ambos dominios usarán los mismos datos

## 🚨 Si Aún No Funciona

### Verificar en Consola del Navegador

1. Ve a https://tapati.online
2. Presiona `F12`
3. Ve a la pestaña "Console"
4. Intenta iniciar sesión
5. Busca errores que digan:

```
Firebase: Error (auth/unauthorized-domain)
```

Si ves este error, confirma que el dominio está en la lista de autorizados.

### Verificar Configuración de Firebase

Asegúrate de que el archivo `.env.local` tenga la configuración correcta:

```env
VITE_FIREBASE_API_KEY=tu-api-key
VITE_FIREBASE_AUTH_DOMAIN=citard-fbc26.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=citard-fbc26
...
```

## 🎉 Confirmación de Éxito

Sabrás que funcionó cuando:
1. ✅ Puedes iniciar sesión en https://tapati.online
2. ✅ No aparece el mensaje de error
3. ✅ Ves tu perfil correctamente
4. ✅ Todas las funciones de la app funcionan

## 📞 Próximos Pasos

Una vez que agregues el dominio:
1. Avísame si funcionó
2. Si hay algún otro error, copia el mensaje exacto
3. Podemos verificar la configuración juntos

---

**Resumen**: Solo necesitas agregar `tapati.online` a los dominios autorizados en Firebase Console → Authentication → Settings → Authorized domains. Es un cambio de 30 segundos que resolverá el problema inmediatamente.
