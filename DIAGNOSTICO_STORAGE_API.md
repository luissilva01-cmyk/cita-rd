# 🔍 Diagnóstico: Storage Habilitado pero SDK Falla

**Problema:** Storage visible en Console pero SDK dice "not available"  
**Causa probable:** Cloud Storage API no habilitada en Google Cloud

---

## 🚨 PROBLEMA

Firebase Storage está habilitado en Firebase Console (bucket visible), pero el SDK lanza:
```
Error: Service storage is not available
```

**Esto significa:** El API de Google Cloud Storage no está habilitada.

---

## ✅ SOLUCIÓN RÁPIDA

### **Opción 1: Habilitar Cloud Storage API (Recomendado)**

**1. Abre Google Cloud Console:**
```
https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26
```

**2. Click en "ENABLE" (Habilitar)**

**3. Espera 30-60 segundos**

**4. Reinicia el servidor:**
```bash
cd cita-rd
npm run dev
```

**5. Recarga la app** (Ctrl+Shift+R)

---

### **Opción 2: Usar Firebase CLI**

```bash
# En el directorio cita-rd
firebase use citard-fbc26

# Habilitar Storage
firebase deploy --only storage
```

---

### **Opción 3: Verificar APIs Habilitadas**

**1. Ve a:**
```
https://console.cloud.google.com/apis/dashboard?project=citard-fbc26
```

**2. Busca "Cloud Storage API"**

**3. Si no está en la lista, habilítala:**
```
https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26
```

---

## 🔍 VERIFICAR BUCKET NAME

El bucket que ves en Firebase Console, ¿cuál es su nombre exacto?

**Opciones posibles:**
- `citard-fbc26.appspot.com` (formato antiguo)
- `citard-fbc26.firebasestorage.app` (formato nuevo)

**Verifica en:**
```
https://console.firebase.google.com/project/citard-fbc26/storage
```

**Si el bucket es diferente**, actualiza `firebase.ts`:
```typescript
storageBucket: "TU_BUCKET_REAL_AQUI"
```

---

## 📋 CHECKLIST DE DIAGNÓSTICO

- [ ] Storage habilitado en Firebase Console ✅ (ya lo tienes)
- [ ] Bucket visible en Firebase Console ✅ (ya lo tienes)
- [ ] Plan Blaze activo ✅ (ya lo tienes)
- [ ] Cloud Storage API habilitada ❓ (verificar)
- [ ] Bucket name correcto en código ❓ (verificar)

---

## 🎯 PRÓXIMOS PASOS

**1. Verifica el nombre del bucket:**
- Ve a: https://console.firebase.google.com/project/citard-fbc26/storage
- Copia el nombre exacto del bucket
- Compártelo conmigo

**2. Habilita Cloud Storage API:**
- Ve a: https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26
- Click "ENABLE"

**3. Reinicia y prueba**

---

**¿Cuál es el nombre exacto del bucket que ves en Firebase Console?**
