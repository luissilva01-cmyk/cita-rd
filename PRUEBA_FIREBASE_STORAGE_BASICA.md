# 🧪 Prueba Firebase Storage Básica

## 🎯 Objetivo

Verificar si Firebase Storage funciona con una subida básica usando el formato `.appspot.com`.

## ✅ Configuración Actual

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.appspot.com", // ← FORMATO .appspot.com
  messagingSenderId: "564769541768",
  appId: "1:564769541768:web:07013924da206d8b37593d"
};
```

## 🚀 Pasos para Probar

### 1. Abre el Test HTML
```
http://localhost:3002/test-firebase-storage-basic.html
```

### 2. Observa la Inicialización

En la pantalla verás un log negro con mensajes. Busca:

**✅ Si funciona:**
```
✅ Firebase App inicializada correctamente
✅ Firebase Storage inicializado correctamente
📦 Storage Bucket: citard-fbc26.appspot.com
✅ Sistema listo para subir archivos
```

**❌ Si NO funciona:**
```
❌ Error inicializando Firebase: Service storage is not available
```

### 3. Prueba Subir una Imagen

1. Haz clic en "Seleccionar archivo"
2. Elige cualquier imagen de tu computadora
3. Haz clic en "Subir Imagen"
4. Observa los mensajes en el log

**✅ Si la subida funciona:**
```
📤 Iniciando subida...
📁 Path: profile-photos/test_1234567890.jpg
🔄 Subiendo bytes...
✅ Bytes subidos correctamente
🔗 Obteniendo URL de descarga...
✅ URL obtenida correctamente
🔗 URL: https://firebasestorage.googleapis.com/...
🎉 ¡SUBIDA EXITOSA!
✅ Firebase Storage está funcionando correctamente
```

**❌ Si la subida falla:**
```
❌ Error en la subida: [mensaje de error]
❌ Error code: storage/unauthorized (o storage/unknown)
```

## 📊 Posibles Resultados

### ✅ Resultado 1: TODO FUNCIONA
- Storage se inicializa correctamente
- La subida es exitosa
- Obtienes una URL de descarga

**Acción:** 
- ¡Listo! Firebase Storage funciona
- La app ya puede subir fotos de perfil
- Solo necesitas probar en la app real

### ❌ Resultado 2: Storage NO se inicializa
- Error: "Service storage is not available"
- Storage es null

**Acción:**
- El problema es la configuración del bucket
- Necesitamos verificar el nombre EXACTO en Firebase Console
- O cambiar a Imgur (alternativa recomendada)

### ❌ Resultado 3: Storage se inicializa pero falla la subida
- Storage funciona
- Error en uploadBytes: "storage/unauthorized" o "storage/unknown"

**Acción:**
- Problema con las reglas de seguridad
- O Storage no está completamente habilitado en Firebase

## 🔍 Diagnóstico Según Error

### Error: "Service storage is not available"
**Causa:** El SDK no puede conectarse al bucket
**Solución:** 
1. Verificar nombre exacto del bucket en Firebase Console
2. Probar con `.firebasestorage.app` en lugar de `.appspot.com`
3. Considerar Imgur como alternativa

### Error: "storage/unauthorized"
**Causa:** Reglas de seguridad bloquean la subida
**Solución:**
1. Verificar `storage.rules` en Firebase Console
2. Asegurar que las reglas permitan escritura

### Error: "storage/unknown"
**Causa:** Error genérico de Storage
**Solución:**
1. Verificar que Storage esté habilitado en Firebase Console
2. Verificar que Cloud Storage API esté habilitada en Google Cloud

## 📝 Reporta el Resultado

Después de probar, dime:

1. **¿Storage se inicializó?**
   - ✅ Sí / ❌ No

2. **¿Qué mensaje de error viste (si hubo)?**
   - Copia el mensaje exacto del log

3. **¿La subida funcionó?**
   - ✅ Sí / ❌ No

4. **¿Obtuviste una URL?**
   - ✅ Sí / ❌ No

## 🔄 Alternativa: Imgur

Si Firebase Storage sigue sin funcionar después de esta prueba, tenemos Imgur listo:

- ✅ Gratis: 1250 uploads/día
- ✅ Setup: 5 minutos
- ✅ Sin configuración compleja
- ✅ Funciona 100% garantizado
- ✅ Documentación lista en: `IMGUR_IMPLEMENTACION.md`

---

**Fecha:** 22 de enero de 2026
**Test:** Subida básica con .appspot.com
**Estado:** Pendiente de prueba
