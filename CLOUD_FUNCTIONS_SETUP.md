# 🚀 Cloud Functions Setup - Eliminación Segura de Fotos

**Fecha:** 23 de enero de 2026  
**Estado:** ✅ CÓDIGO LISTO - Pendiente configuración

---

## 📋 QUÉ SE IMPLEMENTÓ

### 1. Cloud Functions (Backend)
✅ **`cita-rd/functions/index.js`** - 3 funciones creadas:

1. **`deleteImageKitPhoto`** - Elimina fotos de ImageKit de forma segura
   - Verifica autenticación del usuario
   - Verifica que la foto pertenezca al usuario
   - Elimina físicamente de ImageKit
   
2. **`getImageKitAuthParams`** - Genera parámetros de autenticación
   - Alternativa más segura para subir fotos
   - Private Key nunca se expone en el frontend

3. **`cleanOrphanedPhotos`** - Limpia fotos huérfanas
   - Solo para administradores
   - Elimina fotos que ya no están en ningún perfil

### 2. Frontend Actualizado
✅ **`cita-rd/services/photoUploadService.ts`**
- Ahora guarda `fileId` junto con la URL
- Función `deletePhoto()` llama a Cloud Function
- Maneja errores gracefully

✅ **`cita-rd/services/imagekitService.ts`**
- Interfaz actualizada con `fileId`

---

## 🔧 CONFIGURACIÓN PASO A PASO

### **Paso 1: Instalar Firebase CLI** (si no lo tienes)

```bash
npm install -g firebase-tools
```

Verificar instalación:
```bash
firebase --version
```

---

### **Paso 2: Iniciar sesión en Firebase**

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Google.

---

### **Paso 3: Instalar dependencias de Functions**

```bash
cd cita-rd/functions
npm install
cd ..
```

---

### **Paso 4: Configurar credenciales de ImageKit**

Las credenciales se guardan de forma segura en Firebase:

```bash
firebase functions:config:set imagekit.public_key="public_7UvlcweOdXIY9MmkbNWvPHW/aw0="
firebase functions:config:set imagekit.private_key="private_QQPSCxQq54yEBrjQf8JLkQhLELc="
firebase functions:config:set imagekit.url_endpoint="https://ik.imagekit.io/tapapati"
```

Verificar configuración:
```bash
firebase functions:config:get
```

Deberías ver:
```json
{
  "imagekit": {
    "public_key": "public_7UvlcweOdXIY9MmkbNWvPHW/aw0=",
    "private_key": "private_QQPSCxQq54yEBrjQf8JLkQhLELc=",
    "url_endpoint": "https://ik.imagekit.io/tapapati"
  }
}
```

---

### **Paso 5: Desplegar Functions**

```bash
firebase deploy --only functions
```

Esto desplegará las 3 funciones:
- `deleteImageKitPhoto`
- `getImageKitAuthParams`
- `cleanOrphanedPhotos`

El proceso toma 2-5 minutos.

---

### **Paso 6: Verificar despliegue**

Ve a Firebase Console:
```
https://console.firebase.google.com/project/citard-fbc26/functions
```

Deberías ver las 3 funciones desplegadas y activas.

---

### **Paso 7: Actualizar reglas de seguridad** (Opcional pero recomendado)

Actualiza `cita-rd/firestore.rules` para incluir el campo `photosInfo`:

```javascript
match /perfiles/{userId} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
  
  // Validar que photosInfo tenga la estructura correcta
  allow update: if request.auth != null 
    && request.auth.uid == userId
    && (!request.resource.data.keys().hasAny(['photosInfo']) 
        || request.resource.data.photosInfo is list);
}
```

Desplegar reglas:
```bash
firebase deploy --only firestore:rules
```

---

### **Paso 8: Remover Private Key del frontend** (IMPORTANTE)

Edita `cita-rd/.env.local` y comenta o elimina la Private Key:

```env
# ImageKit Configuration
VITE_IMAGEKIT_PUBLIC_KEY=public_7UvlcweOdXIY9MmkbNWvPHW/aw0=
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/tapapati
# VITE_IMAGEKIT_PRIVATE_KEY=private_QQPSCxQq54yEBrjQf8JLkQhLELc=  # Ya no se necesita en frontend
```

---

### **Paso 9: Reiniciar servidor**

```bash
cd cita-rd
npm run dev
```

---

### **Paso 10: Probar eliminación**

1. Sube una foto en tu perfil
2. Elimínala
3. Verifica en la consola del navegador:
   ```
   🗑️ Eliminando foto de ImageKit...
   ☁️ Llamando a Cloud Function...
   ✅ Respuesta de Cloud Function: { success: true, message: "..." }
   ```
4. Verifica en ImageKit dashboard que la foto fue eliminada

---

## 🧪 TESTING

### Test 1: Eliminar foto propia
1. Sube una foto
2. Elimínala
3. ✅ Debería eliminarse de ImageKit y Firestore

### Test 2: Intentar eliminar foto de otro usuario
1. Intenta llamar la función con fileId de otro usuario
2. ❌ Debería fallar con error "permission-denied"

### Test 3: Limpiar fotos huérfanas (Solo admin)
```bash
firebase functions:call cleanOrphanedPhotos
```

---

## 📊 COSTOS

### Firebase Functions (Plan Blaze)
- **Invocaciones:** 2 millones/mes GRATIS
- **Después:** $0.40 por millón
- **Tu uso estimado:** ~1,000 eliminaciones/mes = GRATIS

### ImageKit
- **Storage:** 20GB GRATIS
- **Bandwidth:** 20GB/mes GRATIS
- **Con eliminación:** Ahorras espacio y bandwidth

---

## 🔐 SEGURIDAD

### Antes (Sin Cloud Functions):
❌ Private Key en el frontend  
❌ Cualquiera puede ver la clave  
❌ Riesgo de abuso  

### Ahora (Con Cloud Functions):
✅ Private Key solo en el backend  
✅ Verificación de autenticación  
✅ Verificación de permisos  
✅ Logs de auditoría  

---

## 🐛 TROUBLESHOOTING

### Error: "Firebase CLI not found"
**Solución:**
```bash
npm install -g firebase-tools
```

### Error: "Permission denied"
**Solución:**
```bash
firebase login
```

### Error: "Functions config not set"
**Solución:**
```bash
firebase functions:config:set imagekit.private_key="tu_private_key"
```

### Error: "Function not found"
**Solución:**
```bash
firebase deploy --only functions
```

### Error al eliminar foto: "CORS"
**Solución:** Las Cloud Functions tienen CORS habilitado por defecto, no debería haber problemas.

---

## 📝 NOTAS IMPORTANTES

1. **Plan Blaze requerido:** Firebase Functions requiere el plan Blaze (pago por uso)
   - Ya lo tienes activado
   - Las primeras 2M invocaciones/mes son gratis

2. **Fotos antiguas:** Las fotos subidas antes de esta actualización no tienen `fileId`
   - No se pueden eliminar automáticamente
   - Usa `cleanOrphanedPhotos` para limpiarlas

3. **Compatibilidad:** El código es compatible con fotos antiguas
   - Si no hay `fileId`, solo se elimina de Firestore
   - La foto queda huérfana en ImageKit (se puede limpiar después)

---

## ✅ CHECKLIST

- [ ] Firebase CLI instalado
- [ ] Sesión iniciada (`firebase login`)
- [ ] Dependencias instaladas (`cd functions && npm install`)
- [ ] Credenciales configuradas (`firebase functions:config:set`)
- [ ] Functions desplegadas (`firebase deploy --only functions`)
- [ ] Private Key removida del `.env.local`
- [ ] Servidor reiniciado
- [ ] Eliminación probada y funcionando
- [ ] Verificado en ImageKit dashboard

---

## 🎯 PRÓXIMOS PASOS

Una vez configurado:
1. ✅ Las fotos se eliminarán físicamente de ImageKit
2. ✅ Ahorrarás espacio y costos
3. ✅ Mayor seguridad y privacidad
4. ✅ Logs de auditoría en Firebase Console

---

**¿Listo para configurar? Sigue los pasos en orden y estarás listo en 10-15 minutos.** 🚀
