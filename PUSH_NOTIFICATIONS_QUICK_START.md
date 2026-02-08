# 🚀 Push Notifications - Quick Start

## ⚡ Configuración Rápida (5 minutos)

### 1️⃣ Obtener VAPID Key

```bash
# Ir a Firebase Console
https://console.firebase.google.com/project/citard-fbc26/settings/cloudmessaging

# Copiar la VAPID Key de "Web Push certificates"
# Si no existe, hacer clic en "Generate key pair"
```

### 2️⃣ Actualizar el Código

```typescript
// cita-rd/services/notificationService.ts - Línea 8
const VAPID_KEY = 'PEGAR_TU_VAPID_KEY_AQUI';
```

### 3️⃣ Desplegar

```bash
cd cita-rd

# Desplegar Firestore Rules
firebase deploy --only firestore:rules

# Desplegar Cloud Functions
firebase deploy --only functions
```

### 4️⃣ Probar

1. Abre la app en el navegador
2. Inicia sesión
3. Completa tu perfil
4. Espera 3 segundos → Aparecerá el prompt
5. Haz clic en "Activar"
6. Acepta el permiso del navegador
7. ¡Deberías ver una notificación de prueba! 🎉

---

## ✅ Verificación Rápida

### ¿Funciona?

```bash
# Ver logs de Cloud Functions
firebase functions:log

# Deberías ver:
# ✅ Notificación de mensaje enviada a: [userId]
```

### ¿Token guardado?

1. Firebase Console → Firestore Database
2. Colección `fcmTokens`
3. Busca tu userId → Debe tener un `token`

---

## 🎯 Tipos de Notificaciones

| Evento | Notificación |
|--------|--------------|
| Nuevo mensaje | "Nombre: Mensaje..." |
| Nuevo match | "🎉 ¡Nuevo Match! ¡Hiciste match con Nombre!" |
| Nueva story | "Nombre publicó una historia" |

---

## 🐛 Problemas Comunes

**No aparece el prompt:**
- Espera 3 segundos después del login
- Verifica que el perfil esté completo

**No llegan notificaciones:**
- Verifica VAPID Key
- Verifica que Cloud Functions estén desplegadas
- Revisa logs: `firebase functions:log`

**Solo funciona con app abierta:**
- Verifica Service Worker en DevTools → Application → Service Workers
- Debe estar `firebase-messaging-sw.js` activo

---

## 📚 Documentación Completa

Ver `PUSH_NOTIFICATIONS_SETUP.md` para guía detallada.

---

**¡Listo para lanzamiento!** 🚀
