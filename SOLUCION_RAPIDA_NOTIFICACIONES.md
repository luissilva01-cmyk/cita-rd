# ⚡ SOLUCIÓN RÁPIDA - Notificaciones NO Funcionan

**Problema:** Las notificaciones no están funcionando porque no se están solicitando los permisos.

---

## 🎯 SOLUCIÓN EN 3 PASOS (5 MINUTOS)

### PASO 1: Limpiar localStorage y Cache

**En el navegador donde estás probando:**

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Copia y pega este código:

```javascript
// Limpiar localStorage
localStorage.removeItem('notification-declined');
console.log('✅ localStorage limpiado');

// Verificar permisos actuales
console.log('📋 Permiso actual:', Notification.permission);

// Si el permiso es "denied", necesitas resetear manualmente:
// Chrome: Configuración → Privacidad y seguridad → Configuración de sitios → Notificaciones
// Busca localhost:3000 y elimínalo de la lista de bloqueados
```

4. Recarga la página (Ctrl + R)

---

### PASO 2: Activar Notificaciones Manualmente desde Configuración

**No esperes el prompt automático, actívalas manualmente:**

1. En la app, ve a **Profile** (icono de usuario en la barra inferior)
2. Haz clic en el botón **⚙️ Configuración** (arriba a la derecha)
3. Busca la sección **"Notificaciones Push"**
4. Haz clic en el botón **"Activar Notificaciones"** (naranja)
5. El navegador mostrará un diálogo pidiendo permiso
6. Haz clic en **"Permitir"** o **"Allow"**

**Deberías ver:**
- ✅ El botón cambia a verde
- ✅ Aparece una notificación de prueba: "🎉 Ta' Pa' Ti - Las notificaciones están funcionando correctamente!"
- ✅ En la consola aparece: `🔔 NOTIFICATION FCM Token obtained`

---

### PASO 3: Verificar que Funcionó

**A) Verificar en Console:**
```javascript
// Ejecuta en Console:
console.log('Permiso:', Notification.permission);
// Debe mostrar: "granted"
```

**B) Verificar en Firestore:**
1. Abre Firebase Console: https://console.firebase.google.com/project/citard-fbc26/firestore
2. Ve a la colección **`fcmTokens`**
3. Debe haber un documento con tu `userId`
4. Verifica que tenga un campo `token` con un valor largo

**C) Verificar Service Worker:**
1. En DevTools, ve a **Application** → **Service Workers**
2. Debe aparecer `firebase-messaging-sw.js` con estado **"activated and is running"**

---

## 🧪 PROBAR NOTIFICACIONES

### Prueba 1: Notificación de Mensaje

**Necesitas 2 navegadores:**

1. **Navegador 1 (Chrome normal):**
   - Inicia sesión con Usuario A
   - Activa notificaciones desde Configuración
   - Ve a Messages y abre el chat con Usuario B

2. **Navegador 2 (Chrome incógnito o Firefox):**
   - Inicia sesión con Usuario B
   - Activa notificaciones desde Configuración
   - **Minimiza el navegador** (no lo cierres)

3. **En Navegador 1:**
   - Envía un mensaje: "Hola, probando notificaciones"

4. **En Navegador 2:**
   - Debe aparecer una notificación del sistema
   - Título: "Nombre de Usuario A"
   - Contenido: "Hola, probando notificaciones"

---

## 🔍 VERIFICAR LOGS

### En el Navegador (Console):

Cuando envías un mensaje, deberías ver:
```
💬 CHAT Message sent successfully {chatId: "...", type: "text"}
```

Cuando recibes un mensaje, deberías ver:
```
🔔 NOTIFICATION Foreground message received
```

### En Cloud Functions:

Abre una terminal y ejecuta:
```bash
cd cita-rd
firebase functions:log
```

Cuando se envía un mensaje, deberías ver:
```
✅ Notificación de mensaje enviada a: [userId]
```

---

## ❌ SI NO FUNCIONA

### Problema 1: Permiso "denied"

**Síntoma:** El navegador no muestra el diálogo de permisos.

**Solución:**
1. En Chrome, ve a: `chrome://settings/content/notifications`
2. Busca `localhost:3000` en la lista de bloqueados
3. Elimínalo o muévelo a "Permitidos"
4. Recarga la app y vuelve a intentar

### Problema 2: Service Worker no se registra

**Síntoma:** En DevTools → Application → Service Workers no aparece nada.

**Solución:**
1. En DevTools → Application → Clear storage
2. Marca todas las casillas
3. Haz clic en "Clear site data"
4. Recarga la página (Ctrl + Shift + R)

### Problema 3: Token no se guarda en Firestore

**Síntoma:** La colección `fcmTokens` está vacía.

**Solución:**
1. Verifica que las Firestore Rules permitan escribir:
```javascript
match /fcmTokens/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

2. Verifica en Console que no haya errores:
```
❌ Error saving FCM token to Firestore
```

### Problema 4: Cloud Functions no se ejecutan

**Síntoma:** No hay logs en `firebase functions:log`.

**Solución:**
1. Verifica que las functions estén desplegadas:
```bash
firebase functions:list
```

2. Si no aparecen, despliégalas:
```bash
firebase deploy --only functions
```

---

## 📊 CHECKLIST RÁPIDO

Marca cada item:

- [ ] localStorage limpiado
- [ ] Notificaciones activadas desde Configuración
- [ ] Permiso "granted" en Console
- [ ] Token guardado en Firestore
- [ ] Service Worker activo
- [ ] Notificación de prueba recibida
- [ ] Mensaje de prueba con notificación funciona

---

## 💡 TIPS IMPORTANTES

1. **Ambos usuarios deben tener notificaciones activas** para que funcione
2. **El navegador debe estar abierto** (puede estar minimizado, pero no cerrado)
3. **En web, las notificaciones solo funcionan con navegador abierto** (en PWA funcionarían con app cerrada)
4. **Verifica que no tengas bloqueador de notificaciones** en el sistema operativo

---

## 🎯 RESULTADO ESPERADO

Cuando todo funcione correctamente:

1. ✅ Activar notificaciones → Notificación de prueba aparece
2. ✅ Enviar mensaje → Receptor recibe notificación
3. ✅ Crear match → Ambos usuarios reciben notificación
4. ✅ Publicar story → Matches reciben notificación
5. ✅ Click en notificación → Abre la app en la sección correcta

---

**Fecha:** 5 de Febrero 2026  
**Tiempo estimado:** 5-10 minutos  
**Dificultad:** Fácil

**¿Necesitas ayuda?** Reporta en qué paso te quedaste y qué error ves.
