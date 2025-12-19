# Firebase Integration - CitaRD

## 🔥 Mejoras Integradas con Google AI Studio

### Configuración de Firebase

**Archivo actualizado**: `cita-rd/services/firebase.ts`

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// IMPORTANTE: Sustituye estos valores por los de tu consola de Firebase
// https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "cita-rd.firebaseapp.com",
  projectId: "cita-rd",
  storageBucket: "cita-rd.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase using the modular SDK (v9+).
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
```

### Configuración Rápida

1. **Obtén credenciales**: Ve a [Firebase Console](https://console.firebase.google.com/)
2. **Edita firebase.ts**: Reemplaza `TU_API_KEY` y otros valores
3. **Habilita Firestore**: En modo de prueba para desarrollo
4. **Ejecuta la app**: `npm run dev`

📖 **Guía completa**: Ver `FIREBASE_SETUP.md` para instrucciones detalladas

### Nuevas Funcionalidades

#### 1. **Firebase Firestore en Tiempo Real**
- ✅ Matches sincronizados en tiempo real
- ✅ Mensajes de chat en tiempo real
- ✅ Persistencia de datos en la nube
- ✅ Listeners automáticos con `onSnapshot`

#### 2. **Estructura de Datos**

**Colección: `matches`**
```typescript
{
  id: string,
  user: UserProfile,
  timestamp: number,
  serverTimestamp: FieldValue,
  lastMessage: string
}
```

**Subcolección: `matches/{matchId}/messages`**
```typescript
{
  id: string,
  senderId: string,
  text: string,
  timestamp: number,
  serverTimestamp: FieldValue
}
```

#### 3. **Archivos Creados/Modificados**

**Nuevos archivos:**
- `cita-rd/services/firebase.ts` - Configuración de Firebase
- `cita-rd/.env.example` - Variables de entorno

**Archivos actualizados:**
- `cita-rd/App.tsx` - Integración completa con Firebase
- `cita-rd/types.ts` - Tipos actualizados con campos de Firebase
- `cita-rd/views/views/Discovery.tsx` - Soporte para funciones async
- `cita-rd/index.html` - Import maps actualizados

### Configuración Requerida

#### 1. Crear archivo `.env.local`

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=tu-api-key-aqui
VITE_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-proyecto-id
VITE_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
VITE_FIREBASE_APP_ID=tu-app-id

# Google AI Studio (Gemini)
VITE_GEMINI_API_KEY=tu-gemini-api-key
```

#### 2. Configurar Firebase Console

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear nuevo proyecto o usar existente
3. Habilitar Firestore Database
4. Configurar reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Matches collection
    match /matches/{matchId} {
      allow read, write: if request.auth != null;
      
      // Messages subcollection
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
  }
}
```

#### 3. Crear índices en Firestore

**Índice para matches:**
- Colección: `matches`
- Campos: `timestamp` (Descending)

**Índice para messages:**
- Colección: `matches/{matchId}/messages`
- Campos: `timestamp` (Ascending)

### Características Implementadas

#### ✅ Real-time Matches
```typescript
useEffect(() => {
  const q = query(collection(db, "matches"), orderBy("timestamp", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    // Actualización automática de matches
  });
  return () => unsubscribe();
}, []);
```

#### ✅ Real-time Chat
```typescript
useEffect(() => {
  if (!selectedMatchId) return;
  const q = query(
    collection(db, "matches", selectedMatchId, "messages"), 
    orderBy("timestamp", "asc")
  );
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    // Actualización automática de mensajes
  });
  return () => unsubscribe();
}, [selectedMatchId]);
```

#### ✅ Crear Match
```typescript
const handleLike = async (user: UserProfile) => {
  if (Math.random() > 0.3) {
    await addDoc(collection(db, "matches"), {
      user,
      timestamp: Date.now(),
      lastMessage: '¡Match nuevo! Di algo bacano.',
      serverTimestamp: serverTimestamp()
    });
    return true;
  }
  return false;
};
```

#### ✅ Enviar Mensaje
```typescript
const handleSendMessage = async (matchId: string, text: string) => {
  await addDoc(collection(db, "matches", matchId, "messages"), {
    senderId: 'me',
    text,
    timestamp: Date.now(),
    serverTimestamp: serverTimestamp()
  });
  
  await updateDoc(doc(db, "matches", matchId), {
    lastMessage: text,
    timestamp: Date.now()
  });
};
```

### Ventajas de la Integración

1. **Sincronización en Tiempo Real** - Los cambios se reflejan instantáneamente
2. **Persistencia** - Los datos se guardan en la nube
3. **Escalabilidad** - Firebase maneja millones de usuarios
4. **Offline Support** - Funciona sin conexión (con configuración adicional)
5. **Server Timestamps** - Timestamps consistentes del servidor

### Próximos Pasos

1. ✅ Configurar Firebase en tu proyecto
2. ✅ Añadir autenticación de usuarios
3. ✅ Implementar notificaciones push
4. ✅ Añadir almacenamiento de imágenes (Firebase Storage)
5. ✅ Implementar funciones de seguridad avanzadas

### Testing

Para probar la integración:

```bash
cd cita-rd
npm install firebase
npm run dev
```

La app ahora guardará matches y mensajes en Firestore en tiempo real.

### Notas Importantes

- Los datos de demo seguirán funcionando si Firebase no está configurado
- Asegúrate de configurar las reglas de seguridad en producción
- Usa variables de entorno para las credenciales
- Nunca subas el archivo `.env.local` a Git

---

**Integración completada con éxito** ✅
Desarrollado con Google AI Studio para CitaRD