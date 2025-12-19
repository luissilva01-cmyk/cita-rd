# 🔥 Configuración de Firebase para CitaRD

## Paso 1: Crear Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Nombra tu proyecto: `cita-rd` (o el nombre que prefieras)
4. Sigue los pasos del asistente

## Paso 2: Obtener Credenciales

1. En la consola de Firebase, ve a **Configuración del proyecto** (ícono de engranaje)
2. En la pestaña **General**, baja hasta "Tus aplicaciones"
3. Haz clic en el ícono **</>** (Web)
4. Registra tu app con el nombre "CitaRD Web"
5. Copia las credenciales que aparecen

## Paso 3: Configurar el Proyecto

### Opción A: Editar directamente `firebase.ts`

Abre `cita-rd/services/firebase.ts` y reemplaza los valores:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Tu API Key
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### Opción B: Usar variables de entorno (Recomendado)

1. Copia el archivo de ejemplo:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` con tus credenciales:
   ```bash
   VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
   VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
   ```

3. Actualiza `firebase.ts` para usar las variables:
   ```typescript
   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
     appId: import.meta.env.VITE_FIREBASE_APP_ID
   };
   ```

## Paso 4: Habilitar Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Selecciona **Modo de prueba** (para desarrollo)
4. Elige la ubicación más cercana (ej: `us-east1`)
5. Haz clic en "Habilitar"

## Paso 5: Configurar Reglas de Seguridad

En la pestaña **Reglas** de Firestore, pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura en modo desarrollo
    // IMPORTANTE: Cambiar en producción
    match /{document=**} {
      allow read, write: if true;
    }
    
    // Reglas para producción (comentadas por ahora):
    // match /matches/{matchId} {
    //   allow read, write: if request.auth != null;
    //   
    //   match /messages/{messageId} {
    //     allow read, write: if request.auth != null;
    //   }
    // }
  }
}
```

## Paso 6: Crear Índices

1. Ve a la pestaña **Índices** en Firestore
2. Crea estos índices compuestos:

### Índice para Matches
- **Colección**: `matches`
- **Campos indexados**:
  - `timestamp` - Descendente
- **Estado de consulta**: Habilitado

### Índice para Messages
- **Colección**: `matches/{matchId}/messages`
- **Campos indexados**:
  - `timestamp` - Ascendente
- **Estado de consulta**: Habilitado

> **Nota**: Firebase puede crear estos índices automáticamente cuando ejecutes la app por primera vez. Verás un enlace en la consola del navegador si hace falta algún índice.

## Paso 7: Probar la Configuración

1. Instala las dependencias:
   ```bash
   npm install firebase
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre la app en `http://localhost:5173/`

4. Prueba hacer un "like" en Discovery - debería crear un match en Firestore

5. Verifica en Firebase Console > Firestore Database que se creó el documento

## Estructura de Datos en Firestore

### Colección: `matches`
```
matches/
  └── {matchId}/
      ├── user: {UserProfile}
      ├── timestamp: number
      ├── serverTimestamp: FieldValue
      ├── lastMessage: string
      └── messages/ (subcolección)
          └── {messageId}/
              ├── senderId: string
              ├── text: string
              ├── timestamp: number
              └── serverTimestamp: FieldValue
```

## Solución de Problemas

### Error: "Missing or insufficient permissions"
- Verifica que las reglas de Firestore permitan lectura/escritura
- En desarrollo, usa `allow read, write: if true;`

### Error: "Firebase: No Firebase App '[DEFAULT]' has been created"
- Verifica que `firebase.ts` esté importando correctamente
- Asegúrate de que las credenciales sean correctas

### Error: "The query requires an index"
- Haz clic en el enlace que aparece en la consola
- Firebase te llevará a crear el índice automáticamente

### Los datos no se sincronizan en tiempo real
- Verifica que estés usando `onSnapshot` en lugar de `getDocs`
- Revisa la consola del navegador por errores

## Seguridad en Producción

⚠️ **IMPORTANTE**: Antes de desplegar a producción:

1. **Actualiza las reglas de Firestore** para requerir autenticación
2. **Habilita Firebase Authentication** (Email/Password, Google, etc.)
3. **Usa variables de entorno** para las credenciales
4. **Nunca subas** el archivo `.env.local` a Git
5. **Configura límites** de lectura/escritura en Firebase Console

## Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
- [Google AI Studio](https://aistudio.google.com/)

---

**¿Necesitas ayuda?** Revisa la documentación o abre un issue en el repositorio.