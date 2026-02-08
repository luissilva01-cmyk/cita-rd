# 🧪 Guía de Testing - Push Notifications

## ✅ Servidor Corriendo

```
✅ Local:   http://localhost:3000/
✅ Network: http://192.168.100.52:3000/
✅ Estado:  Activo y listo para testing
```

---

## 🎯 TESTING DE NOTIFICACIONES PUSH

### PASO 1: Probar Solicitud de Permisos (5 minutos)

#### 1.1 Abrir la App
```
Abre tu navegador (Chrome recomendado)
Ve a: http://localhost:3000
```

#### 1.2 Iniciar Sesión
- Si no tienes cuenta, regístrate
- Si ya tienes cuenta, inicia sesión

#### 1.3 Completar Perfil
**IMPORTANTE:** El prompt de notificaciones solo aparece si el perfil está completo.

Verifica que tengas:
- ✅ Al menos 1 foto subida
- ✅ Bio escrita
- ✅ Provincia seleccionada

Si falta algo, ve a **Profile** y complétalo.

#### 1.4 Esperar el Prompt
- Después de completar el perfil, espera **3 segundos**
- Debe aparecer un prompt bonito en la esquina inferior derecha
- Diseño con gradiente rosa
- Lista de beneficios

#### 1.5 Activar Notificaciones
1. Haz clic en el botón **"Activar"** (rosa con icono de campana)
2. El navegador mostrará un diálogo nativo pidiendo permiso
3. Haz clic en **"Permitir"** o **"Allow"**
4. Deberías ver una notificación de prueba:
   ```
   🎉 Ta' Pa' Ti
   Las notificaciones están funcionando correctamente!
   ```

#### 1.6 Verificar Token en Firestore
```
1. Abre Firebase Console
2. Ve a Firestore Database
3. Busca la colección "fcmTokens"
4. Debe haber un documento con tu userId
5. Verifica que tenga:
   - token: [string largo]
   - userId: [tu user ID]
   - platform: "web"
   - createdAt: [timestamp]
   - updatedAt: [timestamp]
```

---

### PASO 2: Probar Notificación de Mensaje (10 minutos)

#### 2.1 Preparar 2 Usuarios
Necesitas 2 navegadores con 2 usuarios diferentes:

**Opción A: Chrome Normal + Chrome Incógnito**
```
1. Chrome normal: Usuario A (ya iniciado sesión)
2. Chrome incógnito: Usuario B (nuevo usuario)
```

**Opción B: Chrome + Firefox**
```
1. Chrome: Usuario A
2. Firefox: Usuario B
```

#### 2.2 Configurar Usuario B
En el segundo navegador:
1. Abre http://localhost:3000
2. Regístrate con un nuevo usuario
3. Completa el perfil (foto, bio, provincia)
4. Activa notificaciones (espera 3 segundos, clic en "Activar")

#### 2.3 Crear Match
En el navegador de Usuario A:
1. Ve a **Discovery** (icono de corazón)
2. Da like al perfil de Usuario B
3. Se creará un match automáticamente
4. **Ambos usuarios deben recibir notificación:**
   ```
   🎉 ¡Nuevo Match!
   ¡Hiciste match con [nombre]!
   ```

#### 2.4 Enviar Mensaje
En el navegador de Usuario A:
1. Ve a **Messages** (icono de chat)
2. Abre el chat con Usuario B
3. Escribe un mensaje: "Hola! ¿Cómo estás?"
4. Envía el mensaje

#### 2.5 Verificar Notificación
En el navegador de Usuario B:
- Debe aparecer una notificación:
  ```
  [Nombre de Usuario A], [edad]
  Hola! ¿Cómo estás?
  ```
- **Prueba con app en background:**
  - Minimiza el navegador de Usuario B
  - Usuario A envía otro mensaje
  - La notificación debe aparecer igual

#### 2.6 Probar Click en Notificación
1. Haz clic en la notificación
2. El navegador debe:
   - Abrir/enfocar la ventana de la app
   - Navegar directamente al chat con Usuario A

---

### PASO 3: Probar Notificación de Story (5 minutos)

#### 3.1 Publicar Story
En el navegador de Usuario A:
1. Ve a **Home**
2. Haz clic en el botón **"+"** en las stories
3. Publica una story (texto o foto)

#### 3.2 Verificar Notificación
En el navegador de Usuario B:
- Debe aparecer una notificación:
  ```
  [Nombre de Usuario A] publicó una historia
  ¡Mírala antes de que desaparezca!
  ```

#### 3.3 Probar Click en Notificación
1. Haz clic en la notificación
2. El navegador debe abrir la app en la vista Home
3. Deberías ver la story de Usuario A disponible

---

### PASO 4: Verificar Logs de Cloud Functions (5 minutos)

#### 4.1 Ver Logs en Terminal
Abre una nueva terminal y ejecuta:
```bash
cd cita-rd
firebase functions:log
```

#### 4.2 Buscar Logs de Notificaciones
Deberías ver logs como:
```
✅ Notificación de mensaje enviada a: [userId]
✅ Notificación de match enviada a: [userId]
✅ Notificaciones de story enviadas a 1 usuarios
```

#### 4.3 Ver Logs en Firebase Console
```
1. Abre Firebase Console
2. Ve a Functions
3. Haz clic en "Logs"
4. Filtra por:
   - sendMessageNotification
   - sendMatchNotification
   - sendStoryNotification
```

---

### PASO 5: Probar en Diferentes Escenarios (10 minutos)

#### 5.1 App en Foreground (Abierta)
- ✅ Usuario A envía mensaje
- ✅ Usuario B tiene la app abierta
- ✅ Notificación debe aparecer

#### 5.2 App en Background (Minimizada)
- ✅ Usuario A envía mensaje
- ✅ Usuario B minimiza el navegador
- ✅ Notificación debe aparecer

#### 5.3 App Cerrada
- ✅ Usuario A envía mensaje
- ✅ Usuario B cierra el navegador completamente
- ✅ Notificación NO aparecerá (esperado en web)
  - En web, las notificaciones solo funcionan si el navegador está abierto
  - En mobile (PWA), funcionarían con app cerrada

#### 5.4 Click en Notificación
- ✅ Hacer clic en notificación de mensaje → Abre chat
- ✅ Hacer clic en notificación de match → Abre matches
- ✅ Hacer clic en notificación de story → Abre home

---

## 🐛 TROUBLESHOOTING

### Problema 1: No aparece el prompt de notificaciones

**Posibles causas:**
- Perfil incompleto (falta foto, bio o provincia)
- Ya se rechazó antes (guardado en localStorage)
- No han pasado 3 segundos desde el login

**Soluciones:**
1. Verifica que el perfil esté completo
2. Abre DevTools (F12) → Console → Ejecuta:
   ```javascript
   localStorage.removeItem('notification-declined')
   ```
3. Recarga la página y espera 3 segundos

---

### Problema 2: No llegan notificaciones

**Posibles causas:**
- Token no guardado en Firestore
- Cloud Functions no desplegadas
- Service Worker no activo

**Soluciones:**
1. Verifica token en Firestore:
   ```
   Firebase Console → Firestore → fcmTokens → [userId]
   ```

2. Verifica Cloud Functions:
   ```bash
   firebase functions:list
   ```
   Debe mostrar:
   - sendMessageNotification
   - sendMatchNotification
   - sendStoryNotification

3. Verifica Service Worker:
   ```
   DevTools (F12) → Application → Service Workers
   Debe aparecer: firebase-messaging-sw.js (activated)
   ```

---

### Problema 3: Error en Service Worker

**Solución:**
1. Abre DevTools (F12)
2. Ve a Application → Service Workers
3. Haz clic en "Unregister"
4. Recarga la página
5. El Service Worker se registrará automáticamente

---

### Problema 4: Notificaciones solo funcionan con app abierta

**Esto es normal en web:**
- Las notificaciones web requieren que el navegador esté abierto
- Pueden estar en background (minimizado) pero no cerrado
- En mobile (PWA), funcionarían con app cerrada

---

## ✅ CHECKLIST DE TESTING

### Funcionalidad Básica
- [ ] Prompt de notificaciones aparece después de 3 segundos
- [ ] Botón "Activar" solicita permiso del navegador
- [ ] Notificación de prueba aparece al activar
- [ ] Token se guarda en Firestore

### Notificación de Mensaje
- [ ] Notificación aparece al recibir mensaje
- [ ] Título muestra nombre del remitente
- [ ] Body muestra contenido del mensaje
- [ ] Click abre el chat correcto
- [ ] Funciona con app en foreground
- [ ] Funciona con app en background

### Notificación de Match
- [ ] Notificación aparece al crear match
- [ ] Ambos usuarios reciben notificación
- [ ] Título: "🎉 ¡Nuevo Match!"
- [ ] Body muestra nombre del otro usuario
- [ ] Click abre la vista de matches

### Notificación de Story
- [ ] Notificación aparece al publicar story
- [ ] Solo matches reciben notificación
- [ ] Título muestra nombre del creador
- [ ] Click abre la app en home

### Logs y Debugging
- [ ] Logs aparecen en `firebase functions:log`
- [ ] Service Worker está activo
- [ ] No hay errores en consola del navegador

---

## 📊 RESULTADOS ESPERADOS

### ✅ Todo Funciona Correctamente Si:
1. El prompt aparece después de 3 segundos
2. La notificación de prueba aparece al activar
3. Las notificaciones de mensaje llegan correctamente
4. Las notificaciones de match llegan a ambos usuarios
5. Las notificaciones de story llegan a los matches
6. Click en notificaciones navega correctamente
7. Los logs muestran éxito en Cloud Functions
8. No hay errores en la consola

---

## 🎉 SIGUIENTE PASO

Una vez que hayas completado este testing y todo funcione:

1. **Reporta cualquier bug encontrado**
2. **Prueba en diferentes navegadores** (Chrome, Firefox, Edge)
3. **Prueba en mobile** (Chrome Android, Safari iOS)
4. **Prepara para beta testing** con usuarios reales

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs: `firebase functions:log`
3. Verifica Firestore: fcmTokens y chats
4. Consulta `PUSH_NOTIFICATIONS_SETUP.md` para más detalles

---

**Fecha:** 4 de Febrero 2026  
**Servidor:** http://localhost:3000  
**Estado:** ✅ Listo para testing  
**Duración estimada:** 30-40 minutos
