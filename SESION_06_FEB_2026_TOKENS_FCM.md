# Sesión 06 Febrero 2026 - Diagnóstico Tokens FCM

## Problema Identificado

Los tokens FCM no se están guardando en Firestore debido a un error de permisos en la API de Firebase Installations.

### Error Específico

```
403 PERMISSION_DENIED: Requests to this API firebaseinstallations.googleapis.com 
method google.firebase.installations.v1.FirebaseInstallationsService.CreateInstallation are blocked.
```

## Causa Raíz

La **Firebase Installations API** no está habilitada en el proyecto de Google Cloud. Esta API es requerida para:
- Generar tokens FCM
- Registrar dispositivos para notificaciones push
- Gestionar instalaciones de Firebase

## Solución

### Opción 1: Google Cloud Console

1. Ve a https://console.cloud.google.com/
2. Selecciona el proyecto `citard-fbc26`
3. Ve a "APIs & Services" → "Library"
4. Busca "Firebase Installations API"
5. Click en "Enable"

**Link directo:**
```
https://console.cloud.google.com/apis/library/firebaseinstallations.googleapis.com?project=citard-fbc26
```

### Opción 2: Firebase Console

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Project Settings (engranaje)
4. Pestaña "Cloud Messaging"
5. Habilitar la API si hay un botón disponible

## Trabajo Realizado en Esta Sesión

### 1. Servidor Migrado a Puerto 3000
- ✅ Detenido servidor en puerto 3001
- ✅ Liberado puerto 3000
- ✅ Servidor corriendo en http://localhost:3000/

### 2. Error de Matches.tsx Corregido
- ✅ Agregada validación `Array.isArray()` para `interests`
- ✅ Previene error cuando `interests` no es un array

**Archivo:** `cita-rd/views/views/Matches.tsx` línea 189

```typescript
{Array.isArray(match.user.interests) && match.user.interests.slice(0, 3).map(...)}
```

### 3. Logging Mejorado en AccountSettings
- ✅ Agregados logs detallados del flujo de activación de notificaciones
- ✅ Agregada verificación de guardado en Firestore
- ✅ Imports de Firestore agregados

**Archivo:** `cita-rd/components/AccountSettings.tsx`

```typescript
import { getFirestore, doc, getDoc } from 'firebase/firestore';

// Logs agregados:
console.log('🔔 [AccountSettings] Solicitando permiso...');
console.log('🎫 [AccountSettings] Obteniendo y guardando token...');
console.log('🔍 [AccountSettings] Verificando que el token se guardó...');
console.log('📄 [AccountSettings] Token existe en Firestore:', tokenDoc.exists());
```

### 4. Testing Realizado
- ✅ Desactivación de notificaciones funciona correctamente
- ✅ Activación falla por API bloqueada (esperado)
- ✅ Error identificado claramente en consola

## Estado Actual

### ✅ Funcionando
- Desactivación de notificaciones
- Eliminación de tokens
- UI de configuración
- Logging y diagnóstico

### ❌ Bloqueado (Requiere Acción)
- Generación de tokens FCM
- Guardado de tokens en Firestore
- **Causa:** Firebase Installations API no habilitada

## Próximos Pasos

1. **INMEDIATO:** Habilitar Firebase Installations API en Google Cloud Console
2. **DESPUÉS:** Probar activación de notificaciones nuevamente
3. **VERIFICAR:** Que el token se guarde en Firestore colección `fcmTokens`
4. **TESTING:** Enviar notificación de prueba desde Firebase Console

## Archivos Modificados

1. `cita-rd/components/AccountSettings.tsx` - Logging mejorado
2. `cita-rd/views/views/Matches.tsx` - Fix de error de interests

## Documentación Relacionada

- `DIAGNOSTICO_TOKENS_FCM.md` - Diagnóstico completo
- `SOLUCION_TOKENS_FCM.md` - Soluciones propuestas
- `TESTING_TOKENS_FCM_AHORA.md` - Guía de testing
- `FLUJO_TOKENS_FCM_VISUAL.md` - Diagramas del flujo

## Notas Importantes

- El código de notificaciones está correcto
- Las reglas de Firestore permiten escritura en `fcmTokens`
- El Service Worker está configurado correctamente
- El problema es únicamente de permisos de API en Google Cloud

---

**Fecha:** 06 Febrero 2026  
**Estado:** Problema identificado, solución clara  
**Prioridad:** Alta - Bloquea funcionalidad de notificaciones push
