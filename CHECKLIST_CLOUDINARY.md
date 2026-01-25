# ✅ Checklist - Configurar Cloudinary

## 📋 Antes de Empezar

- [ ] Tengo acceso a Cloudinary Console
- [ ] Tengo el Cloud Name: `dkdfvcrdbt`
- [ ] El servidor está detenido (o listo para reiniciar)

---

## 🎯 Paso 1: Crear Preset en Cloudinary

### 1.1 Acceder a Cloudinary
- [ ] Abrir https://console.cloudinary.com/
- [ ] Iniciar sesión exitosamente

### 1.2 Navegar a Upload Presets
- [ ] Hacer clic en "Settings" (⚙️)
- [ ] Hacer clic en "Upload"
- [ ] Buscar sección "Upload presets"
- [ ] Hacer clic en "Add upload preset"

### 1.3 Configurar el Preset
- [ ] **Preset name:** `tapapati_users` (exacto)
- [ ] **Signing mode:** Cambiar a **"Unsigned"** ⚠️
- [ ] **Folder:** `tapapati_users` (opcional)
- [ ] **Use filename:** Desmarcar (NO)
- [ ] **Unique filename:** Marcar (SÍ)
- [ ] **Overwrite:** Desmarcar (NO)

### 1.4 Guardar y Verificar
- [ ] Hacer clic en "Save"
- [ ] Preset aparece en la lista
- [ ] Hacer clic en el preset para editarlo
- [ ] Confirmar que dice **"Unsigned"** (no "Signed")

---

## 🎯 Paso 2: Verificar Configuración Local

### 2.1 Variables de Entorno
- [ ] Abrir `cita-rd/.env.local`
- [ ] Verificar: `VITE_CLOUDINARY_CLOUD_NAME=dkdfvcrdbt`
- [ ] Verificar: `VITE_CLOUDINARY_UPLOAD_PRESET=tapapati_users`

### 2.2 Código
- [ ] Archivo `photoUploadService.ts` existe
- [ ] Archivo `PhotoUploader.tsx` existe
- [ ] No hay errores de TypeScript visibles

---

## 🎯 Paso 3: Reiniciar Servidor

### 3.1 Detener Servidor Actual
- [ ] Si el servidor está corriendo, presionar Ctrl+C
- [ ] Esperar a que se detenga completamente

### 3.2 Iniciar Servidor
- [ ] Abrir terminal
- [ ] Ejecutar: `cd cita-rd`
- [ ] Ejecutar: `npm run dev`
- [ ] Esperar mensaje: "Local: http://localhost:3000"
- [ ] Servidor corriendo sin errores

---

## 🎯 Paso 4: Probar Subida de Foto

### 4.1 Preparar Navegador
- [ ] Abrir http://localhost:3000
- [ ] Presionar F12 (abrir DevTools)
- [ ] Ir a pestaña "Console"
- [ ] Limpiar consola (icono 🚫 o Ctrl+L)

### 4.2 Navegar a Subida de Fotos
- [ ] Iniciar sesión en la app
- [ ] Ir a perfil (icono de usuario)
- [ ] Buscar "Gestionar fotos" o botón de subir foto
- [ ] Hacer clic en el botón

### 4.3 Seleccionar Imagen
- [ ] Preparar una imagen de prueba (< 5MB)
- [ ] Hacer clic en "Seleccionar archivo"
- [ ] Elegir la imagen
- [ ] Confirmar selección

### 4.4 Observar Logs
- [ ] Ver logs en la consola del navegador
- [ ] Buscar: "☁️ Subiendo foto a Cloudinary..."
- [ ] Buscar: "📋 Upload Preset: tapapati_users"
- [ ] Buscar: "📤 Enviando petición a Cloudinary..."

---

## ✅ Verificación de Éxito

### Si Funciona (Status 200):
- [ ] Ver: "📥 Respuesta recibida. Status: 200"
- [ ] Ver: "✅ Foto subida a Cloudinary exitosamente"
- [ ] Ver: "🔗 URL: https://res.cloudinary.com/..."
- [ ] La foto aparece en el perfil
- [ ] La foto se guarda en Firestore

### Si Falla (Status 401):
- [ ] Ver: "📥 Respuesta recibida. Status: 401"
- [ ] Ver: "❌ Error de Cloudinary"
- [ ] Leer el mensaje de error específico
- [ ] Ir a sección de Troubleshooting

---

## 🔧 Troubleshooting

### Error 401: "Unknown API key"
- [ ] Volver a Cloudinary Console
- [ ] Verificar que el preset `tapapati_users` existe
- [ ] Editar el preset
- [ ] Cambiar a "Unsigned" si no lo está
- [ ] Guardar
- [ ] Reiniciar servidor
- [ ] Intentar de nuevo

### Error: "Upload preset must be specified"
- [ ] Verificar `.env.local` tiene las variables correctas
- [ ] Reiniciar servidor completamente
- [ ] Recargar página con Ctrl+Shift+R
- [ ] Intentar de nuevo

### Error: "Service storage is not available"
- [ ] Esto es Firebase Storage, no Cloudinary
- [ ] Ignorar por ahora (Cloudinary es el fallback)
- [ ] Si Cloudinary funciona, este error no importa

### La foto no se sube pero no hay errores
- [ ] Verificar que la imagen sea < 5MB
- [ ] Verificar que sea un archivo de imagen (jpg, png)
- [ ] Revisar toda la consola para errores
- [ ] Intentar con otra imagen

---

## 🎉 Éxito Confirmado

Marca todos estos cuando funcione:

- [ ] ✅ Preset creado en Cloudinary
- [ ] ✅ Preset configurado como "Unsigned"
- [ ] ✅ Servidor reiniciado
- [ ] ✅ Foto subida exitosamente
- [ ] ✅ URL de Cloudinary recibida
- [ ] ✅ Foto visible en el perfil
- [ ] ✅ Foto guardada en Firestore

---

## 📊 Progreso Total

**Completado:** _____ / 50 pasos

**Tiempo estimado:** 10-15 minutos

**Dificultad:** Fácil (siguiendo instrucciones exactas)

---

## 📞 Ayuda Adicional

Si necesitas ayuda:

1. **Revisa los logs** de la consola del navegador
2. **Copia el error exacto** que aparece
3. **Verifica el preset** en Cloudinary Console
4. **Consulta la documentación:**
   - `ACCION_INMEDIATA.md` - Guía rápida
   - `CREAR_PRESET_CLOUDINARY.md` - Instrucciones detalladas
   - `PASOS_SIGUIENTES_CLOUDINARY.md` - Troubleshooting completo

---

**¡Buena suerte!** 🍀

Marca cada casilla a medida que completas los pasos.
