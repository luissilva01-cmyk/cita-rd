# 🚀 DEPLOY: Contador de Mensajes No Leídos a Producción

**Fecha**: 6 de marzo de 2026  
**Hora**: 11:00 AM  
**Destino**: https://tapati.online

---

## 📋 CHECKLIST PRE-DEPLOY

### ✅ Archivos Modificados:
- [x] `cita-rd/hooks/useUnreadMessages.ts` - Hook creado
- [x] `cita-rd/App.tsx` - Hook integrado
- [x] `cita-rd/services/chatService.ts` - sendMessage y markMessagesAsRead actualizados
- [x] `cita-rd/components/DesktopSidebar.tsx` - Badge en navegación
- [x] `cita-rd/components/DesktopLayout.tsx` - Prop passing
- [x] `cita-rd/components/components/Layout.tsx` - Badge en mobile
- [x] `cita-rd/views/views/Messages.tsx` - Badge en lista de chats

### ✅ Testing Local:
- [x] Hook ejecutándose correctamente
- [x] Listener de Firestore activo
- [x] Logs confirmando funcionamiento
- [x] Badge renderizado en todas las ubicaciones

---

## 🚀 COMANDOS DE DEPLOY

### 1️⃣ Detener Servidor de Desarrollo
```powershell
# Presiona Ctrl+C en la terminal donde corre npm run dev
```

### 2️⃣ Build de Producción
```powershell
cd C:\Users\HP\Desktop\cita-rd\cita-rd
npm run build
```

**Tiempo estimado**: 30-60 segundos

**Salida esperada**:
```
vite v7.1.5 building for production...
✓ 1234 modules transformed.
dist/index.html                   1.23 kB
dist/assets/index-abc123.js     456.78 kB
✓ built in 45.67s
```

### 3️⃣ Deploy a Firebase Hosting
```powershell
firebase deploy --only hosting
```

**Tiempo estimado**: 30-60 segundos

**Salida esperada**:
```
=== Deploying to 'citard-fbc26'...

i  deploying hosting
i  hosting[citard-fbc26]: beginning deploy...
i  hosting[citard-fbc26]: found 123 files in dist
✔  hosting[citard-fbc26]: file upload complete
i  hosting[citard-fbc26]: finalizing version...
✔  hosting[citard-fbc26]: version finalized
i  hosting[citard-fbc26]: releasing new version...
✔  hosting[citard-fbc26]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/citard-fbc26/overview
Hosting URL: https://tapati.online
```

---

## 🧪 VERIFICACIÓN POST-DEPLOY

### 1️⃣ Limpiar Caché del Navegador
```
1. Abre https://tapati.online
2. Presiona Ctrl+Shift+R (hard refresh)
3. O abre en ventana de incógnito
```

### 2️⃣ Verificar en DevTools
```
1. Presiona F12 para abrir DevTools
2. Ve a la pestaña Console
3. Inicia sesión
4. Busca estos logs:

🔔 [APP] Llamando useUnreadMessages con userId: ...
🔔 [UNREAD HOOK] Inicializado
📡 [UNREAD HOOK] Configurando listener de Firestore
✅ [UNREAD HOOK] Listener configurado exitosamente
```

### 3️⃣ Verificar Badge Visualmente
```
Desktop:
- Ve al sidebar izquierdo
- Busca el botón "Mensajes"
- Verifica que el badge aparezca si hay mensajes sin leer

Mobile:
- Ve a la navegación inferior
- Busca el ícono de mensajes
- Verifica que el badge aparezca si hay mensajes sin leer

Lista de Chats:
- Ve a la vista de Mensajes
- Verifica que cada chat con mensajes sin leer tenga un badge verde sobre el avatar
```

---

## 🎯 PRUEBA FUNCIONAL

### Método 1: Simular con Firestore Console
1. Ve a Firebase Console → Firestore
2. Abre un chat donde seas participante
3. Agrega: `unreadCount_TU_USER_ID: 5`
4. Guarda
5. Refresca https://tapati.online
6. Verás el badge con "5"

### Método 2: Prueba Real con Dos Cuentas
1. Abre https://tapati.online en navegador normal
2. Inicia sesión con tu cuenta principal
3. Abre https://tapati.online en ventana de incógnito
4. Inicia sesión con cuenta de prueba
5. Envía mensaje desde cuenta de prueba
6. Verifica badge en cuenta principal (sin abrir el chat)

---

## 📊 ARCHIVOS DEPLOYADOS

### Nuevos Archivos:
```
cita-rd/hooks/useUnreadMessages.ts
```

### Archivos Modificados:
```
cita-rd/App.tsx
cita-rd/services/chatService.ts
cita-rd/components/DesktopSidebar.tsx
cita-rd/components/DesktopLayout.tsx
cita-rd/components/components/Layout.tsx
cita-rd/views/views/Messages.tsx
```

### Archivos de Documentación (NO deployados):
```
cita-rd/VERIFICACION_CONTADOR_MENSAJES_06_MAR_2026.md
cita-rd/PRUEBA_RAPIDA_CONTADOR.md
cita-rd/RESUMEN_VISUAL_CONTADOR_06_MAR_2026.md
cita-rd/ESTADO_FINAL_CONTADOR_06_MAR_2026.md
cita-rd/BADGE_UBICACIONES_WHATSAPP_STYLE_06_MAR_2026.md
cita-rd/DEPLOY_CONTADOR_MENSAJES_06_MAR_2026.md (este archivo)
```

---

## 🔧 TROUBLESHOOTING

### Problema: Badge no aparece después del deploy

**Solución 1: Limpiar caché**
```
1. Ctrl+Shift+R (hard refresh)
2. O Ctrl+Shift+Delete → Limpiar caché
3. O abrir en ventana de incógnito
```

**Solución 2: Verificar logs**
```
1. F12 → Console
2. Buscar logs de [UNREAD HOOK]
3. Si no aparecen, el código no se deployó correctamente
```

**Solución 3: Re-deploy**
```powershell
npm run build
firebase deploy --only hosting
```

### Problema: Build falla

**Error común**: Errores de TypeScript
```
Solución: Verificar que no haya errores de sintaxis
npm run build
```

**Error común**: Falta de memoria
```
Solución: Cerrar otras aplicaciones y reintentar
npm run build
```

### Problema: Deploy falla

**Error común**: No autenticado en Firebase
```
Solución: Volver a autenticar
firebase login
firebase deploy --only hosting
```

**Error común**: Proyecto incorrecto
```
Solución: Verificar proyecto
firebase use citard-fbc26
firebase deploy --only hosting
```

---

## ✅ CHECKLIST POST-DEPLOY

- [ ] Build completado sin errores
- [ ] Deploy completado sin errores
- [ ] Caché del navegador limpiado
- [ ] Logs de [UNREAD HOOK] aparecen en Console
- [ ] Badge visible en navegación (si hay mensajes sin leer)
- [ ] Badge visible en lista de chats (si hay mensajes sin leer)
- [ ] Badge desaparece al abrir chat
- [ ] Contador se actualiza en tiempo real

---

## 🎉 RESULTADO ESPERADO

Después del deploy exitoso:

1. ✅ https://tapati.online tendrá el nuevo código
2. ✅ Badge de mensajes no leídos funcionando
3. ✅ Actualización en tiempo real
4. ✅ Estilo WhatsApp/Telegram
5. ✅ Responsive (mobile y desktop)

---

## 📝 NOTAS IMPORTANTES

1. **Caché del navegador**: Los usuarios existentes necesitarán hacer hard refresh (Ctrl+Shift+R) para ver los cambios

2. **Mensajes existentes**: Los chats existentes NO tendrán contadores hasta que se envíen nuevos mensajes

3. **Compatibilidad**: El sistema es compatible con todos los navegadores modernos

4. **Performance**: El listener de Firestore es eficiente y no afecta el rendimiento

---

**Deployado por**: Usuario  
**Asistido por**: Kiro AI  
**Fecha**: 6 de marzo de 2026  
**Versión**: 1.0.0
