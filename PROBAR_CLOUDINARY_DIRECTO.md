# 🧪 PROBAR CLOUDINARY DIRECTAMENTE

**Fecha:** 22 de enero de 2026  
**Objetivo:** Diagnosticar si el problema es de Cloudinary o del código

---

## 🎯 Test HTML Creado

He creado un archivo HTML simple que prueba Cloudinary directamente sin Firebase, sin React, sin nada más.

**Archivo:** `test-cloudinary-upload.html`

---

## 🚀 CÓMO PROBAR

### Opción 1: Abrir Directamente
1. Navega a la carpeta `cita-rd`
2. Haz doble click en `test-cloudinary-upload.html`
3. Se abrirá en tu navegador

### Opción 2: Desde el Servidor
1. Con el servidor corriendo (http://localhost:3000/)
2. Abre: http://localhost:3000/test-cloudinary-upload.html

### Pasos de la Prueba:
1. **Selecciona una imagen** (click en "Choose File")
2. **Click en "Subir a Cloudinary"**
3. **Observa los logs** en la caja negra
4. **Verifica el resultado**

---

## 📊 Qué Observar

### Si Funciona ✅
Verás:
```
✅ Foto subida exitosamente!
🔗 URL: https://res.cloudinary.com/dkdfvcrdbt/...
📊 Public ID: test_...
📊 Format: jpg
📊 Width: XXXpx
📊 Height: XXXpx
```

Y la imagen se mostrará abajo.

**Esto significa:**
- ✅ Cloudinary funciona
- ✅ El preset `tapapati_users` está correcto
- ✅ El problema está en el código de la app

### Si Falla con Error 401 ❌
Verás:
```
❌ Error en la respuesta:
❌ Error completo: {
  "error": {
    "message": "Unknown API key"
  }
}
```

**Esto significa:**
- ❌ El preset NO funciona
- ❌ Posible problema de configuración en Cloudinary
- ❌ Necesitamos recrear el preset

### Si Falla con Otro Error ❌
Copia el error completo y lo analizamos.

---

## 🔍 Verificaciones Adicionales

### 1. Verificar Cloud Name
En Cloudinary Console:
1. Ve a: https://console.cloudinary.com/console
2. En la esquina superior derecha verás tu Cloud Name
3. Debe ser: `dkdfvcrdbt`

### 2. Verificar Upload Preset
En Cloudinary Console:
1. Ve a: https://console.cloudinary.com/settings/upload
2. Busca el preset: `tapapati_users`
3. Verifica:
   - ✅ Signing mode: **Unsigned**
   - ✅ Estado: **Enabled** (no disabled)

### 3. Verificar Restricciones de Seguridad
En Cloudinary Console:
1. Ve a: https://console.cloudinary.com/settings/security
2. Verifica:
   - **Restricted image types:** Debe estar vacío o sin "Uploaded" marcado
   - **Allowed fetch domains:** Debe estar vacío o incluir `localhost`
   - **Allowed IP addresses:** Debe estar vacío (sin restricciones)

---

## 🛠️ Si el Test Falla

### Opción 1: Recrear el Preset

1. **Eliminar preset actual:**
   - Ve a: https://console.cloudinary.com/settings/upload
   - Busca `tapapati_users`
   - Click en el ícono de basura para eliminarlo

2. **Crear nuevo preset:**
   - Click en "Add upload preset"
   - **Preset name:** `tapapati_users_v2`
   - **Signing mode:** Unsigned ✅
   - **Folder:** (dejar vacío o poner `tapapati/users`)
   - **Overwrite:** false
   - **Use filename:** false
   - **Unique filename:** true
   - Click en "Save"

3. **Actualizar `.env.local`:**
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=tapapati_users_v2
   ```

4. **Reiniciar servidor y probar de nuevo**

### Opción 2: Probar con ml_default

Cloudinary tiene un preset por defecto llamado `ml_default` que es "Signed". Podemos probarlo:

1. **Actualizar `.env.local`:**
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
   ```

2. **Modificar el test HTML:**
   - Cambiar `UPLOAD_PRESET = 'ml_default'`

3. **Probar de nuevo**

### Opción 3: Usar Firebase Storage

Si Cloudinary sigue sin funcionar, la mejor opción es:
1. Habilitar Firebase Storage (como te expliqué antes)
2. Usar Firebase Storage como solución principal
3. Olvidarse de Cloudinary por ahora

---

## 📋 Checklist de Diagnóstico

- [ ] Abrir `test-cloudinary-upload.html`
- [ ] Seleccionar una imagen
- [ ] Click en "Subir a Cloudinary"
- [ ] Observar logs
- [ ] Copiar resultado (éxito o error)
- [ ] Si falla, verificar Cloud Name en Cloudinary Console
- [ ] Si falla, verificar preset en Cloudinary Console
- [ ] Si falla, verificar restricciones de seguridad
- [ ] Si falla, considerar recrear preset
- [ ] Si falla, considerar usar Firebase Storage

---

## 🎯 Próximos Pasos

### Si el Test Funciona:
- Integrar Cloudinary en el código de la app
- Modificar `photoUploadService.ts` para usar Cloudinary primero

### Si el Test Falla:
- Recrear preset con nombre diferente
- O usar Firebase Storage (más confiable)

---

## 🚀 ACCIÓN INMEDIATA

**AHORA MISMO:**
1. Abre `cita-rd/test-cloudinary-upload.html` en tu navegador
2. Selecciona una imagen
3. Click en "Subir a Cloudinary"
4. Copia y pega aquí el resultado completo (logs + mensaje de éxito/error)

¡Vamos a ver qué pasa! 🔥
