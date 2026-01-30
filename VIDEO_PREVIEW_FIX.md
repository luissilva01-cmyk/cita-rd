# ✅ FIX: Vista Previa de Video Sale Negra

**Fecha:** 30 de enero de 2026  
**Problema:** Al grabar videomensajes, el recuadro aparece pero sale negro (no se ve la cámara)

---

## 🐛 PROBLEMA IDENTIFICADO

Cuando el usuario presionaba el botón de videomensaje 📹, aparecía el recuadro de grabación pero la vista previa salía completamente negra.

**Causa raíz:**
El estado `isRecordingVideo` se activaba DESPUÉS de obtener el stream de la cámara. Esto causaba que:
1. Se obtenía el stream de la cámara
2. Se intentaba asignar el stream al elemento `<video>`
3. Pero el elemento `<video>` aún no existía en el DOM (porque `isRecordingVideo` era `false`)
4. Luego se activaba `isRecordingVideo` y se renderizaba el `<video>`
5. Pero el stream ya no se asignaba correctamente

---

## ✅ SOLUCIÓN IMPLEMENTADA

Cambiar el orden de ejecución para activar el estado ANTES de obtener el stream:

```typescript
const handleStartVideoRecording = async () => {
  try {
    // 1. PRIMERO: Activar estado para renderizar el elemento <video>
    setIsRecordingVideo(true);
    
    // 2. Pequeño delay para asegurar que el DOM se actualice
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // 3. DESPUÉS: Obtener stream de la cámara
    const stream = await navigator.mediaDevices.getUserMedia({...});
    
    // 4. Asignar stream al elemento (que ya existe en el DOM)
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = stream;
      await videoPreviewRef.current.play();
    }
    
    // ... resto del código
  }
}
```


---

## 📝 CAMBIOS REALIZADOS

### Archivo: `cita-rd/views/views/ChatView.tsx`

**Antes:**
```typescript
const handleStartVideoRecording = async () => {
  // 1. Obtener stream
  const stream = await navigator.mediaDevices.getUserMedia({...});
  
  // 2. Asignar a video (que no existe aún)
  if (videoPreviewRef.current) {
    videoPreviewRef.current.srcObject = stream;
  }
  
  // 3. Activar estado (ahora se renderiza el video)
  setIsRecordingVideo(true);
}
```

**Después:**
```typescript
const handleStartVideoRecording = async () => {
  // 1. Activar estado PRIMERO
  setIsRecordingVideo(true);
  
  // 2. Delay para que el DOM se actualice
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // 3. Obtener stream
  const stream = await navigator.mediaDevices.getUserMedia({...});
  
  // 4. Asignar a video (que ya existe)
  if (videoPreviewRef.current) {
    videoPreviewRef.current.srcObject = stream;
  } else {
    // Si aún no existe, limpiar y salir
    stream.getTracks().forEach(track => track.stop());
    setIsRecordingVideo(false);
    return;
  }
}
```

---

## 🧪 CÓMO PROBAR

1. Abre la app en http://localhost:3000/
2. Inicia sesión y abre un chat
3. Presiona el botón de videomensaje 📹
4. Permite permisos de cámara
5. **Verifica que ahora SÍ se ve la imagen de la cámara** (no sale negro)
6. Graba un video corto
7. Envía el mensaje
8. Verifica que el otro usuario puede ver el video

---

## ✅ RESULTADO ESPERADO

- ✅ Al presionar el botón de videomensaje, aparece el recuadro
- ✅ La vista previa muestra la imagen de la cámara (NO sale negro)
- ✅ Se puede ver el contador de tiempo (0:02 / 0:30)
- ✅ Se puede grabar y enviar el videomensaje
- ✅ El receptor puede ver el video correctamente

---

## 🔍 LOGS EN CONSOLA

Deberías ver estos logs en orden:

```
📹 Iniciando grabación de videomensaje...
📹 Stream obtenido: MediaStream {...}
📹 Video tracks: [...]
📹 Audio tracks: [...]
📹 Asignando stream a video preview...
✅ Vista previa iniciada correctamente
🎬 MediaRecorder creado con mimeType: video/webm;codecs=vp8,opus
🎬 Grabación iniciada
```

Si ves `❌ videoPreviewRef.current es null!`, significa que el elemento aún no se renderizó correctamente.


---

## 📱 FIX ADICIONAL: Formato Vertical para Videomensajes

**Problema:** La vista previa salía en formato horizontal (apaisado) cuando debería ser vertical (retrato).

**Solución:** Cambiar las dimensiones del video a formato vertical 9:16 (como Instagram Stories):

### Cambios en `getUserMedia`:

**Antes:**
```typescript
video: {
  width: { ideal: 1280 },
  height: { ideal: 720 },
  facingMode: 'user'
}
```

**Después:**
```typescript
video: {
  width: { ideal: 720 },
  height: { ideal: 1280 },
  facingMode: 'user',
  aspectRatio: { ideal: 9/16 } // Formato vertical
}
```

### Cambios en el elemento `<video>`:

**Antes:**
```tsx
<video
  className="w-full max-h-64 object-cover"
  style={{ transform: 'scaleX(-1)' }}
/>
```

**Después:**
```tsx
<video
  className="w-full h-auto object-cover"
  style={{ 
    transform: 'scaleX(-1)',
    aspectRatio: '9/16'
  }}
/>
```

### Contenedor con ancho máximo:

```tsx
<div className="relative mb-3 rounded-xl overflow-hidden bg-black mx-auto" 
     style={{ maxWidth: '360px' }}>
  <video ... />
</div>
```

---

## ✅ RESULTADO FINAL

- ✅ Vista previa en formato vertical (retrato) 9:16
- ✅ Ancho máximo de 360px para no ocupar toda la pantalla
- ✅ Efecto espejo para que el usuario se vea como en un espejo
- ✅ Centrado horizontalmente con `mx-auto`
- ✅ Mantiene proporción correcta en todos los dispositivos

