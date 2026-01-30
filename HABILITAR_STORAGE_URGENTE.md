# ⚠️ URGENTE: Habilitar Firebase Storage

## ❌ Error Actual

```
Uncaught Error: Service storage is not available
```

**Causa:** Firebase Storage NO está habilitado en tu proyecto Firebase.

## ✅ Solución: Habilitar Storage en Firebase Console

### Paso 1: Ir a Firebase Console
1. Abre: https://console.firebase.google.com/project/citard-fbc26/storage
2. Inicia sesión si es necesario

### Paso 2: Habilitar Storage
1. Verás un botón que dice **"Get Started"** o **"Comenzar"**
2. Haz clic en él
3. Te preguntará sobre las reglas de seguridad:
   - Selecciona **"Start in production mode"** (Modo producción)
   - O **"Start in test mode"** (Modo prueba) - más fácil para desarrollo
4. Selecciona la ubicación del bucket:
   - Recomendado: **us-central1** (más cercano y económico)
5. Haz clic en **"Done"** o **"Listo"**

### Paso 3: Verificar que se creó
Deberías ver:
- Un bucket llamado: `citard-fbc26.appspot.com`
- La interfaz de Storage con carpetas vacías

### Paso 4: Desplegar las Reglas
Ya tenemos las reglas listas, solo necesitas desplegarlas:

```bash
cd cita-rd
firebase deploy --only storage
```

## 🔄 Después de Habilitar

1. **Recarga la página** del navegador (Ctrl+R)
2. **Abre la consola** (F12)
3. **Busca el log:**
   ```
   ✅ Firebase Storage inicializado correctamente
   ```
4. **Prueba grabar un mensaje de voz**

## 📋 Alternativa: Habilitar con Firebase CLI

Si prefieres usar la terminal:

```bash
# 1. Asegúrate de estar en el directorio correcto
cd cita-rd

# 2. Inicializar Storage
firebase init storage

# Selecciona:
# - Use an existing project: citard-fbc26
# - Storage rules file: storage.rules (ya existe)

# 3. Desplegar
firebase deploy --only storage
```

## ⚠️ Importante

**Firebase Storage requiere el plan Blaze (pago por uso)** que ya tienes activado.

Si ves un mensaje sobre el plan, es solo una confirmación. No te preocupes, ya estás en el plan correcto.

## 🎯 Verificación Final

Una vez habilitado, deberías poder:
1. ✅ Ver el bucket en Firebase Console
2. ✅ Subir archivos desde la app
3. ✅ Ver los archivos en `voice_messages/` folder
4. ✅ Los mensajes de voz/video funcionarán entre usuarios

---

**Fecha:** 30 Enero 2026  
**Proyecto:** Ta' Pa' Ti  
**Firebase:** citard-fbc26  
**Plan:** Blaze (Activo)  
**Acción Requerida:** Habilitar Storage en Firebase Console
