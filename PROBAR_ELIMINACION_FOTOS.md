# 🧪 Cómo Probar la Eliminación de Fotos

**Fecha:** 23 de enero de 2026  
**Estado:** ✅ Listo para probar

---

## 🎯 QUÉ VAMOS A PROBAR

Verificar que las fotos se eliminan **físicamente** de ImageKit (no solo de Firestore).

---

## 📋 PASOS PARA PROBAR

### Paso 1: Subir una Foto Nueva ✅

1. Abre la app en `http://localhost:3000`
2. Inicia sesión con tu cuenta
3. Ve a tu perfil
4. Sube una foto nueva
5. **Abre la consola del navegador** (F12)
6. Busca estos mensajes:

```
✅ Foto subida exitosa a ImageKit
✅ Foto subida y perfil actualizado con fileId
```

7. **Copia la URL de la foto** que aparece en consola:
```
🔗 URL: https://ik.imagekit.io/tapapati/profile-photos/...
```

---

### Paso 2: Verificar que se Guardó el fileId 📝

1. Abre Firebase Console: https://console.firebase.google.com
2. Ve a Firestore Database
3. Busca tu perfil en la colección `perfiles`
4. Verifica que tenga estos campos:

```javascript
{
  images: [
    "https://ik.imagekit.io/tapapati/..."
  ],
  photosInfo: [
    {
      url: "https://ik.imagekit.io/tapapati/...",
      fileId: "abc123xyz",  // ← Debe tener esto
      uploadedAt: Timestamp
    }
  ]
}
```

✅ Si ves el `fileId`, ¡perfecto! Continúa al siguiente paso.

---

### Paso 3: Eliminar la Foto 🗑️

1. En tu perfil, haz clic en el botón **X** de la foto que subiste
2. **Abre la consola del navegador** (F12)
3. Busca estos mensajes:

```
🗑️ Eliminando foto con fileId: abc123xyz
☁️ Llamando a Cloud Function...
✅ Respuesta de Cloud Function: { success: true }
✅ Foto eliminada
```

✅ Si ves estos mensajes, ¡la eliminación funcionó!

---

### Paso 4: Verificar Eliminación Física 🔍

1. **Copia la URL** que guardaste en el Paso 1
2. Abre una **nueva pestaña** en el navegador
3. Pega la URL y presiona Enter
4. **Resultado esperado:**

```
❌ Error 404 - File not found
```

✅ Si ves error 404, ¡la foto se eliminó físicamente de ImageKit!

---

### Paso 5: Verificar en ImageKit Dashboard 📊

1. Abre ImageKit Dashboard: https://imagekit.io/dashboard
2. Inicia sesión con tu cuenta
3. Ve a **Media Library**
4. Busca la carpeta `profile-photos`
5. **Verifica que la foto eliminada NO aparece**

✅ Si no aparece, ¡confirmado! La eliminación física funciona.

---

## 🐛 TROUBLESHOOTING

### Problema 1: "No se proporcionó fileId"

**Causa:** La foto fue subida antes de esta actualización.

**Solución:**
- Las fotos antiguas no tienen `fileId`
- Se eliminarán solo de Firestore (no de ImageKit)
- **Sube una foto nueva** para probar con `fileId`

---

### Problema 2: "Error llamando a Cloud Function"

**Causa:** Cloud Functions no están desplegadas.

**Solución:**
```bash
cd cita-rd
firebase deploy --only functions
```

Espera 2-3 minutos y vuelve a intentar.

---

### Problema 3: La URL sigue funcionando después de eliminar

**Causa:** Puede ser caché del navegador.

**Solución:**
1. Abre la URL en **modo incógnito**
2. O presiona **Ctrl + Shift + R** para forzar recarga
3. Si sigue funcionando, verifica que la Cloud Function se ejecutó correctamente

---

### Problema 4: "Permission denied"

**Causa:** No estás autenticado o intentas eliminar foto de otro usuario.

**Solución:**
1. Cierra sesión y vuelve a iniciar
2. Verifica que estás eliminando TU foto (no de otro usuario)

---

## ✅ CHECKLIST DE VERIFICACIÓN

Marca cada item cuando lo completes:

- [ ] Subí una foto nueva
- [ ] Vi el mensaje "✅ Foto subida y perfil actualizado con fileId"
- [ ] Verifiqué en Firestore que tiene `fileId`
- [ ] Copié la URL de la foto
- [ ] Eliminé la foto
- [ ] Vi el mensaje "☁️ Llamando a Cloud Function..."
- [ ] Vi el mensaje "✅ Respuesta de Cloud Function"
- [ ] La URL ahora da error 404
- [ ] La foto no aparece en ImageKit Dashboard

---

## 🎉 SI TODO FUNCIONA

**¡Felicidades!** Tu sistema de eliminación de fotos está funcionando perfectamente:

- ✅ Fotos se eliminan físicamente de ImageKit
- ✅ URLs dejan de funcionar
- ✅ Privacidad garantizada
- ✅ Costos optimizados

---

## 📊 LOGS ESPERADOS

### Al Subir
```
🔄 Redimensionando imagen...
📤 Subiendo foto...
📤 Iniciando subida de foto...
📋 Archivo: mi-foto.jpg
📋 Tamaño: 45.23 KB
📋 Tipo: image/jpeg
🔄 Redimensionando imagen...
✅ Imagen redimensionada: 45.12 KB
☁️ Subiendo a ImageKit...
📤 Subiendo a ImageKit...
📋 Archivo: mi-foto.jpg
📊 Tamaño: 45.12 KB
🔐 Obteniendo parámetros de autenticación desde Cloud Function...
✅ Parámetros de autenticación obtenidos
🔄 Enviando a ImageKit...
✅ Subida exitosa a ImageKit
🔗 URL: https://ik.imagekit.io/tapapati/profile-photos/...
✅ Foto subida exitosamente a ImageKit
💾 Actualizando fotos en Firestore...
👤 User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📸 Fotos a guardar: 1
✅ Fotos del perfil actualizadas en Firestore
✅ Foto subida y perfil actualizado con fileId
```

### Al Eliminar
```
🗑️ Eliminando foto con fileId: abc123xyz
☁️ Llamando a Cloud Function...
✅ Respuesta de Cloud Function: { success: true, message: "Foto eliminada exitosamente" }
💾 Actualizando fotos en Firestore...
👤 User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📸 Fotos a guardar: 0
✅ Fotos del perfil actualizadas en Firestore
✅ Foto eliminada
```

---

## 📞 SOPORTE

Si tienes problemas, revisa:
1. `PHOTO_DELETION_COMPLETE.md` - Documentación completa
2. `CLOUD_FUNCTIONS_SETUP.md` - Setup de Cloud Functions
3. `SESION_23_ENE_2026_CLOUD_FUNCTIONS.md` - Detalles técnicos

**Email:** tapapatisoporte@gmail.com

---

**¡Buena suerte con las pruebas!** 🚀
