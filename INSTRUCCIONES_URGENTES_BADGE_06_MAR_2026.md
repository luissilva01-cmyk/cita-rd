# ⚠️ INSTRUCCIONES URGENTES - Badge de Mensajes No Leídos
**Fecha**: 6 de marzo de 2026

## 🔴 PROBLEMA ACTUAL

El badge no aparece porque el código no se ha recompilado con los cambios.

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Detener el Servidor de Desarrollo
1. Ve a la terminal donde está corriendo `npm run dev`
2. Presiona `Ctrl+C` para detener el servidor

### Paso 2: Limpiar Caché y Recompilar
Ejecuta estos comandos en orden:

```bash
cd cita-rd
rm -rf node_modules/.vite
npm run dev
```

O en Windows PowerShell:
```powershell
cd cita-rd
Remove-Item -Recurse -Force node_modules/.vite -ErrorAction SilentlyContinue
npm run dev
```

### Paso 3: Hard Refresh en el Navegador
1. Abre la app en el navegador
2. Presiona `Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac)
3. Esto forzará una recarga completa sin caché

### Paso 4: Verificar los Logs
1. Abre la consola del navegador (`F12`)
2. Busca logs que digan `[UNREAD HOOK]`
3. Deberías ver algo como:

```
🔔 [UNREAD HOOK] Inicializado { currentUserId: "abc123", totalUnread: 0 }
🔔 [UNREAD HOOK] useEffect ejecutado { currentUserId: "abc123" }
📡 [UNREAD HOOK] Configurando listener de Firestore para userId: abc123
✅ [UNREAD HOOK] Listener configurado exitosamente
🔍 [UNREAD HOOK] Snapshot recibido { userId: "abc123", totalChats: 2 }
📊 [UNREAD HOOK] Chat analizado { chatId: "0bk1qh6o...", unreadCount: 0, ... }
✅ [UNREAD HOOK] Contadores actualizados { totalUnread: 0, chatsWithUnread: 0 }
```

## 🔍 QUÉ BUSCAR EN LOS LOGS

### Si ves esto:
```
📊 [UNREAD HOOK] Chat analizado {
  chatId: "0bk1qh6o...",
  fieldName: "unreadCount_tuUserId",
  unreadCount: 0,
  hasField: false,  ← ⚠️ ESTE ES EL PROBLEMA
  allUnreadFields: []  ← ⚠️ NO HAY CAMPOS unreadCount_*
}
```

**Significa**: Los documentos de chat NO tienen el campo `unreadCount_${userId}`

**Solución**: Necesitas que alguien te envíe un mensaje nuevo para que el campo se cree automáticamente.

### Si ves esto:
```
📊 [UNREAD HOOK] Chat analizado {
  chatId: "0bk1qh6o...",
  fieldName: "unreadCount_tuUserId",
  unreadCount: 3,  ← ✅ HAY MENSAJES NO LEÍDOS
  hasField: true,  ← ✅ EL CAMPO EXISTE
  allUnreadFields: ["unreadCount_abc123", "unreadCount_xyz789"]
}
```

**Significa**: Todo está funcionando correctamente y el badge DEBERÍA aparecer.

## 🧪 PRUEBA RÁPIDA

### Opción A: Crear el Campo Manualmente en Firestore

1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a Firestore Database
4. Busca la colección `chats`
5. Abre un documento de chat
6. Haz clic en "Add field"
7. Nombre del campo: `unreadCount_TU_USER_ID` (reemplaza con tu ID real)
8. Tipo: `number`
9. Valor: `5`
10. Guarda
11. Recarga la app

El badge debería aparecer con el número "5".

### Opción B: Enviar Mensaje desde Otra Cuenta

1. Abre un navegador en modo incógnito
2. Inicia sesión con otra cuenta
3. Envía un mensaje a tu cuenta principal
4. En tu cuenta principal, el badge debería aparecer con "1"

## 📸 Cómo Debe Verse

### Desktop Sidebar - CON mensajes no leídos:
```
┌─────────────────────────┐
│ 🏠 Inicio               │
│ 🔍 Explorar             │
│ 👥 Matches         [2]  │
│ 💬 Mensajes        [5]  │  ← Badge ROJO con número
│ 👤 Mi Perfil            │
└─────────────────────────┘
```

### Desktop Sidebar - SIN mensajes no leídos:
```
┌─────────────────────────┐
│ 🏠 Inicio               │
│ 🔍 Explorar             │
│ 👥 Matches         [2]  │
│ 💬 Mensajes             │  ← Sin badge
│ 👤 Mi Perfil            │
└─────────────────────────┘
```

## 🆘 Si Sigue Sin Funcionar

Comparte los logs completos que aparecen en la consola con el texto `[UNREAD HOOK]` para diagnosticar el problema específico.

Los logs mostrarán:
- Si el hook se está ejecutando
- Si hay chats en Firestore
- Si los chats tienen el campo `unreadCount_${userId}`
- Cuál es el valor del contador

---

**IMPORTANTE**: Después de hacer los pasos 1-3, los logs DEBEN aparecer. Si no aparecen, significa que hay un problema con la compilación o el código no se actualizó correctamente.
