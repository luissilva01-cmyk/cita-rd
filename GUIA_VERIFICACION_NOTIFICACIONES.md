# 🔔 GUÍA COMPLETA: Verificación de Notificaciones Push

**Fecha:** 09 de Febrero 2026  
**Objetivo:** Verificar que las notificaciones push funcionan de extremo a extremo

---

## ✅ PARTE 1: Infraestructura (YA COMPLETADO)

### Lo que ya verificamos:

```
✅ Permiso de notificaciones: granted
✅ Service Worker: registrado
✅ Token FCM: obtenido
✅ Token guardado en Firestore: verificado
```

**Conclusión:** La infraestructura está 100% operativa.

---

## 🧪 PARTE 2: Funcionalidad Real (PENDIENTE)

Para estar completamente seguros, necesitas verificar que **realmente lleguen notificaciones**.

### Método 1: Prueba Rápida con Firebase Console (5 minutos)

#### Pasos:

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona tu proyecto: `cita-rd`

2. **Cloud Messaging:**
   - En el menú lateral → "Messaging"
   - Clic en "Send your first message" o "Create campaign"

3. **Configurar mensaje:**
   ```
   Título: 🔔 Prueba de Notificación
   Mensaje: Esta es una notificación de prueba desde Firebase Console
   ```

4. **Seleccionar target:**
   - Opción 1: "User segment" → "All users"
   - Opción 2: "Single device" → Pega tu token FCM

5. **Enviar:**
   - Clic en "Review" → "Publish"
   - **Deberías ver la notificación en tu navegador** 🎉

#### ¿Dónde encontrar tu token FCM?

**Opción A - Desde la consola del navegador:**
```javascript
// Pega esto en la consola (F12):
console.log('Tu token FCM:', localStorage.getItem('fcmToken'));
```

**Opción B - Desde Firestore:**
1. Firebase Console → Firestore Database
2. Colección: `fcmTokens`
3. Busca tu userId
4. Copia el campo `token`

---

### Método 2: Prueba Real con Dos Usuarios (10 minutos)

#### Escenario: Simular un match real

1. **Preparación:**
   - Abre dos navegadores diferentes (Chrome + Firefox)
   - O usa modo incógnito en uno
   - Inicia sesión con dos usuarios diferentes

2. **Usuario A (Emisor):**
   - Navega a Discovery
   - Da like a Usuario B
   - Si hay match → se envía notificación automática

3. **Usuario B (Receptor):**
   - **Debería recibir notificación:** "💕 ¡Nuevo Match!"
   - Verifica que aparezca en el navegador
   - Verifica que al hacer clic te lleve a la app

#### ¿Qué verificar?

```
✅ La notificación aparece en el navegador
✅ El título y mensaje son correctos
✅ El ícono de la app se muestra
✅ Al hacer clic, abre la aplicación
✅ La notificación persiste si el navegador está minimizado
```

---

### Método 3: Prueba Manual con Archivo HTML (15 minutos)

Usa el archivo que creé: `test-send-notification.html`

#### Pasos:

1. **Obtener Server Key de Firebase:**
   - Firebase Console → Project Settings
   - Pestaña "Cloud Messaging"
   - Copia la "Server key"

2. **Actualizar el archivo:**
   - Abre `test-send-notification.html`
   - Busca: `YOUR_SERVER_KEY_HERE`
   - Reemplaza con tu Server Key

3. **Abrir el archivo:**
   ```bash
   # Desde cita-rd/
   open test-send-notification.html
   ```

4. **Enviar notificación:**
   - Ingresa un userId (de Firestore → fcmTokens)
   - Selecciona tipo de notificación
   - Clic en "Enviar Notificación de Prueba"
   - Verifica que llegue al navegador del usuario

---

## 📊 CHECKLIST DE VERIFICACIÓN COMPLETA

### Infraestructura (100% ✅):
- [x] Permiso de notificaciones concedido
- [x] Service Worker registrado
- [x] Token FCM obtenido
- [x] Token guardado en Firestore
- [x] Token verificado en Firestore

### Funcionalidad (Pendiente):
- [ ] Notificación enviada desde Firebase Console
- [ ] Notificación recibida en el navegador
- [ ] Notificación de match funciona
- [ ] Notificación de mensaje funciona
- [ ] Notificación de story funciona
- [ ] Click en notificación abre la app
- [ ] Notificación persiste cuando navegador minimizado

---

## 🎯 ESCENARIOS DE PRUEBA RECOMENDADOS

### 1. Notificación de Match:
```
Trigger: Usuario A da like a Usuario B (match mutuo)
Esperado: Usuario B recibe "💕 ¡Nuevo Match!"
```

### 2. Notificación de Mensaje:
```
Trigger: Usuario A envía mensaje a Usuario B
Esperado: Usuario B recibe "💬 Nuevo Mensaje"
```

### 3. Notificación de Story:
```
Trigger: Usuario A publica una story
Esperado: Matches de Usuario A reciben "📱 Nueva Story"
```

---

## 🔍 CÓMO SABER SI FUNCIONAN 100%

### ✅ Señales de éxito:

1. **Notificación visible:**
   - Aparece en la esquina del navegador
   - Muestra título, mensaje e ícono correcto

2. **Notificación interactiva:**
   - Al hacer clic, abre la aplicación
   - Navega a la sección correcta (chat, matches, etc.)

3. **Notificación persistente:**
   - Funciona con navegador minimizado
   - Funciona con navegador en segundo plano
   - Funciona con pantalla bloqueada (móvil)

4. **Logs en consola:**
   ```
   ✅ [NOTIFICATION] Notification permission: granted
   ✅ [NOTIFICATION] Service Worker registered
   ✅ [NOTIFICATION] FCM Token obtained
   ✅ [NOTIFICATION] FCM token saved to Firestore
   ✅ [NOTIFICATION] Notification received
   ✅ [NOTIFICATION] Notification displayed
   ```

### ❌ Señales de problema:

1. **No aparece notificación:**
   - Verificar permiso en configuración del navegador
   - Verificar que Service Worker esté activo
   - Verificar token FCM en Firestore

2. **Notificación sin contenido:**
   - Verificar payload de la notificación
   - Verificar formato del mensaje

3. **Click no funciona:**
   - Verificar `click_action` en el payload
   - Verificar Service Worker listener

---

## 🚀 PRÓXIMOS PASOS

### Si las notificaciones funcionan:
1. ✅ Marcar testing como 100% completado
2. ✅ Actualizar documentación
3. ✅ Guardar cambios en GitHub
4. ✅ Proceder con lanzamiento beta

### Si hay problemas:
1. 🔍 Revisar logs de la consola
2. 🔍 Verificar Service Worker en DevTools
3. 🔍 Verificar token FCM en Firestore
4. 🔍 Verificar configuración de Firebase
5. 💬 Reportar el problema específico

---

## 📝 NOTAS IMPORTANTES

### Limitaciones conocidas:

1. **iOS Safari:**
   - No soporta notificaciones push web (aún)
   - Solo funciona en iOS 16.4+ con PWA instalada

2. **Navegadores:**
   - Chrome: ✅ Soporte completo
   - Firefox: ✅ Soporte completo
   - Safari (macOS): ✅ Soporte completo
   - Edge: ✅ Soporte completo
   - Safari (iOS): ⚠️ Limitado

3. **Permisos:**
   - El usuario debe conceder permiso explícitamente
   - El permiso puede ser revocado en cualquier momento
   - Verificar permiso antes de enviar notificaciones

---

## 🎉 CONCLUSIÓN

**Estado actual:**
- ✅ Infraestructura: 100% operativa
- 🔄 Funcionalidad: Pendiente de testing manual

**Recomendación:**
- Realizar al menos una prueba con Firebase Console
- O esperar a usuarios reales en beta para verificar

**Tiempo estimado:**
- Prueba rápida: 5 minutos
- Prueba completa: 15 minutos

---

**Última actualización:** 09 Feb 2026 - 20:50
