# 🔍 Diagnóstico: Stories No Visibles

**Fecha:** 26 de enero de 2026  
**Problema:** Usuario publicó una historia pero Luis Silva no la puede visualizar

---

## 🎯 Problema Identificado

El sistema de historias funciona correctamente, pero hay un **problema de configuración de privacidad** o **userId no registrado**.

---

## 🔍 Causas Posibles

### 1. **userId No Registrado en Privacy Service**

El servicio de privacidad (`privacyService.ts`) tiene una lista hardcodeada de usuarios con configuración de privacidad:

```typescript
const demoSettings: PrivacySettings[] = [
  {
    userId: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2', // Usuario actual
    storiesVisibility: 'everyone',
    ...
  },
  {
    userId: '1', // Carolina
    storiesVisibility: 'everyone',
    ...
  },
  // ... más usuarios
];
```

**Si el userId de Luis Silva no está en esta lista**, el sistema creará una configuración por defecto con `storiesVisibility: 'everyone'`, lo cual debería funcionar.

### 2. **No Hay Match Entre Usuarios**

Si la configuración de privacidad del usuario que publicó la historia es `matches_only`, entonces Luis Silva necesita tener un match con ese usuario para ver la historia.

El servicio tiene matches hardcodeados:

```typescript
this.userMatches = [
  {
    userId1: 'KU5ZalR92QcPV7RGbLFTjEjTXZm2',
    userId2: '1', // Carolina
    matchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  // ... más matches
];
```

### 3. **Historia Expirada**

Las historias expiran después de 24 horas. Si la historia fue creada hace más de 24 horas, no se mostrará.

### 4. **userId Diferente**

El usuario que publicó la historia tiene un `userId` diferente al esperado, y Luis Silva está usando otro `userId`.

---

## 🧪 Cómo Diagnosticar

### Paso 1: Verificar userId en la Consola

1. Abre la app en el navegador
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**
4. Busca logs que digan:
   ```
   🟢 Setting up presence system for user: XXXXXXX
   ```
   Este es el `userId` del usuario actual (Luis Silva)

### Paso 2: Verificar Logs de Stories

En la consola, busca logs como:
```
🔒 Obteniendo configuración de privacidad para: XXXXXXX
👁️ Verificando si XXXXXXX puede ver stories de YYYYYYY
✅ Stories públicas - todos pueden ver
```

Estos logs te dirán:
- Qué `userId` está intentando ver las stories
- Qué `userId` publicó las stories
- Si la verificación de privacidad pasó o falló

### Paso 3: Verificar Stories en Firestore (si usas Firebase)

Si estás usando Firebase, las stories deberían estar en una colección. Verifica:
- ¿La historia existe en la base de datos?
- ¿Tiene el `userId` correcto?
- ¿La fecha de expiración (`expiresAt`) es válida?

---

## 🔧 Soluciones

### Solución 1: Agregar userId al Privacy Service

Si el problema es que el `userId` no está registrado, agrégalo manualmente:

1. Abre `cita-rd/services/privacyService.ts`
2. En el método `initializeDemoData()`, agrega el userId de Luis Silva:

```typescript
{
  userId: 'USERID_DE_LUIS_SILVA', // Reemplazar con el userId real
  storiesVisibility: 'everyone',
  allowStoryReplies: true,
  showOnlineStatus: true,
  allowProfileViews: 'everyone',
  createdAt: new Date(),
  updatedAt: new Date()
}
```

### Solución 2: Crear Match Entre Usuarios

Si la historia tiene privacidad `matches_only`, crea un match:

1. Abre la consola del navegador
2. Ejecuta:
```javascript
// Reemplazar con los userIds reales
await privacyService.createMatch('USERID_LUIS_SILVA', 'USERID_OTRO_USUARIO');
```

### Solución 3: Cambiar Privacidad a "Everyone"

Si quieres que todos vean las historias:

1. Abre la app
2. Ve a **Configuración de Cuenta** (icono de engranaje en Stories)
3. En **Privacidad de Stories**, selecciona **"Todos"**
4. Guarda los cambios

### Solución 4: Verificar Fecha de Expiración

Las historias expiran después de 24 horas. Si la historia es vieja, no se mostrará.

---

## 🐛 Debug en Vivo

### Opción 1: Logs en Consola

El sistema ya tiene logs extensivos. Abre la consola y verás:

```
🔒 Obteniendo configuración de privacidad para: XXXXXXX
✅ Configuración obtenida: { storiesVisibility: 'everyone', ... }
👁️ Verificando si XXXXXXX puede ver stories de YYYYYYY
✅ Stories públicas - todos pueden ver
```

### Opción 2: Agregar Logs Temporales

Si necesitas más información, agrega logs temporales en `storiesService.ts`:

```typescript
async getStoryGroups(currentUserId: string): Promise<StoryGroup[]> {
  console.log('📊 === CARGANDO STORY GROUPS ===');
  console.log('📊 Current User ID:', currentUserId);
  console.log('📊 Total Stories:', this.stories.length);
  console.log('📊 Total Story Groups:', this.storyGroups.length);
  
  // ... resto del código
  
  console.log('📊 Filtered Groups:', filteredGroups.length);
  console.log('📊 === FIN CARGA ===');
  
  return filteredGroups;
}
```

---

## 📝 Información Necesaria para Ayudar

Para poder ayudarte mejor, necesito saber:

1. **userId de Luis Silva:**
   - Busca en consola: `🟢 Setting up presence system for user: XXXXXXX`

2. **userId del usuario que publicó la historia:**
   - Busca en consola logs de stories

3. **Configuración de privacidad:**
   - ¿La historia es pública o solo para matches?

4. **¿Hay errores en consola?**
   - Busca mensajes en rojo

5. **¿Cuándo se publicó la historia?**
   - ¿Hace menos de 24 horas?

---

## 🎯 Próximos Pasos

1. **Abre la consola del navegador** (F12)
2. **Recarga la página** (Ctrl + R)
3. **Copia todos los logs** que veas relacionados con:
   - `Setting up presence system`
   - `Obteniendo configuración de privacidad`
   - `Verificando si ... puede ver stories`
   - `CARGANDO STORY GROUPS` (si agregaste los logs)
4. **Comparte los logs** para que pueda diagnosticar el problema exacto

---

## 🔍 Verificación Rápida

Ejecuta esto en la consola del navegador:

```javascript
// Ver configuración de privacidad
await privacyService.getPrivacySettings('USERID_AQUI');

// Ver si hay match
await privacyService.areUsersMatched('USERID1', 'USERID2');

// Ver si puede ver stories
await privacyService.canViewStories('USERID_VIEWER', 'USERID_OWNER');

// Ver estadísticas
await privacyService.getPrivacyStats();
```

---

**¿Necesitas ayuda?** Comparte los logs de la consola y podré identificar el problema exacto.
