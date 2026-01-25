# 🔥 Habilitar Cloud Storage API - Solución Definitiva

**Fecha:** 21 de enero de 2026  
**Error:** "Service storage is not available"

## ⚠️ Problema

Cloud Storage API no está habilitada en tu proyecto de Firebase. Esto es necesario para subir fotos.

## ✅ Solución Rápida (Recomendada)

### Opción 1: Desde Google Cloud Console (MÁS FÁCIL)

1. **Ve a:** https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26

2. **Haz clic en el botón "ENABLE" (Habilitar)**

3. **Espera 1-2 minutos** para que se active

4. **Reinicia el servidor:**
   ```bash
   # Ctrl+C
   cd cita-rd
   npm run dev
   ```

5. **Recarga la página** y la app debería funcionar

### Opción 2: Desde Firebase Console

1. Ve a: https://console.firebase.google.com/project/citard-fbc26/storage

2. Si ves un botón "Get Started" o "Comenzar", haz clic

3. Selecciona la ubicación: **us-east1** (más cerca de República Dominicana)

4. Haz clic en "Done"

5. Reinicia el servidor y recarga la página

## 🔍 Verificar que Funcionó

Después de habilitar, deberías ver en la consola del navegador:

```
✅ Firebase Storage inicializado correctamente
📦 Bucket: citard-fbc26.appspot.com
```

Si ves:
```
❌ Error inicializando Storage: Service storage is not available
⚠️ Cloud Storage API no está habilitada en Firebase
```

Entonces la API aún no está habilitada.

## 🚀 Después de Habilitar

1. **Reinicia el servidor** (importante)
2. **Recarga la página** (Ctrl+Shift+R)
3. **Prueba subir una foto:**
   - Ve a tu perfil
   - Haz clic en "Gestionar fotos"
   - Selecciona una foto
   - Debería subirse sin errores

## 📝 Notas Importantes

- **No necesitas plan Blaze (pago)** para Storage básico
- El plan Spark (gratis) incluye **5GB de almacenamiento**
- Suficiente para miles de fotos de perfil
- Solo pagas si superas 5GB o 50,000 descargas/día

## 🐛 Si Sigue Sin Funcionar

### Error persiste después de habilitar

1. **Espera 2-3 minutos** - La API tarda en activarse
2. **Cierra y abre el navegador** - Limpia la caché
3. **Verifica en:** https://console.cloud.google.com/apis/dashboard?project=citard-fbc26
   - Busca "Cloud Storage API"
   - Debe decir "Enabled"

### La app no carga

Si la app no carga después de reiniciar:

1. **Verifica la consola del navegador** (F12)
2. **Busca errores en rojo**
3. **Copia y pega el error completo**

### Storage sigue siendo null

Si `storage` es `null` incluso después de habilitar:

1. Verifica que el bucket existe en Firebase Console
2. Ve a: https://console.firebase.google.com/project/citard-fbc26/storage
3. Deberías ver el bucket `citard-fbc26.appspot.com`

## 🎯 Estado Actual

- ✅ Firebase Auth: Funciona
- ✅ Firestore: Funciona  
- ❌ Firebase Storage: **Necesita habilitarse**
- ❌ Cloudinary: Bloqueado por restricciones de cuenta

Una vez que habilites Storage, todo funcionará correctamente.

## 📞 Siguiente Paso

**HAZ ESTO AHORA:**

1. Abre: https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26
2. Haz clic en "ENABLE"
3. Espera 1-2 minutos
4. Reinicia el servidor
5. Prueba subir una foto

Dime cuando hayas habilitado la API y reiniciado el servidor.
