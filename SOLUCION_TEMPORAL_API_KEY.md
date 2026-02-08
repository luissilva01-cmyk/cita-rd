# 🔴 Solución Temporal - API Key Sin Restricciones

## 🎯 Problema Confirmado

El error 403 persiste:
```
Requests to this API fcmregistrations.googleapis.com method 
google.firebase.fcm.registration.v1.RegistrationApi.CreateRegistration are blocked
```

Esto significa que:
- ❌ La API Key NO tiene Firebase Cloud Messaging API habilitada
- ❌ O estás editando una API Key diferente a la que usa tu app

---

## ⚠️ Solución Temporal (SOLO PARA DESARROLLO)

Vamos a crear una **API Key temporal SIN restricciones** para que puedas probar las notificaciones mientras investigamos el problema con la API Key principal.

**IMPORTANTE**: Esta API Key temporal NO debe usarse en producción.

---

## 📋 Pasos para Crear API Key Temporal

### Paso 1: Ir a Google Cloud Console

Ve a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26

### Paso 2: Crear Nueva API Key

1. Click en **"Crear credenciales"** (Create credentials)
2. Selecciona **"Clave de API"** (API key)
3. Se creará una nueva API Key
4. **Copia la API Key** (algo como: AIzaSy...)

### Paso 3: NO Agregar Restricciones (Temporal)

1. En la ventana que aparece, click en **"Cerrar"** (Close)
2. **NO agregues restricciones** por ahora
3. Esta API Key estará sin restricciones temporalmente

### Paso 4: Actualizar .env.local

1. Abre el archivo `cita-rd/.env.local`
2. **Guarda una copia de seguridad** de tu API Key actual
3. Reemplaza `VITE_FIREBASE_API_KEY` con la nueva API Key temporal

**Antes:**
```env
VITE_FIREBASE_API_KEY=AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg
```

**Después:**
```env
# API Key temporal SIN restricciones (SOLO DESARROLLO)
VITE_FIREBASE_API_KEY=TU_NUEVA_API_KEY_AQUI

# API Key original (con restricciones que no funcionan)
# VITE_FIREBASE_API_KEY=AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg
```

### Paso 5: Reiniciar el Servidor

```bash
# Detener el servidor actual (Ctrl+C en la terminal)
# Luego reiniciar:
npm run dev
```

### Paso 6: Probar las Notificaciones

1. Ve a http://localhost:3000/
2. Inicia sesión
3. Ve a Perfil → Configuración (⚙️)
4. Activa las notificaciones
5. **Deberías ver el token FCM generado exitosamente**

---

## ✅ Si Funciona con la API Key Temporal

Esto confirma que:
- ✅ Tu código está bien
- ✅ Firebase está configurado correctamente
- ❌ El problema es con las restricciones de la API Key original

**Próximos pasos:**
1. Investiga por qué la API Key original no funciona
2. Verifica que estás editando la API Key correcta en Google Cloud
3. Una vez resuelto, vuelve a la API Key original con restricciones

---

## 🔍 Investigar API Key Original

Mientras usas la API Key temporal, investiga esto:

### Opción A: Verificar que Estás Editando la API Key Correcta

1. Ve a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. ¿Cuántas API Keys ves en la lista?
3. ¿Cuál es el nombre de cada una?
4. Busca la que termina en **...CRhg**
5. Click en el nombre para editarla
6. Verifica las restricciones

### Opción B: Crear Nueva API Key con Restricciones Correctas

En lugar de usar la API Key original, crea una nueva con las restricciones correctas:

1. Crea una nueva API Key
2. Agrégale un nombre descriptivo: "Ta Pa Ti - Web App"
3. En **"Restricciones de API"**, selecciona **"Restringir clave"**
4. Agrega estas 7 APIs:
   - Cloud Firestore API
   - Cloud Storage for Firebase API
   - **Firebase Cloud Messaging API**
   - **Firebase Installations API**
   - Firebase Management API
   - Identity Toolkit API
   - Token Service API
5. Guarda
6. Espera 10 minutos
7. Actualiza `.env.local` con esta nueva API Key
8. Prueba las notificaciones

---

## 🚨 Importante: Seguridad

### Para Desarrollo (Ahora)
- ✅ Puedes usar API Key sin restricciones
- ✅ Solo tú tienes acceso a localhost:3000
- ✅ No hay riesgo de abuso

### Para Producción (Antes de Lanzar)
- ❌ NUNCA uses API Key sin restricciones
- ✅ SIEMPRE usa restricciones de API
- ✅ SIEMPRE usa restricciones de dominio (solo tu dominio)

---

## 📊 Checklist

- [ ] Crear nueva API Key temporal sin restricciones
- [ ] Copiar la nueva API Key
- [ ] Actualizar `cita-rd/.env.local`
- [ ] Reiniciar servidor (npm run dev)
- [ ] Probar notificaciones en http://localhost:3000/
- [ ] Verificar que el token FCM se genera correctamente
- [ ] Investigar por qué la API Key original no funciona

---

## 🎯 Objetivo Final

Una vez que las notificaciones funcionen con la API Key temporal:

1. Investiga y resuelve el problema con la API Key original
2. Crea una nueva API Key con restricciones correctas
3. Agrega restricciones de dominio para producción
4. Actualiza `.env.local` con la API Key segura
5. Despliega a producción

---

**Fecha**: 07 Febrero 2026  
**Estado**: Error 403 confirmado - API Key sin restricciones correctas  
**Próxima Acción**: Crear API Key temporal sin restricciones para continuar desarrollo

¡Vamos a resolver esto! 🚀
