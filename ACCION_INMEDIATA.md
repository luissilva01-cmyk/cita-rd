# ⚡ ACCIÓN INMEDIATA - 3 Pasos Simples

## 🎯 Paso 1: Crear Preset (5 minutos)

### Ve a Cloudinary:
👉 https://console.cloudinary.com/

### Navega a:
Settings (⚙️) → Upload → Upload presets → "Add upload preset"

### Configura EXACTAMENTE así:

```
┌─────────────────────────────────────┐
│ Preset name: tapapati_users         │
│ Signing mode: Unsigned ⚠️ CRÍTICO   │
│ Folder: tapapati_users              │
│ Use filename: NO ❌                 │
│ Unique filename: SÍ ✅              │
│ Overwrite: NO ❌                    │
└─────────────────────────────────────┘
```

### Guarda y verifica:
✅ Haz clic en "Save"  
✅ Confirma que dice "Unsigned" (no "Signed")

---

## 🎯 Paso 2: Reiniciar Servidor

Abre tu terminal y ejecuta:

```bash
cd cita-rd
npm run dev
```

Espera a que diga: "Local: http://localhost:3000"

---

## 🎯 Paso 3: Probar Subida

1. **Abre:** http://localhost:3000
2. **Inicia sesión**
3. **Ve a tu perfil** → Gestionar fotos
4. **Presiona F12** (abre consola del navegador)
5. **Selecciona una foto**
6. **Observa los logs**

### ✅ Si funciona verás:
```
📥 Respuesta recibida. Status: 200
✅ Foto subida a Cloudinary exitosamente
🔗 URL: https://res.cloudinary.com/...
```

### ❌ Si falla verás:
```
📥 Respuesta recibida. Status: 401
❌ Preset "tapapati_users" no existe o no es "Unsigned"
```

---

## 🆘 Si Falla

1. **Vuelve a Cloudinary Console**
2. **Edita el preset `tapapati_users`**
3. **Cambia a "Unsigned"**
4. **Guarda**
5. **Reinicia el servidor**
6. **Intenta de nuevo**

---

## 📋 Checklist Rápido

Antes de probar, confirma:

- [ ] Preset creado con nombre: `tapapati_users`
- [ ] Signing mode: **Unsigned**
- [ ] Preset guardado
- [ ] Servidor reiniciado
- [ ] Navegador abierto en http://localhost:3000

---

## 🎉 ¡Eso es todo!

Si sigues estos 3 pasos exactamente, debería funcionar.

**Tiempo estimado:** 10 minutos

---

**Documentación completa:**
- `CREAR_PRESET_CLOUDINARY.md` - Instrucciones detalladas
- `PASOS_SIGUIENTES_CLOUDINARY.md` - Troubleshooting completo
- `SESION_CLOUDINARY_PRESET_NUEVO.md` - Resumen técnico
