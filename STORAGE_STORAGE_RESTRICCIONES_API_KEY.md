# 🔥 HABILITAR CLOUD STORAGE API - AHORA

**Bucket confirmado:** `citard-fbc26.firebasestorage.app` ✅  
**Problema:** Cloud Storage API no habilitada  
**Solución:** 1 minuto

---

## ⚡ ACCIÓN INMEDIATA

### **Opción 1: Link Directo (Más Rápido)**

**1. Abre este link:**
```
https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26
```

**2. Click en "ENABLE" (o "HABILITAR")**

**3. Espera 30 segundos**

---

### **Opción 2: Desde Google Cloud Console**

**1. Abre:**
```
https://console.cloud.google.com/apis/dashboard?project=citard-fbc26
```

**2. Click en "+ ENABLE APIS AND SERVICES"** (arriba)

**3. Busca:** "Cloud Storage API"

**4. Click en el resultado**

**5. Click en "ENABLE"**

---

## 🚀 DESPUÉS DE HABILITAR

### **1. Espera 30-60 segundos**
El API tarda un poco en activarse.

### **2. Reinicia el servidor:**
```bash
cd cita-rd
npm run dev
```

### **3. Recarga la app:**
```
http://localhost:3000
```
Presiona `Ctrl+Shift+R` (hard reload)

### **4. Verifica logs en consola (F12):**
Deberías ver:
```
🔧 Inicializando Firebase...
✅ Firebase App inicializada
✅ Firebase Storage inicializado
```

**Si ves esto → ¡Funciona! ✅**

### **5. Prueba subir una foto:**
- Ve a tu perfil
- Selecciona una imagen
- ¡Debería funcionar! 🎉

---

## 📊 VERIFICACIÓN

### **Antes (Error):**
```
❌ Uncaught Error: Service storage is not available
```

### **Después (Funciona):**
```
✅ Firebase Storage inicializado
📤 Subiendo foto...
✅ Foto subida exitosamente
```

---

## ❓ SI TODAVÍA FALLA

### **1. Verifica que el API esté habilitada:**
```
https://console.cloud.google.com/apis/dashboard?project=citard-fbc26
```
Busca "Cloud Storage API" en la lista.

### **2. Limpia caché del navegador:**
```
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

### **3. Borra caché de Vite:**
```bash
cd cita-rd
rm -rf node_modules/.vite
npm run dev
```

---

## 🎯 RESUMEN

1. ✅ Plan Blaze activo
2. ✅ Storage habilitado en Firebase
3. ✅ Bucket existe: `citard-fbc26.firebasestorage.app`
4. ⏳ **Habilitar Cloud Storage API** ← HACER AHORA
5. ⏳ Reiniciar servidor
6. ⏳ Probar subida

---

**Link directo para habilitar:**
```
https://console.cloud.google.com/apis/library/storage-component.googleapis.com?project=citard-fbc26
```

**¡Haz click en ENABLE y listo!** 🚀
