# 🧪 TESTING SECURITY RULES - GUÍA RÁPIDA

**Fecha:** 12 de Febrero 2026  
**Proyecto:** Ta' Pa' Ti (Tapati)

---

## 🎯 OBJETIVO

Verificar que las reglas de seguridad funcionan correctamente y protegen los datos de usuarios.

---

## 🔍 CÓMO PROBAR LAS REGLAS

### Opción 1: Firebase Console (Recomendado)

1. Ve a [Firebase Console](https://console.firebase.google.com/project/citard-fbc26/firestore/rules)
2. Click en "Rules Playground"
3. Prueba diferentes escenarios

### Opción 2: Emulator (Desarrollo)

```bash
cd cita-rd
firebase emulators:start --only firestore
```

### Opción 3: Testing Manual en App

Prueba directamente en la app en producción.

---

## 📋 ESCENARIOS DE TESTING

### 1. PERFILES

#### ✅ Debe Funcionar:
```javascript
// Usuario A lee su propio perfil
firestore.collection('perfiles').doc(userA_id).get()
// ✅ Permitido

// Usuario A edita su propio perfil
firestore.collection('perfiles').doc(userA_id).update({
  bio: 'Nueva bio'
})
// ✅ Permitido
```

#### ❌ Debe Fallar:
```javascript
// Usuario A intenta editar perfil de Usuario B
firestore.collection('perfiles').doc(userB_id).update({
  bio: 'Hack'
})
// ❌ Permission denied

// Usuario A intenta crear perfil con edad < 18
firestore.collection('perfiles').doc(userA_id).set({
  name: 'Test',
  age: 17, // ❌ Menor de 18
  bio: 'Test',
  location: 'Test',
  images: ['url'],
  interests: []
})
// ❌ Permission denied
```

---

### 2. CHATS

#### ✅ Debe Funcionar:
```javascript
// Usuario A (participante) lee mensajes del chat
firestore.collection('chats').doc(chatId)
  .collection('messages').get()
// ✅ Permitido (si userA está en participants)

// Usuario A envía mensaje
firestore.collection('chats').doc(chatId)
  .collection('messages').add({
    senderId: userA_id,
    text: 'Hola',
    timestamp: Date.now()
  })
// ✅ Permitido
```

#### ❌ Debe Fallar:
```javascript
// Usuario C (no participante) intenta leer mensajes
firestore.collection('chats').doc(chatId)
  .collection('messages').get()
// ❌ Permission denied

// Usuario C intenta enviar mensaje
firestore.collection('chats').doc(chatId)
  .collection('messages').add({
    senderId: userC_id,
    text: 'Hack',
    timestamp: Date.now()
  })
// ❌ Permission denied
```

---

### 3. LIKES

#### ✅ Debe Funcionar:
```javascript
// Usuario A da like a Usuario B
firestore.collection('likes').doc('userA_userB').set({
  fromUserId: userA_id,
  toUserId: userB_id,
  timestamp: Date.now()
})
// ✅ Permitido

// Usuario A elimina su like
firestore.collection('likes').doc('userA_userB').delete()
// ✅ Permitido
```

#### ❌ Debe Fallar:
```javascript
// Usuario A intenta gustarse a sí mismo
firestore.collection('likes').doc('userA_userA').set({
  fromUserId: userA_id,
  toUserId: userA_id, // ❌ Mismo usuario
  timestamp: Date.now()
})
// ❌ Permission denied

// Usuario A intenta crear like de Usuario B
firestore.collection('likes').doc('userB_userC').set({
  fromUserId: userB_id, // ❌ No es userA
  toUserId: userC_id,
  timestamp: Date.now()
})
// ❌ Permission denied
```

---

### 4. MATCHES

#### ✅ Debe Funcionar:
```javascript
// Usuario A lee sus matches
firestore.collection('matches')
  .where('users', 'array-contains', userA_id)
  .get()
// ✅ Permitido

// Usuario A elimina un match
firestore.collection('matches').doc(matchId).delete()
// ✅ Permitido (si userA está en users)
```

#### ❌ Debe Fallar:
```javascript
// Usuario A intenta crear match manualmente
firestore.collection('matches').doc('newMatch').set({
  users: [userA_id, userB_id],
  timestamp: Date.now()
})
// ❌ Permission denied (solo Cloud Functions)

// Usuario C intenta leer match de A y B
firestore.collection('matches').doc(matchId).get()
// ❌ Permission denied (userC no está en users)
```

---

### 5. REPORTS

#### ✅ Debe Funcionar:
```javascript
// Usuario A reporta a Usuario B
firestore.collection('reports').add({
  reporterId: userA_id,
  reportedUserId: userB_id,
  reason: 'Spam',
  timestamp: Date.now()
})
// ✅ Permitido
```

#### ❌ Debe Fallar:
```javascript
// Usuario A intenta reportarse a sí mismo
firestore.collection('reports').add({
  reporterId: userA_id,
  reportedUserId: userA_id, // ❌ Mismo usuario
  reason: 'Test',
  timestamp: Date.now()
})
// ❌ Permission denied

// Usuario A intenta leer reports
firestore.collection('reports').get()
// ❌ Permission denied (solo admins)
```

---

### 6. BLOCKS

#### ✅ Debe Funcionar:
```javascript
// Usuario A bloquea a Usuario B
firestore.collection('blocks').add({
  blockerId: userA_id,
  blockedUserId: userB_id,
  timestamp: Date.now()
})
// ✅ Permitido

// Usuario A lee sus bloqueos
firestore.collection('blocks')
  .where('blockerId', '==', userA_id)
  .get()
// ✅ Permitido
```

#### ❌ Debe Fallar:
```javascript
// Usuario A intenta bloquearse a sí mismo
firestore.collection('blocks').add({
  blockerId: userA_id,
  blockedUserId: userA_id, // ❌ Mismo usuario
  timestamp: Date.now()
})
// ❌ Permission denied

// Usuario A intenta leer bloqueos de Usuario B
firestore.collection('blocks')
  .where('blockerId', '==', userB_id)
  .get()
// ❌ Permission denied
```

---

## 🧪 TESTING EN CONSOLA DE FIREBASE

### Paso 1: Ir a Rules Playground

1. Abre [Firebase Console](https://console.firebase.google.com/project/citard-fbc26/firestore/rules)
2. Click en "Rules Playground" (arriba a la derecha)

### Paso 2: Configurar Simulación

```
Tipo: get
Ubicación: /perfiles/user123
Autenticado: Sí
UID: user123
```

### Paso 3: Ejecutar

Click en "Run" y verifica el resultado:
- ✅ Verde = Permitido
- ❌ Rojo = Denegado

### Paso 4: Probar Diferentes Escenarios

Cambia los parámetros y prueba:
- Diferentes UIDs
- Diferentes colecciones
- Diferentes operaciones (get, list, create, update, delete)

---

## 📊 CHECKLIST DE TESTING

### Perfiles:
```
□ Usuario puede leer su perfil
□ Usuario puede editar su perfil
□ Usuario NO puede editar perfil ajeno
□ Validación de edad funciona (18-100)
□ Validación de fotos funciona (1-6)
□ Validación de bio funciona (max 500)
```

### Chats:
```
□ Participante puede leer mensajes
□ No participante NO puede leer mensajes
□ Participante puede enviar mensajes
□ No participante NO puede enviar mensajes
```

### Likes:
```
□ Usuario puede crear likes
□ Usuario NO puede gustarse a sí mismo
□ Usuario NO puede crear likes de otros
□ Usuario puede eliminar sus likes
```

### Matches:
```
□ Usuario puede ver sus matches
□ Usuario NO puede ver matches ajenos
□ Usuario NO puede crear matches manualmente
```

### Reports:
```
□ Usuario puede reportar a otro
□ Usuario NO puede reportarse a sí mismo
□ Usuario NO puede leer reports
```

### Blocks:
```
□ Usuario puede bloquear a otro
□ Usuario NO puede bloquearse a sí mismo
□ Usuario puede ver sus bloqueos
□ Usuario NO puede ver bloqueos ajenos
```

---

## 🐛 ERRORES COMUNES

### Error: "Missing or insufficient permissions"

**Causa:** Las reglas están bloqueando el acceso

**Solución:**
1. Verifica que el usuario esté autenticado
2. Verifica que el UID coincida con el recurso
3. Verifica que los datos sean válidos

### Error: "PERMISSION_DENIED"

**Causa:** Intentando acceder a datos sin permiso

**Solución:**
1. Revisa las reglas en Firebase Console
2. Verifica que el usuario tenga permiso
3. Verifica que los datos cumplan validaciones

### Error: "Invalid data"

**Causa:** Datos no cumplen validaciones

**Solución:**
1. Revisa las validaciones en las reglas
2. Asegúrate de enviar todos los campos requeridos
3. Verifica tipos de datos (string, int, list, etc.)

---

## 🎯 TESTING RÁPIDO EN APP

### 1. Crear 2 Usuarios de Prueba

```
Usuario A: test1@example.com
Usuario B: test2@example.com
```

### 2. Probar Escenarios

#### Escenario 1: Editar Perfil Propio
1. Login como Usuario A
2. Ir a Profile
3. Editar bio
4. Guardar
5. ✅ Debe funcionar

#### Escenario 2: Ver Chat
1. Login como Usuario A
2. Match con Usuario B
3. Abrir chat
4. Enviar mensaje
5. ✅ Debe funcionar

#### Escenario 3: Dar Like
1. Login como Usuario A
2. Ir a Discovery
3. Dar like a Usuario B
4. ✅ Debe funcionar

#### Escenario 4: Reportar Usuario
1. Login como Usuario A
2. Ver perfil de Usuario B
3. Reportar
4. ✅ Debe funcionar

#### Escenario 5: Bloquear Usuario
1. Login como Usuario A
2. Ver perfil de Usuario B
3. Bloquear
4. ✅ Debe funcionar
5. Usuario B no debe aparecer en Discovery

---

## 📝 REPORTE DE TESTING

Después de probar, documenta los resultados:

```markdown
## Testing Results - [Fecha]

### Perfiles:
- ✅ Lectura propia: OK
- ✅ Edición propia: OK
- ✅ Edición ajena bloqueada: OK
- ✅ Validación edad: OK

### Chats:
- ✅ Lectura participante: OK
- ✅ Lectura no participante bloqueada: OK
- ✅ Envío participante: OK

### Likes:
- ✅ Crear like: OK
- ✅ Auto-like bloqueado: OK
- ✅ Eliminar like: OK

### Matches:
- ✅ Ver propios: OK
- ✅ Ver ajenos bloqueado: OK
- ✅ Crear manual bloqueado: OK

### Reports:
- ✅ Crear report: OK
- ✅ Auto-report bloqueado: OK
- ✅ Leer reports bloqueado: OK

### Blocks:
- ✅ Crear block: OK
- ✅ Auto-block bloqueado: OK
- ✅ Ver propios: OK
```

---

## 🚀 PRÓXIMOS PASOS

Una vez verificadas las reglas:

1. ✅ Reglas funcionan correctamente
2. ⏳ Continuar con Error Handling
3. ⏳ Testing manual completo
4. ⏳ Deploy final

---

**Documentado por:** Kiro AI  
**Fecha:** 12 de Febrero 2026
