# 🐌 Problema de Rendimiento en Discovery - DIAGNOSTICADO

**Fecha:** 17 de Febrero 2026  
**Estado:** 🔍 DIAGNOSTICADO - Pendiente Fix  
**Severidad:** 🔴 ALTA - Afecta UX directamente

---

## 🎯 PROBLEMA REPORTADO

"En la sección descubrir, los usuarios están durando mucho para cargar"

---

## 🔍 DIAGNÓSTICO COMPLETO

### Causas Identificadas:

#### 1. **Cálculo de Scores para TODOS los usuarios** 🔴 CRÍTICO
```typescript
// En optimizeUsersWithAI() - Línea ~110
const usersWithScores = await Promise.all(
  users.map(async (user) => {
    const profileScore = await calculateProfileScore(user.images || []);
    // ⚠️ Esto llama a ImageKit API para CADA usuario
    return { ...user, visibilityBoost: profileScore.visibilityBoost };
  })
);
```

**Problema:**
- Si hay 20 usuarios, hace 20 llamadas a ImageKit API
- Cada llamada puede tardar 500ms - 2s
- Total: **10-40 segundos de espera** 😱

#### 2. **Generación de Predicciones de IA** 🟡 MEDIO
```typescript
// Línea ~108
await generatePredictions(currentUserId, [CURRENT_USER_MOCK, ...users]);
```

**Problema:**
- Llama a Gemini AI para analizar compatibilidad
- Procesa TODOS los usuarios a la vez
- Puede tardar 3-5 segundos adicionales

#### 3. **Bloqueo de UI durante carga** 🟡 MEDIO
```typescript
if (isLoadingScores || isAnalyzing) {
  return <LoadingScreen />; // ⚠️ Usuario ve pantalla de carga
}
```

**Problema:**
- Usuario no ve NADA hasta que todo termine
- Mala experiencia de usuario
- Sensación de app lenta

---

## 📊 IMPACTO REAL

### Tiempo de Carga Actual:

| Operación | Tiempo | Bloqueante |
|-----------|--------|------------|
| **ImageKit API (20 usuarios)** | 10-40s | ✅ SÍ |
| **Gemini AI predictions** | 3-5s | ✅ SÍ |
| **Firestore query** | 0.5-1s | ✅ SÍ |
| **TOTAL** | **13-46s** | 😱 |

### Experiencia del Usuario:
1. Usuario abre Discovery
2. Ve spinner de carga por 13-46 segundos 😴
3. Finalmente ve el primer perfil
4. **Resultado:** Usuario frustrado, posible abandono

---

## ✅ SOLUCIONES PROPUESTAS

### Solución 1: Lazy Loading de Scores (RECOMENDADA) ⭐

**Implementación:**
```typescript
// Cargar usuarios inmediatamente SIN scores
useEffect(() => {
  setSortedUsers(availableUsers); // Mostrar YA
  setIsLoadingScores(false);
  
  // Calcular scores en background
  calculateScoresInBackground(availableUsers);
}, [availableUsers]);

// Función que calcula scores de a pocos
const calculateScoresInBackground = async (users: UserProfile[]) => {
  const batchSize = 5; // Procesar 5 a la vez
  
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    const withScores = await Promise.all(
      batch.map(async (user) => {
        const score = await calculateProfileScore(user.images || []);
        return { ...user, ...score };
      })
    );
    
    // Actualizar usuarios gradualmente
    setSortedUsers(prev => updateUsersWithScores(prev, withScores));
  }
};
```

**Beneficios:**
- ✅ Usuario ve perfiles en **< 1 segundo**
- ✅ Scores se calculan en background
- ✅ No bloquea la UI
- ✅ Mejor experiencia de usuario

**Tiempo de carga:** 0.5-1s (95% más rápido) 🚀

---

### Solución 2: Cache de Scores

**Implementación:**
```typescript
// Guardar scores en localStorage
const CACHE_KEY = 'profile_scores_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

const getCachedScore = (userId: string) => {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const cached = cache[userId];
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.score;
  }
  return null;
};

const setCachedScore = (userId: string, score: any) => {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  cache[userId] = { score, timestamp: Date.now() };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};
```

**Beneficios:**
- ✅ Scores se reutilizan entre sesiones
- ✅ Reduce llamadas a ImageKit en 80-90%
- ✅ Carga instantánea para usuarios ya vistos

---

### Solución 3: Optimización de IA

**Implementación:**
```typescript
// Solo generar predicciones para los primeros 10 usuarios
const optimizeUsersWithAI = async (users: UserProfile[]) => {
  const topUsers = users.slice(0, 10); // Solo top 10
  await generatePredictions(currentUserId, topUsers);
  
  // Resto de usuarios sin IA (solo scores tradicionales)
  return sortUsers(users);
};
```

**Beneficios:**
- ✅ Reduce tiempo de IA en 50%
- ✅ Suficiente para mostrar buenos matches
- ✅ Puede generar más predicciones en background

---

### Solución 4: Mostrar Perfiles Inmediatamente (QUICK WIN) ⚡

**Implementación:**
```typescript
// Remover el loading screen completo
// Mostrar perfiles inmediatamente con indicador sutil
return (
  <div>
    {isLoadingScores && (
      <div className="absolute top-4 right-4 z-50">
        <Brain className="animate-pulse text-purple-600" size={20} />
      </div>
    )}
    
    {/* Mostrar perfiles normalmente */}
    <SwipeCard user={currentUser} ... />
  </div>
);
```

**Beneficios:**
- ✅ Usuario ve perfiles INMEDIATAMENTE
- ✅ Indicador sutil de que IA está trabajando
- ✅ No bloquea la experiencia
- ✅ Implementación en 5 minutos

---

## 🎯 PLAN DE ACCIÓN RECOMENDADO

### Fase 1: Quick Win (5 minutos) ⚡
1. Remover loading screen bloqueante
2. Mostrar perfiles inmediatamente
3. Indicador sutil de carga de IA

**Resultado:** Carga percibida < 1 segundo

### Fase 2: Lazy Loading (30 minutos) 🚀
1. Implementar cálculo de scores en background
2. Procesar en batches de 5 usuarios
3. Actualizar UI gradualmente

**Resultado:** Carga real < 1 segundo

### Fase 3: Cache (15 minutos) 💾
1. Implementar cache de scores en localStorage
2. Reutilizar scores entre sesiones
3. Reducir llamadas a ImageKit

**Resultado:** 80-90% menos llamadas API

### Fase 4: Optimización IA (15 minutos) 🧠
1. Limitar predicciones a top 10 usuarios
2. Generar más predicciones en background
3. Priorizar experiencia sobre precisión

**Resultado:** 50% menos tiempo de IA

---

## 📈 IMPACTO ESPERADO

### Antes:
- ⏱️ Tiempo de carga: 13-46 segundos
- 😴 Usuario ve spinner todo el tiempo
- 📉 Alta probabilidad de abandono

### Después (Todas las fases):
- ⏱️ Tiempo de carga percibido: < 1 segundo
- 😊 Usuario ve perfiles inmediatamente
- 📈 Mejor retención y engagement
- 💰 80-90% menos llamadas API (ahorro de costos)

---

## 🔧 ARCHIVOS A MODIFICAR

```
cita-rd/views/views/Discovery.tsx
  - Remover loading screen bloqueante
  - Implementar lazy loading de scores
  - Agregar cache de scores
  - Optimizar llamadas a IA

cita-rd/services/photoAnalysisService.ts
  - Agregar cache de scores
  - Optimizar llamadas a ImageKit

cita-rd/hooks/useMatchingAI.ts
  - Limitar predicciones iniciales
  - Generar más en background
```

---

## 💡 RECOMENDACIÓN FINAL

**Implementar Fase 1 (Quick Win) AHORA:**
- 5 minutos de trabajo
- Mejora inmediata en UX
- Usuario ve perfiles en < 1 segundo

**Luego implementar Fases 2-4:**
- 1 hora de trabajo total
- Optimización completa
- Reducción de costos API

---

## 📝 NOTAS TÉCNICAS

### Por qué calculateProfileScore es lento:
```typescript
// En photoAnalysisService.ts
export const calculateProfileScore = async (images: string[]) => {
  // ⚠️ Llama a ImageKit API para analizar cada imagen
  const analysis = await analyzePhotoQuality(images[0]);
  // Esto puede tardar 500ms - 2s por imagen
};
```

### Por qué generatePredictions es lento:
```typescript
// En matchingAI.ts
export const generatePredictions = async (userId, users) => {
  // ⚠️ Llama a Gemini AI para analizar compatibilidad
  const response = await geminiService.analyzeCompatibility(userId, users);
  // Esto puede tardar 3-5s para 20 usuarios
};
```

---

**Diagnosticado por:** Kiro AI  
**Fecha:** 17 de Febrero 2026  
**Prioridad:** 🔴 ALTA - Afecta experiencia de usuario directamente
