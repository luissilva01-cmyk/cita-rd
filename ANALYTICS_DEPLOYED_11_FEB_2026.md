# Analytics Desplegado - 11 Febrero 2026 ✅

## Deploy Completado

**URL de Producción:** https://citard-fbc26.web.app

**Cambios Desplegados:**
- ✅ `send_page_view: true` - Envío automático de page views
- ✅ `cookie_flags: 'SameSite=None;Secure'` - Mejor configuración de cookies
- ✅ Evento inicial de carga al inicializar Analytics
- ✅ Variable `VITE_GA_MEASUREMENT_ID` agregada a `.env.example`

## ⏰ IMPORTANTE: Esperar 2-5 Minutos

Google Analytics en tiempo real **NO es instantáneo**. Después de cargar la app, espera entre 2-5 minutos antes de verificar en Google Analytics.

## Cómo Verificar que Funciona

### Paso 1: Verificar en la Consola del Navegador

1. Abre https://citard-fbc26.web.app
2. Abre la consola del navegador (F12)
3. Ve a la pestaña "Console"
4. Busca mensajes como:
   ```
   [Analytics] Analytics initialized
   [Analytics] Event: app_open
   [Analytics] Event: page_view
   ```

### Paso 2: Verificar Requests de Red

1. En la consola (F12), ve a la pestaña "Network"
2. Filtra por "google" o "gtag"
3. Deberías ver requests a:
   - `https://www.googletagmanager.com/gtag/js`
   - `https://www.google-analytics.com/g/collect`

### Paso 3: Verificar que gtag Está Cargado

En la consola del navegador, ejecuta:
```javascript
console.log(typeof window.gtag);
// Debe mostrar: "function"

console.log(window.dataLayer);
// Debe mostrar un array con eventos
```

### Paso 4: Enviar Evento de Prueba

En la consola del navegador:
```javascript
window.gtag('event', 'test_event', {
  test_param: 'verificacion_manual'
});
```

Luego verifica en Google Analytics → Tiempo Real → Eventos.

## Verificar en Google Analytics

### Opción 1: Tiempo Real (Esperar 2-5 minutos)

1. Ve a Google Analytics
2. Reportes → Tiempo Real → Resumen
3. **ESPERA 2-5 MINUTOS** después de cargar la app
4. Deberías ver:
   - Usuarios activos
   - Vistas de página
   - Eventos (app_open, page_view, etc.)

### Opción 2: DebugView (Recomendado)

1. Abre la app con `?debug_mode=true` en la URL:
   ```
   https://citard-fbc26.web.app?debug_mode=true
   ```
2. Ve a Google Analytics
3. Admin → DebugView
4. Verás eventos en tiempo real con detalles completos

## Checklist de Verificación

- [ ] Abrir https://citard-fbc26.web.app
- [ ] **Desactivar Ad Blocker** (uBlock Origin, AdBlock, etc.)
- [ ] Verificar en consola que `window.gtag` existe
- [ ] Verificar en Network tab que hay requests a Google Analytics
- [ ] **Esperar 2-5 minutos**
- [ ] Verificar en Google Analytics → Tiempo Real
- [ ] (Opcional) Probar con DebugView usando `?debug_mode=true`

## Causas Comunes de "0 Usuarios"

### 1. Ad Blockers (Causa #1)
Los bloqueadores de anuncios bloquean Google Analytics. Prueba en:
- Modo incógnito sin extensiones
- Otro navegador sin ad blocker
- Desactivando temporalmente el ad blocker

### 2. No Esperar Suficiente Tiempo
Google Analytics puede tardar hasta 5 minutos en mostrar datos. Ten paciencia.

### 3. Variable de Entorno No Configurada
Verifica que `VITE_GA_MEASUREMENT_ID` esté en `.env.local` de producción.

### 4. Cookies Bloqueadas
Algunos navegadores bloquean cookies de terceros por defecto:
- Safari con "Prevent Cross-Site Tracking"
- Firefox con "Enhanced Tracking Protection"

### 5. Navegación Privada
El modo incógnito puede bloquear tracking en algunos navegadores.

## Eventos que Deberías Ver

Una vez funcionando, verás estos eventos en Analytics:

### Eventos Automáticos
- `page_view` - Cada vez que se carga una página
- `session_start` - Al iniciar sesión
- `first_visit` - Primera vez que un usuario visita

### Eventos Personalizados
- `app_open` - Al abrir la app
- `login` - Al iniciar sesión
- `register` - Al registrarse
- `profile_view` - Al ver un perfil
- `message_sent` - Al enviar un mensaje
- `match_created` - Al hacer match
- `story_created` - Al crear una story
- `notification_permission_granted` - Al aceptar notificaciones

## Solución Rápida

Si después de 5 minutos aún no ves datos:

1. ✅ **Desactiva Ad Blocker**
2. ✅ **Usa modo incógnito** (sin extensiones)
3. ✅ **Verifica la consola** para errores
4. ✅ **Usa DebugView** con `?debug_mode=true`
5. ✅ **Espera 5 minutos más** (en serio, puede tardar)

## Verificar Variable de Entorno

Para verificar que la variable está configurada en producción:

1. Abre https://citard-fbc26.web.app
2. Abre la consola del navegador
3. Ejecuta:
   ```javascript
   console.log(import.meta.env.VITE_GA_MEASUREMENT_ID);
   ```
4. Debe mostrar tu Measurement ID (G-XXXXXXXXXX)

Si muestra `undefined`, necesitas configurar la variable en Firebase Hosting o en tu proceso de build.

## Próximos Pasos

1. ✅ Abrir la app en producción
2. ✅ Desactivar ad blocker
3. ✅ Verificar en consola que gtag está cargado
4. ✅ **Esperar 5 minutos**
5. ✅ Verificar en Google Analytics → Tiempo Real
6. ✅ Si no funciona, usar DebugView con `?debug_mode=true`

## Documentación Completa

Para más detalles, consulta:
- `ANALYTICS_DIAGNOSTICO_11_FEB_2026.md` - Diagnóstico completo
- `ANALYTICS_SETUP_GUIDE.md` - Guía de configuración

---

**Fecha:** 11 de Febrero 2026  
**Estado:** ✅ Desplegado en producción  
**URL:** https://citard-fbc26.web.app  
**Próximo paso:** Esperar 5 minutos y verificar en Google Analytics
