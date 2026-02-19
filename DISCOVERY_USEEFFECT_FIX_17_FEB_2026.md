# Discovery useEffect Fix - 17 Feb 2026

## 🐛 PROBLEMA

Los logs de `getDiscoveryProfiles` NO aparecían en consola cuando la app abría directamente en Discovery. Los usuarios veían datos antiguos (5 usuarios) pero no se cargaban perfiles nuevos.

### Síntomas
- ✅ Analytics funcionando correctamente
- ✅ Stories funcionando correctamente  
- ❌ Discovery mostraba 5 usuarios antiguos
- ❌ NO aparecían logs: 🔍, 📊, 🔥, ✅ getDocs completado
- ❌ El `useEffect` en `App.tsx` NO se ejecutaba

### Causa Raíz
El `useEffect` en `App.tsx` tenía esta dependencia:
```typescript
useEffect(() => {
  // ... código de carga de perfiles
}, [currentUser, discoveryRefreshTrigger]);
```

**PROBLEMA:** Cuando la app abre directamente en Discovery:
1. `currentUser` ya está cargado (desde el primer `useEffect` de autenticación)
2. El `useEffect` solo se ejecuta cuando `currentUser` **CAMBIA**
3. Como `currentUser` no cambia (ya estaba cargado), el `useEffect` nunca se ejecuta
4. Los perfiles nunca se cargan
5. Discovery muestra datos antiguos del estado inicial

## ✅ SOLUCIÓN

Separar en **DOS useEffects independientes**:

### 1. useEffect de Montaje (Carga Inicial)
```typescript
useEffect(() => {
  if (!currentUser) return;
  
  // Cargar perfiles cuando currentUser se carga por primera vez
  setupDiscoveryListener();
  
}, [currentUser?.id]); // ⚡ Solo depende del ID
```

**Ventaja:** Se ejecuta cuando `currentUser.id` está disponible, incluso si `currentUser` ya estaba cargado.

### 2. useEffect de Trigger (Recargas Manuales)
```typescript
useEffect(() => {
  if (discoveryRefreshTrigger === 0 || !currentUser) return;
  
  // Recargar perfiles cuando el usuario navega a Discovery
  reloadProfiles();
  
}, [discoveryRefreshTrigger]); // ⚡ Solo depende del trigger
```

**Ventaja:** Se ejecuta solo cuando el usuario navega manualmente a Discovery, no en la carga inicial.

## 📝 CAMBIOS REALIZADOS

### Archivo: `cita-rd/App.tsx`

**ANTES:**
```typescript
useEffect(() => {
  // Un solo useEffect con ambas dependencias
}, [currentUser, discoveryRefreshTrigger]);
```

**DESPUÉS:**
```typescript
// useEffect 1: Carga inicial cuando currentUser se carga
useEffect(() => {
  // ... código de carga inicial
}, [currentUser?.id]);

// useEffect 2: Recargas manuales por navegación
useEffect(() => {
  if (discoveryRefreshTrigger === 0) return;
  // ... código de recarga
}, [discoveryRefreshTrigger]);
```

### Archivo: `cita-rd/views/views/Discovery.tsx`

**CAMBIO:** Removido import no usado de `getDiscoveryProfiles`
- Se había agregado en el intento anterior pero nunca se implementó el useEffect en Discovery
- La solución correcta es arreglar el useEffect en App.tsx, no duplicar la lógica en Discovery

## 🔍 LOGS ESPERADOS

Después del fix, al abrir Discovery deberías ver:

```
🚀 [MOUNT] Iniciando carga inicial de perfiles para Discovery
📡 [MOUNT] Llamando a getDiscoveryProfiles...
🔍 getDiscoveryProfiles iniciado
📊 Creando query de Firestore...
🔥 Ejecutando getDocs...
✅ getDocs completado { docsCount: 10 }
📄 Procesando perfil { id: 'xxx', name: 'Usuario 1' }
📄 Procesando perfil { id: 'yyy', name: 'Usuario 2' }
...
✅ Perfiles procesados { totalDocs: 10, profilesAfterFilter: 9 }
📞 Ejecutando callback con perfiles...
✅ [MOUNT] Callback de perfiles ejecutado { profileCount: 9 }
✅ [MOUNT] setPotentialMatches ejecutado { count: 9 }
```

## 🧪 TESTING

### Pasos para Verificar
1. Abrir https://citard-fbc26.web.app
2. Hacer **hard refresh** (Ctrl+Shift+R)
3. Abrir consola (F12)
4. La app debe abrir en Discovery (si el perfil está completo)
5. **DEBE ver logs** con prefijo `[MOUNT]`
6. Los perfiles deben cargar inmediatamente

### Navegación Manual
1. Navegar a otra vista (Home, Messages, etc.)
2. Navegar de vuelta a Discovery
3. **DEBE ver logs** con prefijo `[TRIGGER]`
4. Los perfiles deben recargarse

## 📊 PERFORMANCE

- ✅ Carga única con `getDocs()` (no listener en tiempo real)
- ✅ Límite de 10 perfiles (reducido de 20)
- ✅ Logs detallados para debugging
- ✅ Separación de concerns (mount vs trigger)

## 🚀 DEPLOY

```bash
npm run build
firebase deploy --only hosting
```

**URL:** https://citard-fbc26.web.app

## 📅 METADATA

- **Fecha:** 17 de Febrero 2026
- **Hora:** ~9:10 PM
- **Build:** `Discovery-BPXdDePc.js`
- **Archivos modificados:**
  - `cita-rd/App.tsx` - Separado useEffect en dos
  - `cita-rd/views/views/Discovery.tsx` - Removido import no usado

## 🎯 RESULTADO ESPERADO

- ✅ Los logs de `getDiscoveryProfiles` aparecen en consola
- ✅ Los perfiles se cargan inmediatamente al abrir Discovery
- ✅ Los perfiles se recargan al navegar a Discovery
- ✅ No más datos antiguos en Discovery
- ✅ Performance óptima con carga única
