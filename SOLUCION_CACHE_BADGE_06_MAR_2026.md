# 🚨 SOLUCIÓN URGENTE: Badge de Mensajes No Aparece

**Fecha**: 6 de marzo de 2026  
**Problema**: El hook `useUnreadMessages` no se ejecuta - logs `[UNREAD HOOK]` no aparecen  
**Causa**: Caché del navegador muy agresivo

---

## ✅ SOLUCIÓN PASO A PASO

### Opción 1: Hard Refresh Agresivo (PRUEBA ESTO PRIMERO)

1. **Abre DevTools** (F12)
2. **Haz clic derecho en el botón de recargar** (al lado de la barra de direcciones)
3. **Selecciona "Vaciar caché y recargar de manera forzada"** o **"Empty Cache and Hard Reload"**

### Opción 2: Limpiar Caché Manualmente

Si la Opción 1 no funciona:

1. **Abre DevTools** (F12)
2. Ve a la pestaña **"Application"** (o "Aplicación")
3. En el menú izquierdo, busca **"Storage"**
4. Haz clic en **"Clear site data"** o **"Borrar datos del sitio"**
5. Marca todas las opciones:
   - ✅ Cookies and site data
   - ✅ Cache storage
   - ✅ Application cache
6. Haz clic en **"Clear site data"**
7. **Cierra y vuelve a abrir el navegador**
8. Vuelve a abrir `https://tapati.online`

### Opción 3: Limpiar Caché de Vite (SI NADA FUNCIONA)

Si las opciones anteriores no funcionan, el problema puede estar en el caché de Vite:

```powershell
# 1. Detén el servidor (Ctrl+C)

# 2. Limpia el caché de Vite
Remove-Item -Recurse -Force node_modules/.vite

# 3. Reinicia el servidor
npm run dev

# 4. Hard refresh en el navegador (Ctrl+Shift+R)
```

---

## 🔍 VERIFICACIÓN

Después de hacer el hard refresh, deberías ver estos logs en la consola:

```
🔔 [UNREAD HOOK] Inicializado { currentUserId: "KU5ZalR92QcPV7RGbLFTjEjTXZm2", totalUnread: 0 }
🔔 [UNREAD HOOK] useEffect ejecutado { currentUserId: "KU5ZalR92QcPV7RGbLFTjEjTXZm2" }
📡 [UNREAD HOOK] Configurando listener de Firestore para userId: KU5ZalR92QcPV7RGbLFTjEjTXZm2
✅ [UNREAD HOOK] Listener configurado exitosamente
🔍 [UNREAD HOOK] Snapshot recibido { userId: "KU5ZalR92QcPV7RGbLFTjEjTXZm2", totalChats: 17, ... }
```

Si ves estos logs, **el hook está funcionando correctamente**.

---

## 📊 SIGUIENTE PASO: Verificar Campos en Firestore

Una vez que veas los logs `[UNREAD HOOK]`, revisa si aparece:

```
hasField: true
```

Si dice `hasField: false`, significa que los campos `unreadCount_${userId}` no existen en tus chats.

**Solución**: Envía un mensaje de prueba desde otra cuenta para crear el campo automáticamente.

---

## 🎯 RESUMEN

1. ✅ Código implementado correctamente
2. ⚠️ Problema: Caché del navegador
3. 🔧 Solución: Hard refresh agresivo o limpiar caché manualmente
4. 🔍 Verificación: Buscar logs `[UNREAD HOOK]` en consola
5. 📊 Siguiente: Verificar campos `unreadCount_` en Firestore

---

## ❓ SI SIGUE SIN FUNCIONAR

Si después de probar las 3 opciones todavía no ves los logs:

1. Comparte una captura de pantalla de la consola completa
2. Verifica que estás en `https://tapati.online` (no localhost)
3. Verifica que iniciaste sesión correctamente
4. Comparte el resultado de ejecutar en la consola del navegador:
   ```javascript
   console.log('User ID:', localStorage.getItem('userId'));
   ```
