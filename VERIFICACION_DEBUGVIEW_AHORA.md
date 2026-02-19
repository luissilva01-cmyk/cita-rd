# 🔍 Verificación con DebugView - AHORA

## Situación Actual

- ✅ Cuenta de Analytics creada hace 1 semana
- ✅ Measurement ID: G-3J77FEQ9PN
- ⚠️ Código implementado recientemente (últimos días)
- ⚠️ Aviso: "La recogida de datos no está activada"

**El aviso aparece porque el código no estaba en producción antes.** Ahora que está implementado, necesitamos verificar que funciona.

---

## Verificación Inmediata con DebugView

### Paso 1: Abrir DebugView

1. Ve a: https://analytics.google.com/
2. Asegúrate de estar en la propiedad correcta (ID: 524271886)
3. En el menú lateral izquierdo, haz clic en **"Admin"** (abajo)
4. En la columna del medio ("Propiedad"), haz clic en **"DebugView"**

### Paso 2: Abrir App en Modo Debug

Abre esta URL exacta en una nueva pestaña:

```
https://citard-fbc26.web.app/app?debug_mode=true
```

**IMPORTANTE:** Debe incluir `?debug_mode=true` al final

### Paso 3: Verificar Eventos

Después de abrir la app con `?debug_mode=true`:

1. Espera 10-30 segundos
2. En la página de DebugView deberías ver:
   - Tu dispositivo aparece en la lista de dispositivos activos
   - Eventos apareciendo en tiempo real:
     - `session_start`
     - `page_view`
     - `app_open`
     - `first_visit` (si es la primera vez con debug mode)

### Paso 4: Interactuar con la App

Mientras mantienes DebugView abierto:

1. Navega por la app (Home, Matches, Messages, Profile)
2. Cada navegación debería generar un evento `page_view`
3. Los eventos deberían aparecer en DebugView en 1-2 segundos

---

## Qué Esperar

### ✅ Si DebugView Muestra Eventos

**¡Perfecto! Analytics funciona correctamente.**

Esto significa:
- El código está bien implementado
- Los eventos se están enviando a Google
- El aviso desaparecerá en 24-48 horas automáticamente
- Los datos comenzarán a aparecer en los informes

**Acción:** No hacer nada más, solo esperar.

### ❌ Si DebugView NO Muestra Eventos

**Hay un problema que necesitamos resolver.**

Posibles causas:
1. Ad blocker está bloqueando gtag.js
2. No usaste `?debug_mode=true` en la URL
3. Hay un error en la implementación

**Acción:** Revisar logs de consola y network requests.

---

## Verificación Adicional: Logs de Consola

Mientras tienes la app abierta con `?debug_mode=true`:

1. Abre DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca logs con emoji 📊

**Deberías ver:**
```
✅ [ANALYTICS] gtag.js script loaded successfully
📊 ANALYTICS Event: session_start
📊 ANALYTICS Analytics initialized
📊 ANALYTICS Event: page_view
📊 ANALYTICS Event: app_open
```

Si ves estos logs, confirma que el código funciona.

---

## Verificación Adicional: Network Requests

1. En DevTools, ve a la pestaña **Network**
2. Filtra por "gtag"
3. Deberías ver: `gtag/js?id=G-3J77FEQ9PN` (Status: 200)
4. Filtra por "collect"
5. Deberías ver múltiples requests a `google-analytics.com/g/collect` (Status: 200)

Si ves estos requests, confirma que los eventos llegan a Google.

---

## Timeline Esperado

### Hoy (16 Feb)
- ✅ DebugView muestra eventos inmediatamente
- ⏳ "Tiempo Real" puede tardar 1-5 minutos
- ⚠️ Aviso amarillo aún visible

### Mañana (17 Feb)
- ✅ "Tiempo Real" debería mostrar usuarios activos
- ⏳ Informes estándar comenzando a mostrar datos
- ⚠️ Aviso amarillo posiblemente aún visible

### 18-19 Feb
- ✅ Todos los informes con datos completos
- ✅ Aviso amarillo desaparecido
- ✅ Sistema completamente funcional

---

## Comandos Útiles

### Ver Measurement ID en código:
```bash
cd cita-rd
type .env.local | findstr GA_MEASUREMENT_ID
```

### Ver logs en producción:
1. Abre: https://citard-fbc26.web.app/app
2. DevTools (F12) → Console
3. Busca logs con emoji 📊

---

## Próximos Pasos

1. **Ahora:** Abre DebugView y la app con `?debug_mode=true`
2. **Verifica:** Que los eventos aparezcan en DebugView
3. **Comparte:** Captura de pantalla de DebugView mostrando eventos
4. **Espera:** 24-48 horas para que el aviso desaparezca

---

## Recursos

- [DebugView Documentation](https://support.google.com/analytics/answer/7201382)
- [Debug Mode for Web](https://developers.google.com/analytics/devguides/collection/ga4/debug)

---

**Fecha:** 16 de Febrero 2026  
**Measurement ID:** G-3J77FEQ9PN  
**URL de prueba:** https://citard-fbc26.web.app/app?debug_mode=true  
**Acción:** Verificar con DebugView ahora

