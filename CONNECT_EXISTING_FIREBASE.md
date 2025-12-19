# 🔥 Conectar con Firebase Existente (citard-fbc26)

## Configuración Detectada

Basándome en tu URL de Firebase Console, he adaptado el código para trabajar con tu estructura existente:

- **Proyecto ID**: `citard-fbc26`
- **Estructura**: `chats` con subcolección `messages`
- **Perfiles**: Colección `perfiles`
- **Usuario actual**: `KU5ZalR92QcPV7RGbLFTjEjTXZm2`

## Pasos para Conectar

### 1. Obtener Credenciales de Firebase

Ve a tu [Firebase Console](https://console.firebase.google.com/u/0/project/citard-fbc26/settings/general/) y copia las credenciales:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...", // Copia este valor
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.appspot.com",
  messagingSenderId: "123456789", // Copia este valor
  appId: "1:123456789:web:abc123" // Copia este valor
};
```

### 2. Actualizar firebase.ts

Edita `cita-rd/services/firebase.ts` y reemplaza los valores:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL", // ← Reemplaza aquí
  authDomain: "citard-fbc26.firebaseapp.com",
  projectId: "citard-fbc26",
  storageBucket: "citard-fbc26.appspot.com",
  messagingSenderId: "TU_SENDER_ID", // ← Reemplaza aquí
  appId: "TU_APP_ID" // ← Reemplaza aquí
};
```

### 3. Verificar ID de Usuario

En `App.tsx`, línea 11, está configurado tu ID real:

```typescript
const CURRENT_USER_ID = 'KU5ZalR92QcPV7RGbLFTjEjTXZm2';
```

Si necesitas cambiarlo, edita esa línea.

## Servicios Creados

### 📁 `services/chatService.ts`
- ✅ `createChat()` - Crear nuevo chat
- ✅ `getUserChats()` - Obtener chats del usuario
- ✅ `sendMessage()` - Enviar mensaje
- ✅ `listenToMessages()` - Escuchar mensajes en tiempo real
- ✅ `findOrCreateChat()` - Buscar o crear chat

### 📁 `services/profileService.ts`
- ✅ `createOrUpdateProfile()` - Crear/actualizar perfil
- ✅ `getUserProfile()` - Obtener perfil de usuario
- ✅ `getDiscoveryProfiles()` - Obtener perfiles para Discovery
- ✅ `searchProfiles()` - Buscar perfiles con filtros

### 📁 `firestore.rules`
- ✅ Reglas de seguridad adaptadas a tu estructura
- ✅ Compatibilidad con `chats` y `perfiles`
- ✅ Soporte para `matches` (retrocompatibilidad)

## Estructura de Datos Soportada

### Colección `chats`
```
chats/
  └── {chatId}/
      ├── participants: [userId1, userId2]
      ├── lastMessage: string
      ├── timestamp: number
      ├── serverTimestamp: FieldValue
      └── messages/ (subcolección)
          └── {messageId}/
              ├── senderId: string
              ├── text: string
              ├── timestamp: number
              └── serverTimestamp: FieldValue
```

### Colección `perfiles`
```
perfiles/
  └── {userId}/
      ├── id: string
      ├── name: string
      ├── age: number
      ├── bio: string
      ├── location: string
      ├── images: string[]
      ├── interests: string[]
      ├── job?: string
      ├── isVerified?: boolean
      └── timestamp: number
```

## Funcionalidades Implementadas

### ✅ Discovery
- Carga perfiles desde `perfiles` collection
- Crea chats automáticamente al hacer match
- Envía mensaje inicial de bienvenida

### ✅ Messages
- Lista chats del usuario actual
- Muestra último mensaje y timestamp
- Navegación a chat individual

### ✅ Chat Individual
- Mensajes en tiempo real
- Envío de mensajes con timestamp del servidor
- Actualización automática del último mensaje

### ✅ Profile
- Creación/actualización automática del perfil
- Sincronización con Firestore

## Probar la Conexión

1. **Actualiza las credenciales** en `firebase.ts`
2. **Ejecuta la app**:
   ```bash
   cd cita-rd
   npm run dev
   ```
3. **Prueba las funciones**:
   - Ve a Discovery y haz "like" a un perfil
   - Verifica que se cree un chat en Firebase Console
   - Ve a Messages y abre el chat
   - Envía un mensaje y verifica en Firebase Console

## Migración de Datos (Opcional)

Si tienes datos en formato diferente, puedo crear scripts de migración. Solo necesito saber:

1. **¿Qué estructura tienes actualmente en `chats`?**
2. **¿Tienes datos en `perfiles` ya?**
3. **¿Necesitas migrar algo específico?**

## Solución de Problemas

### Error: "Missing or insufficient permissions"
- Verifica que las reglas de Firestore estén actualizadas
- Usa las reglas de `firestore.rules` que creé

### Error: "No such document"
- Verifica que el ID de usuario sea correcto
- Asegúrate de que exista el perfil en `perfiles`

### Los chats no aparecen
- Verifica que el array `participants` incluya tu ID de usuario
- Revisa la consola del navegador por errores

### Los mensajes no se sincronizan
- Verifica que el `chatId` sea correcto
- Asegúrate de que las reglas permitan acceso a la subcolección

## Próximos Pasos

Una vez conectado, puedes:
1. ✅ Añadir autenticación real (Firebase Auth)
2. ✅ Implementar notificaciones push
3. ✅ Añadir funciones de moderación
4. ✅ Integrar con Google AI Studio para sugerencias

---

**¿Necesitas ayuda con la configuración?** Comparte las credenciales de Firebase y te ayudo a conectar todo.