# 🔍 VERIFICAR PRESET DE CLOUDINARY

**Fecha:** 21 de enero de 2026  
**Error:** `401 Unauthorized - Unknown API key`  
**Causa:** El preset NO está configurado como "Unsigned" correctamente

---

## 🎯 EL PROBLEMA

El error "Unknown API key" significa que Cloudinary está esperando autenticación, pero no la estamos enviando. Esto ocurre cuando el preset NO está configurado como **"Unsigned"**.

---

## ✅ SOLUCIÓN: Verificar y Reconfigurar el Preset

### PASO 1: Ve a Cloudinary Upload Settings

1. **Abre:** https://console.cloudinary.com/settings/upload
2. **Busca la sección:** "Upload presets"
3. **Busca el preset:** `tapapati_photos`

### PASO 2: Verifica la Configuración

Haz clic en el preset `tapapati_photos` para editarlo y verifica:

#### ✅ Configuración CORRECTA:
```
Preset name: tapapati_photos
Signing Mode: Unsigned ← DEBE SER UNSIGNED
Folder: tapapati/users ← Configura esto aquí
Unique filename: true
Overwrite: false
```

#### ❌ Si ves "Signed":
- Cambia a **"Unsigned"**
- Guarda el preset

### PASO 3: Configurar el Folder en el Preset

**IMPORTANTE:** Como estamos usando unsigned upload, el folder debe estar configurado en el preset, NO en el código.

1. **En el preset, busca:** "Folder"
2. **Escribe:** `tapapati/users`
3. **Guarda el preset**

---

## 🔄 DESPUÉS DE VERIFICAR

### 1. Reinicia el servidor
```bash
# Ctrl + C para detener
npm run dev
```

### 2. Prueba subir una foto

Deberías ver en la consola:
```
☁️ Subiendo foto a Cloudinary...
📋 Cloud Name: dkdfvcrdbt
📋 Upload Preset: tapapati_photos
✅ Foto subida a Cloudinary: https://res.cloudinary.com/...
```

### 3. Verifica en Cloudinary

Ve a: https://console.cloudinary.com/console/media_library

Deberías ver la carpeta `tapapati/users/` con tu foto.

---

## 🆘 SI SIGUE FALLANDO

### Opción A: Crear un Nuevo Preset

Si el preset actual no funciona, crea uno nuevo:

1. **Ve a:** https://console.cloudinary.com/settings/upload
2. **Haz clic en:** "Add upload preset"
3. **Configura:**
   - Preset name: `tapapati_unsigned`
   - Signing Mode: **Unsigned** ← CRÍTICO
   - Folder: `tapapati/users`
   - Unique filename: true
   - Overwrite: false
4. **Guarda**

5. **Actualiza `.env.local`:**
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=tapapati_unsigned
   ```

6. **Reinicia el servidor**

### Opción B: Usar Preset por Defecto

Cloudinary tiene un preset unsigned por defecto llamado `ml_default`:

1. **Actualiza `.env.local`:**
   ```
   VITE_CLOUDINARY_UPLOAD_PRESET=ml_default
   ```

2. **Reinicia el servidor**

3. **Prueba subir una foto**

---

## 📸 CAPTURA DE PANTALLA DE LA CONFIGURACIÓN

Cuando edites el preset, deberías ver algo así:

```
┌─────────────────────────────────────┐
│ Upload preset settings              │
├─────────────────────────────────────┤
│ Preset name: tapapati_photos        │
│ Signing Mode: ● Unsigned  ○ Signed  │ ← DEBE ESTAR EN UNSIGNED
│ Folder: tapapati/users              │
│ Unique filename: ☑ true             │
│ Overwrite: ☐ false                  │
└─────────────────────────────────────┘
```

---

## 🔑 DIFERENCIA ENTRE SIGNED Y UNSIGNED

### Unsigned (Lo que necesitamos):
- ✅ No requiere API key
- ✅ Funciona desde el navegador
- ✅ Solo necesita Cloud Name + Upload Preset
- ❌ Menos control sobre qué se sube

### Signed (Lo que NO queremos):
- ❌ Requiere API key + API secret
- ❌ Requiere firma en el servidor
- ❌ No funciona directo desde el navegador
- ✅ Más control y seguridad

---

**ACCIÓN REQUERIDA:**

1. Ve a Cloudinary y verifica que el preset sea **"Unsigned"**
2. Configura el folder en el preset: `tapapati/users`
3. Guarda el preset
4. Reinicia el servidor
5. Prueba subir una foto

Si después de esto sigue fallando, prueba crear un nuevo preset o usar `ml_default`.
