# 🧪 Guía de Prueba: Videomensajes y Mensajes de Voz

## ✅ Servidor Corriendo

El servidor de desarrollo está activo en:
- **Local:** http://localhost:3000/
- **Red:** http://192.168.100.52:3000/

## 📋 Pasos para Probar

### 1. Preparar Dos Usuarios

**Opción A: Dos Navegadores Diferentes**
- Chrome en ventana normal
- Firefox o Edge en ventana normal

**Opción B: Modo Incógnito (Recomendado)**
- Chrome ventana 1 (Ctrl+Shift+N)
- Chrome ventana 2 (Ctrl+Shift+N)

### 2. Crear Usuarios y Match

**En Ventana 1:**
1. Abre http://localhost:3000/
2. Regístrate con:
   - Email: usuario1@test.com
   - Contraseña: test123
   - Nombre: Usuario 1

**En Ventana 2:**
1. Abre http://localhost:3000/
2. Regístrate con:
   - Email: usuario2@test.com
   - Contraseña: test123
   - Nombre: Usuario 2

**Crear Match:**
1. En ambas ventanas, ve a "Descubrir" (icono de corazón)
2. Dale "like" al otro usuario
3. Deberías ver una notificación de "Match!"
4. Ve a "Mensajes" (icono de chat)

### 3. Probar Mensajes de Voz

**En Ventana 1 (Usuario 1):**
1. Abre el chat con Usuario 2
2. Presiona el botón del **micrófono** (🎤)
3. Permite el acceso al micrófono si te lo pide
4. Habla algo (ej: "Hola, este es un mensaje de voz de prueba")
5. Presiona **"Enviar"** (botón rojo con StopCircle)
6. **Observa la consola del navegador:**
   ```
   ☁️ Subiendo archivo a Firebase Storage...
   📤 Subiendo a: voice_messages/...
   ✅ Archivo subido, obteniendo URL...
   ✅ URL obtenida: https://firebasestorage.googleapis.com/...
   ```

**En Ventana 2 (Usuario 2):**
1. Deberías ver aparecer el mensaje de voz automáticamente
2. Presiona el botón de **play** (▶️) para escucharlo
3. **Verifica que se escucha correctamente**

### 4. Probar Videomensajes

**En Ventana 2 (Usuario 2):**
1. Presiona el botón de **videomensaje** (📹)
2. Permite el acceso a la cámara y micrófono si te lo pide
3. **Verifica que ves la vista previa de tu cámara** (efecto espejo)
4. Graba un mensaje corto (ej: "Hola, este es un videomensaje")
5. Observa el contador (máximo 30 segundos)
6. Presiona **"Enviar"** (botón morado con StopCircle)
7. **Observa la consola del navegador:**
   ```
   📹 Iniciando grabación de videomensaje...
   📹 Stream obtenido
   🎬 MediaRecorder creado
   🎬 Grabación iniciada
   📹 Grabación detenida, procesando...
   ☁️ Subiendo video a Firebase Storage...
   ✅ Video subido exitosamente
   ```

**En Ventana 1 (Usuario 1):**
1. Deberías ver aparecer el videomensaje automáticamente
2. Presiona el botón de **play** (▶️) para verlo
3. **Verifica que se ve y escucha correctamente**
4. Prueba el botón de **volumen** (🔊/🔇)

## 🔍 Qué Verificar

### ✅ Mensajes de Voz
- [ ] Se graba correctamente
- [ ] Se sube a Firebase Storage (ver consola)
- [ ] El receptor lo recibe automáticamente
- [ ] Se puede reproducir
- [ ] El contador de duración funciona
- [ ] El botón de cancelar funciona

### ✅ Videomensajes
- [ ] Se solicitan permisos de cámara/micrófono
- [ ] La vista previa se ve correctamente (no negro)
- [ ] Se graba correctamente
- [ ] El contador funciona (máx 30 seg)
- [ ] Se sube a Firebase Storage (ver consola)
- [ ] El receptor lo recibe automáticamente
- [ ] Se puede reproducir
- [ ] Los controles funcionan (play/pause, volumen)

## 🐛 Problemas Comunes

### Vista Previa Negra
**Síntoma:** El recuadro de video aparece pero está negro durante la grabación.

**Solución:**
1. Verifica que diste permisos de cámara
2. Cierra otras apps que usen la cámara (Zoom, Teams, etc.)
3. Recarga la página y vuelve a intentar
4. Revisa la consola para ver errores

### No Se Sube a Firebase
**Síntoma:** Error en consola al subir archivo.

**Solución:**
1. Verifica que estás autenticado
2. Verifica que las Storage Rules están desplegadas
3. Revisa Firebase Console > Storage para ver si hay errores

### Receptor No Recibe Mensaje
**Síntoma:** El mensaje no aparece en la otra ventana.

**Solución:**
1. Verifica que ambos usuarios tienen un match
2. Verifica que el chatId es el mismo en ambas ventanas
3. Revisa Firestore Console > messages para ver si el mensaje se guardó

## 📊 Verificar en Firebase Console

### Storage
1. Ve a https://console.firebase.google.com/project/citard-fbc26/storage
2. Navega a `voice_messages/`
3. Deberías ver carpetas con los chatIds
4. Dentro, deberías ver archivos `.webm`

### Firestore
1. Ve a https://console.firebase.google.com/project/citard-fbc26/firestore
2. Navega a `messages` collection
3. Busca los mensajes con `type: 'voice'` o `type: 'video'`
4. Verifica que tienen el campo `content` con la URL de Firebase Storage

## 🎯 Resultado Esperado

### Antes (NO funcionaba)
```javascript
// URL local (solo funciona en el navegador que la creó)
content: "blob:http://localhost:3000/abc123..."
```

### Ahora (Funciona)
```javascript
// URL pública de Firebase Storage (funciona para todos)
content: "https://firebasestorage.googleapis.com/v0/b/citard-fbc26.appspot.com/o/voice_messages%2F..."
```

## 📝 Logs Importantes

### Consola del Navegador (Envío)
```
☁️ Subiendo archivo a Firebase Storage...
  size: 123456
  type: "audio/webm" o "video/webm"
  chatId: "..."
  senderId: "..."
📤 Subiendo a: voice_messages/chatId/senderId_timestamp.webm
✅ Archivo subido, obteniendo URL...
✅ URL obtenida: https://firebasestorage.googleapis.com/...
```

### Consola del Navegador (Recepción)
```
📹 VideoMessage montado:
  videoUrl: "https://firebasestorage.googleapis.com/..."
  duration: 15
  isOwn: false
✅ Video metadata cargada
✅ Video listo para reproducir
```

## 🚀 Siguiente Paso

Si todo funciona correctamente:
1. ✅ Los mensajes de voz se comparten entre usuarios
2. ✅ Los videomensajes se comparten entre usuarios
3. ✅ Las URLs son públicas de Firebase Storage
4. ✅ La vista previa funciona correctamente

**¡El problema está resuelto!** 🎉

---

**Fecha:** 30 Enero 2026  
**Proyecto:** Ta' Pa' Ti  
**Servidor:** http://localhost:3000/  
**Firebase:** citard-fbc26
