# Diagnóstico de Google Analytics - 11 Febrero 2026

## Problema Reportado

Google Analytics muestra 0 usuarios activos en tiempo real a pesar de tener un usuario conectado a la app.

## Causas Comunes

### 1. Retraso Normal de Google Analytics
Google Analytics en tiempo real puede tardar **2-5 minutos** en mostrar los datos. Esto es completamente normal.

### 2. Variable de Entorno No Configurada
El `VITE_GA_MEASUREMENT_ID` debe estar configurado en `.env.local`.

### 3. Ad Blockers
Los bloqueadores de anuncios (uBlock Origin, AdBlock, etc.) bloquean Google Analytics.

### 4. Navegación Privada/Incógnito
Algunos navegadores bloquean tracking en modo privado.

### 5. Configuración de Cookies
Las políticas de cookies del navegador pueden bloquear Analytics.

## Soluciones Implementadas

### 1. Actualización de analyticsService.ts

**Cambio realizado:**
```typescript
// ANTES
gtag('config', measurementId, {
  send_page_view: false, // Lo haremos manualmente
  anonymize_ip: true,
});

// DESPUÉS
gtag('config', measurementId, {
  send_page_view: true, // Enviar automáticamente
  anonymize_ip: true,
  cookie_flags: 'SameSite=None;Secure',
});

// Enviar evento inicial de carga
this.trackPageView(window.location.pathname, document.title);
```

**Beneficios:**
- Envío automático de page views
- Mejor configuración de cookies para cross-site tracking
- Evento inicial de carga para confirmar que Analytics está funcionando

### 2. Actualización de .env.example

Agregado:
```env
# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Cómo Verificar que Analytics Está Funcionando

### Opción 1: Consola del Navegador

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Network"
3. Filtra por "google-analytics" o "gtag"
4. Deberías ver requests a:
   - `https://www.googletagmanager.com/gtag/js`
   - `https://www.google-analytics.com/g/collect`

### Opción 2: Extensión de Chrome

Instala "Google Analytics Debugger" desde Chrome Web Store:
1. Activa la extensión
2. Recarga la página
3. Abre la consola
4. Verás logs detallados de todos los eventos de Analytics

### Opción 3: DebugView en Google Analytics

1. Ve a Google Analytics
2. Admin → DebugView
3. Abre la app con `?debug_mode=true` en la URL
4. Verás eventos en tiempo real en DebugView

## Pasos para Verificar la Configuración

### 1. Verificar Variable de Entorno

```bash
# En la raíz del proyecto cita-rd
cat .env.local | grep VITE_GA_MEASUREMENT_ID
```

Debe mostrar algo como:
```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 2. Verificar en el Código

Abre la consola del navegador y ejecuta:
```javascript
console.log(import.meta.env.VITE_GA_MEASUREMENT_ID);
```

Debe mostrar tu Measurement ID (G-XXXXXXXXXX).

### 3. Verificar que gtag Está Cargado

En la consola del navegador:
```javascript
console.log(typeof window.gtag);
// Debe mostrar: "function"

console.log(window.dataLayer);
// Debe mostrar un array con eventos
```

### 4. Enviar Evento de Prueba

En la consola del navegador:
```javascript
window.gtag('event', 'test_event', {
  test_param: 'test_value'
});
```

Luego verifica en Google Analytics → Tiempo Real → Eventos.

## Verificación en Google Analytics

### Tiempo Real

1. Ve a Google Analytics
2. Reportes → Tiempo Real → Resumen
3. Espera 2-5 minutos después de cargar la app
4. Deberías ver:
   - Usuarios activos
   - Vistas de página
   - Eventos

### DebugView (Recomendado para Testing)

1. Agrega `?debug_mode=true` a la URL de tu app
2. Ve a Admin → DebugView en Google Analytics
3. Verás eventos en tiempo real con detalles completos

## Comandos para Rebuild y Deploy

```bash
cd cita-rd

# Build con las nuevas variables
npm run build

# Deploy a Firebase Hosting
firebase deploy --only hosting
```

## Testing Local

Para probar localmente con Analytics:

```bash
# Asegúrate de tener .env.local configurado
npm run dev

# Abre en el navegador
# http://localhost:5173

# Verifica en la consola que gtag está cargado
```

## Checklist de Verificación

- [ ] Variable `VITE_GA_MEASUREMENT_ID` configurada en `.env.local`
- [ ] Build y deploy realizados después de configurar la variable
- [ ] Ad blocker desactivado en el navegador de prueba
- [ ] Esperado 2-5 minutos después de cargar la app
- [ ] Verificado en consola que `window.gtag` existe
- [ ] Verificado en Network tab que hay requests a Google Analytics
- [ ] Probado con DebugView activado (`?debug_mode=true`)

## Datos Esperados en Analytics

Una vez funcionando correctamente, deberías ver:

### Eventos Automáticos
- `page_view` - Cada vez que se carga una página
- `session_start` - Al iniciar sesión
- `first_visit` - Primera vez que un usuario visita

### Eventos Personalizados (Implementados)
- `app_open` - Al abrir la app
- `login` - Al iniciar sesión
- `register` - Al registrarse
- `profile_view` - Al ver un perfil
- `message_sent` - Al enviar un mensaje
- `match_created` - Al hacer match
- Y muchos más...

## Notas Importantes

1. **Retraso Normal**: Google Analytics en tiempo real NO es instantáneo. Puede tardar 2-5 minutos.

2. **Ad Blockers**: Son la causa #1 de Analytics no funcionando. Prueba en modo incógnito sin extensiones.

3. **Cookies de Terceros**: Algunos navegadores bloquean cookies de terceros por defecto (Safari, Firefox con protección mejorada).

4. **Producción vs Desarrollo**: Analytics funciona mejor en producción (HTTPS) que en desarrollo local.

5. **Usuarios Únicos**: Google Analytics filtra bots y tráfico sospechoso, lo que puede reducir el conteo.

## Solución Rápida

Si después de 5 minutos aún no ves datos:

1. **Desactiva Ad Blocker**
2. **Usa modo incógnito** (sin extensiones)
3. **Verifica la consola** para errores
4. **Usa DebugView** con `?debug_mode=true`
5. **Espera 5 minutos más** (en serio, puede tardar)

## Contacto y Soporte

Si el problema persiste después de seguir todos los pasos:

1. Verifica que el Measurement ID sea correcto en Firebase Console
2. Revisa que la propiedad de Analytics esté activa
3. Confirma que no hay filtros activos en Analytics que excluyan tu tráfico
4. Verifica que la zona horaria en Analytics sea correcta

---

**Fecha:** 11 de Febrero 2026
**Estado:** Mejoras implementadas - Esperando verificación
**Próximo paso:** Build, deploy y esperar 5 minutos para verificar
