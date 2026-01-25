# 🎯 Crear Preset "tapapati_users" en Cloudinary

**Fecha:** 21 de enero de 2026  
**Preset:** tapapati_users  
**Cloud Name:** dkdfvcrdbt

## 📋 Pasos para Crear el Preset

### 1. Ir a Cloudinary Console

1. Abre tu navegador
2. Ve a: https://console.cloudinary.com/
3. Inicia sesión con tu cuenta

### 2. Navegar a Upload Presets

1. En el menú lateral izquierdo, haz clic en **"Settings"** (⚙️)
2. Luego haz clic en **"Upload"**
3. Busca la sección **"Upload presets"**
4. Haz clic en **"Add upload preset"**

### 3. Configurar el Preset

**IMPORTANTE:** Estos valores son CRÍTICOS para que funcione:

#### Configuración Básica:
- **Preset name:** `tapapati_users`
- **Signing mode:** **Unsigned** ⚠️ (DEBE ser Unsigned, no Signed)
- **Folder:** `tapapati_users` (opcional, para organizar)

#### Configuración de Archivos:
- **Use filename:** ❌ Desmarcar (false)
- **Unique filename:** ✅ Marcar (true)
- **Overwrite:** ❌ Desmarcar (false)
- **Discard original filename:** ✅ Marcar (true)

#### Configuración de Transformaciones (opcional):
- **Format:** Auto
- **Quality:** Auto
- **Max width:** 1200 (opcional)
- **Max height:** 1600 (opcional)

### 4. Guardar el Preset

1. Revisa que **Signing mode** esté en **"Unsigned"**
2. Haz clic en **"Save"**
3. Verifica que aparezca en la lista de presets

### 5. Verificar el Preset

Después de crear el preset, verifica:

1. En la lista de presets, busca `tapapati_users`
2. Haz clic en él para editarlo
3. Confirma que **Signing mode** dice **"Unsigned"**
4. Si dice "Signed", cámbialo a "Unsigned" y guarda

## ✅ Checklist de Verificación

Antes de continuar, confirma:

- [ ] Preset creado con nombre exacto: `tapapati_users`
- [ ] Signing mode: **Unsigned** (no Signed)
- [ ] Preset guardado exitosamente
- [ ] Preset visible en la lista

## 🚀 Después de Crear el Preset

Una vez creado el preset, ejecuta estos comandos:

```bash
# 1. Ir al directorio del proyecto
cd cita-rd

# 2. Detener el servidor (Ctrl+C si está corriendo)

# 3. Reiniciar el servidor
npm run dev
```

## 🧪 Probar la Subida

1. Abre la app en el navegador: http://localhost:3000
2. Inicia sesión
3. Ve a tu perfil
4. Haz clic en "Gestionar fotos" o el botón de subir foto
5. Selecciona una imagen
6. Observa la consola del navegador (F12)

### Logs Esperados (Éxito):

```
☁️ Iniciando subida a Cloudinary...
📋 Cloud Name: dkdfvcrdbt
📋 Upload Preset: tapapati_users
📋 File size: XX.XX KB
📋 File type: image/jpeg
📤 Enviando petición a Cloudinary...
📥 Respuesta recibida. Status: 200
✅ Foto subida a Cloudinary exitosamente
🔗 URL: https://res.cloudinary.com/...
```

### Si Sigue Fallando (Error 401):

Posibles causas:

1. **Preset no es Unsigned:**
   - Vuelve a Cloudinary Console
   - Edita el preset `tapapati_users`
   - Cambia a "Unsigned"
   - Guarda

2. **Restricciones de seguridad:**
   - Ve a Settings → Security
   - Busca "Restricted image types"
   - Asegúrate que "Uploaded" esté **desmarcado**

3. **Caché del navegador:**
   - Presiona Ctrl+Shift+R para recargar sin caché
   - O abre en ventana de incógnito

## 🆘 Si Nada Funciona

Si después de crear el preset correctamente sigue fallando, considera:

### Opción A: Usar Firebase Storage
- Ya funcionó antes (hay 2 fotos subidas)
- Necesitamos investigar por qué dejó de funcionar

### Opción B: Backend para Cloudinary
- Crear un servidor Node.js/Express
- Firmar las peticiones con API Secret
- Evitar el problema de "Unknown API key"

### Opción C: Servicio Alternativo
- Imgur API (más simple)
- ImageKit
- Uploadcare

## 📞 Contacto

Si necesitas ayuda adicional, revisa:
- Documentación de Cloudinary: https://cloudinary.com/documentation/upload_presets
- Firebase Storage: https://firebase.google.com/docs/storage

---

**Nota:** El preset DEBE ser "Unsigned" para que funcione desde el frontend sin API Secret.
