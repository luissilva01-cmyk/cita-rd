# 🔒 Guía de Seguridad Firebase - Ta' Pa' Ti

## ⚠️ Alerta de Google Cloud Recibida

Google detectó tu API key pública en GitHub. **Esto es NORMAL para aplicaciones web**, pero necesitas agregar restricciones.

## ✅ Acciones Inmediatas (HACER AHORA)

### 1. Agregar Restricciones a la API Key

**URL:** https://console.cloud.google.com/apis/credentials?project=citard-fbc26

**Pasos:**
1. Buscar la clave: `AIzaSyDy2tLpXr3v6llyWGfQVhVlnmZtMgCDRhg`
2. Click en el ícono de lápiz (Editar)
3. En "Restricciones de aplicación":
   - Seleccionar: **Referentes HTTP (sitios web)**
   - Agregar estos referentes:
     ```
     localhost:3000/*
     localhost:5173/*
     127.0.0.1:3000/*
     127.0.0.1:5173/*
     *.netlify.app/*
     *.vercel.app/*
     tapati.com/*
     *.tapati.com/*
     ```

4. En "Restricciones de API":
   - Seleccionar: **Restringir clave**
   - Marcar SOLO estas APIs:
     - ✅ Cloud Firestore API
     - ✅ Firebase Authentication API  
     - ✅ Cloud Storage for Firebase API
     - ✅ Identity Toolkit API
     - ✅ Token Service API

5. Click en **GUARDAR**

### 2. Verificar Reglas de Seguridad

#### Firestore Rules (✅ Ya configuradas)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer/escribir sus propios datos
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chats solo accesibles por participantes
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
  }
}
```

#### Storage Rules (✅ Ya configuradas)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-photos/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Monitorear Uso

**URL:** https://console.firebase.google.com/project/citard-fbc26/usage

**Qué revisar:**
- ✅ Lecturas de Firestore (debe ser bajo)
- ✅ Escrituras de Firestore (debe ser bajo)
- ✅ Autenticaciones (debe coincidir con tus usuarios)
- ✅ Storage (debe ser razonable)

**Alertas recomendadas:**
- Si lecturas > 50,000/día → Investigar
- Si escrituras > 20,000/día → Investigar
- Si storage > 5GB → Investigar

## 🛡️ Por Qué Esto es Seguro

### 1. Las API Keys de Firebase SON Públicas
A diferencia de claves de servidor, las API keys de Firebase **están diseñadas** para estar en el código del cliente. No son secretas.

### 2. La Seguridad Real Está en las Reglas
Tu seguridad viene de:
- ✅ **Firestore Rules** - Controlan quién lee/escribe datos
- ✅ **Storage Rules** - Controlan quién sube/descarga archivos
- ✅ **Authentication** - Solo usuarios autenticados pueden acceder
- ✅ **Restricciones de API** - Limitan desde dónde se puede usar

### 3. Restricciones de Dominio
Con las restricciones agregadas, solo tu app puede usar la API key.

## 📝 Mejores Prácticas Implementadas

### ✅ Ya Tienes:
1. **Reglas de Firestore** - Protegen datos
2. **Reglas de Storage** - Protegen archivos
3. **Authentication** - Solo usuarios registrados
4. **`.gitignore`** - Protege `.env.local`
5. **`.env.example`** - Template sin datos sensibles

### 🔄 Próximos Pasos (Opcional):

#### Opción A: Dejar API Key en Código (Recomendado para ahora)
- ✅ Más simple
- ✅ Funciona en cualquier entorno
- ✅ Es la práctica estándar de Firebase
- ⚠️ Requiere restricciones de dominio (ya las agregaste)

#### Opción B: Mover a Variables de Entorno (Para producción)
1. Crear archivo `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Completar con tus valores reales

3. Actualizar `services/firebase.ts`:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     // ... resto de config
   };
   ```

4. En Netlify/Vercel, agregar las variables de entorno en el dashboard

## 🚨 Señales de Alerta

**Monitorear estos indicadores:**

### ❌ Uso Anormal:
- Picos repentinos en lecturas/escrituras
- Autenticaciones desde IPs sospechosas
- Storage creciendo muy rápido

### ✅ Uso Normal:
- Lecturas proporcionales a usuarios activos
- Escrituras cuando usuarios interactúan
- Storage crece gradualmente

## 📞 Qué Hacer Si Detectas Abuso

1. **Inmediato:**
   - Regenerar la API key en Google Cloud Console
   - Actualizar tu código con la nueva key
   - Desplegar nueva versión

2. **Investigar:**
   - Revisar logs de Firebase
   - Identificar patrones de uso
   - Bloquear IPs si es necesario

3. **Prevenir:**
   - Agregar rate limiting
   - Implementar CAPTCHA en registro
   - Monitorear con alertas automáticas

## 🎯 Resumen

### Lo Que Hiciste Bien:
- ✅ Reglas de Firestore configuradas
- ✅ Reglas de Storage configuradas
- ✅ Authentication implementado
- ✅ `.gitignore` protege archivos sensibles

### Lo Que Debes Hacer AHORA:
1. ⚠️ **Agregar restricciones de dominio** (5 minutos)
2. ⚠️ **Limitar APIs permitidas** (2 minutos)
3. ✅ **Monitorear uso** (revisar semanalmente)

### Resultado Final:
🔒 **Tu app estará segura** con las restricciones agregadas. Las API keys de Firebase están diseñadas para ser públicas cuando están correctamente restringidas.

---

**Última actualización:** 2026-01-18  
**Proyecto:** citard-fbc26  
**Estado:** ⚠️ Requiere agregar restricciones de dominio
