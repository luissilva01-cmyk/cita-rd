# 🚀 EMPIEZA AQUÍ: Diagnóstico Tokens FCM

## ⚡ Acción Inmediata (5 minutos)

### Opción 1: Herramienta de Diagnóstico (Recomendado)

1. **Abre el archivo de diagnóstico**:
   ```
   cita-rd/test-fcm-token-debug.html
   ```

2. **Sigue estos pasos en orden**:
   - ✅ Verificar Estado del Sistema (debe estar todo en verde)
   - ✅ Autenticación (ingresa un userId o inicia sesión)
   - ✅ Solicitar Permiso (click en "Solicitar Permiso")
   - ✅ Obtener Token (click en "Obtener Token")
   - ✅ Guardar Token (click en "Guardar Token en Firestore")
   - ✅ Verificar (click en "Verificar Colección fcmTokens")

3. **Revisa los logs**:
   - Los logs te dirán exactamente dónde falla
   - Si todo funciona, verás ✅ en cada paso
   - Si algo falla, verás ❌ con el error exacto

### Opción 2: Verificación Rápida en la App

1. **Abre la app en el navegador**
2. **Abre DevTools (F12)**
3. **Ve a la pestaña Console**
4. **Ve a Profile > Configuración de Cuenta**
5. **Activa las notificaciones**
6. **Revisa los logs en la consola**

Busca estos mensajes:
```
✅ Service Worker registered
✅ FCM Token obtained
✅ FCM token saved to Firestore
```

Si ves errores, cópialos y revisa `SOLUCION_TOKENS_FCM.md`.

## 🔍 Verificación en Firestore

### Método 1: Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a Firestore Database
4. Busca la colección `fcmTokens`
5. ¿Existe? ¿Tiene documentos?

### Método 2: Consola del Navegador
```javascript
// Pega esto en la consola del navegador
import { getFirestore, doc, getDoc } from 'firebase/firestore';
const db = getFirestore();
const userId = 'TU_USER_ID'; // Reemplaza con tu userId real
const tokenDoc = await getDoc(doc(db, 'fcmTokens', userId));
console.log(tokenDoc.exists() ? '✅ Token guardado' : '❌ Token NO guardado');
if (tokenDoc.exists()) {
  console.log('Datos:', tokenDoc.data());
}
```

## 📊 Resultados Posibles

### ✅ Caso 1: Todo Funciona
Si el token se guarda correctamente:
- La colección `fcmTokens` existe
- Hay un documento con tu userId
- El documento tiene el campo `token`

**Acción**: El problema está resuelto. Verifica que las notificaciones lleguen.

### ❌ Caso 2: Token No Se Obtiene
Si el token FCM no se obtiene:
- Verifica que el Service Worker esté registrado
- Verifica que la VAPID key sea correcta
- Verifica que Firebase Messaging esté habilitado

**Acción**: Revisa `DIAGNOSTICO_TOKENS_FCM.md` sección "Token no se obtiene"

### ❌ Caso 3: Token No Se Guarda
Si el token se obtiene pero no se guarda:
- Verifica las reglas de Firestore
- Verifica que el usuario esté autenticado
- Verifica que no haya errores en la consola

**Acción**: Revisa `SOLUCION_TOKENS_FCM.md` sección "Mejoras al código"

### ❌ Caso 4: Error de Permisos
Si ves error `permission-denied`:
- Las reglas de Firestore están bloqueando la escritura
- El usuario no está autenticado correctamente
- El userId no coincide con el auth.uid

**Acción**: Verifica las reglas en `firestore.rules`

## 🛠️ Solución Rápida (Si Tienes Prisa)

Si necesitas una solución rápida para testing:

### 1. Verificar Reglas de Firestore
```javascript
// En firestore.rules, asegúrate de tener:
match /fcmTokens/{userId} {
  allow read: if isOwner(userId);
  allow write: if isOwner(userId);
}
```

### 2. Agregar Logging Extra
En `notificationService.ts`, línea ~130, agrega:
```typescript
console.log('🔍 Guardando token:', { userId, tokenLength: token.length });
```

### 3. Verificar Después de Guardar
En `notificationService.ts`, después de `setDoc`, agrega:
```typescript
const savedDoc = await getDoc(doc(db, 'fcmTokens', userId));
console.log('✅ Verificado:', savedDoc.exists());
```

### 4. Reiniciar el Servidor
```bash
npm run dev
```

## 📚 Documentación Completa

Si necesitas más detalles:

1. **`DIAGNOSTICO_TOKENS_FCM.md`** - Diagnóstico completo
2. **`SOLUCION_TOKENS_FCM.md`** - Soluciones y mejoras
3. **`RESUMEN_TOKENS_FCM_06_FEB.md`** - Resumen ejecutivo
4. **`PROBLEMA_TOKENS_NO_GUARDADOS.md`** - Problema original

## 🎯 Objetivo Final

Al terminar, debes tener:

- ✅ Colección `fcmTokens` en Firestore
- ✅ Documentos con tokens de usuarios
- ✅ Notificaciones funcionando
- ✅ Sin errores en la consola

## 🆘 ¿Necesitas Ayuda?

Si después de seguir estos pasos aún tienes problemas:

1. Copia los logs de la consola
2. Copia el error exacto
3. Verifica en Firebase Console si la colección existe
4. Revisa `SOLUCION_TOKENS_FCM.md` para soluciones específicas

---

**Tiempo estimado**: 5-10 minutos  
**Dificultad**: Fácil  
**Prioridad**: Alta
