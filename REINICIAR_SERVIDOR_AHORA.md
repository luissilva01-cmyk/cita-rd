# 🔄 REINICIAR SERVIDOR - INSTRUCCIONES

**Fecha:** 21 de enero de 2026  
**Acción requerida:** Reiniciar el servidor para aplicar cambios

---

## ✅ CAMBIO REALIZADO

He modificado `cita-rd/services/firebase.ts` para inicializar Storage de forma diferente:

**Antes:**
```typescript
storageInstance = getStorage(app, "gs://citard-fbc26.appspot.com");
```

**Ahora:**
```typescript
storageInstance = getStorage(app); // Usa el bucket del config automáticamente
```

---

## 🔄 CÓMO REINICIAR EL SERVIDOR

### Opción 1: Desde la terminal donde corre el servidor

1. **Ve a la terminal donde está corriendo `npm run dev`**
2. **Presiona `Ctrl + C`** para detener el servidor
3. **Espera a que se detenga completamente**
4. **Ejecuta de nuevo:**
   ```bash
   npm run dev
   ```

### Opción 2: Desde una nueva terminal

Si no encuentras la terminal original:

1. **Abre una nueva terminal**
2. **Navega al directorio:**
   ```bash
   cd cita-rd
   ```
3. **Ejecuta:**
   ```bash
   npm run dev
   ```

---

## ✅ VERIFICAR QUE FUNCIONÓ

### 1. Abre tu navegador
```
http://localhost:3000
```

### 2. Abre DevTools
- Presiona `F12` o
- Click derecho → "Inspeccionar" → pestaña "Console"

### 3. Busca estos mensajes:

**✅ SI FUNCIONA, verás:**
```
✅ Firebase Storage inicializado correctamente
📦 Bucket: citard-fbc26.appspot.com
```

**❌ SI NO FUNCIONA, verás:**
```
❌ Error inicializando Storage: ...
⚠️ Storage no disponible. Error: ...
```

---

## 🎯 PRÓXIMOS PASOS

### Si funciona (✅):
1. ¡Perfecto! Storage está listo
2. Prueba subir una foto de perfil
3. Avísame si funciona la subida

### Si NO funciona (❌):
1. Copia el error completo de la consola
2. Compártelo conmigo
3. Probaremos la Opción 3: Cloudinary

---

## 📸 PROBAR SUBIDA DE FOTOS

Una vez que veas el mensaje de éxito:

1. **Ve a tu perfil** en la app
2. **Busca el botón para subir foto**
3. **Selecciona una imagen**
4. **Observa la consola del navegador:**
   - Debe decir: `📸 Subiendo foto: ...`
   - Luego: `✅ Foto subida exitosamente`
   - Finalmente: `🔗 URL obtenida: ...`

---

## 🔍 DIAGNÓSTICO ADICIONAL

Si después de reiniciar sigue sin funcionar, necesito que me compartas:

1. **El error exacto de la consola del navegador**
2. **Screenshot de Firebase Console → Storage** (la página donde ves "Archivos, Usos, Reglas")
3. **Confirma que el servidor se reinició** (debe mostrar la hora actual en la terminal)

---

## 💡 ¿POR QUÉ ESTE CAMBIO?

El problema puede ser que especificar el bucket con `gs://` causa conflicto. Al usar `getStorage(app)` sin parámetros, Firebase usa automáticamente el bucket configurado en `firebaseConfig.storageBucket`.

Esto es más confiable porque:
- ✅ Usa la configuración oficial del proyecto
- ✅ No hay conflictos de formato (gs:// vs https://)
- ✅ Es el método recomendado por Firebase

---

**ACCIÓN REQUERIDA:** Reinicia el servidor ahora y avísame qué mensaje ves en la consola del navegador.
