# 🚀 GUÍA RÁPIDA: Configurar API Key (5 minutos)

## 📍 ESTÁS AQUÍ: Paso 4 - Configurar Restricciones de API

Ya creaste la API Key. Ahora necesitas configurar las restricciones de API para que funcione con notificaciones.

---

## ✅ PASO 4: Seleccionar las 7 APIs Necesarias

### 1️⃣ Busca la sección "Restricciones de API"

En la ventana de configuración de tu API Key, verás:

```
Restricciones de API
○ No restringir clave
● Restringir clave
```

**IMPORTANTE**: Selecciona **"Restringir clave"** (segundo radio button)

---

### 2️⃣ Click en el menú desplegable "Seleccionar APIs"

Verás un campo de búsqueda. Busca y selecciona estas 7 APIs **UNA POR UNA**:

#### ✅ API 1: Cloud Firestore API
- Escribe: `Cloud Firestore API`
- Click en el checkbox para seleccionarla

#### ✅ API 2: Cloud Storage for Firebase API
- Escribe: `Cloud Storage for Firebase API`
- Click en el checkbox para seleccionarla

#### ✅ API 3: Firebase Cloud Messaging API ⭐ CRÍTICA
- Escribe: `Firebase Cloud Messaging API`
- Click en el checkbox para seleccionarla
- **Esta es la que falta en tu API Key actual**

#### ✅ API 4: Firebase Installations API ⭐ CRÍTICA
- Escribe: `Firebase Installations API`
- Click en el checkbox para seleccionarla
- **Esta también es necesaria para notificaciones**

#### ✅ API 5: Firebase Management API
- Escribe: `Firebase Management API`
- Click en el checkbox para seleccionarla

#### ✅ API 6: Identity Toolkit API
- Escribe: `Identity Toolkit API`
- Click en el checkbox para seleccionarla

#### ✅ API 7: Token Service API
- Escribe: `Token Service API`
- Click en el checkbox para seleccionarla

---

### 3️⃣ Verificar que las 7 APIs están seleccionadas

Deberías ver algo como:

```
APIs seleccionadas (7):
✓ Cloud Firestore API
✓ Cloud Storage for Firebase API
✓ Firebase Cloud Messaging API
✓ Firebase Installations API
✓ Firebase Management API
✓ Identity Toolkit API
✓ Token Service API
```

---

### 4️⃣ Click en "GUARDAR"

- Click en el botón **"GUARDAR"** (o "SAVE")
- Espera a que se guarden los cambios (puede tardar unos segundos)

---

### 5️⃣ Copiar la API Key

Una vez guardada, verás tu nueva API Key. Algo como:

```
AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**COPIA ESTA API KEY** (click en el icono de copiar o selecciona y copia)

---

## 🔧 PASO 5: Actualizar .env.local

### 1️⃣ Abre el archivo `.env.local`

En tu proyecto `cita-rd`, abre el archivo `.env.local`

### 2️⃣ Reemplaza la API Key

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

### 3️⃣ Guarda el archivo

- Guarda el archivo (Ctrl+S)
- El servidor debería recargarse automáticamente

---

## ✅ PASO 6: Probar las Notificaciones

### 1️⃣ Limpiar caché del navegador

- Abre DevTools (F12)
- Click derecho en el botón de recargar
- Selecciona **"Empty Cache and Hard Reload"**

### 2️⃣ Ir a la app

1. Ve a http://localhost:3000/
2. Inicia sesión
3. Ve a **Perfil** → **Configuración** (⚙️)
4. Click en **"Activar Notificaciones"**
5. Acepta el permiso del navegador

### 3️⃣ Verificar en la consola

Deberías ver:

```
🔔 [AccountSettings] Solicitando permiso de notificaciones...
🔔 [AccountSettings] Permiso concedido: true
🎫 [AccountSettings] Obteniendo y guardando token para userId: ...
✅ [AccountSettings] Token obtenido y guardado: SÍ
🔍 [AccountSettings] Verificando que el token se guardó en Firestore...
📄 [AccountSettings] Token existe en Firestore: true
📄 [AccountSettings] Datos del token: {token: "...", userId: "...", ...}
```

**Si ves el token**: ✅ ¡Perfecto! Las notificaciones funcionan

**Si ves error 403**: ❌ Revisa que las 7 APIs estén seleccionadas

---

## 🆘 ¿Necesitas Ayuda?

### Si todavía ves error 403:

1. **Verifica que las 7 APIs estén habilitadas**:
   - Ve a: https://console.cloud.google.com/apis/library?project=citard-fbc26
   - Busca "Firebase Cloud Messaging API"
   - Si dice "Habilitar", click en ese botón
   - Repite para "Firebase Installations API"

2. **Espera 5-10 minutos**:
   - Los cambios pueden tardar en propagarse
   - Limpia caché del navegador
   - Vuelve a probar

3. **Verifica la API Key en .env.local**:
   - Asegúrate de que copiaste la API Key correcta
   - No debe tener espacios al inicio o al final
   - Debe empezar con `AIzaSy...`

---

## 📊 Checklist Rápido

- [ ] Seleccionar "Restringir clave" en Restricciones de API
- [ ] Seleccionar las 7 APIs (especialmente Firebase Cloud Messaging API)
- [ ] Click en "GUARDAR"
- [ ] Copiar la nueva API Key
- [ ] Actualizar VITE_FIREBASE_API_KEY en .env.local
- [ ] Guardar el archivo
- [ ] Limpiar caché del navegador
- [ ] Probar activar notificaciones
- [ ] Verificar token en consola

---

**Fecha**: 07 Febrero 2026  
**Tiempo estimado**: 5 minutos  
**Estado**: Paso 4 - Configurar Restricciones de API

¡Vamos a resolver esto! 🚀
