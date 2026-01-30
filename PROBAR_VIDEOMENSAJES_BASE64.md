# 🧪 GUÍA RÁPIDA: PROBAR VIDEOMENSAJES Y MENSAJES DE VOZ

**Fecha:** 30 de enero de 2026  
**Servidor:** http://localhost:3000/ (ya está corriendo)

---

## ✅ CAMBIOS IMPLEMENTADOS

- ✅ Reescrito `voiceMessageService.ts` para usar Base64 en lugar de Firebase Storage
- ✅ Agregadas validaciones de tamaño (máximo 1MB)
- ✅ Mensajes de error claros para el usuario
- ✅ Compatible con Firestore sin necesidad de Storage

---

## 🎯 PASOS PARA PROBAR

### 1. Preparar dos usuarios

**Opción A: Dos navegadores**
- Navegador 1: Chrome normal
- Navegador 2: Chrome en modo incógnito

**Opción B: Dos pestañas**
- Pestaña 1: Usuario A
- Pestaña 2: Usuario B (modo incógnito)

### 2. Crear un match

1. Inicia sesión con ambos usuarios
2. Asegúrate de que ambos usuarios se hayan dado "like" mutuamente
3. Verifica que aparecen en la sección de Matches

### 3. Probar Mensajes de Voz 🎤

1. Abre el chat entre los dos usuarios
2. Presiona el botón de **micrófono** 🎤
3. Permite permisos de micrófono si te lo pide
4. Habla durante 5-10 segundos
5. Presiona **"Enviar"**
6. Verifica en el otro navegador que el mensaje aparece
7. Presiona el botón de **Play** ▶️ para escuchar

**✅ Resultado esperado:**
- El mensaje se envía correctamente
- El otro usuario puede escuchar el audio
- NO aparecen errores en la consola


### 4. Probar Videomensajes 📹

1. En el chat, presiona el botón de **videomensaje** 📹
2. Permite permisos de cámara y micrófono
3. **IMPORTANTE:** Verifica que aparece la vista previa de la cámara
4. Graba durante 5-10 segundos
5. Presiona **"Enviar"**
6. Verifica en el otro navegador que el mensaje aparece
7. Presiona el botón de **Play** ▶️ para ver el video

**✅ Resultado esperado:**
- La vista previa de la cámara se muestra correctamente
- El video se envía correctamente
- El otro usuario puede ver el video
- NO aparecen errores en la consola

---

## 🔍 QUÉ VERIFICAR EN LA CONSOLA

Abre DevTools (F12) y ve a la pestaña **Console**. Deberías ver:

### Al grabar mensaje de voz:
```
📦 Convirtiendo archivo a Base64...
✅ Conversión completada: { originalSize: 45678, base64Size: 60904, base64SizeKB: "59.48KB" }
```

### Al grabar videomensaje:
```
📹 Iniciando grabación de videomensaje...
📹 Stream obtenido: MediaStream {...}
✅ Vista previa iniciada correctamente
🎬 MediaRecorder creado con mimeType: video/webm;codecs=vp8,opus
📹 Grabación detenida, procesando...
📹 Video blob creado: 234567 bytes
☁️ Subiendo video a Firebase Storage...
📦 Convirtiendo archivo a Base64...
✅ Conversión completada: { originalSize: 234567, base64Size: 312756, base64SizeKB: "305.43KB" }
✅ Video subido exitosamente: data:video/webm;base64,GkXfo...
```

### ❌ NO deberías ver estos errores:
- ❌ `Cannot read properties of null (reading '_location')`
- ❌ `Firebase Storage NO está habilitado`
- ❌ `Service storage is not available`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "El archivo es demasiado grande"

**Causa:** El archivo excede 1MB (límite de Firestore)

**Solución:**
- Graba mensajes más cortos
- Audio: máximo 10-15 segundos
- Video: máximo 5-10 segundos

### Problema: Vista previa de video no aparece

**Causa:** Permisos de cámara no otorgados o cámara en uso

**Solución:**
1. Verifica que otorgaste permisos de cámara
2. Cierra otras aplicaciones que usen la cámara
3. Recarga la página y vuelve a intentar

### Problema: Los mensajes antiguos no se reproducen

**Causa:** Mensajes antiguos usan URLs `blob:` que ya no existen

**Solución:**
- Estos mensajes son de pruebas anteriores
- Puedes ignorarlos o eliminarlos de Firestore
- Los nuevos mensajes funcionarán correctamente

