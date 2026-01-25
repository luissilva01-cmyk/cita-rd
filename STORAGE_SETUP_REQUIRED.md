# Firebase Storage - Configuración Requerida

**Fecha:** 20 de enero de 2026  
**Estado:** ⚠️ Storage NO habilitado

---

## 🔴 PROBLEMA

Firebase Storage no está habilitado en tu proyecto `citard-fbc26`. Esto causa el error:

```
Error: Service storage is not available
```

---

## ✅ SOLUCIÓN TEMPORAL IMPLEMENTADA

La app ahora puede funcionar **sin Storage**. El código maneja el error de forma elegante:

```typescript
// En cita-rd/services/firebase.ts
let storage: FirebaseStorage | null = null;
try {
  storage = getStorage(app);
} catch (error) {
  console.error('Firebase Storage no disponible:', error);
  // La app funciona sin Storage (auth y firestore funcionan)
}
```

**Funcionalidades que funcionan SIN Storage:**
- ✅ Autenticación (Login/Register)
- ✅ Firestore (perfiles, chats, matches)
- ✅ Typing indicator
- ✅ Navegación

**Funcionalidades que REQUIEREN Storage:**
- ❌ Subir fotos de perfil
- ❌ Crear stories con imágenes
- ❌ Enviar fotos en chat
- ❌ Verificación de identidad con foto

---

## 🔧 CÓMO HABILITAR FIREBASE STORAGE

### Paso 1: Ir a Firebase Console
1. Abre https://console.firebase.google.com/
2. Selecciona tu proyecto: **citard-fbc26**

### Paso 2: Habilitar Storage
1. En el menú lateral, busca **"Storage"** (icono de carpeta)
2. Click en **"Get Started"** o **"Comenzar"**
3. Lee las reglas de seguridad y click **"Next"** / **"Siguiente"**
4. Selecciona la ubicación: **us-east1** (ya configurada para tu proyecto)
5. Click **"Done"** / **"Listo"**

### Paso 3: Configurar Reglas de Seguridad
1. Ve a la pestaña **"Rules"** en Storage
2. Reemplaza las reglas por defecto con el contenido de `cita-rd/storage.rules`
3. Click **"Publish"** / **"Publicar"**

### Paso 4: Verificar
1. Reinicia el servidor: `npm run dev` en `cita-rd/`
2. El error de Storage debería desaparecer
3. Ahora podrás subir fotos

---

## 📋 REGLAS DE STORAGE YA PREPARADAS

El archivo `cita-rd/storage.rules` ya tiene las reglas configuradas:

- **profile-photos/**: Fotos de perfil (lectura pública, escritura autenticada, máx 5MB)
- **stories/**: Fotos de stories (lectura pública, escritura autenticada, máx 5MB)
- **chat-photos/**: Fotos de chat (lectura/escritura autenticada, máx 10MB)

---

## 🚀 DESPLEGAR REGLAS DESDE CLI (Opcional)

Si tienes Firebase CLI instalado:

```bash
cd cita-rd
firebase deploy --only storage
```

---

## ⚡ ESTADO ACTUAL

- **Auth:** ✅ Funcionando
- **Firestore:** ✅ Funcionando
- **Storage:** ⚠️ NO habilitado (app funciona sin él)
- **Servidor:** ✅ Corriendo en http://localhost:3000/

---

## 📝 PRÓXIMOS PASOS

1. **Habilitar Storage** siguiendo los pasos arriba
2. **Probar typing indicator** (no requiere Storage)
3. **Probar subida de fotos** (requiere Storage habilitado)

---

**Nota:** La app puede funcionar completamente sin Storage para testing de otras funcionalidades (auth, chat, typing indicator, etc.). Solo necesitas habilitarlo cuando quieras probar funcionalidades de imágenes.
