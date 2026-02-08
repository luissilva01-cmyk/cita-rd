# 🔄 Continuación: Resolver Tokens FCM (07 Feb 2026)

## 📊 Estado Actual

### ❌ Problema Confirmado

El usuario activó y desactivó las notificaciones, y el resultado fue:

```javascript
{
  token: null,
  updatedAt: _Timestamp,
  deleted: true
}
```

**Error en consola:**
```
FirebaseError: Messaging: A problem occurred while subscribing the user to FCM: 
Requests to this API fcmregistrations.googleapis.com method 
google.firebase.fcm.registration.v1.RegistrationApi.CreateRegistration are blocked. 
(messaging/token-subscribe-failed)
```

### 🔍 Causa Raíz

La API Key actual (`AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg`) **NO tiene permisos** para:
- ❌ Firebase Cloud Messaging API
- ❌ Firebase Installations API

Por eso el error 403 (Forbidden).

---

## ✅ Solución en Progreso

### Pasos Completados

1. ✅ Usuario navegó a Google Cloud Console → Credenciales
2. ✅ Usuario hizo click en "+ Crear credenciales" → "Clave de API"
3. ✅ Se abrió la ventana de configuración de la nueva API Key

### 🔄 Paso Actual: Configurar Restricciones de API

El usuario necesita:

1. **Seleccionar "Restringir clave"** en la sección "Restricciones de API"
2. **Seleccionar estas 7 APIs** en el menú desplegable:
   - Cloud Firestore API
   - Cloud Storage for Firebase API
   - **Firebase Cloud Messaging API** ⭐ CRÍTICA
   - **Firebase Installations API** ⭐ CRÍTICA
   - Firebase Management API
   - Identity Toolkit API
   - Token Service API
3. **Click en "GUARDAR"**
4. **Copiar la nueva API Key**

---

## 📋 Próximos Pasos

### Después de Crear la API Key

1. **Actualizar `.env.local`**:
   ```env
   # API Key de Producción con restricciones correctas
   VITE_FIREBASE_API_KEY=NUEVA_API_KEY_AQUI
   
   # API Key antigua (con problemas - NO USAR)
   # VITE_FIREBASE_API_KEY=AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg
   ```

2. **Reiniciar el servidor** (debería recargarse automáticamente)

3. **Limpiar caché del navegador**:
   - F12 → Click derecho en recargar → "Empty Cache and Hard Reload"

4. **Probar las notificaciones**:
   - Ir a http://localhost:3000/
   - Iniciar sesión
   - Ir a Perfil → Configuración (⚙️)
   - Click en "Activar Notificaciones"
   - Aceptar permiso del navegador

5. **Verificar en la consola**:
   ```
   ✅ [AccountSettings] Token obtenido y guardado: SÍ
   📄 [AccountSettings] Token existe en Firestore: true
   📄 [AccountSettings] Datos del token: {token: "...", userId: "...", ...}
   ```

6. **Verificar en Firestore**:
   - Ir a Firebase Console → Firestore
   - Buscar colección `fcmTokens`
   - Verificar que el documento tiene un `token` válido (no `null`)

---

## 📚 Documentos de Referencia

- **Guía Completa**: `CREAR_API_KEY_PRODUCCION.md` (paso a paso detallado)
- **Guía Rápida**: `GUIA_RAPIDA_CREAR_API_KEY.md` (5 minutos)
- **Servicio de Notificaciones**: `services/notificationService.ts`
- **Componente de Configuración**: `components/AccountSettings.tsx`

---

## 🔍 Logging Detallado

El componente `AccountSettings.tsx` tiene logging detallado para debugging:

```typescript
console.log('🔔 [AccountSettings] Solicitando permiso de notificaciones...');
console.log('🔔 [AccountSettings] Permiso concedido:', granted);
console.log('🎫 [AccountSettings] Obteniendo y guardando token para userId:', currentUserId);
console.log('✅ [AccountSettings] Token obtenido y guardado:', token ? 'SÍ' : 'NO');
console.log('🔍 [AccountSettings] Verificando que el token se guardó en Firestore...');
console.log('📄 [AccountSettings] Token existe en Firestore:', tokenDoc.exists());
console.log('📄 [AccountSettings] Datos del token:', tokenDoc.data());
```

Esto nos permite ver exactamente dónde falla el proceso.

---

## ⚠️ Importante

### Por Qué Crear una Nueva API Key

- ✅ **Seguridad**: La API Key actual puede tener configuraciones incorrectas
- ✅ **Limpieza**: Empezar desde cero garantiza que todo esté bien configurado
- ✅ **Producción**: La nueva API Key tendrá las restricciones correctas desde el inicio
- ✅ **Sin Riesgos**: Cambiar la API Key NO afecta datos existentes (usuarios, matches, mensajes, fotos)

### Qué NO se Afecta

- ✅ Usuarios existentes
- ✅ Matches y conversaciones
- ✅ Fotos y stories
- ✅ Configuraciones de privacidad
- ✅ Verificaciones de identidad
- ✅ Cualquier otro dato en Firestore

La API Key es solo una **credencial de acceso**, como cambiar una llave de la casa. Los muebles (datos) siguen ahí.

---

## 🎯 Objetivo Final

Una vez que la nueva API Key esté configurada y funcionando:

1. ✅ Los tokens FCM se generarán correctamente
2. ✅ Los tokens se guardarán en Firestore
3. ✅ Las notificaciones push funcionarán
4. ✅ Los usuarios recibirán alertas de mensajes y matches
5. ✅ La app estará lista para producción (98% → 100%)

---

**Fecha**: 07 Febrero 2026  
**Hora**: Continuación de sesión  
**Estado**: Esperando que el usuario complete Paso 4 (Configurar Restricciones de API)  
**Próxima Acción**: Usuario debe seleccionar las 7 APIs y guardar la nueva API Key

¡Estamos muy cerca de resolver esto! 🚀
