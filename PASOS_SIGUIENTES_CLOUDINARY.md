# 🚀 Pasos Siguientes - Configurar Cloudinary

**Fecha:** 21 de enero de 2026  
**Estado:** Listo para crear preset y probar

## ✅ Lo que Ya Está Hecho

1. ✅ Código corregido en `photoUploadService.ts`
2. ✅ Variables de entorno configuradas en `.env.local`
3. ✅ Componente `PhotoUploader.tsx` listo
4. ✅ Mensajes de error mejorados

## 🎯 Lo que Debes Hacer AHORA

### Paso 1: Crear el Preset en Cloudinary (5 minutos)

1. **Abre Cloudinary Console:**
   - Ve a: https://console.cloudinary.com/
   - Inicia sesión

2. **Navega a Upload Presets:**
   - Settings (⚙️) → Upload → Upload presets
   - Haz clic en "Add upload preset"

3. **Configura el preset con estos valores EXACTOS:**

   ```
   Preset name: tapapati_users
   Signing mode: Unsigned ⚠️ (CRÍTICO)
   Folder: tapapati_users (opcional)
   Use filename: NO ❌
   Unique filename: SÍ ✅
   Overwrite: NO ❌
   ```

4. **Guarda el preset**
   - Haz clic en "Save"
   - Verifica que aparezca en la lista

5. **Verifica que sea "Unsigned":**
   - Haz clic en el preset para editarlo
   - Confirma que dice "Unsigned" (no "Signed")

### Paso 2: Reiniciar el Servidor

```bash
# 1. Ve al directorio del proyecto
cd cita-rd

# 2. Si el servidor está corriendo, detenlo con Ctrl+C

# 3. Reinicia el servidor
npm run dev
```

### Paso 3: Probar la Subida de Foto

1. **Abre la app:**
   - http://localhost:3000

2. **Inicia sesión**

3. **Ve a tu perfil:**
   - Haz clic en el ícono de perfil
   - Busca "Gestionar fotos" o el botón de subir foto

4. **Abre la consola del navegador:**
   - Presiona F12
   - Ve a la pestaña "Console"

5. **Selecciona una imagen:**
   - Haz clic en el botón de subir
   - Selecciona una foto de tu computadora

6. **Observa los logs:**

   **Si funciona (Status 200):**
   ```
   ☁️ Subiendo foto a Cloudinary...
   📋 Cloud Name: dkdfvcrdbt
   📋 Upload Preset: tapapati_users
   📤 Enviando petición a Cloudinary...
   📥 Respuesta recibida. Status: 200
   ✅ Foto subida a Cloudinary exitosamente
   🔗 URL: https://res.cloudinary.com/...
   ```

   **Si falla (Status 401):**
   ```
   📥 Respuesta recibida. Status: 401
   ❌ Error de Cloudinary: {...}
   ❌ Preset "tapapati_users" no existe o no es "Unsigned"
   ```

## 🔍 Troubleshooting

### Error 401: "Unknown API key"

**Causa:** El preset no existe o no es "Unsigned"

**Solución:**
1. Ve a Cloudinary Console
2. Settings → Upload → Upload presets
3. Busca `tapapati_users`
4. Si no existe, créalo (ver Paso 1)
5. Si existe, edítalo y cambia a "Unsigned"
6. Guarda y reinicia el servidor

### Error: "Upload preset must be specified"

**Causa:** Variables de entorno no se cargaron

**Solución:**
1. Verifica que `.env.local` tenga:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=dkdfvcrdbt
   VITE_CLOUDINARY_UPLOAD_PRESET=tapapati_users
   ```
2. Reinicia el servidor completamente
3. Recarga la página con Ctrl+Shift+R

### La foto no se sube pero no hay errores

**Causa:** Posible problema de permisos o tamaño

**Solución:**
1. Verifica que la imagen sea menor a 5MB
2. Verifica que sea un archivo de imagen (jpg, png, etc.)
3. Revisa la consola del navegador para errores

## 📊 Verificación de Éxito

Sabrás que funciona cuando:

1. ✅ La consola muestra "Status: 200"
2. ✅ Aparece la URL de Cloudinary
3. ✅ La foto se muestra en tu perfil
4. ✅ La foto se guarda en Firestore (campo `images`)

## 🆘 Si Nada Funciona

Si después de seguir todos los pasos sigue fallando:

### Opción A: Verificar Restricciones de Seguridad

1. Ve a Cloudinary Console
2. Settings → Security
3. Busca "Restricted image types"
4. Asegúrate que "Uploaded" esté **desmarcado**

### Opción B: Probar con Firebase Storage

Firebase Storage ya funcionó antes (hay 2 fotos subidas). Podemos investigar por qué dejó de funcionar.

### Opción C: Implementar Backend

Crear un servidor Node.js/Express que firme las peticiones a Cloudinary. Esto evita el problema de "Unknown API key".

## 📝 Notas Importantes

- El preset DEBE ser "Unsigned" para funcionar desde el frontend
- Si cambias el preset, debes reiniciar el servidor
- Si cambias `.env.local`, debes reiniciar el servidor
- El navegador puede cachear el código, usa Ctrl+Shift+R para recargar

## 🎉 Siguiente Paso

Una vez que la subida funcione, podemos:
1. Probar con múltiples fotos
2. Implementar la eliminación de fotos
3. Agregar preview antes de subir
4. Optimizar el tamaño de las imágenes

---

**¡Buena suerte!** 🍀

Si tienes algún problema, revisa los logs de la consola y compártelos para ayudarte mejor.
