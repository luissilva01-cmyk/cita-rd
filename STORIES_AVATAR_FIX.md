# 🖼️ Stories Avatar Fix - 30 Enero 2026

## ❌ PROBLEMA IDENTIFICADO

Las fotos de perfil en las stories no correspondían a los usuarios reales porque el código estaba buscando el campo incorrecto en Firestore.

### Código Anterior (Incorrecto)
```typescript
// ❌ PROBLEMA: Buscaba 'fotos' y 'nombre' (campos incorrectos)
user: {
  name: perfilData.nombre || 'Usuario',
  avatar: perfilData.fotos?.[0] || 'https://images.unsplash.com/...'
}
```

### Estructura Real en Firestore
```typescript
// ✅ Estructura correcta según types.ts
interface UserProfile {
  id: string;
  name: string;        // ← Campo correcto
  age: number;
  bio: string;
  location: string;
  images: string[];    // ← Campo correcto
  interests: string[];
  // ...
}
```

### Resultado del Bug
- ❌ Siempre mostraba la foto por defecto (placeholder de Unsplash)
- ❌ No mostraba las fotos reales de los usuarios
- ❌ Causaba confusión sobre quién publicó la story

---

## ✅ SOLUCIÓN IMPLEMENTADA

### Código Nuevo (Correcto)
```typescript
// ✅ CORRECTO: Busca ambos campos para compatibilidad
user: {
  name: perfilData.name || perfilData.nombre || 'Usuario',
  avatar: perfilData.images?.[0] || perfilData.fotos?.[0] || 'https://images.unsplash.com/...'
}
```

### Lógica de Fallback
1. **Nombre:**
   - Primero intenta `perfilData.name` (campo correcto)
   - Si no existe, intenta `perfilData.nombre` (compatibilidad)
   - Si no existe, usa `'Usuario'` (fallback)

2. **Avatar:**
   - Primero intenta `perfilData.images?.[0]` (campo correcto)
   - Si no existe, intenta `perfilData.fotos?.[0]` (compatibilidad)
   - Si no existe, usa placeholder de Unsplash (fallback)

---

## 📊 COMPORTAMIENTO ANTES vs DESPUÉS

### ANTES del Fix
```
Usuario A (con foto real en Firestore)
├─ Campo en Firestore: images: ['https://foto-real.jpg']
├─ Código buscaba: perfilData.fotos?.[0]
└─ Resultado: ❌ Mostraba placeholder (foto genérica)

Usuario B (con foto real en Firestore)
├─ Campo en Firestore: images: ['https://otra-foto.jpg']
├─ Código buscaba: perfilData.fotos?.[0]
└─ Resultado: ❌ Mostraba placeholder (foto genérica)
```

### DESPUÉS del Fix
```
Usuario A (con foto real en Firestore)
├─ Campo en Firestore: images: ['https://foto-real.jpg']
├─ Código busca: perfilData.images?.[0]
└─ Resultado: ✅ Muestra foto real del usuario

Usuario B (con foto real en Firestore)
├─ Campo en Firestore: images: ['https://otra-foto.jpg']
├─ Código busca: perfilData.images?.[0]
└─ Resultado: ✅ Muestra foto real del usuario
```

---

## 🎯 CASOS DE USO

### Caso 1: Usuario con Foto Real
```typescript
// Perfil en Firestore
{
  id: 'user123',
  name: 'Carolina',
  images: ['https://mi-foto-real.jpg'],
  // ...
}

// Resultado en Stories
✅ Muestra: 'Carolina' con su foto real
```

### Caso 2: Usuario Sin Foto
```typescript
// Perfil en Firestore
{
  id: 'user456',
  name: 'Marcos',
  images: [],
  // ...
}

// Resultado en Stories
✅ Muestra: 'Marcos' con placeholder genérico
```

### Caso 3: Perfil con Campos Antiguos (Compatibilidad)
```typescript
// Perfil antiguo en Firestore
{
  id: 'user789',
  nombre: 'Isabella',  // Campo antiguo
  fotos: ['https://foto-antigua.jpg'],  // Campo antiguo
  // ...
}

// Resultado en Stories
✅ Muestra: 'Isabella' con su foto (compatibilidad)
```

---

## 🧪 TESTING

### Test 1: Usuario con Foto Real
1. Crear usuario con foto en Firestore
2. Publicar una story
3. **Esperado:** La story muestra la foto real del usuario
4. **Esperado:** El nombre del usuario es correcto

### Test 2: Usuario Sin Foto
1. Crear usuario sin fotos en Firestore
2. Publicar una story
3. **Esperado:** La story muestra el placeholder genérico
4. **Esperado:** El nombre del usuario es correcto

### Test 3: Múltiples Usuarios
1. Varios usuarios publican stories
2. Ver el ring de stories
3. **Esperado:** Cada story muestra la foto correcta de su autor
4. **Esperado:** No hay confusión entre usuarios

---

## 📝 ARCHIVOS MODIFICADOS

### `cita-rd/services/storiesService.ts`
```typescript
// Línea ~140-150
user: {
  name: perfilData.name || perfilData.nombre || 'Usuario',
  avatar: perfilData.images?.[0] || perfilData.fotos?.[0] || 'https://...'
}
```

**Cambios:**
- ✅ Busca `perfilData.name` primero (campo correcto)
- ✅ Busca `perfilData.images?.[0]` primero (campo correcto)
- ✅ Mantiene compatibilidad con campos antiguos
- ✅ Fallback a placeholder si no hay foto

---

## 🔍 CAUSA RAÍZ

### ¿Por qué pasó esto?

El código fue escrito asumiendo que los campos en Firestore se llamaban:
- `nombre` (español)
- `fotos` (español)

Pero la estructura real definida en `types.ts` usa:
- `name` (inglés)
- `images` (inglés)

Esto es común cuando hay:
1. Múltiples desarrolladores
2. Cambios en la estructura de datos
3. Migración de código antiguo
4. Falta de validación de tipos

---

## ✅ VERIFICACIÓN

Para verificar que el fix funciona:

1. **Abrir la app:** http://localhost:3000/
2. **Crear usuario con foto real**
3. **Publicar una story**
4. **Verificar:**
   - ✅ La foto en el ring de stories es la correcta
   - ✅ El nombre del usuario es correcto
   - ✅ No muestra el placeholder genérico

---

## 🚀 MEJORAS FUTURAS

### 1. Validación de Tipos
```typescript
// Agregar validación en tiempo de compilación
const perfilData = perfilDoc.data() as UserProfile;
```

### 2. Migración de Datos
```typescript
// Script para migrar campos antiguos a nuevos
if (perfilData.fotos && !perfilData.images) {
  await updateDoc(perfilRef, { images: perfilData.fotos });
}
```

### 3. Logging Mejorado
```typescript
console.log('📸 Avatar obtenido:', {
  userId,
  hasImages: !!perfilData.images,
  hasFotos: !!perfilData.fotos,
  avatarUsed: group.user.avatar
});
```

---

## 📌 NOTAS IMPORTANTES

### Compatibilidad
El código ahora soporta **ambos** formatos:
- ✅ Formato nuevo: `name`, `images`
- ✅ Formato antiguo: `nombre`, `fotos`

Esto asegura que:
- Perfiles nuevos funcionan correctamente
- Perfiles antiguos siguen funcionando
- No se rompe nada durante la migración

### Placeholder
El placeholder de Unsplash solo se usa cuando:
- El usuario no tiene fotos
- El campo `images` está vacío
- El campo `fotos` está vacío

---

## 🎉 RESULTADO

✅ **Fix implementado correctamente**  
✅ **Fotos de perfil ahora se muestran correctamente**  
✅ **Compatibilidad con datos antiguos**  
✅ **Fallback robusto para casos sin foto**

---

**Fecha:** 30 de Enero 2026  
**Commit:** Próximo  
**Estado:** ✅ Implementado, listo para commit
