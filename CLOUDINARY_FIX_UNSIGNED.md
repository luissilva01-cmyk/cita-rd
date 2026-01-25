# 🔧 Fix: Cloudinary Unsigned Upload

**Fecha:** 21 de enero de 2026  
**Error:** `401 Unauthorized - Unknown API key`  
**Causa:** Enviando `public_id` en un upload unsigned (requiere firma)

---

## ✅ PROBLEMA RESUELTO

El código estaba enviando `public_id` en la petición, pero los **unsigned uploads** no pueden especificar `public_id` porque eso requiere autenticación.

### Cambio realizado:
```typescript
// ❌ ANTES (causaba error 401)
formData.append('public_id', `photo_${photoIndex}_${Date.now()}`);

// ✅ AHORA (funciona)
// NO incluir public_id en unsigned uploads
// Cloudinary genera un ID único automáticamente
```

---

## 🔍 VERIFICAR UPLOAD PRESET EN CLOUDINARY

Para que funcione correctamente, verifica tu upload preset:

1. **Ve a:** https://console.cloudinary.com/settings/upload
2. **Busca el preset:** `tapapati_photos`
3. **Verifica estas configuraciones:**

### Configuración Correcta:
```
Preset name: tapapati_photos
Signing Mode: Unsigned ✅
Folder: (vacío o tapapati/users) ⚠️
Unique filename: true ✅
Overwrite: false ✅
```

### ⚠️ IMPORTANTE: Configuración del Folder

Hay dos opciones:

#### Opción A: Folder en el preset (Recomendado)
- **En Cloudinary preset:** Folder = `tapapati/users`
- **En el código:** NO enviar folder en FormData
- **Resultado:** Todas las fotos van a `tapapati/users/`

#### Opción B: Folder dinámico (Actual)
- **En Cloudinary preset:** Folder = (vacío)
- **En el código:** Enviar folder en FormData = `tapapati/users/${userId}`
- **Resultado:** Cada usuario tiene su carpeta `tapapati/users/abc123/`

**Estamos usando Opción B** (folder dinámico por usuario).

---

## 🚀 PRÓXIMOS PASOS

1. **Guarda los cambios** (ya están guardados automáticamente)

2. **Reinicia el servidor:**
   ```bash
   # Ctrl + C para detener
   npm run dev
   ```

3. **Prueba subir una foto:**
   - Abre la app en el navegador
   - Ve a tu perfil
   - Intenta subir una foto
   - Verifica en la consola:
     ```
     ☁️ Subiendo foto a Cloudinary...
     📋 Cloud Name: dkdfvcrdbt
     📋 Upload Preset: tapapati_photos
     ✅ Foto subida a Cloudinary: https://res.cloudinary.com/...
     ```

4. **Verifica en Cloudinary:**
   - Ve a: https://console.cloudinary.com/console/media_library
   - Busca la carpeta: `tapapati/users/`
   - Deberías ver tu foto subida

---

## 🐛 SI SIGUE FALLANDO

### Error: "Upload preset not found"
**Solución:** Verifica que el preset `tapapati_photos` exista y esté guardado.

### Error: "Folder not allowed"
**Solución:** En el preset, asegúrate de que "Folder" esté vacío o configurado correctamente.

### Error: "Invalid signature"
**Solución:** Verifica que Signing Mode sea **Unsigned**.

---

## 📊 RESUMEN DE CAMBIOS

### Archivo modificado:
- `cita-rd/services/photoUploadService.ts`

### Cambio específico:
- ❌ Removido: `formData.append('public_id', ...)`
- ✅ Agregado: Logs de debug para Cloud Name y Upload Preset
- ✅ Mejorado: Manejo de errores con más detalles

---

**¿Listo?** Reinicia el servidor y prueba subir una foto. ¡Debería funcionar ahora! 📸✨
