# 🧪 PRUEBA RÁPIDA: Contador de Mensajes No Leídos

**Objetivo**: Verificar que el badge funciona sin necesidad de crear otra cuenta

---

## 🎯 MÉTODO RÁPIDO (2 minutos)

### 1️⃣ Abre Firebase Console

Ve a: https://console.firebase.google.com/project/citard-fbc26/firestore/databases/-default-/data/~2Fchats

### 2️⃣ Selecciona un Chat

- Busca un documento en la colección `chats`
- Debe tener tu userId en el array `participants`
- Ejemplo: Un chat donde `participants` incluya `oti2f0Xp13YUXxxNOrgD5jCI0ru1`

### 3️⃣ Agrega el Campo de Contador

Haz clic en "Add field" y agrega:

```
Field name: unreadCount_oti2f0Xp13YUXxxNOrgD5jCI0ru1
Type: number
Value: 5
```

**IMPORTANTE**: Reemplaza `oti2f0Xp13YUXxxNOrgD5jCI0ru1` con tu userId real.

### 4️⃣ Guarda y Observa

- Haz clic en "Save"
- Vuelve a tu app en `http://localhost:3000`
- Verás el badge con "5" aparecer INMEDIATAMENTE

### 5️⃣ Prueba el Reset

- Haz clic en el botón "Mensajes"
- Abre el chat que modificaste
- El badge desaparecerá automáticamente

---

## 🔍 ENCONTRAR TU USER ID

Si no sabes tu userId, abre la consola del navegador (F12) y busca:

```javascript
🔔 [APP] Llamando useUnreadMessages con userId: TU_USER_ID_AQUI
```

O ejecuta en la consola:
```javascript
console.log(localStorage.getItem('userId'))
```

---

## 📊 EJEMPLO VISUAL

### Antes (sin mensajes no leídos):
```
Mensajes  [Sin badge]
```

### Después (con 5 mensajes no leídos):
```
Mensajes  [5]  ← Badge rojo
```

---

## 🎨 PROBAR MÚLTIPLES CHATS

Puedes agregar el campo a varios chats:

```javascript
// Chat 1
unreadCount_oti2f0Xp13YUXxxNOrgD5jCI0ru1: 3

// Chat 2
unreadCount_oti2f0Xp13YUXxxNOrgD5jCI0ru1: 2

// Chat 3
unreadCount_oti2f0Xp13YUXxxNOrgD5jCI0ru1: 1

// Total en badge: 6 (3 + 2 + 1)
```

---

## ✅ LOGS ESPERADOS

Después de agregar el campo, verás en la consola:

```javascript
🔍 [UNREAD HOOK] Snapshot recibido {
  userId: "oti2f0Xp13YUXxxNOrgD5jCI0ru1",
  totalChats: 17,
  timestamp: "10:35:20"
}

📊 [UNREAD HOOK] Chat analizado {
  chatId: "abc12345...",
  fieldName: "unreadCount_oti2f0Xp13YUXxxNOrgD5jCI0ru1",
  unreadCount: 5,
  hasField: true,
  participants: ["oti2f0Xp13YUXxxNOrgD5jCI0ru1", "otherUserId"]
}

✅ [UNREAD HOOK] Contadores actualizados {
  totalUnread: 5,
  chatsWithUnread: 1,
  counts: { "abc12345": 5 },
  timestamp: "10:35:20"
}
```

---

## 🚨 TROUBLESHOOTING

### El badge no aparece:

1. **Verifica el nombre del campo**:
   - Debe ser exactamente: `unreadCount_TU_USER_ID`
   - Sin espacios, sin mayúsculas incorrectas

2. **Verifica que el valor sea > 0**:
   - El badge solo aparece si hay mensajes sin leer

3. **Refresca la página**:
   - A veces el listener tarda 1-2 segundos en detectar cambios

4. **Verifica los logs**:
   - Abre DevTools (F12) → Console
   - Busca `[UNREAD HOOK]`

---

## 🎯 RESULTADO ESPERADO

Después de seguir estos pasos, deberías ver:

✅ Badge rojo con número en el botón "Mensajes"  
✅ Logs en consola confirmando la detección  
✅ Badge desaparece al abrir el chat  

---

**Tiempo estimado**: 2 minutos  
**Dificultad**: Fácil  
**Requiere**: Acceso a Firebase Console
