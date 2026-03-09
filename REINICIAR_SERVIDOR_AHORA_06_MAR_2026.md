# 🚨 REINICIAR SERVIDOR DE DESARROLLO - URGENTE

**Fecha**: 6 de marzo de 2026  
**Problema**: El hook `useUnreadMessages` no se ejecuta porque el servidor tiene código antiguo en memoria

---

## ⚡ ACCIÓN INMEDIATA

### 1️⃣ Detener el servidor actual

En tu terminal PowerShell donde está corriendo `npm run dev`:

```powershell
# Presiona Ctrl + C para detener el servidor
```

Verás algo como:
```
^C
PS C:\Users\HP\Desktop\cita-rd\cita-rd>
```

---

### 2️⃣ Reiniciar el servidor

```powershell
npm run dev
```

Espera a ver:
```
VITE v7.1.5  ready in XXX ms
➜  Local:   http://localhost:3000/
```

---

### 3️⃣ Limpiar caché del navegador COMPLETAMENTE

1. **Cierra TODAS las pestañas de tapati.online**
2. Abre DevTools (F12)
3. Ve a **Application** → **Storage**
4. Click en **"Clear site data"** (selecciona TODO)
5. **Cierra el navegador completamente** (todas las ventanas)

---

### 4️⃣ Abrir navegador limpio

1. Abre el navegador de nuevo
2. Ve a `https://tapati.online`
3. Abre DevTools (F12) → Console
4. Inicia sesión

---

## ✅ QUÉ DEBES VER EN LA CONSOLA

Si todo funciona, verás estos logs:

```javascript
🔔 [APP] useUnreadMessages hook montado {userId: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2'}
🔔 [UNREAD HOOK] Iniciando listener {userId: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2'}
🔔 [UNREAD HOOK] Snapshot recibido {size: 17}
🔔 [UNREAD HOOK] Procesando chat {chatId: '...', hasField: true/false}
```

---

## 🔍 SI NO VES LOS LOGS

Significa que el código TODAVÍA no se recompiló. Verifica:

1. ¿El servidor se reinició correctamente?
2. ¿Cerraste TODAS las pestañas de tapati.online?
3. ¿Limpiaste el caché del navegador?
4. ¿Cerraste el navegador completamente?

---

## 📊 SIGUIENTE PASO

Una vez que veas los logs `🔔 [UNREAD HOOK]`, revisa si dice:

- `hasField: true` → El campo `unreadCount_KU5ZalR92QcPV7RGbLFTjEjTXZm2` existe
- `hasField: false` → El campo NO existe, necesitas enviar un mensaje de prueba

---

**IMPORTANTE**: NO hagas nada más hasta que veas los logs en la consola.
