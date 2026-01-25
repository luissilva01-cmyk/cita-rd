# ☁️ Cloudinary Implementado - Guía Completa

**Fecha:** 21 de enero de 2026  
**Estado:** Configuración en progreso

## 🎯 Configuración de Cloudinary

### Paso 1: Configuración de Seguridad ✅

En **Cloudinary Console → Settings → Security**:

1. **Strict transformations:** `Disabled` ✅
2. **Strict video transformations:** `Disabled` ✅
3. **Restricted image types:**
   - ❌ Desmarca **"Uploaded"** (IMPORTANTE)
   - ❌ Desmarca todas las demás opciones EXCEPTO "Resource list"
   - ✅ Deja marcado solo "Resource list"

**¿Por qué?** La restricción "Uploaded" bloquea las subidas unsigned, que es lo que necesitamos.

### Paso 2: Crear Upload Preset ✅

En **Cloudinary Console → Settings → Upload**:

1. Haz clic en **"Add upload preset"**
2. Configura:
   - **Preset name:** `tapapati_photos`
   - **Signing Mode:** `Unsigned` (IMPORTANTE)
   - **Folder:** `tapapati/profile-photos` (opcional, para organizar)
   - **Use filename:** `false`
   - **Unique filename:** `true`
   - **Overwrite:** `false`
3. Haz clic en **"Save"**

### Paso 3: Variables de Entorno ✅

Archivo: `cita-rd/.env.local`

```env
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dkdfvcrdbt
VITE_CLOUDINARY_UPLOAD_PRESET=tapapati_photos
```

**Verificar:**
- ✅ Cloud Name: `dkdfvcrdbt`
- ✅ Upload Preset: `tapapati_photos`
- ✅ Preset es "Unsigned"

### Paso 4: Reiniciar Servidor 🔄

**IMPORTANTE:** Después de cambiar `.env.local`, debes reiniciar el servidor:

```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
cd cita-rd
npm run dev
```

## 🔍 Verificación

### 1. Verificar Variables de Entorno

Abre la consola del navegador y ejecuta:

```javascript
console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
```

Deberías ver:
```
Cloud Name: dkdfvcrdbt
Upload Preset: tapapati_photos
```

Si ves `undefined`, el servidor no se reinició correctamente.

### 2. Probar Subida de Foto

1. Ve a tu perfil en la app
2. Haz clic en "Gestionar fotos"
3. Selecciona una foto
4. Observa la consola del navegador

**Logs esperados (éxito):**
```
🔄 Redimensionando imagen...
📤 Subiendo foto...
☁️ Iniciando subida a Cloudinary...
📋 Cloud Name: dkdfvcrdbt
📋 Upload Preset: tapapati_photos
📋 File size: 245.67 KB
📋 File type: image/jpeg
📤 Enviando petición a Cloudinary...
📥 Respuesta recibida. Status: 200
✅ Foto subida a Cloudinary exitosamente
🔗 URL: https://res.cloudinary.com/dkdfvcrdbt/image/upload/v1737489234/tapapati/profile-photos/je1H4wssPlgxtDyHKZpkXNMOGY32_0_1737489234567.jpg
📊 Tamaño final: 198.45 KB
✅ Fotos del perfil actualizadas
✅ Foto subida y perfil actualizado
```

**Logs de error (si falla):**
```
❌ Error de Cloudinary: { error: { message: "..." } }
```

### 3. Verificar en Cloudinary Console

1. Ve a [Cloudinary Console](https://console.cloudinary.com/)
2. Haz clic en **"Media Library"** en el menú lateral
3. Busca la carpeta **"tapapati/profile-photos"**
4. Deberías ver tus fotos subidas

## 🐛 Solución de Problemas

### Error: "Unknown API key"

**Causa:** El Upload Preset tiene restricciones de seguridad o no es "Unsigned"

**Solución:**
1. Ve a Cloudinary Console → Settings → Upload
2. Edita el preset `tapapati_photos`
3. Verifica que **Signing Mode** sea `Unsigned`
4. Guarda los cambios

### Error: "Upload preset must be specified"

**Causa:** La variable de entorno no se cargó correctamente

**Solución:**
1. Verifica que `.env.local` tenga `VITE_CLOUDINARY_UPLOAD_PRESET=tapapati_photos`
2. Reinicia el servidor: `Ctrl+C` y luego `npm run dev`
3. Recarga la página en el navegador (Ctrl+Shift+R)

### Error: "Invalid signature"

**Causa:** El preset está configurado como "Signed" en lugar de "Unsigned"

**Solución:**
1. Ve a Cloudinary Console → Settings → Upload
2. Edita el preset `tapapati_photos`
3. Cambia **Signing Mode** a `Unsigned`
4. Guarda los cambios

### Las fotos no se muestran en la app

**Causa:** Las URLs se guardan en Cloudinary pero no en Firestore

**Solución:**
1. Verifica que aparezca el log "✅ Fotos del perfil actualizadas"
2. Si no aparece, hay un problema con `updateUserPhotos()`
3. Verifica los permisos de Firestore en `firestore.rules`

## 📊 Ventajas de Cloudinary

✅ **Optimización automática:** Las imágenes se optimizan automáticamente  
✅ **CDN global:** Carga rápida desde cualquier parte del mundo  
✅ **Transformaciones:** Puedes redimensionar/recortar imágenes en la URL  
✅ **Sin límites de Firebase:** No necesitas plan Blaze  
✅ **Gratis hasta 25GB:** Suficiente para empezar  

## 🔗 URLs de Cloudinary

Las URLs tienen este formato:
```
https://res.cloudinary.com/dkdfvcrdbt/image/upload/v1737489234/tapapati/profile-photos/userId_0_timestamp.jpg
```

Puedes transformarlas agregando parámetros:
```
# Redimensionar a 400x400
https://res.cloudinary.com/dkdfvcrdbt/image/upload/w_400,h_400,c_fill/v1737489234/tapapati/profile-photos/userId_0_timestamp.jpg

# Calidad 80%
https://res.cloudinary.com/dkdfvcrdbt/image/upload/q_80/v1737489234/tapapati/profile-photos/userId_0_timestamp.jpg

# Formato WebP (más ligero)
https://res.cloudinary.com/dkdfvcrdbt/image/upload/f_webp/v1737489234/tapapati/profile-photos/userId_0_timestamp.jpg
```

## 📝 Próximos Pasos

1. ✅ Configurar seguridad en Cloudinary Console
2. ✅ Crear Upload Preset "Unsigned"
3. ✅ Configurar variables de entorno
4. 🔄 Reiniciar servidor
5. ⏳ Probar subida de foto
6. ⏳ Verificar que las fotos se muestren en la app

## 🎉 Estado Final

Una vez que funcione, verás:
- ✅ Fotos se suben a Cloudinary
- ✅ URLs se guardan en Firestore
- ✅ Fotos se muestran en la app
- ✅ Consola limpia sin errores
