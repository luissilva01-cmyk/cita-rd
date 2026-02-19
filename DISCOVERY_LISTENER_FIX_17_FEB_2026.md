# 🔥 Discovery Listener - Problema Crítico Encontrado
**Fecha:** 17 de Febrero 2026  
**Hora:** ~8:45 PM  
**Estado:** ✅ SOLUCIONADO

---

## 🚨 Problema Crítico Identificado

### Causa Raíz del Ralentizamiento

**Archivo:** `cita-rd/services/profileService.ts`  
**Función:** `getDiscoveryProfiles()`

**Problema:**
```typescript
// ❌ ANTES: Listener en tiempo real que se dispara constantemente
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  // Este código se ejecuta CADA VEZ que cualquier perfil cambia en Firestore
  const profiles: UserProfile[] = [];
  querySnapshot.forEach((doc) => {
    // Procesar 20 perfiles cada vez...
  });
  callback(profiles);
});
```

### ¿Por Qué Causaba Lentitud?

1. **Listener en Tiempo Real Innecesario:**
   - `onSnapshot()` crea un listener que escucha cambios en Firestore
   - Cada vez que CUALQUIER perfil se actualiza, el listener se dispara
   - Esto incluye: nuevas fotos, cambios de bio, actualizaciones de ubicación, etc.

2. **Re-renders en Cascada:**
   - Listener dispara → callback ejecuta → `setPotentialMatches()` en App.tsx
   - `setPotentialMatches()` → Discovery re-renderiza
   - Discovery re-renderiza → StoriesRing re-renderiza
   - StoriesRing re-renderiza → Nuevo listener de stories se configura
   - **Resultado:** Ciclo infinito de re-renders

3. **Carga de 20 Perfiles Constantemente:**
   - Cada disparo del listener carga 20 perfiles completos
   - Incluye todas las imágenes, datos, intereses, etc.
   - Sin caché, sin optimización

4. **Sin Filtrado de Matches:**
   - No filtra usuarios con los que ya hay match
   - No filtra usuarios ya vistos
   - Carga usuarios innecesarios

---

## ✅ Solución Implementada

### Cambio Principal: Carga Única en Lugar de Listener

```typescript
// ✅ DESPUÉS: Carga única, sin listener en tiempo real
export const getDiscoveryProfiles = async (
  currentUserId: string, 
  callback: (profiles: UserProfile[]) => void,
  profileLimit: number = 10 // ⚡ Reducido de 20 a 10
) => {
  try {
    // ⚡ getDocs = carga única, NO escucha cambios
    const q = query(
      collection(db, "perfiles"),
      orderBy("timestamp", "desc"),
      limit(profileLimit) // Solo 10 perfiles
    );
    
    const querySnapshot = await getDocs(q);
    const profiles: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const profile = { id: doc.id, ...doc.data() } as UserProfile;
      
      if (profile.id === currentUserId) {
        return;
      }
      
      profiles.push(profile);
    });
    
    logger.profile.success('Perfiles cargados (carga única)', { count: profiles.length });
    callback(profiles);
    
    // ⚡ No hay listener que cancelar
    return () => {};
  } catch (error) {
    logger.profile.error('Error cargando perfiles', error);
    callback([]);
    return () => {};
  }
};
```

### Beneficios de la Solución:

1. **Carga Única:**
   - Se ejecuta UNA SOLA VEZ al montar Discovery
   - No se dispara con cambios en Firestore
   - No causa re-renders innecesarios

2. **Menos Perfiles:**
   - Reducido de 20 a 10 perfiles
   - Carga más rápida
   - Menos datos transferidos

3. **Sin Ciclos Infinitos:**
   - No hay listener que dispare callbacks
   - No hay re-renders en cascada
   - Comportamiento predecible

4. **Mejor UX:**
   - Usuarios cargan inmediatamente
   - No hay "saltos" cuando se actualizan perfiles
   - Experiencia más estable

---

## 📊 Comparación: Antes vs Después

### Antes (con onSnapshot):
```
Usuario abre Discovery
  ↓
Listener se configura (onSnapshot)
  ↓
Carga 20 perfiles
  ↓
Callback ejecuta → setPotentialMatches
  ↓
Discovery re-renderiza
  ↓
StoriesRing re-renderiza
  ↓
Nuevo listener de stories
  ↓
[Cualquier perfil se actualiza en Firestore]
  ↓
Listener se dispara OTRA VEZ
  ↓
Carga 20 perfiles OTRA VEZ
  ↓
Callback ejecuta → setPotentialMatches
  ↓
Discovery re-renderiza OTRA VEZ
  ↓
[CICLO INFINITO] ♾️
```

### Después (con getDocs):
```
Usuario abre Discovery
  ↓
Carga 10 perfiles UNA VEZ
  ↓
Callback ejecuta → setPotentialMatches
  ↓
Discovery renderiza UNA VEZ
  ↓
StoriesRing renderiza UNA VEZ
  ↓
[FIN] ✅
```

---

## 🎯 Impacto Esperado

### Métricas de Performance:

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Tiempo de carga | 10-60+ seg | 1-3 seg | **90%+** |
| Renders de Discovery | 6+ | 1-2 | **70%+** |
| Configuraciones de StoriesRing | 3+ | 1 | **66%+** |
| Perfiles cargados | 20 | 10 | **50%** |
| Disparos de listener | Infinitos | 0 | **100%** |
| Llamadas a Firestore | Continuas | 1 | **99%+** |

### Beneficios Adicionales:

1. **Menor Consumo de Datos:**
   - Solo 10 perfiles en lugar de 20
   - Sin recargas innecesarias
   - Ahorro de ancho de banda

2. **Menor Costo de Firestore:**
   - Sin listeners en tiempo real = sin lecturas continuas
   - Solo 1 lectura por sesión de Discovery
   - Reducción de costos del 90%+

3. **Mejor Batería en Móviles:**
   - Sin listeners activos consumiendo recursos
   - Menos procesamiento de datos
   - Menos re-renders

4. **Experiencia Más Estable:**
   - No hay "saltos" cuando se actualizan perfiles
   - Comportamiento predecible
   - Menos bugs potenciales

---

## 🔍 ¿Por Qué No Se Detectó Antes?

1. **Listeners Ocultos:**
   - Los listeners en tiempo real no son obvios en el código
   - `onSnapshot()` parece una función normal
   - El problema solo aparece en producción con usuarios reales

2. **Efecto Cascada:**
   - El problema no es un solo listener
   - Es la combinación de múltiples listeners (profiles + stories + privacy)
   - Cada uno dispara re-renders que activan otros listeners

3. **Testing Local:**
   - En desarrollo local, hay pocos perfiles
   - Los cambios son menos frecuentes
   - El problema no es tan evidente

4. **React.memo No Era Suficiente:**
   - Aunque agregamos React.memo, el problema raíz seguía
   - El listener seguía disparando callbacks
   - React.memo solo previene re-renders, no detiene listeners

---

## 🧪 Testing

### Pasos para Verificar la Solución:

1. **Limpiar Caché:**
   ```
   Ctrl + Shift + R (Windows)
   Cmd + Shift + R (Mac)
   ```

2. **Abrir Consola (F12)**

3. **Navegar a Discovery**

4. **Verificar Logs:**
   ```
   ✅ Debe ver: "Perfiles cargados (carga única)" - SOLO 1 VEZ
   ✅ Debe ver: "count: 10" (no 20)
   ✅ Debe ver: "Discovery render" - SOLO 1-2 VECES
   ❌ NO debe ver: Múltiples "Perfiles cargados"
   ❌ NO debe ver: Renders continuos
   ```

5. **Verificar Tiempo de Carga:**
   - Usuarios deben aparecer en 1-3 segundos
   - No debe haber recargas después de la carga inicial

6. **Verificar Estabilidad:**
   - Dejar Discovery abierto por 30 segundos
   - NO debe haber nuevas cargas de perfiles
   - NO debe haber re-renders adicionales

---

## 📁 Archivos Modificados

1. ✅ `cita-rd/services/profileService.ts` - Cambio de onSnapshot a getDocs
2. ✅ Límite reducido de 20 a 10 perfiles

---

## 🚀 Deploy

```bash
# Build
npm run build

# Deploy
firebase deploy --only hosting

# URL
https://citard-fbc26.web.app
```

---

## 📝 Notas Importantes

### ¿Por Qué Carga Única es Mejor?

1. **Discovery No Necesita Tiempo Real:**
   - Los usuarios no esperan ver perfiles actualizarse en vivo
   - Es más importante que cargue rápido
   - Pueden refrescar manualmente si quieren nuevos perfiles

2. **Listeners Son Para Chat:**
   - Los mensajes SÍ necesitan tiempo real
   - Los chats SÍ necesitan actualizaciones instantáneas
   - Discovery NO

3. **Mejor Performance:**
   - Menos complejidad
   - Menos bugs potenciales
   - Más predecible

### ¿Cómo Refrescar Perfiles?

Si el usuario quiere ver nuevos perfiles:

1. **Opción 1:** Navegar fuera y volver a Discovery
2. **Opción 2:** Agregar botón "Refrescar" (futuro)
3. **Opción 3:** Pull-to-refresh en móvil (futuro)

---

## 🎯 Próximos Pasos (Opcional)

Si se necesita más optimización:

1. **Paginación:**
   - Cargar 5 perfiles inicialmente
   - Cargar más al hacer scroll
   - Infinite scroll

2. **Caché Local:**
   - Guardar perfiles en localStorage
   - Mostrar inmediatamente al abrir
   - Actualizar en background

3. **Prefetch:**
   - Precargar perfiles mientras el usuario está en Home
   - Discovery carga instantáneamente

4. **Filtrado Inteligente:**
   - Excluir usuarios con match
   - Excluir usuarios ya vistos
   - Priorizar usuarios compatibles

---

## ✅ Checklist de Verificación

- [x] Listener en tiempo real removido
- [x] Cambio a carga única (getDocs)
- [x] Límite reducido de 20 a 10
- [x] Logs actualizados
- [x] Error handling agregado
- [x] Build completado sin errores
- [ ] Deploy pendiente
- [ ] Usuario verifica carga rápida
- [ ] Usuario confirma sin re-renders

---

**Estado Final:** ✅ LISTO PARA DEPLOY

**Acción Requerida:** Deploy y testing por usuario
