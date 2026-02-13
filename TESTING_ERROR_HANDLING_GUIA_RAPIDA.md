# ⚡ GUÍA RÁPIDA - TESTING ERROR HANDLING

**Duración:** 15-20 minutos  
**Objetivo:** Verificar error handling funciona correctamente

---

## 🎯 ANTES DE EMPEZAR

1. ✅ Servidor corriendo: http://localhost:5173
2. ✅ Abrir DevTools (F12)
3. ✅ Tener sesión iniciada

---

## 📋 TESTS RÁPIDOS (15 minutos)

### TEST 1: OFFLINE BANNER (5 min)

#### Paso 1: Simular Offline
```
1. Abrir http://localhost:5173
2. F12 → Network tab
3. Cambiar dropdown a "Offline"
4. Observar si aparece banner rojo arriba
```

**¿Qué buscar?**
- ✅ Banner rojo aparece
- ✅ Dice "Sin conexión a internet"
- ✅ Tiene botón "Reintentar"

#### Paso 2: Volver Online
```
1. Network → Cambiar a "Online"
2. Observar si banner desaparece
```

**¿Qué buscar?**
- ✅ Banner desaparece automáticamente
- ✅ App vuelve a funcionar

---

### TEST 2: RETRY LOGIC (5 min)

#### Paso 1: Ver Logs de Retry
```
1. F12 → Console tab
2. Network → "Slow 3G"
3. Recargar página (Ctrl+R)
4. Observar logs en consola
```

**¿Qué buscar?**
- ✅ Logs: "Retrying getUserProfile, attempt 1"
- ✅ Logs: "Retrying getUserProfile, attempt 2"
- ✅ Perfil carga después de reintentos

#### Paso 2: Retry en Navegación
```
1. Mantener "Slow 3G"
2. Navegar entre vistas (Home, Discovery, Messages)
3. Observar comportamiento
```

**¿Qué buscar?**
- ✅ App sigue funcionando (aunque lento)
- ✅ No hay errores visibles
- ✅ Vistas cargan eventualmente

---

### TEST 3: ERROR BOUNDARIES (5 min)

#### Navegación Fluida
```
1. Network → "Online" (volver a normal)
2. Navegar a cada vista:
   - Home
   - Discovery
   - Messages
   - Matches
   - Profile
```

**¿Qué buscar?**
- ✅ Todas las vistas cargan
- ✅ No hay pantallas blancas
- ✅ No hay errores en consola

---

## 🎯 RESULTADO ESPERADO

### Si todo funciona:
- ✅ Banner aparece/desaparece con offline/online
- ✅ Logs de retry visibles en consola
- ✅ App funciona con red lenta
- ✅ Navegación fluida entre vistas

### Si algo falla:
- ❌ Banner no aparece → Documentar en resultados
- ❌ No hay logs de retry → Documentar
- ❌ Errores en consola → Copiar y documentar

---

## 📝 DOCUMENTAR RESULTADOS

Abrir: `TESTING_ERROR_HANDLING_RESULTADOS_12_FEB_2026.md`

Marcar cada test como:
- ✅ Funciona
- ⚠️ Funciona con advertencias
- ❌ No funciona

---

## ⚠️ LIMITACIÓN CONOCIDA

**DevTools "Offline" NO dispara eventos del navegador**

Esto significa:
- El banner puede NO aparecer con DevTools Offline
- Es una limitación técnica, no un bug
- Para testing real: Desconectar WiFi físicamente

**Alternativa:**
```
1. Desconectar WiFi del sistema
2. Observar banner aparece
3. Reconectar WiFi
4. Observar banner desaparece
```

---

## 🚀 DESPUÉS DEL TESTING

### Si todo funciona:
1. Completar documento de resultados
2. Marcar Fase 3 como completada
3. Listo para producción

### Si hay bugs:
1. Documentar en detalle
2. Reportar bugs encontrados
3. Decidir si son críticos o no

---

## 💡 TIPS

1. **Console logs:** Mantén la consola abierta todo el tiempo
2. **Network tab:** Útil para simular condiciones de red
3. **Slow 3G:** Mejor que Offline para ver retry logic
4. **Recargar página:** Ctrl+R para ver comportamiento inicial

---

**Tiempo estimado:** 15-20 minutos  
**Dificultad:** Fácil  
**Requisitos:** Navegador con DevTools

