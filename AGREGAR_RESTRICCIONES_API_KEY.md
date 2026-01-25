# 🔥 HABILITAR FIREBASE STORAGE - Plan Blaze Activo

**Estado:** Plan Blaze activo, solo falta habilitar Storage  
**Tiempo:** 2 minutos

---

## ⚡ PASOS RÁPIDOS

### **1. Abre Firebase Console**
```
https://console.firebase.google.com/project/citard-fbc26/storage
```

### **2. Click en "Get Started"**
Verás un botón grande en el centro de la pantalla.

### **3. Selecciona Modo de Seguridad**
- Selecciona: **"Start in production mode"**
- (Las reglas ya están configuradas en tu código)
- Click **"Next"**

### **4. Selecciona Ubicación**
- Selecciona: **"us-east1"** (o la más cercana a República Dominicana)
- Click **"Done"**

### **5. Espera 30-60 segundos**
Firebase creará el bucket automáticamente.

### **6. Verifica que se creó**
Deberías ver:
- Bucket: `citard-fbc26.firebasestorage.app`
- Carpeta "Files" (vacía)
- Pestaña "Rules"

---

## 🚀 DESPUÉS DE HABILITAR

### **1. Reinicia el servidor**
```bash
cd cita-rd
npm run dev
```

### **2. Recarga la app**
```
http://localhost:3000
```
Presiona `Ctrl+Shift+R` (hard reload)

### **3. Verifica logs en consola (F12)**
Deberías ver:
```
🔧 Inicializando Firebase...
✅ Firebase App inicializada
✅ Firebase Storage inicializado
```

**Si ves esto → Storage está funcionando ✅**

### **4. Prueba subir una foto**
- Ve a tu perfil
- Selecciona una imagen
- ¡Debería funcionar! 🎉

---

## 📊 COSTO ESTIMADO

Con Plan Blaze activo:

**Cuota gratuita mensual:**
- 5 GB de almacenamiento
- 1 GB/día de descarga
- 20,000 operaciones/día

**Para tu app (estimado):**
- 0-1000 usuarios: **$0/mes** (dentro de cuota gratuita)
- 1000-5000 usuarios: **$1-3/mes**
- 5000+ usuarios: **$3-10/mes**

---

## ❓ SI ALGO FALLA

### **Error: "Service storage is not available"**
**Solución:** Espera 1-2 minutos después de habilitar Storage, luego reinicia el servidor.

### **Error: "storage/unauthorized"**
**Solución:** Despliega las reglas de seguridad:
```bash
cd cita-rd
firebase deploy --only storage
```

### **Bucket no aparece**
**Solución:** Verifica que estás en el proyecto correcto:
```bash
firebase use citard-fbc26
```

---

## 🎯 RESUMEN

1. ✅ Plan Blaze activo
2. ⏳ Habilitar Storage (2 minutos)
3. ⏳ Reiniciar servidor
4. ⏳ Probar subida

**¡Estás a 2 minutos de tener fotos funcionando!** 🚀

---

**Link directo:** https://console.firebase.google.com/project/citard-fbc26/storage
