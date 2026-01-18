# 🧹 Limpieza de Datos Mock - Bugs Encontrados en Testing

**Fecha:** Enero 16, 2026  
**Reportado por:** Usuario durante testing  
**Severidad:** ALTA

---

## 🐛 Bugs Encontrados

### 1. "Juan Pérez" en Actividad Reciente
**Problema:** En la página de inicio aparece "Juan Pérez" en actividad reciente  
**Causa:** `App.tsx` pasa `potentialMatches.slice(0, 3)` que son datos mock hardcodeados  
**Solución:** Pasar matches reales desde Firebase o array vacío

### 2. Matches Falsos (Carolina, Isabella, Diego)
**Problema:** Aparecen 3 matches que no existen  
**Causa:** Misma que #1 - datos mock de `INITIAL_POTENTIAL_MATCHES`  
**Solución:** Usar solo matches reales del usuario

### 3. Contador de Mensajes Incorrecto
**Problema:** Muestra "5 mensajes" pero al hacer click dice "No tienes matches aún"  
**Causa:** Contador hardcodeado en Home.tsx: `const unreadMessages = 3;`  
**Solución:** Calcular desde chats reales

### 4. Nombre No Se Guarda
**Problema:** Aparece email "silva132011" en vez del nombre del usuario  
**Causa:** El registro no guarda el nombre ingresado en Firestore  
**Solución:** Guardar el nombre del formulario de registro en el perfil

### 5. Edad Incorrecta
**Problema:** Muestra 18 años en vez de calcular desde fecha de nacimiento  
**Causa:** Perfil básico se crea con `age: 18` hardcodeado  
**Solución:** Calcular edad real desde `birthDate` del registro

---

## ✅ Soluciones a Implementar

### Fix 1: Limpiar Datos Mock en App.tsx
```typescript
// ANTES:
const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>(INITIAL_POTENTIAL_MATCHES);

// DESPUÉS:
const [potentialMatches, setPotentialMatches] = useState<UserProfile[]>([]);
```

### Fix 2: Pasar Matches Reales a Home
```typescript
// ANTES:
<Home 
  currentUser={user}
  recentMatches={potentialMatches.slice(0, 3)}
  ...
/>

// DESPUÉS:
<Home 
  currentUser={user}
  recentMatches={chats.slice(0, 3).map(chat => {
    // Convertir chats a UserProfile[]
  })}
  ...
/>
```

### Fix 3: Calcular Mensajes No Leídos
```typescript
// En Home.tsx
// ANTES:
const unreadMessages = 3;

// DESPUÉS:
const unreadMessages = recentMatches.length; // O calcular desde chats
```

### Fix 4: Guardar Nombre en Registro
```typescript
// En Register.tsx, después de crear usuario:
const basicProfile: UserProfile = {
  id: user.uid,
  name: formData.name, // ✅ Usar nombre del formulario
  age: calculateAge(formData.birthDate), // ✅ Calcular edad
  bio: '',
  location: '',
  images: [],
  interests: [],
  isVerified: false
};
await createOrUpdateProfile(user.uid, basicProfile);
```

### Fix 5: Función para Calcular Edad
```typescript
const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};
```

---

## 📝 Archivos a Modificar

1. ✅ `cita-rd/App.tsx` - Limpiar datos mock
2. ✅ `cita-rd/src/pages/Auth/Register.tsx` - Guardar nombre y edad real
3. ✅ `cita-rd/views/views/Home.tsx` - Calcular mensajes reales

---

## 🧪 Testing Después del Fix

### Verificar:
1. ✅ Home NO muestra "Juan Pérez"
2. ✅ Home NO muestra matches falsos
3. ✅ Contador de mensajes es correcto (0 si no hay matches)
4. ✅ Perfil muestra el nombre ingresado en registro
5. ✅ Perfil muestra la edad correcta calculada desde fecha de nacimiento

---

**Estado:** En progreso...
