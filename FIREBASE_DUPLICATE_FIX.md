# Solución: Error de Inicialización Duplicada de Firebase

**Fecha:** 20 de enero de 2026  
**Problema:** Firebase App named '[DEFAULT]' already exists with different options or config

---

## 🔴 PROBLEMA IDENTIFICADO

La aplicación tenía **DOS archivos de configuración de Firebase** que se estaban inicializando simultáneamente:

1. **`cita-rd/services/firebase.ts`** (TypeScript - NUEVO) ✅
2. **`cita-rd/src/utils/firebase.js`** (JavaScript - VIEJO) ❌

Esto causaba el error:
```
FirebaseError: Firebase: Firebase App named '[DEFAULT]' already exists with different options or config (app/duplicate-app)
```

Y también:
```
Error: Service storage is not available
```

---

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Eliminado archivo duplicado
- **Eliminado:** `cita-rd/src/utils/firebase.js`
- Este archivo era legacy y ya no se necesitaba

### 2. Actualizadas importaciones en archivos TypeScript activos

**Archivos corregidos:**
- `cita-rd/views/views/Profile.tsx`
- `cita-rd/src/pages/Auth/Login.tsx`
- `cita-rd/src/pages/Auth/Register.tsx`
- `cita-rd/src/pages/Auth/ForgotPassword.tsx`
- `cita-rd/src/services/consentService.ts`

**Cambio realizado:**
```typescript
// ❌ ANTES (ruta incorrecta)
import { auth } from '../../utils/firebase';

// ✅ DESPUÉS (ruta correcta)
import { auth } from '../../../services/firebase';
```

### 3. Corregido storageBucket

**En `cita-rd/services/firebase.ts`:**
```typescript
// ❌ ANTES
storageBucket: "citard-fbc26.firebasestorage.app"

// ✅ DESPUÉS
storageBucket: "citard-fbc26.appspot.com"
```

---

## 📁 ARCHIVO ÚNICO DE FIREBASE

**Ubicación:** `cita-rd/services/firebase.ts`

```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg",
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.appspot.com",
  messagingSenderId: "564769541768",
  appId: "1:564769541768:web:07013924da206d8b37593d"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

---

## 🎯 RESULTADO

✅ **Servidor corriendo limpio en:** `http://localhost:3000/`  
✅ **Sin errores de Firebase**  
✅ **Storage disponible**  
✅ **Una sola inicialización de Firebase**

---

## 📝 NOTA IMPORTANTE

Los archivos en `cita-rd/src/` (JavaScript legacy) aún tienen importaciones al archivo eliminado, pero **NO se están usando** en la aplicación actual. La app corre con los archivos TypeScript en:
- `cita-rd/services/`
- `cita-rd/views/`
- `cita-rd/components/`
- `cita-rd/src/App.tsx` (wrapper de autenticación)
- `cita-rd/src/pages/Auth/` (páginas de autenticación)

Si en el futuro necesitas usar algún archivo legacy, deberás actualizar sus importaciones a `../../services/firebase`.

---

## 🔄 PRÓXIMOS PASOS

Ahora que Firebase está funcionando correctamente, puedes continuar con:

1. **Probar el typing indicator** con dos ventanas de navegador
2. **Verificar que todos los servicios funcionan** (auth, firestore, storage)
3. **Eliminar console.logs de debug** de ChatView.tsx y chatService.ts una vez confirmado el funcionamiento

---

**Estado:** ✅ RESUELTO  
**Servidor:** ✅ CORRIENDO  
**URL:** http://localhost:3000/
