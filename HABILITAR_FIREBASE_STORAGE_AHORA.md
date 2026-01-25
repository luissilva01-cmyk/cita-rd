# 🔥 HABILITAR FIREBASE STORAGE - PASO A PASO

**Fecha:** 22 de enero de 2026  
**Problema:** "Service storage is not available"

---

## 🐛 Problema

Firebase Storage NO está habilitado en el proyecto `citard-fbc26`.

**Error:**
```
Uncaught Error: Service storage is not available
at Provider.getImmediate
at getStorage
```

---

## ✅ SOLUCIÓN: Habilitar Storage en Firebase Console

### Paso 1: Ir a Firebase Console
Abre este link:
```
https://console.firebase.google.com/project/citard-fbc26/storage
```

### Paso 2: Click en "Get Started" o "Comenzar"
- Verás un botón grande que dice "Get Started" o "Comenzar"
- Click en ese botón

### Paso 3: Configurar Reglas de Seguridad
Firebase te preguntará qué reglas usar:

**Opción 1: Modo de Producción (RECOMENDADO)**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- Click en "Next" o "Siguiente"

**Opción 2: Modo de Prueba (NO RECOMENDADO)**
- Permite acceso público temporal
- Solo para desarrollo

### Paso 4: Seleccionar Ubicación
- Selecciona: **us-east1** (o la región más cercana)
- Click en "Done" o "Listo"

### Paso 5: Esperar
- Firebase creará el bucket automáticamente
- Esto toma 30-60 segundos
- Verás una pantalla de carga

### Paso 6: Verificar
Una vez completado, deberías ver:
- ✅ Bucket creado: `citard-fbc26.appspot.com`
- ✅ Carpeta "Files" vacía
- ✅ Pestaña "Rules" con reglas configuradas

---

## 🔄 Después de Habilitar

### 1. Reiniciar Servidor
```bash
# El servidor ya está corriendo, solo recarga la página
```

### 2. Recargar la Aplicación
- Presiona **Ctrl+Shift+R** en el navegador
- O cierra y abre la pestaña

### 3. Verificar en Consola
Deberías ver:
```
✅ Firebase Storage inicializado correctamente
📦 Bucket: citard-fbc26.appspot.com
```

### 4. Probar Subida de Foto
1. Inicia sesión
2. Ve a Perfil → Gestionar fotos
3. Selecciona una imagen
4. Debería subirse exitosamente

---

## 🎯 Alternativa: Usar Comando CLI

Si prefieres usar la terminal:

```bash
# Habilitar Storage API
gcloud services enable firebasestorage.googleapis.com --project=citard-fbc26

# Crear bucket (si no existe)
gsutil mb -p citard-fbc26 -c STANDARD -l us-east1 gs://citard-fbc26.appspot.com
```

---

## ⚠️ IMPORTANTE

**¿Por qué no estaba habilitado?**
- Firebase Storage es un servicio OPCIONAL
- Debe habilitarse manualmente en cada proyecto
- Las APIs de Google Cloud están habilitadas, pero el servicio de Firebase no

**¿Por qué funcionó antes?**
- Probablemente había 2 fotos subidas en un proyecto diferente
- O el Storage se deshabilitó accidentalmente

---

## 📋 Checklist

- [ ] Ir a Firebase Console
- [ ] Click en "Storage" en el menú lateral
- [ ] Click en "Get Started"
- [ ] Configurar reglas (Modo Producción)
- [ ] Seleccionar ubicación (us-east1)
- [ ] Esperar a que se cree el bucket
- [ ] Recargar la aplicación
- [ ] Verificar logs en consola
- [ ] Probar subir una foto

---

## 🚀 ACCIÓN INMEDIATA

**AHORA MISMO:**
1. Abre: https://console.firebase.google.com/project/citard-fbc26/storage
2. Click en "Get Started"
3. Sigue los pasos
4. Recarga la aplicación
5. Prueba subir una foto

Una vez habilitado, Firebase Storage funcionará perfectamente. 🔥
