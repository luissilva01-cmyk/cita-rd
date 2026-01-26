# Guía para Probar Typing Indicator (15 segundos)

## 🚀 Servidor Iniciado

**URL Local:** http://localhost:3000/
**URL Red:** http://192.168.100.52:3000/

---

## 📋 PASOS PARA PROBAR

### Opción 1: Dos Ventanas del Navegador (Recomendado)

**1. Ventana Normal:**
- Abre: http://localhost:3000/
- Login como: **Juan Pérez**
  - Email: `juan@test.com` (o el que uses)
  - User ID: `KU5ZalR92QcPV7RGbLFTjEjTXZm2`

**2. Ventana Incógnito:**
- Abre: http://localhost:3000/ (en modo incógnito)
- Login como: **Luis Silva**
  - Email: `luis@test.com` (o el que uses)
  - User ID: `je1HdwssPigxtDyHKZpkXNMOGY32`

**3. Iniciar Chat:**
- En cualquiera de las dos ventanas, ve a "Matches" o "Mensajes"
- Abre el chat entre Juan y Luis
- Chat ID conocido: `WRn2Al5ruyw0LE15PP80`

---

## 🧪 PRUEBAS A REALIZAR

### Prueba 1: Typing Indicator Aparece
1. En **Ventana 1** (Juan): Empieza a escribir en el input
2. En **Ventana 2** (Luis): Deberías ver "Juan escribiendo..." con animación de puntos
3. ✅ **Resultado esperado:** Indicador aparece inmediatamente

### Prueba 2: Timeout de 15 Segundos
1. En **Ventana 1** (Juan): Escribe algo pero NO envíes
2. En **Ventana 2** (Luis): Observa el indicador "Juan escribiendo..."
3. En **Ventana 1** (Juan): Deja de escribir y espera
4. Cuenta 15 segundos
5. ✅ **Resultado esperado:** Indicador desaparece después de 15 segundos

### Prueba 3: Limpiar Input
1. En **Ventana 1** (Juan): Escribe algo
2. En **Ventana 2** (Luis): Ve el indicador "Juan escribiendo..."
3. En **Ventana 1** (Juan): Borra todo el texto (input vacío)
4. ✅ **Resultado esperado:** Indicador desaparece INMEDIATAMENTE

### Prueba 4: Enviar Mensaje
1. En **Ventana 1** (Juan): Escribe un mensaje
2. En **Ventana 2** (Luis): Ve el indicador "Juan escribiendo..."
3. En **Ventana 1** (Juan): Presiona Enter o click en enviar
4. ✅ **Resultado esperado:** Indicador desaparece INMEDIATAMENTE

### Prueba 5: Cerrar Chat
1. En **Ventana 1** (Juan): Escribe algo
2. En **Ventana 2** (Luis): Ve el indicador "Juan escribiendo..."
3. En **Ventana 1** (Juan): Cierra el chat (botón atrás)
4. ✅ **Resultado esperado:** Indicador desaparece en Ventana 2

### Prueba 6: Escribir Continuamente
1. En **Ventana 1** (Juan): Escribe continuamente por 30 segundos
2. En **Ventana 2** (Luis): Observa el indicador
3. ✅ **Resultado esperado:** Indicador permanece visible mientras escribes

### Prueba 7: Pausar y Continuar
1. En **Ventana 1** (Juan): Escribe algo
2. Espera 10 segundos (sin escribir)
3. Vuelve a escribir antes de que pasen 15 segundos
4. ✅ **Resultado esperado:** Indicador permanece visible, timeout se reinicia

---

## 🔍 QUÉ OBSERVAR EN CONSOLA

### Logs Esperados (Ventana 1 - Juan):
```
⌨️ Input changed, updating typing status: typing
🔥 updateTypingStatus llamado: {chatId: "...", userId: "...", isTyping: true}
✅ Typing status actualizado en Firebase: true
```

### Logs Esperados (Ventana 2 - Luis):
```
👂 SNAPSHOT RECIBIDO!
👂 Exists: true
👂 Data: {isTyping: true, timestamp: ...}
👂 ✅ Llamando callback con isTyping= true
🔔 Typing status changed: {userName: "Juan", isTyping: true}
```

### Después de 15 segundos (Ventana 1):
```
⏱️ Timeout: Limpiando typing status después de 15 segundos
🔥 updateTypingStatus llamado: {chatId: "...", userId: "...", isTyping: false}
✅ Typing status actualizado en Firebase: false
```

---

## 📊 VERIFICAR EN FIREBASE CONSOLE

**URL:** https://console.firebase.google.com/project/citard-fbc26/firestore

**Navegar a:**
```
Firestore Database > chats > {chatId} > typingStatus > {userId}
```

**Campos esperados:**
```javascript
{
  isTyping: true/false,
  timestamp: Timestamp
}
```

**Observar:**
- ✅ Campo `isTyping` cambia a `true` cuando escribes
- ✅ Campo `isTyping` cambia a `false` después de 15 segundos
- ✅ Campo `timestamp` se actualiza con cada cambio

---

## ⏱️ COMPARACIÓN DE TIMEOUTS

### Antes (3 segundos):
- Indicador desaparecía muy rápido
- ~20 writes por minuto
- Usuario sentía presión al escribir

### Ahora (15 segundos):
- ✅ Indicador permanece visible más tiempo
- ✅ ~4 writes por minuto (80% menos)
- ✅ Usuario puede pausar para pensar
- ✅ Experiencia más natural

---

## 🐛 TROUBLESHOOTING

### Problema: Indicador no aparece
**Solución:**
1. Verifica que ambos usuarios estén en el mismo chat
2. Abre consola del navegador y busca errores
3. Verifica Firebase Console que el documento se crea
4. Hard refresh (Ctrl + Shift + R)

### Problema: Indicador no desaparece
**Solución:**
1. Verifica que han pasado 15 segundos completos
2. Revisa consola para ver si el timeout se ejecutó
3. Verifica Firebase Console que `isTyping` cambió a `false`

### Problema: Errores en consola
**Solución:**
1. Verifica que Firebase está inicializado correctamente
2. Revisa que el chatId es válido
3. Verifica permisos en Firestore Rules

---

## 📱 PROBAR EN MÓVIL (Opcional)

**Desde tu teléfono:**
1. Conecta a la misma red WiFi
2. Abre: http://192.168.100.52:3000/
3. Login y prueba el typing indicator
4. Verifica que funciona igual que en desktop

---

## ✅ CHECKLIST DE PRUEBAS

- [ ] Indicador aparece cuando el otro usuario escribe
- [ ] Indicador desaparece después de 15 segundos de inactividad
- [ ] Indicador desaparece al limpiar input
- [ ] Indicador desaparece al enviar mensaje
- [ ] Indicador desaparece al cerrar chat
- [ ] Indicador permanece visible al escribir continuamente
- [ ] Timeout se reinicia al volver a escribir
- [ ] Funciona en ambas direcciones (Juan → Luis y Luis → Juan)
- [ ] Traducciones funcionan (cambiar idioma y verificar)
- [ ] No hay errores en consola
- [ ] Firebase Console muestra cambios correctos

---

## 🎯 RESULTADO ESPERADO

**Experiencia de Usuario:**
- ✅ Indicador aparece suavemente cuando el otro escribe
- ✅ Permanece visible mientras escribe
- ✅ Desaparece después de 15 segundos si para de escribir
- ✅ Desaparece inmediatamente al enviar o limpiar
- ✅ Animación de puntos es fluida
- ✅ No hay lag o delay perceptible

**Performance:**
- ✅ Menos writes a Firebase (80% reducción)
- ✅ No hay memory leaks
- ✅ Funciona en múltiples chats simultáneamente
- ✅ Console limpio (sin logs de debug)

---

## 📞 USUARIOS DE PRUEBA

### Usuario 1: Juan Pérez
- **User ID:** `KU5ZalR92QcPV7RGbLFTjEjTXZm2`
- **Email:** juan@test.com (o el que uses)
- **Nombre:** Juan Pérez

### Usuario 2: Luis Silva
- **User ID:** `je1HdwssPigxtDyHKZpkXNMOGY32`
- **Email:** luis@test.com (o el que uses)
- **Nombre:** Luis Silva

### Chat ID Conocido:
- **Chat ID:** `WRn2Al5ruyw0LE15PP80`

---

## 🎉 DESPUÉS DE PROBAR

Si todo funciona correctamente:
1. ✅ Marca todas las pruebas del checklist
2. ✅ Toma screenshots si quieres documentar
3. ✅ Verifica Firebase Console para confirmar reducción de writes
4. ✅ Celebra - tienes un typing indicator profesional! 🎊

---

**Fecha:** 26 de enero de 2026
**Timeout configurado:** 15 segundos
**Estado:** ✅ Listo para probar
**Servidor:** http://localhost:3000/
