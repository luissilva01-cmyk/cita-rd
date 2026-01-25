# 🔧 Habilitar Cloud Storage API - Google Cloud Console

**Fecha:** 21 de enero de 2026  
**Problema:** Storage bucket existe pero SDK no puede acceder

---

## 🎯 EL PROBLEMA

Tienes el bucket creado (`citard-fbc26.firebasestorage.app` en región US-EAST1) pero el SDK de Firebase no puede acceder a él porque **la API de Cloud Storage no está habilitada** en Google Cloud Console.

---

## ✅ SOLUCIÓN: Habilitar la API

### Paso 1: Ir a Google Cloud Console
1. Abre tu navegador
2. Ve a: https://console.cloud.google.com/
3. Si te pide iniciar sesión, usa la misma cuenta de Firebase
4. Selecciona el proyecto: **citard-fbc26**

### Paso 2: Ir a APIs & Services
1. En el menú lateral izquierdo (☰), busca **"APIs & Services"**
2. Haz clic en **"Library"** (Biblioteca)

### Paso 3: Buscar Cloud Storage API
1. En el buscador, escribe: **"Cloud Storage for Firebase API"**
2. Haz clic en el resultado que dice **"Cloud Storage for Firebase API"**

### Paso 4: Habilitar la API
1. Verás una página con información de la API
2. Si ves un botón azul que dice **"ENABLE"** (HABILITAR):
   - Haz clic en **"ENABLE"**
   - Espera 30-60 segundos mientras se habilita
   - Verás un mensaje de confirmación
3. Si ya dice **"MANAGE"** o **"API enabled"**:
   - La API ya está habilitada ✅
   - El problema es otro (ver sección de diagnóstico)

### Paso 5: Habilitar APIs Adicionales (Opcional pero Recomendado)
Mientras estás aquí, habilita estas APIs también:
1. **"Cloud Storage API"** (sin "for Firebase")
2. **"Firebase Storage API"**

Para cada una:
- Busca en Library
- Haz clic en la API
- Haz clic en "ENABLE"

### Paso 6: Verificar en la App
1. Espera 2-3 minutos (propagación de cambios)
2. Reinicia el servidor:
   ```bash
   # Detener servidor (Ctrl+C en la terminal)
   cd cita-rd
   npm run dev
   ```
3. Abre http://localhost:3000/
4. Abre DevTools (F12) → Console
5. Busca: `✅ Firebase Storage inicializado correctamente`

---

## 🔍 DIAGNÓSTICO ALTERNATIVO

### Si la API ya estaba habilitada:

#### Opción A: Verificar Permisos de IAM
1. En Google Cloud Console, ve a **"IAM & Admin"** → **"IAM"**
2. Busca el service account de Firebase (termina en `@appspot.gserviceaccount.com`)
3. Verifica que tenga el rol: **"Firebase Admin"** o **"Storage Admin"**
4. Si no lo tiene, haz clic en el lápiz (editar) y agrega el rol

#### Opción B: Verificar Facturación
1. En Google Cloud Console, ve a **"Billing"** (Facturación)
2. Verifica que el proyecto tenga una cuenta de facturación asociada
3. Firebase Storage requiere Blaze Plan (pago por uso)
4. Si no tienes facturación, agrégala (tiene capa gratuita generosa)

#### Opción C: Recrear el Bucket
1. En Firebase Console → Storage
2. Haz clic en los tres puntos (⋮) junto al bucket
3. Selecciona **"Delete bucket"**
4. Confirma la eliminación
5. Espera 5 minutos
6. Vuelve a crear el bucket:
   - Haz clic en "Get Started"
   - Selecciona "Production mode"
   - Elige región: us-east1
   - Haz clic en "Done"

---

## 🎯 SOLUCIÓN RÁPIDA: Probar Ambos Formatos

He actualizado el código para usar el formato antiguo (`.appspot.com`). Esto a veces funciona mejor:

```typescript
storageBucket: "citard-fbc26.appspot.com"  // Formato antiguo
```

**Prueba ahora:**
1. Reinicia el servidor
2. Verifica el mensaje en consola
3. Si funciona: ✅ Listo!
4. Si no funciona: Sigue con habilitar la API

---

## 📝 CHECKLIST

- [ ] Fui a Google Cloud Console
- [ ] Seleccioné proyecto citard-fbc26
- [ ] Fui a APIs & Services → Library
- [ ] Busqué "Cloud Storage for Firebase API"
- [ ] Habilité la API (si no estaba habilitada)
- [ ] Esperé 2-3 minutos
- [ ] Reinicié el servidor
- [ ] Verifiqué el mensaje en consola

---

## 💡 NOTA IMPORTANTE

Si después de todo esto Storage sigue sin funcionar, **no es crítico**. Tu app funciona perfectamente sin Storage. Puedes:

1. **Lanzar sin fotos** - Todas las demás features funcionan
2. **Usar servicio externo** - Cloudinary, ImgBB, etc.
3. **Contactar soporte de Firebase** - Puede ser un problema de configuración del proyecto

---

## 📞 ENLACES ÚTILES

- **Google Cloud Console:** https://console.cloud.google.com/
- **Firebase Console:** https://console.firebase.google.com/project/citard-fbc26
- **APIs Library:** https://console.cloud.google.com/apis/library?project=citard-fbc26
- **Cloud Storage API:** https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26

---

**Prioridad:** 🔴 ALTA (si quieres fotos)  
**Tiempo estimado:** 5 minutos  
**Dificultad:** Media

