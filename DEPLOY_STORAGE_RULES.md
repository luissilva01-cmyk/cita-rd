# 🔥 Desplegar Storage Rules - URGENTE

## ⚠️ PROBLEMA IDENTIFICADO

Las Storage Rules actuales NO permiten videos. Por eso:
1. ❌ El recuadro sale negro (stream no se asigna correctamente - CORREGIDO)
2. ❌ El receptor no puede ver el video (Firebase Storage bloquea el acceso)

---

## ✅ SOLUCIÓN

### Paso 1: Desplegar Nuevas Storage Rules

Las reglas ya están actualizadas en `storage.rules`. Ahora debes desplegarlas:

```bash
cd cita-rd
firebase deploy --only storage
```

**Salida esperada:**
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/citard-fbc26/overview
```

---

### Paso 2: Verificar en Firebase Console

1. Ir a: https://console.firebase.google.com/project/citard-fbc26/storage/rules
2. Verificar que aparezcan las nuevas reglas:

```javascript
// Reglas para mensajes de voz y video
match /voice_messages/{chatId}/{fileName} {
  allow read: if request.auth != null;
  allow write: if request.auth != null
               && request.resource.size < 50 * 1024 * 1024
               && (request.resource.contentType.matches('audio/.*') 
                   || request.resource.contentType.matches('video/.*'));
  allow delete: if request.auth != null;
}
```

---

## 🔍 Cambios en las Reglas

### ANTES (Bloqueaba videos):
```javascript
match /{allPaths=**} {
  allow read, write: if false;  // ❌ Bloqueaba todo lo demás
}
```

### AHORA (Permite videos):
```javascript
match /voice_messages/{chatId}/{fileName} {
  allow read: if request.auth != null;  // ✅ Usuarios autenticados pueden leer
  allow write: if request.auth != null
               && request.resource.size < 50 * 1024 * 1024  // Máx 50MB
               && (request.resource.contentType.matches('audio/.*') 
                   || request.resource.contentType.matches('video/.*'));  // ✅ Audio Y video
  allow delete: if request.auth != null;
}
```

---

## 🧪 Cómo Probar Después del Deploy

### Test 1: Grabar Videomensaje
1. Ir a un chat
2. Clic en botón 📹
3. Permitir permisos
4. **Verificar:** Debe verse tu cámara en tiempo real (no negro)
5. Grabar 5-10 segundos
6. Clic en "Enviar"
7. **Verificar en consola:**
   ```
   📹 Stream obtenido: MediaStream
   ✅ Vista previa iniciada correctamente
   🎬 Grabación iniciada
   📹 Grabación detenida, procesando...
   📹 Video blob creado: XXX bytes
   ☁️ Subiendo video a Firebase Storage...
   ✅ Video subido exitosamente: https://...
   ```

### Test 2: Ver Video (Emisor)
1. El video debe aparecer en tu chat
2. Hacer clic en play
3. **Verificar:** El video se reproduce correctamente

### Test 3: Ver Video (Receptor)
1. Abrir chat desde otra cuenta
2. **Verificar:** El video aparece
3. Hacer clic en play
4. **Verificar:** El video se reproduce
5. **Verificar en consola:**
   ```
   📹 VideoMessage montado: { videoUrl: "https://...", duration: 10 }
   ✅ Video metadata cargada: { duration: 10, width: 1280, height: 720 }
   ✅ Video listo para reproducir
   ```

---

## 🐛 Si Aún Hay Problemas

### Problema 1: Recuadro Negro Durante Grabación

**Verificar en consola:**
```
📹 Asignando stream a video preview...
✅ Vista previa iniciada correctamente
```

**Si no aparece:**
- Recargar página
- Permitir permisos de cámara
- Verificar que no haya otra app usando la cámara

---

### Problema 2: Receptor No Puede Ver Video

**Verificar en consola del receptor:**
```
❌ Error cargando video: ...
```

**Posibles causas:**
1. Storage Rules no desplegadas → **Desplegar con `firebase deploy --only storage`**
2. Usuario no autenticado → **Verificar que esté logueado**
3. URL inválida → **Verificar que la URL sea de Firebase Storage**

**Verificar URL del video:**
Debe ser algo como:
```
https://firebasestorage.googleapis.com/v0/b/citard-fbc26.appspot.com/o/voice_messages%2F...
```

---

## 📋 Checklist de Verificación

- [ ] Storage Rules desplegadas (`firebase deploy --only storage`)
- [ ] Reglas verificadas en Firebase Console
- [ ] Vista previa funciona durante grabación (no negro)
- [ ] Video se sube correctamente
- [ ] Emisor puede ver su video
- [ ] Receptor puede ver el video
- [ ] No hay errores en consola

---

## 🚀 Comandos Rápidos

```bash
# Desplegar Storage Rules
cd cita-rd
firebase deploy --only storage

# Ver logs en tiempo real
firebase functions:log --only storage

# Verificar proyecto actual
firebase projects:list
firebase use citard-fbc26
```

---

## 📝 Notas Importantes

1. **Las Storage Rules se aplican inmediatamente** después del deploy
2. **No necesitas reiniciar el servidor** de desarrollo
3. **Los videos existentes** (si los hay) seguirán funcionando
4. **El límite de 50MB** es suficiente para videos de 30 segundos

---

## ✅ Después del Deploy

Una vez desplegadas las reglas:
1. ✅ Los videos se subirán correctamente
2. ✅ Los receptores podrán verlos
3. ✅ La vista previa funcionará (ya corregida en código)
4. ✅ Todo debería funcionar al 100%

---

## 🆘 Soporte

Si después de desplegar las reglas aún hay problemas:
1. Compartir logs de consola (emisor y receptor)
2. Compartir URL del video generado
3. Verificar que ambos usuarios estén autenticados

**Email:** tapapatisoporte@gmail.com
