# 🧪 GUÍA DE TESTING - ERROR HANDLING

**Fecha:** 12 de Febrero 2026  
**Duración estimada:** 30 minutos  
**Objetivo:** Verificar que el sistema de error handling funcione correctamente

---

## 📋 PREPARACIÓN

### Antes de empezar:
1. Asegúrate de tener el servidor corriendo: `npm run dev`
2. Abre DevTools (F12)
3. Ten 2 pestañas abiertas para testing de retry

---

## 🧪 TEST 1: OFFLINE DETECTION (10 minutos)

### 1.1 Banner Aparece Cuando Pierdes Conexión

**Pasos:**
1. Abrir http://localhost:5173
2. Iniciar sesión
3. Abrir DevTools → Network
4. Cambiar a "Offline"

**Resultado esperado:**
- [ ] Banner rojo aparece en la parte superior
- [ ] Texto: "Sin conexión a internet"
- [ ] Subtexto: "Verifica tu conexión e intenta de nuevo"
- [ ] Botón "Reintentar" visible
- [ ] Animación suave al aparecer

**Resultado real:** ___________

---

### 1.2 Banner Desaparece Cuando Reconectas

**Pasos:**
1. Con el banner visible (offline)
2. Cambiar Network a "Online"

**Resultado esperado:**
- [ ] Banner desaparece con animación suave
- [ ] App vuelve a funcionar normalmente
- [ ] No hay errores en consola

**Resultado real:** ___________

---

### 1.3 Botón Reintentar Funciona

**Pasos:**
1. Cambiar a "Offline"
2. Esperar a que aparezca el banner
3. Hacer clic en "Reintentar"

**Resultado esperado:**
- [ ] Página se recarga
- [ ] Banner desaparece si hay conexión
- [ ] Banner permanece si sigue offline

**Resultado real:** ___________

---

## 🔄 TEST 2: RETRY LOGIC (10 minutos)

### 2.1 Retry en Carga de Perfil

**Pasos:**
1. Abrir DevTools → Console
2. Cambiar Network a "Slow 3G"
3. Recargar la página
4. Observar logs en consola

**Resultado esperado:**
- [ ] Ver logs: "Retrying getUserProfile, attempt 1"
- [ ] Ver logs: "Retrying getUserProfile, attempt 2"
- [ ] Ver logs: "Retrying getUserProfile, attempt 3"
- [ ] Perfil carga exitosamente después de reintentos
- [ ] Usuario no ve errores

**Logs encontrados:**
```
(Copiar logs aquí)
```

**Resultado real:** ___________

---

### 2.2 Retry en Envío de Mensaje

**Pasos:**
1. Ir a un chat
2. Cambiar Network a "Slow 3G"
3. Enviar un mensaje
4. Observar logs en consola

**Resultado esperado:**
- [ ] Ver logs: "Retrying sendMessage, attempt X"
- [ ] Mensaje se envía después de reintentos
- [ ] No hay errores visibles al usuario

**Resultado real:** ___________

---

### 2.3 Retry con Exponential Backoff

**Pasos:**
1. Observar los tiempos entre reintentos en consola
2. Verificar que aumenten progresivamente

**Resultado esperado:**
- [ ] Intento 1 → Espera ~1 segundo
- [ ] Intento 2 → Espera ~2 segundos
- [ ] Intento 3 → Espera ~4 segundos
- [ ] Patrón de exponential backoff visible

**Resultado real:** ___________

---

## 🛡️ TEST 3: ERROR BOUNDARIES (10 minutos)

### 3.1 Error en Sección No Rompe Toda la App

**Pasos:**
1. Navegar a Discovery
2. Navegar a Messages
3. Navegar a Profile
4. Verificar que todo funcione

**Resultado esperado:**
- [ ] Todas las vistas cargan correctamente
- [ ] Navegación fluida entre vistas
- [ ] No hay pantallas blancas
- [ ] No hay errores en consola

**Resultado real:** ___________

---

### 3.2 Fallback de Error Se Muestra Correctamente

**Nota:** Este test requiere forzar un error. Solo para desarrollo.

**Pasos (opcional):**
1. Agregar `throw new Error('Test')` en Discovery.tsx
2. Navegar a Discovery
3. Observar el fallback

**Resultado esperado:**
- [ ] Muestra mensaje: "Algo salió mal en esta sección"
- [ ] Botón "Reintentar" visible
- [ ] Resto de la app funciona
- [ ] No rompe toda la aplicación

**Resultado real:** ___________

---

### 3.3 Botón Reintentar en Error Boundary

**Pasos (si hiciste 3.2):**
1. Con el error visible
2. Hacer clic en "Reintentar"
3. Remover el error forzado
4. Verificar que se recupere

**Resultado esperado:**
- [ ] Componente se resetea
- [ ] Vista se recarga
- [ ] Funciona correctamente después

**Resultado real:** ___________

---

## 🌐 TEST 4: INTEGRACIÓN COMPLETA (5 minutos)

### 4.1 Escenario Real: Red Inestable

**Pasos:**
1. Cambiar Network a "Slow 3G"
2. Navegar entre vistas
3. Intentar cargar perfil
4. Intentar enviar mensaje
5. Cambiar a "Online"

**Resultado esperado:**
- [ ] App sigue funcionando con red lenta
- [ ] Retry automático funciona
- [ ] No hay errores visibles
- [ ] Experiencia fluida para el usuario

**Resultado real:** ___________

---

### 4.2 Escenario Real: Pérdida de Conexión

**Pasos:**
1. Usar la app normalmente
2. Desconectar WiFi físicamente
3. Intentar hacer acciones
4. Reconectar WiFi
5. Verificar que todo vuelva a funcionar

**Resultado esperado:**
- [ ] Banner aparece inmediatamente
- [ ] Usuario sabe que está offline
- [ ] Al reconectar, todo funciona
- [ ] No se pierden datos

**Resultado real:** ___________

---

## 📊 RESUMEN DE TESTING

### Tests Completados:
- [ ] 1.1 Banner aparece offline
- [ ] 1.2 Banner desaparece online
- [ ] 1.3 Botón reintentar funciona
- [ ] 2.1 Retry en carga de perfil
- [ ] 2.2 Retry en envío de mensaje
- [ ] 2.3 Exponential backoff
- [ ] 3.1 Error no rompe app
- [ ] 3.2 Fallback se muestra (opcional)
- [ ] 3.3 Botón reintentar (opcional)
- [ ] 4.1 Red inestable
- [ ] 4.2 Pérdida de conexión

**Total:** _____ / 11 (o 9 sin opcionales)

---

## 🐛 BUGS ENCONTRADOS

### Bug #1
**Descripción:** ___________  
**Severidad:** Alta / Media / Baja  
**Pasos para reproducir:**
1. ___________
2. ___________

---

### Bug #2
**Descripción:** ___________  
**Severidad:** Alta / Media / Baja  
**Pasos para reproducir:**
1. ___________
2. ___________

---

## ✅ CHECKLIST FINAL

### Funcionalidades Verificadas:
- [ ] OfflineBanner aparece/desaparece correctamente
- [ ] Retry logic funciona en operaciones críticas
- [ ] Exponential backoff implementado
- [ ] Error boundaries protegen la app
- [ ] Experiencia de usuario fluida
- [ ] No hay errores en consola
- [ ] Logs de retry visibles en desarrollo

### Recomendación:
- [ ] ✅ Error handling funciona correctamente
- [ ] ⚠️ Funciona con advertencias (especificar)
- [ ] ❌ Necesita correcciones (especificar)

**Notas adicionales:**
___________

---

## 🎯 PRÓXIMOS PASOS

Si todo funciona:
1. ✅ Marcar Fase 3 como completada
2. ✅ Proceder con deploy a producción
3. ✅ Monitorear errores en producción

Si hay bugs:
1. Documentar en detalle
2. Corregir bugs críticos
3. Re-testear
4. Proceder con deploy

---

**Tester:** ___________  
**Fecha:** 12 de Febrero 2026  
**Duración:** ___________ minutos  
**Navegador:** ___________  
**Resultado:** ✅ / ⚠️ / ❌
