# 📋 Instrucciones Finales - Push Notifications

## 🎯 Objetivo

Completar la configuración de Push Notifications para que la app pueda enviar notificaciones a los usuarios.

---

## ⏱️ Tiempo Estimado: 5-10 minutos

---

## 📝 PASO A PASO

### ✅ PASO 1: Obtener VAPID Key (2 minutos)

1. **Abre Firebase Console:**
   ```
   https://console.firebase.google.com/project/citard-fbc26/settings/cloudmessaging
   ```

2. **Navega a la sección correcta:**
   - Haz clic en el ícono de ⚙️ (Settings) en la barra lateral
   - Selecciona **"Project settings"**
   - Haz clic en la pestaña **"Cloud Messaging"**

3. **Genera o copia la VAPID Key:**
   - Busca la sección **"Web Push certificates"**
   - Si NO hay ninguna key:
     - Haz clic en **"Generate key pair"**
     - Espera unos segundos
   - Copia la **VAPID Key** (es un string largo que empieza con "B...")
   - Ejemplo: `BNxS7xK9...` (mucho más largo)

4. **Actualiza el código:**
   - Abre el archivo: `cita-rd/services/notificationService.ts`
   - Ve a la **línea 8**
   - Reemplaza `'TU_VAPID_KEY_AQUI'` con tu VAPID Key:
   
   ```typescript
   // ANTES:
   const VAPID_KEY = 'TU_VAPID_KEY_AQUI';
   
   // DESPUÉS:
   const VAPID_KEY = 'BNxS7xK9...tu_key_completa_aqui';
   ```

5. **Guarda el archivo** (Ctrl+S o Cmd+S)

---

### ✅ PASO 2: Desplegar Cloud Functions (3-5 minutos)

1. **Abre la terminal en el directorio del proyecto:**
   ```bash
   cd cita-rd
   ```

2. **Despliega las Cloud Functions:**
   ```bash
   firebase deploy --only functions
   ```

3. **Espera a que termine el despliegue:**
   - Verás mensajes como:
     ```
     ✔  functions[sendMessageNotification]: Successful create operation.
     ✔  functions[sendMatchNotification]: Successful create operation.
     ✔  functions[sendStoryNotification]: Successful create operation.
     ```

4. **Verifica que se desplegaron correctamente:**
   ```bash
   firebase functions:list
   ```
   
   Deberías ver:
   - `sendMessageNotification`
   - `sendMatchNotification`
   - `sendStoryNotification`

---

### ✅ PASO 3: Probar las Notificaciones (2-3 minutos)

#### 3.1 Probar Solicitud de Permisos

1. **Abre la app en el navegador:**
   ```
   http://localhost:3000
   ```

2. **Inicia sesión** con tu cuenta

3. **Verifica que tu perfil esté completo:**
   - Al menos 1 foto
   - Bio escrita
   - Provincia seleccionada

4. **Espera 3 segundos** → Debería aparecer un prompt bonito con gradiente rosa

5. **Haz clic en "Activar"**

6. **Acepta el permiso** cuando el navegador lo pida

7. **Verifica la notificación de prueba:**
   - Deberías ver: "🎉 Ta' Pa' Ti - Las notificaciones están funcionando correctamente!"

#### 3.2 Probar Notificación de Mensaje

1. **Abre la app en 2 navegadores diferentes** (o 2 ventanas de incógnito)

2. **Inicia sesión con 2 usuarios diferentes**

3. **Usuario A envía mensaje a Usuario B**

4. **Usuario B debería recibir notificación push** (incluso si la app está en background)

#### 3.3 Probar Notificación de Match

1. **Usuario A da like a Usuario B** (en Discovery)

2. **Se crea match automáticamente**

3. **Ambos usuarios deberían recibir notificación:**
   - "🎉 ¡Nuevo Match! ¡Hiciste match con [nombre]!"

#### 3.4 Probar Notificación de Story

1. **Usuario A publica una story**

2. **Sus matches deberían recibir notificación:**
   - "[Nombre] publicó una historia"

---

### ✅ PASO 4: Verificar que Todo Funciona (1 minuto)

#### 4.1 Verificar Token en Firestore

1. **Abre Firebase Console:**
   ```
   https://console.firebase.google.com/project/citard-fbc26/firestore
   ```

2. **Busca la colección `fcmTokens`**

3. **Verifica que hay un documento con tu userId**

4. **El documento debe tener:**
   - `token`: String largo (el FCM token)
   - `userId`: Tu user ID
   - `platform`: "web"
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

#### 4.2 Verificar Service Worker

1. **Abre DevTools** (F12)

2. **Ve a la pestaña "Application"**

3. **En la barra lateral, haz clic en "Service Workers"**

4. **Deberías ver:**
   - `firebase-messaging-sw.js` con estado **"activated"**

#### 4.3 Verificar Logs de Cloud Functions

1. **En la terminal, ejecuta:**
   ```bash
   firebase functions:log
   ```

2. **Deberías ver logs como:**
   ```
   ✅ Notificación de mensaje enviada a: user123
   ✅ Notificación de match enviada a: user456
   ✅ Notificaciones de story enviadas a 3 usuarios
   ```

---

## 🎉 ¡Listo!

Si completaste todos los pasos y las pruebas funcionaron, **¡las notificaciones push están 100% operativas!**

---

## 🐛 Solución de Problemas

### Problema 1: No aparece el prompt de notificaciones

**Posibles causas:**
- El perfil no está completo
- Ya se rechazó antes (guardado en localStorage)
- No han pasado 3 segundos desde el login

**Soluciones:**
1. Verifica que el perfil tenga: fotos, bio, ubicación
2. Abre la consola del navegador (F12) y ejecuta:
   ```javascript
   localStorage.removeItem('notification-declined')
   ```
3. Recarga la página y espera 3 segundos

---

### Problema 2: Error al desplegar Cloud Functions

**Error común:**
```
Error: HTTP Error: 403, Permission denied
```

**Solución:**
1. Verifica que estés autenticado:
   ```bash
   firebase login
   ```

2. Verifica que el proyecto sea correcto:
   ```bash
   firebase use citard-fbc26
   ```

3. Verifica que tengas permisos de editor en el proyecto Firebase

---

### Problema 3: No llegan notificaciones

**Posibles causas:**
- VAPID Key incorrecta
- Cloud Functions no desplegadas
- Token no guardado en Firestore

**Soluciones:**
1. Verifica la VAPID Key en `notificationService.ts` línea 8
2. Verifica que las Cloud Functions estén desplegadas:
   ```bash
   firebase functions:list
   ```
3. Verifica que el token exista en Firestore (ver Paso 4.1)
4. Revisa los logs:
   ```bash
   firebase functions:log
   ```

---

### Problema 4: Solo funciona con app abierta

**Causa:**
Service Worker no está registrado correctamente

**Solución:**
1. Abre DevTools (F12) → Application → Service Workers
2. Verifica que `firebase-messaging-sw.js` esté activo
3. Si no está, haz clic en "Unregister" y recarga la página
4. El Service Worker debería registrarse automáticamente

---

### Problema 5: Error "Messaging: We are unable to register the default service worker"

**Causa:**
El archivo `firebase-messaging-sw.js` no está en la carpeta `public`

**Solución:**
1. Verifica que el archivo exista en: `cita-rd/public/firebase-messaging-sw.js`
2. Si no existe, créalo con el contenido del archivo de implementación
3. Recarga la página

---

## 📞 Soporte Adicional

Si después de seguir todos los pasos y soluciones aún tienes problemas:

1. **Revisa la consola del navegador** (F12) por errores
2. **Revisa los logs de Cloud Functions:**
   ```bash
   firebase functions:log --limit 50
   ```
3. **Verifica la configuración de Firebase:**
   ```bash
   firebase projects:list
   firebase use
   ```

---

## 📚 Documentación de Referencia

- **Guía completa:** `PUSH_NOTIFICATIONS_SETUP.md`
- **Guía rápida:** `PUSH_NOTIFICATIONS_QUICK_START.md`
- **Flujo visual:** `PUSH_NOTIFICATIONS_FLOW.md`
- **Resumen técnico:** `SESION_04_FEB_2026_PUSH_NOTIFICATIONS.md`

---

## ✅ Checklist Final

Marca cada item cuando lo completes:

- [ ] VAPID Key obtenida de Firebase Console
- [ ] VAPID Key actualizada en `notificationService.ts`
- [ ] Cloud Functions desplegadas (`firebase deploy --only functions`)
- [ ] Probado: Solicitud de permisos funciona
- [ ] Probado: Notificación de prueba aparece
- [ ] Probado: Notificación de mensaje funciona
- [ ] Probado: Notificación de match funciona
- [ ] Probado: Notificación de story funciona
- [ ] Verificado: Token guardado en Firestore
- [ ] Verificado: Service Worker activo
- [ ] Verificado: Logs de Cloud Functions muestran éxito

---

## 🚀 Siguiente Paso

Una vez que todas las notificaciones funcionen correctamente, **¡tu app está lista para lanzamiento!**

**Progreso hacia lanzamiento:** 100% 🎉

---

**Fecha:** 4 de Febrero 2026  
**Última actualización:** Implementación completa  
**Estado:** ✅ Listo para configurar y desplegar
