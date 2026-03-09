# 🚨 SOLUCIÓN: Error 403 - API Key Bloqueada para tapati.online
**Fecha**: 4 de marzo de 2026
**Error**: `POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword 403 (Forbidden)`

## 🎯 Causa del Problema

Tu API Key de Firebase tiene restricciones de dominio que NO incluyen `tapati.online`.

**API Key actual**: `AIzaSyB-w84pDXdqj_73Z16FM7aehFTQQy1RnXs`

Esta API Key solo permite requests desde:
- ✅ `localhost`
- ✅ `citard-fbc26.web.app`
- ✅ `citard-fbc26.firebaseapp.com`
- ❌ `tapati.online` (FALTA AGREGAR)

## ✅ SOLUCIÓN (5 minutos)

### Paso 1: Ir a Google Cloud Console

Abre este enlace directo:
```
https://console.cloud.google.com/apis/credentials?project=citard-fbc26
```

O manualmente:
1. Ve a: https://console.cloud.google.com
2. Selecciona el proyecto: **citard-fbc26**
3. En el menú lateral, ve a **APIs & Services** → **Credentials**

### Paso 2: Encontrar tu API Key

En la lista de credenciales, busca:
```
Browser key (auto created by Firebase)
```

O busca la que termina en: `...QQy1RnXs`

Haz click en el nombre de la API Key para editarla.

### Paso 3: Agregar tapati.online a las Restricciones

1. Baja hasta la sección **Application restrictions**
2. Debería estar seleccionado: **HTTP referrers (web sites)**
3. En la lista de **Website restrictions**, verás algo como:
   ```
   localhost/*
   citard-fbc26.web.app/*
   citard-fbc26.firebaseapp.com/*
   ```

4. Haz click en **+ ADD AN ITEM**
5. Agrega estos dos:
   ```
   tapati.online/*
   *.tapati.online/*
   ```

6. Haz click en **SAVE** (abajo)

### Paso 4: Esperar 1-2 Minutos

Los cambios en las restricciones de API Key tardan 1-2 minutos en propagarse.

### Paso 5: Probar

1. Espera 2 minutos
2. Ve a https://tapati.online
3. Recarga la página (`Ctrl + Shift + R`)
4. Intenta iniciar sesión

**Debería funcionar inmediatamente.**

## 📋 Configuración Final de la API Key

Después de agregar `tapati.online`, tu API Key debería tener estas restricciones:

```
Application restrictions:
  Type: HTTP referrers (web sites)
  
Website restrictions:
  ✅ localhost/*
  ✅ citard-fbc26.web.app/*
  ✅ citard-fbc26.firebaseapp.com/*
  ✅ tapati.online/*
  ✅ *.tapati.online/*
```

## 🔍 Verificar que Funcionó

Después de agregar el dominio y esperar 2 minutos:

1. Ve a https://tapati.online
2. Abre DevTools (`F12`)
3. Ve a la pestaña "Console"
4. Intenta login
5. **NO debería aparecer el error 403**

Si funciona, verás tu perfil correctamente.

## 📝 Resumen de Configuraciones Necesarias

Para que `tapati.online` funcione completamente, necesitas:

### 1. Firebase Hosting ✅ (YA HECHO)
- Dominio agregado en Firebase Console → Hosting
- DNS configurado correctamente
- SSL activo

### 2. Firebase Authentication ✅ (YA HECHO)
- `tapati.online` en la lista de dominios autorizados
- Firebase Console → Authentication → Settings → Authorized domains

### 3. Google Cloud API Key ⏳ (HACER AHORA)
- `tapati.online/*` en las restricciones de la API Key
- Google Cloud Console → APIs & Services → Credentials

## 🎯 Por Qué Pasa Esto

Firebase tiene DOS niveles de seguridad:

**Nivel 1: Firebase Authentication (Authorized Domains)**
- Controla desde qué dominios se puede usar Firebase Auth
- Ya lo agregaste ✅

**Nivel 2: Google Cloud API Key (HTTP Referrers)**
- Controla desde qué dominios se pueden hacer requests a la API
- Falta agregarlo ⏳

Ambos deben estar configurados para que funcione.

## ⚡ Solución Temporal

Mientras agregas el dominio a la API Key, puedes usar:
```
https://citard-fbc26.web.app
```

Este dominio ya está autorizado en ambos niveles.

## 📞 Después de Agregar el Dominio

Una vez que agregues `tapati.online/*` a las restricciones de la API Key:

1. Espera 2 minutos (propagación)
2. Recarga https://tapati.online
3. Inicia sesión
4. Debería funcionar perfectamente

Avísame cuando lo hagas y te confirmo que todo esté bien.

---

**Nota Importante**: Este es el último paso. Una vez que agregues el dominio a las restricciones de la API Key, `tapati.online` funcionará completamente igual que `citard-fbc26.web.app`.
