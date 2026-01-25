# 🔑 Storage y Restricciones de API Key

**Fecha:** 21 de enero de 2026  
**Problema:** Storage funciona en Console pero no en código

---

## 🎯 EL PROBLEMA REAL

Has configurado **restricciones en tu API Key** que pueden estar bloqueando el acceso a Storage desde localhost.

### Lo que sabemos:
- ✅ Storage funciona (subiste fotos desde Console)
- ✅ Blaze Plan activo
- ✅ API habilitada
- ❌ SDK no puede inicializar Storage
- ⚠️ API Key tiene restricciones de dominio

---

## ✅ SOLUCIÓN: Verificar Restricciones

### Paso 1: Ir a API Key
1. Ve a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. Busca tu API Key: `AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg`
3. Haz clic en ella

### Paso 2: Verificar Restricciones de Referrer HTTP
En la sección "Application restrictions", verifica que incluya:
- `http://localhost:*`
- `http://localhost:3000/*`
- `http://127.0.0.1:*`

### Paso 3: Verificar APIs Permitidas
En "API restrictions", verifica que incluya:
- ✅ Cloud Storage for Firebase API
- ✅ Firebase Storage API  
- ✅ Cloud Storage API

### Paso 4: Agregar si Falta
Si `localhost` no está en la lista:
1. Haz clic en "Edit API key"
2. En "Website restrictions", agrega:
   ```
   http://localhost:*
   http://127.0.0.1:*
   ```
3. Guarda cambios
4. Espera 2-3 minutos
5. Reinicia servidor

---

## 🔧 SOLUCIÓN ALTERNATIVA: API Key Sin Restricciones (Temporal)

### Para Desarrollo Local
1. Ve a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. Haz clic en tu API Key
3. En "Application restrictions", selecciona **"None"**
4. Guarda
5. Reinicia servidor

**IMPORTANTE:** Esto es solo para desarrollo. Antes de producción, vuelve a poner restricciones.

---

## 🧪 VERIFICAR SI FUNCIONÓ

### Después de cambiar restricciones:
1. Espera 2-3 minutos (propagación)
2. Reinicia servidor:
   ```bash
   cd cita-rd
   npm run dev
   ```
3. Abre http://localhost:3000/
4. Abre DevTools (F12) → Console
5. Busca: `✅ Firebase Storage inicializado correctamente`

---

## 📝 RESTRICCIONES CORRECTAS PARA DESARROLLO

```
Website restrictions:
- http://localhost:*
- http://127.0.0.1:*
- https://tu-dominio-netlify.netlify.app/*
- https://tu-dominio-vercel.vercel.app/*
- https://tu-dominio.com/*

API restrictions:
- Cloud Storage for Firebase API
- Firebase Storage API
- Cloud Storage API
- Firebase Authentication API
- Cloud Firestore API
```

---

## 💡 DIAGNÓSTICO

Si después de esto sigue sin funcionar, el problema puede ser:

1. **Caché del navegador**
   - Solución: Hard refresh (Ctrl + Shift + R)
   - O: Modo incógnito

2. **Versión de Firebase SDK**
   - Solución: Actualizar a última versión
   ```bash
   npm update firebase
   ```

3. **Configuración de CORS**
   - Solución: Aplicar reglas CORS al bucket

---

## 🚀 PRÓXIMOS PASOS

1. **Verifica restricciones de API Key** (más probable)
2. **Quita restricciones temporalmente** para probar
3. **Reinicia servidor** y verifica
4. **Si funciona:** Vuelve a poner restricciones correctas

---

**Prioridad:** 🔴 ALTA  
**Tiempo:** 5 minutos  
**Probabilidad de éxito:** 90%

