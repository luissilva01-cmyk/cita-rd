# 🚨 FORZAR RECOMPILACIÓN COMPLETA

**Fecha**: 6 de marzo de 2026  
**Problema**: Hook `useUnreadMessages` no se ejecuta - caché muy persistente

---

## ✅ EJECUTA ESTOS COMANDOS EN POWERSHELL

```powershell
# 1. Detén el servidor (Ctrl+C en la terminal donde corre npm run dev)

# 2. Navega al directorio del proyecto
cd cita-rd

# 3. Limpia TODOS los cachés
Remove-Item -Recurse -Force node_modules/.vite
Remove-Item -Recurse -Force dist

# 4. Reinicia el servidor
npm run dev
```

---

## 🌐 DESPUÉS EN EL NAVEGADOR

1. **Abre DevTools** (F12)
2. Ve a la pestaña **"Application"**
3. En el menú izquierdo, haz clic en **"Storage"**
4. Haz clic en **"Clear site data"**
5. Marca TODAS las opciones
6. Haz clic en **"Clear site data"**
7. **Cierra completamente el navegador** (todas las ventanas)
8. Vuelve a abrir el navegador
9. Ve a `https://tapati.online`
10. Inicia sesión

---

## 🔍 VERIFICACIÓN

Después de hacer esto, deberías ver en la consola:

```
🔔 [UNREAD HOOK] Inicializado
🔔 [UNREAD HOOK] useEffect ejecutado
📡 [UNREAD HOOK] Configurando listener de Firestore
```

Si ves estos logs, el hook está funcionando.

---

## ⚠️ IMPORTANTE

- Asegúrate de detener el servidor ANTES de limpiar los cachés
- Cierra TODAS las ventanas del navegador, no solo la pestaña
- Si usas Chrome, también puedes probar en modo incógnito para verificar
