# 🧪 Guía Rápida: Probar Firestore Security Rules

**Fecha:** 1 de Febrero 2026  
**Estado:** ✅ Reglas Desplegadas - Listas para Probar  
**Tiempo estimado:** 10-15 minutos

---

## 🎯 Objetivo

Verificar que las reglas de seguridad de Firestore están funcionando correctamente y que la aplicación sigue operando normalmente.

---

## ✅ Pruebas Rápidas (5 minutos)

### Prueba 1: Login y Ver Perfiles ✅

**Objetivo:** Verificar que usuarios autenticados pueden usar la app

**Pasos:**
1. Abrir la app: http://localhost:3000
2. Hacer login con un usuario existente
3. Ir a Discovery/Swipe
4. Verificar que se cargan perfiles

**Resultado Esperado:** ✅ Perfiles visibles y funcionales

**Si falla:** 🔴 Revisar logs de Firebase Console

---

### Prueba 2: Enviar Mensaje ✅

**Objetivo:** Verificar que el chat funciona

**Pasos:**
1. Ir a "Mensajes"
2. Abrir un chat existente
3. Escribir y enviar un mensaje
4. Verificar que se envía correctamente

**Resultado Esperado:** ✅ Mensaje enviado y visible

**Si falla:** 🔴 Verificar que eres participante del chat

---

### Prueba 3: Editar Perfil ✅

**Objetivo:** Verificar que puedes modificar tu perfil

**Pasos:**
1. Ir a "Perfil"
2. Click en "Editar Perfil"
3. Cambiar tu bio o nombre
4. Guardar cambios

**Resultado Esperado:** ✅ Cambios guardados exitosamente

**Si falla:** 🔴 Verificar que estás autenticado

---

### Prueba 4: Crear Story ✅

**Objetivo:** Verificar que las stories funcionan

**Pasos:**
1. Click en "Crear Story"
2. Subir una imagen o escribir texto
3. Publicar

**Resultado Esperado:** ✅ Story creada y visible

**Si falla:** 🔴 Verificar formato de imagen y contenido

---

### Prueba 5: Acceso Sin Login ❌

**Objetivo:** Verificar que usuarios no autenticados NO pueden acceder

**Pasos:**
1. Abrir una ventana de incógnito
2. Ir a: http://localhost:3000
3. Intentar acceder sin login

**Resultado Esperado:** ❌ Redirige a página de login

**Si falla:** 🔴 Las reglas no están funcionando correctamente

---

## 🔍 Pruebas Avanzadas (10 minutos)

### Prueba 6: Intentar Modificar Perfil Ajeno ❌

**Objetivo:** Verificar que NO puedes modificar datos de otros

**Pasos:**
1. Hacer login
2. Abrir consola del navegador (F12)
3. Ejecutar:

```javascript
// Importar Firebase
import { getFirestore, doc, updateDoc } from 'firebase/firestore';

// Intentar modificar perfil de otro usuario
const db = getFirestore();
const otroUserId = "PONER_ID_DE_OTRO_USUARIO_AQUI";

try {
  await updateDoc(doc(db, "perfiles", otroUserId), {
    name: "Hacker Intentando Modificar"
  });
  console.log("❌ ERROR: Se pudo modificar perfil ajeno!");
} catch (error) {
  console.log("✅ CORRECTO: No se puede modificar perfil ajeno");
  console.log("Error:", error.message);
}
```

**Resultado Esperado:** ❌ Error "Missing or insufficient permissions"

**Si falla:** 🔴 Las reglas no están protegiendo correctamente

---

### Prueba 7: Intentar Leer Chat Ajeno ❌

**Objetivo:** Verificar que NO puedes leer chats de otros

**Pasos:**
1. Hacer login
2. Abrir consola del navegador (F12)
3. Ejecutar:

```javascript
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();
const chatAjenoId = "PONER_ID_DE_CHAT_AJENO_AQUI";

try {
  const chatRef = doc(db, "chats", chatAjenoId);
  const chatSnap = await getDoc(chatRef);
  
  if (chatSnap.exists()) {
    console.log("❌ ERROR: Se pudo leer chat ajeno!");
  }
} catch (error) {
  console.log("✅ CORRECTO: No se puede leer chat ajeno");
  console.log("Error:", error.message);
}
```

**Resultado Esperado:** ❌ Error "Missing or insufficient permissions"

**Si falla:** 🔴 Las reglas no están protegiendo chats

---

### Prueba 8: Crear Perfil con Datos Inválidos ❌

**Objetivo:** Verificar validación de datos

**Pasos:**
1. Hacer login
2. Abrir consola del navegador (F12)
3. Ejecutar:

```javascript
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const db = getFirestore();
const auth = getAuth();
const userId = auth.currentUser.uid;

try {
  await setDoc(doc(db, "perfiles", userId), {
    name: "Test",
    age: 15, // ❌ Menor de 18
    bio: "Test",
    location: "Test",
    interests: [],
    images: []
  });
  console.log("❌ ERROR: Se aceptaron datos inválidos!");
} catch (error) {
  console.log("✅ CORRECTO: Datos inválidos rechazados");
  console.log("Error:", error.message);
}
```

**Resultado Esperado:** ❌ Error "Missing or insufficient permissions"

**Si falla:** 🔴 La validación de datos no está funcionando

---

## 📊 Checklist de Verificación

### Funcionalidades que DEBEN funcionar ✅

- [ ] Login/Registro
- [ ] Ver perfiles en Discovery
- [ ] Dar likes
- [ ] Ver matches
- [ ] Leer mensajes propios
- [ ] Enviar mensajes
- [ ] Ver stories
- [ ] Crear stories
- [ ] Editar perfil propio
- [ ] Ver configuración de privacidad
- [ ] Actualizar configuración de privacidad

### Operaciones que NO DEBEN funcionar ❌

- [ ] Acceder sin login
- [ ] Modificar perfil ajeno
- [ ] Leer chat ajeno
- [ ] Eliminar chat
- [ ] Crear perfil con edad < 18
- [ ] Crear perfil sin nombre
- [ ] Modificar likes de otros
- [ ] Eliminar stories ajenas

---

## 🚨 Qué Hacer Si Algo Falla

### Funcionalidad Principal No Funciona

**Síntoma:** No se cargan perfiles, no se envían mensajes, etc.

**Pasos:**
1. Abrir consola del navegador (F12)
2. Buscar errores de Firebase
3. Copiar el error completo
4. Ir a Firebase Console: https://console.firebase.google.com/project/citard-fbc26/firestore/rules
5. Usar el simulador de reglas para probar la operación

**Posibles causas:**
- Usuario no está autenticado
- Datos no cumplen validación
- Error en las reglas

---

### Operación No Autorizada Funciona

**Síntoma:** Puedes modificar datos ajenos, leer chats ajenos, etc.

**Pasos:**
1. Verificar que las reglas están desplegadas:
```bash
firebase firestore:rules:get
```

2. Verificar en Firebase Console:
https://console.firebase.google.com/project/citard-fbc26/firestore/rules

3. Re-desplegar si es necesario:
```bash
firebase deploy --only firestore:rules
```

---

### Muchos Errores de Permisos

**Síntoma:** Errores constantes de "Missing or insufficient permissions"

**Pasos:**
1. Verificar que el usuario está autenticado:
```javascript
const auth = getAuth();
console.log('Usuario:', auth.currentUser);
```

2. Verificar que los datos son válidos:
```javascript
console.log('Datos a guardar:', data);
```

3. Revisar logs en Firebase Console:
https://console.firebase.google.com/project/citard-fbc26/firestore/usage

---

## 📈 Monitoreo Post-Despliegue

### Firebase Console

**URL:** https://console.firebase.google.com/project/citard-fbc26/firestore/usage

**Qué revisar:**
- Lecturas/Escrituras por día
- Errores de permisos
- Operaciones denegadas

**Frecuencia:** Revisar cada 2-3 horas el primer día

---

### Logs en Tiempo Real

**Comando:**
```bash
cd cita-rd
firebase functions:log --only firestore
```

**Qué buscar:**
- Errores de permisos frecuentes
- Patrones sospechosos
- Operaciones denegadas inusuales

---

## ✅ Resultado Esperado

Después de completar todas las pruebas:

### ✅ Funcionalidades Principales
- Login/Registro: ✅ Funciona
- Discovery: ✅ Funciona
- Mensajes: ✅ Funciona
- Stories: ✅ Funciona
- Perfil: ✅ Funciona

### ❌ Operaciones No Autorizadas
- Acceso sin login: ❌ Bloqueado
- Modificar datos ajenos: ❌ Bloqueado
- Leer chats ajenos: ❌ Bloqueado
- Datos inválidos: ❌ Rechazados

### 📊 Seguridad
- Nivel de seguridad: 🟢 6/10
- Protección básica: ✅ Activa
- Validación de datos: ✅ Activa
- Autenticación requerida: ✅ Activa

---

## 🎯 Próximos Pasos

Después de verificar que todo funciona:

### Inmediato (Hoy)
- [ ] Completar todas las pruebas rápidas
- [ ] Verificar que no hay errores en producción
- [ ] Monitorear logs por 2-3 horas

### Esta Semana
- [ ] Restringir API Keys en Firebase Console
- [ ] Implementar rate limiting
- [ ] Configurar alertas de seguridad
- [ ] Realizar pruebas de carga

### Próximas Semanas
- [ ] Auditoría de seguridad completa
- [ ] Implementar 2FA
- [ ] Preparar para lanzamiento

---

## 📚 Recursos Adicionales

### Documentación
- `FIRESTORE_RULES_DEPLOYED.md` - Guía completa de reglas
- `FIRESTORE_SECURITY_RULES_IMPLEMENTATION.md` - Detalles técnicos
- `ANALISIS_PRE_LANZAMIENTO.md` - Análisis de seguridad

### Firebase Console
- **Reglas:** https://console.firebase.google.com/project/citard-fbc26/firestore/rules
- **Datos:** https://console.firebase.google.com/project/citard-fbc26/firestore/data
- **Uso:** https://console.firebase.google.com/project/citard-fbc26/firestore/usage

### Comandos Útiles
```bash
# Ver reglas actuales
firebase firestore:rules:get

# Desplegar reglas
firebase deploy --only firestore:rules

# Ver logs
firebase functions:log
```

---

## ✅ Checklist Final

Antes de considerar las pruebas completas:

- [ ] Todas las pruebas rápidas completadas
- [ ] Al menos 3 pruebas avanzadas completadas
- [ ] Funcionalidades principales funcionan
- [ ] Operaciones no autorizadas bloqueadas
- [ ] Sin errores críticos en logs
- [ ] Monitoreo configurado
- [ ] Documentación revisada

---

**Creado por:** Kiro AI  
**Fecha:** 1 de Febrero 2026  
**Versión:** 1.0  
**Estado:** ✅ Listo para usar
