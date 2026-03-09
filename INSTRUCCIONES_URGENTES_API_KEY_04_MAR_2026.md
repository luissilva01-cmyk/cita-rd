# 🚨 ACCIÓN URGENTE: Agregar tapati.online a la API Key
**Fecha**: 4 de marzo de 2026
**Tiempo estimado**: 3 minutos

## 🎯 El Problema

Estás viendo este error en la consola:
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB-w84pDXdqj_73Z16FM7aehFTQQy1RnXs 403 (Forbidden)
```

**Causa**: Tu API Key de Firebase NO permite requests desde `tapati.online`.

## ✅ SOLUCIÓN (3 pasos simples)

### Paso 1: Abrir Google Cloud Console

**Opción A - Link Directo (más rápido):**
```
https://console.cloud.google.com/apis/credentials?project=citard-fbc26
```

**Opción B - Manual:**
1. Ve a: https://console.cloud.google.com
2. Selecciona proyecto: **citard-fbc26**
3. Menú lateral → **APIs & Services** → **Credentials**

---

### Paso 2: Editar la API Key

En la página de Credentials, busca:

```
Browser key (auto created by Firebase)
```

O la que termina en: `...QQy1RnXs`

**Haz click en el nombre** (no en el ícono de copiar, sino en el texto del nombre).

---

### Paso 3: Agregar tapati.online

1. Baja hasta **Application restrictions**
2. Verás **HTTP referrers (web sites)** seleccionado
3. En **Website restrictions**, verás una lista como:
   ```
   localhost/*
   citard-fbc26.web.app/*
   citard-fbc26.firebaseapp.com/*
   ```

4. **Haz click en "+ ADD AN ITEM"**

5. **Agrega estos DOS dominios** (uno por uno):
   ```
   tapati.online/*
   ```
   
   Luego click en "+ ADD AN ITEM" de nuevo y agrega:
   ```
   *.tapati.online/*
   ```

6. **Haz click en "SAVE"** (botón azul abajo)

---

## ⏱️ Esperar 2 Minutos

Los cambios tardan 1-2 minutos en propagarse.

**Mientras esperas**, puedes:
- Tomar un café ☕
- Revisar tu email 📧
- Mirar por la ventana 🪟

---

## 🧪 Probar que Funciona

Después de 2 minutos:

1. Ve a: **https://tapati.online**
2. Presiona: **Ctrl + Shift + R** (recarga forzada)
3. Abre DevTools: **F12**
4. Ve a la pestaña **Console**
5. **Intenta iniciar sesión**

### ✅ Si Funciona:
- NO verás el error 403
- Podrás acceder a tu perfil
- Todo funcionará normal

### ❌ Si NO Funciona:
- Copia el error que aparece en la consola
- Compártelo conmigo
- Verificaremos juntos

---

## 📋 Configuración Final Esperada

Después de agregar los dominios, tu API Key debería tener:

```
Application restrictions:
  ✓ HTTP referrers (web sites)

Website restrictions:
  ✓ localhost/*
  ✓ citard-fbc26.web.app/*
  ✓ citard-fbc26.firebaseapp.com/*
  ✓ tapati.online/*              ← NUEVO
  ✓ *.tapati.online/*            ← NUEVO
```

---

## 🎯 Por Qué Es Necesario

Firebase tiene DOS niveles de seguridad:

| Nivel | Qué Controla | Estado |
|-------|--------------|--------|
| **Firebase Authentication** | Dominios autorizados para usar Auth | ✅ Ya configurado |
| **Google Cloud API Key** | Dominios que pueden hacer requests | ⏳ Falta configurar |

Ambos deben estar configurados para que funcione.

---

## 💡 Nota Importante

- **NO necesitas redeployar** la app
- **NO necesitas cambiar código**
- **NO necesitas esperar 24 horas**
- Solo agregar el dominio a la API Key y esperar 2 minutos

---

## 🆘 Si Tienes Problemas

Si no encuentras la API Key o tienes dudas:

1. Toma un screenshot de la página de Credentials
2. Compártelo conmigo
3. Te guiaré paso a paso

---

**Avísame cuando hayas agregado el dominio y esperado 2 minutos. Luego probamos juntos.**
