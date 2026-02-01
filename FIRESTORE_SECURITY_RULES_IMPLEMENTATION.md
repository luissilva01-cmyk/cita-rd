# 🔐 Implementación de Firestore Security Rules

**Fecha:** 30 de Enero 2026  
**Estado:** ✅ Implementado - Pendiente de Deploy  
**Prioridad:** 🔴 CRÍTICO

---

## 📋 Resumen

Se han implementado reglas de seguridad completas para Firestore que protegen todos los datos de la aplicación. Las reglas anteriores permitían acceso completo a cualquier persona (`allow read, write: if true`), lo cual era extremadamente inseguro.

---

## ✅ Reglas Implementadas

### 1. Perfiles (`/perfiles/{userId}`)

**Lectura:**
- ✅ Solo usuarios autenticados pueden leer perfiles
- ✅ Cualquier usuario autenticado puede ver perfiles de otros (necesario para Discovery)

**Escritura:**
- ✅ Solo el dueño puede crear/actualizar su perfil
- ✅ Validación de datos:
  - Nombre: 1-100 caracteres
  - Edad: 18-100 años
  - Bio: máximo 500 caracteres
  - Ubicación: requerida
  - Intereses: máximo 20
  - Imágenes: máximo 6

**Eliminación:**
- ✅ Solo el dueño puede eliminar su perfil

### 2. Chats (`/chats/{chatId}`)

**Lectura:**
- ✅ Solo participantes del chat pueden leer

**Escritura:**
- ✅ Crear: Usuario debe estar en la lista de participantes
- ✅ Actualizar: Solo participantes (para lastMessage)
- ✅ Eliminar: No permitido

**Mensajes (`/chats/{chatId}/messages/{messageId}`):**
- ✅ Leer: Solo participantes
- ✅ Crear: Solo participantes con senderId correcto
- ✅ Actualizar: Solo para marcar como leído
- ✅ Eliminar: No permitido

**Typing Status (`/chats/{chatId}/typingStatus/{userId}`):**
- ✅ Leer: Solo participantes
- ✅ Escribir: Solo el propio usuario

### 3. Matches (`/matches/{matchId}`)

**Lectura:**
- ✅ Solo los usuarios involucrados (user1 o user2)

**Escritura:**
- ✅ Crear: Usuario debe ser user1 o user2
- ✅ Actualizar: Solo los involucrados
- ✅ Eliminar: Solo los involucrados

### 4. Likes (`/likes/{likeId}`)

**Lectura:**
- ✅ Solo quien dio el like o quien lo recibió

**Escritura:**
- ✅ Crear: Solo el usuario que da el like (fromUserId)
- ✅ Actualizar: No permitido
- ✅ Eliminar: Solo quien dio el like

### 5. Stories (`/stories/{storyId}`)

**Lectura:**
- ✅ Usuarios autenticados (privacidad adicional en código)

**Escritura:**
- ✅ Crear: Usuario autenticado con userId correcto
- ✅ Validación: tipo (image/text) y contenido requerido
- ✅ Actualizar: Solo el dueño
- ✅ Eliminar: Solo el dueño

### 6. Presence (`/presence/{userId}`)

**Lectura:**
- ✅ Usuarios autenticados

**Escritura:**
- ✅ Solo el propio usuario

### 7. Privacy Settings (`/privacySettings/{userId}`)

**Lectura:**
- ✅ Solo el propio usuario

**Escritura:**
- ✅ Solo el propio usuario

### 8. Verifications (`/verifications/{userId}`)

**Lectura:**
- ✅ Usuarios autenticados (para ver badges)

**Escritura:**
- ✅ Solo el propio usuario

### 9. Regla por Defecto

**Todo lo demás:**
- ✅ Denegado por defecto (`allow read, write: if false`)

---

## 🚀 Cómo Desplegar las Reglas

### Opción 1: Firebase Console (Recomendado para primera vez)

1. **Ir a Firebase Console:**
   ```
   https://console.firebase.google.com/project/citard-fbc26/firestore/rules
   ```

2. **Copiar las reglas:**
   - Abrir el archivo `firestore.rules`
   - Copiar todo el contenido

3. **Pegar en Firebase Console:**
   - Pegar en el editor de reglas
   - Click en "Publicar"

4. **Confirmar:**
   - Revisar los cambios
   - Confirmar publicación

### Opción 2: Firebase CLI (Recomendado para futuro)

```bash
# 1. Instalar Firebase CLI (si no está instalado)
npm install -g firebase-tools

# 2. Login a Firebase
firebase login

# 3. Inicializar proyecto (si no está inicializado)
firebase init firestore

# 4. Desplegar reglas
firebase deploy --only firestore:rules

# 5. Verificar
firebase firestore:rules:get
```

---

## 🧪 Cómo Probar las Reglas

### Prueba 1: Leer Perfiles Sin Autenticación

**Esperado:** ❌ Denegado

```javascript
// En consola del navegador (sin login)
const db = getFirestore();
const q = query(collection(db, "perfiles"));
const snapshot = await getDocs(q);
// Debe fallar con: "Missing or insufficient permissions"
```

### Prueba 2: Leer Perfil Propio

**Esperado:** ✅ Permitido

```javascript
// Después de login
const db = getFirestore();
const auth = getAuth();
const userId = auth.currentUser.uid;
const docRef = doc(db, "perfiles", userId);
const docSnap = await getDoc(docRef);
// Debe funcionar
```

### Prueba 3: Modificar Perfil de Otro Usuario

**Esperado:** ❌ Denegado

```javascript
// Intentar modificar perfil de otro usuario
const db = getFirestore();
const otherUserId = "otro-usuario-id";
await updateDoc(doc(db, "perfiles", otherUserId), {
  name: "Hacker"
});
// Debe fallar con: "Missing or insufficient permissions"
```

### Prueba 4: Leer Chat Sin Ser Participante

**Esperado:** ❌ Denegado

```javascript
// Intentar leer chat de otros
const db = getFirestore();
const chatId = "chat-de-otros";
const docRef = doc(db, "chats", chatId);
const docSnap = await getDoc(docRef);
// Debe fallar con: "Missing or insufficient permissions"
```

### Prueba 5: Crear Perfil con Datos Inválidos

**Esperado:** ❌ Denegado

```javascript
// Intentar crear perfil con edad inválida
const db = getFirestore();
const auth = getAuth();
const userId = auth.currentUser.uid;
await setDoc(doc(db, "perfiles", userId), {
  name: "Test",
  age: 15, // ❌ Menor de 18
  bio: "Test",
  location: "Test",
  interests: [],
  images: []
});
// Debe fallar con: "Missing or insufficient permissions"
```

---

## 🔍 Simulador de Reglas en Firebase Console

Firebase Console tiene un simulador de reglas integrado:

1. **Ir al simulador:**
   ```
   https://console.firebase.google.com/project/citard-fbc26/firestore/rules
   ```

2. **Click en "Reglas de prueba"**

3. **Configurar prueba:**
   - Tipo: `get`, `list`, `create`, `update`, `delete`
   - Ubicación: `/perfiles/user123`
   - Autenticación: Simular usuario o sin auth

4. **Ejecutar y verificar resultado**

---

## 📊 Casos de Uso Validados

### ✅ Permitidos

1. **Usuario autenticado lee perfiles para Discovery**
   - Necesario para la funcionalidad de swipe

2. **Usuario lee y escribe en su propio perfil**
   - Necesario para editar perfil

3. **Participantes de chat leen y escriben mensajes**
   - Necesario para funcionalidad de chat

4. **Usuario crea match con otro usuario**
   - Necesario para sistema de matching

5. **Usuario da like a otro usuario**
   - Necesario para sistema de likes

6. **Usuario crea y elimina sus propias stories**
   - Necesario para sistema de stories

7. **Usuario actualiza su estado de presencia**
   - Necesario para "online/offline"

8. **Usuario lee y actualiza su configuración de privacidad**
   - Necesario para dashboard de privacidad

### ❌ Denegados

1. **Usuario sin autenticación lee cualquier dato**
   - Protege privacidad

2. **Usuario modifica perfil de otro usuario**
   - Previene sabotaje

3. **Usuario lee chats de otros**
   - Protege conversaciones privadas

4. **Usuario crea perfil con datos inválidos**
   - Previene datos corruptos

5. **Usuario elimina chats**
   - Previene pérdida de datos

6. **Usuario modifica likes de otros**
   - Previene manipulación

7. **Usuario accede a configuración de privacidad de otros**
   - Protege configuración personal

---

## ⚠️ Consideraciones Importantes

### 1. Privacidad de Stories

Las reglas permiten que usuarios autenticados lean todas las stories. La privacidad adicional (matches_only, close_friends) se maneja en el código de la aplicación mediante `privacyService.canViewStories()`.

**Razón:** Firestore Rules no puede hacer queries complejas para verificar si dos usuarios son matches.

**Alternativa futura:** Usar Cloud Functions para validación adicional.

### 2. Discovery de Perfiles

Todos los usuarios autenticados pueden leer todos los perfiles. Esto es necesario para la funcionalidad de Discovery (swipe).

**Seguridad:** Los datos sensibles (email, teléfono) NO deben guardarse en el perfil público.

### 3. Validación de Datos

Las reglas validan tipos y rangos básicos. Validación más compleja (formato de email, URLs, etc.) debe hacerse en el frontend antes de guardar.

### 4. Performance

Las reglas usan `get()` para verificar participantes de chat, lo cual cuenta como una lectura adicional. Esto es necesario para seguridad pero tiene un costo mínimo.

---

## 🔄 Migración de Datos Existentes

Si ya tienes datos en Firestore que no cumplen con las nuevas reglas:

### Paso 1: Identificar Datos Inválidos

```javascript
// Script para encontrar perfiles inválidos
const db = getFirestore();
const profilesRef = collection(db, "perfiles");
const snapshot = await getDocs(profilesRef);

snapshot.forEach(doc => {
  const data = doc.data();
  
  // Verificar edad
  if (data.age < 18 || data.age > 100) {
    console.log(`Perfil inválido: ${doc.id} - Edad: ${data.age}`);
  }
  
  // Verificar nombre
  if (!data.name || data.name.length === 0) {
    console.log(`Perfil inválido: ${doc.id} - Sin nombre`);
  }
  
  // Verificar imágenes
  if (!data.images || data.images.length === 0) {
    console.log(`Perfil inválido: ${doc.id} - Sin imágenes`);
  }
});
```

### Paso 2: Corregir Datos

```javascript
// Script para corregir datos inválidos
const db = getFirestore();
const profileRef = doc(db, "perfiles", userId);

await updateDoc(profileRef, {
  age: Math.max(18, Math.min(100, data.age)), // Forzar rango válido
  name: data.name || "Usuario", // Nombre por defecto
  bio: (data.bio || "").substring(0, 500), // Truncar bio
  interests: (data.interests || []).slice(0, 20), // Limitar intereses
  images: (data.images || []).slice(0, 6) // Limitar imágenes
});
```

---

## 📝 Próximos Pasos

### Inmediatos (Hoy)

- [x] Implementar reglas en `firestore.rules`
- [ ] Desplegar reglas a Firebase
- [ ] Probar con simulador de Firebase
- [ ] Probar en la app real

### Esta Semana

- [ ] Monitorear logs de Firebase para errores de permisos
- [ ] Ajustar reglas si es necesario
- [ ] Documentar casos edge encontrados

### Futuro

- [ ] Implementar Cloud Functions para validación adicional
- [ ] Agregar rate limiting
- [ ] Implementar audit logs
- [ ] Configurar alertas de seguridad

---

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"

**Causa:** Usuario no tiene permisos para la operación

**Solución:**
1. Verificar que el usuario está autenticado
2. Verificar que el usuario es el dueño del recurso
3. Verificar que los datos cumplen con las validaciones

### Error: "Document doesn't exist"

**Causa:** Intentando acceder a documento que no existe

**Solución:**
1. Verificar que el documento existe antes de leerlo
2. Usar `getDoc()` con manejo de errores

### Error: "Function get() requires 1 argument"

**Causa:** Error en la sintaxis de las reglas

**Solución:**
1. Verificar sintaxis de `get()` en las reglas
2. Asegurar que el path es correcto

---

## 📚 Referencias

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Rules Language Reference](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Testing Rules](https://firebase.google.com/docs/firestore/security/test-rules-emulator)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-best-practices)

---

## ✅ Checklist de Verificación

Antes de considerar las reglas como completadas:

- [ ] Reglas desplegadas a Firebase
- [ ] Probadas con simulador de Firebase
- [ ] Probadas en app real con usuario autenticado
- [ ] Probadas en app real sin autenticación
- [ ] Probadas todas las operaciones CRUD
- [ ] Verificado que no hay errores en logs
- [ ] Documentación actualizada
- [ ] Equipo notificado de los cambios

---

**Implementado por:** Kiro AI  
**Fecha:** 30 de Enero 2026  
**Versión:** 1.0  
**Estado:** ✅ Listo para Deploy
