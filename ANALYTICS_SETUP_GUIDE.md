# 📊 Guía de Configuración de Analytics y Monitoreo - Ta' Pa' Ti

**Fecha:** 10 de Febrero 2026  
**Estado:** ✅ Implementado - Pendiente Configuración

---

## 🎯 RESUMEN

Sistema completo de Analytics y Error Tracking implementado para Ta' Pa' Ti. Incluye:

1. **Google Analytics 4** - Tracking de eventos y comportamiento de usuarios
2. **Error Tracking Service** - Captura automática de errores
3. **Custom Analytics Hooks** - Tracking simplificado en componentes

---

## 📋 PASO 1: CONFIGURAR GOOGLE ANALYTICS 4

### 1.1 Crear Propiedad en Google Analytics

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Haz clic en "Admin" (⚙️) en la esquina inferior izquierda
3. En la columna "Cuenta", selecciona o crea una cuenta
4. En la columna "Propiedad", haz clic en "Crear propiedad"
5. Completa los datos:
   - **Nombre de la propiedad:** Ta' Pa' Ti
   - **Zona horaria:** (GMT-04:00) Atlantic Time (Santo Domingo)
   - **Moneda:** Peso dominicano (DOP)
6. Haz clic en "Siguiente"
7. Completa información del negocio:
   - **Sector:** Tecnología
   - **Tamaño de la empresa:** Pequeña (1-10 empleados)
   - **Objetivos:** Generar clientes potenciales, Aumentar el engagement
8. Haz clic en "Crear"
9. Acepta los términos de servicio

### 1.2 Configurar Flujo de Datos Web

1. Selecciona "Web" como plataforma
2. Completa los datos:
   - **URL del sitio web:** https://citard-fbc26.web.app
   - **Nombre del flujo:** Ta' Pa' Ti Web
3. Haz clic en "Crear flujo"
4. **IMPORTANTE:** Copia el **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 1.3 Agregar Measurement ID a la App

1. Abre el archivo `cita-rd/.env.local`
2. Busca la línea `VITE_GA_MEASUREMENT_ID=`
3. Pega tu Measurement ID:
   ```env
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. Guarda el archivo

### 1.4 Rebuild y Deploy

```bash
cd cita-rd
npm run build
firebase deploy --only hosting
```

---

## 📊 PASO 2: VERIFICAR QUE FUNCIONA

### 2.1 Verificación en Tiempo Real

1. Ve a Google Analytics
2. Haz clic en "Informes" → "Tiempo real"
3. Abre tu app en producción: https://citard-fbc26.web.app
4. Deberías ver tu visita en tiempo real

### 2.2 Verificación en Consola del Navegador

1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca logs como:
   ```
   📊 [ANALYTICS] Analytics initialized
   📊 [ANALYTICS] Event: app_open
   📊 [ANALYTICS] Event: page_view
   ```

---

## 🎯 EVENTOS QUE SE TRACKEAN AUTOMÁTICAMENTE

### Autenticación
- `login` - Usuario inicia sesión
- `register` - Usuario se registra
- `logout` - Usuario cierra sesión

### Perfil
- `profile_view` - Vista de perfil
- `profile_edit` - Edición de perfil
- `photo_upload` - Subida de foto
- `photo_delete` - Eliminación de foto

### Discovery & Matching
- `profile_swipe_left` - Swipe izquierda (no me gusta)
- `profile_swipe_right` - Swipe derecha (me gusta)
- `super_like` - Super like
- `match_created` - Match creado

### Chat
- `message_sent` - Mensaje enviado
- `message_received` - Mensaje recibido
- `voice_message_sent` - Mensaje de voz enviado
- `video_message_sent` - Video mensaje enviado
- `photo_message_sent` - Foto enviada en chat

### Stories
- `story_created` - Story creada
- `story_viewed` - Story vista
- `story_reaction` - Reacción a story

### Notificaciones
- `notification_permission_granted` - Permiso concedido
- `notification_permission_denied` - Permiso denegado
- `notification_received` - Notificación recibida
- `notification_clicked` - Notificación clickeada

### Engagement
- `app_open` - App abierta
- `session_start` - Sesión iniciada
- `session_end` - Sesión terminada
- `page_view` - Vista de página

### Errores
- `error_occurred` - Error capturado
- `api_error` - Error de API

---

## 🔧 PASO 3: USAR ANALYTICS EN TU CÓDIGO

### 3.1 Usar el Hook useAnalytics

```typescript
import { useAnalytics } from '../hooks/useAnalytics';

function MyComponent() {
  const { trackSwipe, trackMatch, trackMessage } = useAnalytics();

  const handleSwipeRight = (profileId: string) => {
    trackSwipe('right', profileId);
    // ... resto del código
  };

  const handleMatch = (matchId: string, profileId: string) => {
    trackMatch(matchId, profileId);
    // ... resto del código
  };

  return (
    // ... tu componente
  );
}
```

### 3.2 Trackear Eventos Personalizados

```typescript
import { analyticsService } from '../services/analyticsService';

// Trackear evento personalizado
analyticsService.trackEvent('custom_event' as any, {
  custom_param: 'value',
  another_param: 123,
});

// Trackear conversión
analyticsService.trackConversion('purchase', 9.99);

// Trackear timing (performance)
analyticsService.trackTiming('api', 'load_profiles', 1500);
```

---

## 🚨 PASO 4: ERROR TRACKING

### 4.1 Captura Automática

El sistema captura automáticamente:
- Errores no manejados (`window.onerror`)
- Promesas rechazadas no manejadas
- Errores de React (Error Boundary)

### 4.2 Captura Manual

```typescript
import { errorTrackingService } from '../services/errorTrackingService';

try {
  // Código que puede fallar
  await someRiskyOperation();
} catch (error) {
  errorTrackingService.captureError(error as Error, {
    context: 'Some Operation',
    severity: 'high',
    userId: currentUser.id,
  });
}
```

### 4.3 Ver Errores Capturados

```typescript
import { errorTrackingService } from '../services/errorTrackingService';

// Obtener todos los errores
const errors = errorTrackingService.getErrors();

// Obtener estadísticas
const stats = errorTrackingService.getErrorStats();
console.log('Total errors:', stats.total);
console.log('By severity:', stats.bySeverity);
console.log('Recent errors:', stats.recent);
```

---

## 📈 PASO 5: CONFIGURAR DASHBOARDS EN GOOGLE ANALYTICS

### 5.1 Eventos Clave a Monitorear

1. **Engagement:**
   - Usuarios activos diarios (DAU)
   - Usuarios activos mensuales (MAU)
   - Duración promedio de sesión
   - Páginas por sesión

2. **Conversión:**
   - Tasa de registro
   - Tasa de completar perfil
   - Tasa de match
   - Tasa de envío de mensajes

3. **Retención:**
   - Usuarios que regresan
   - Frecuencia de uso
   - Tiempo entre sesiones

### 5.2 Crear Informe Personalizado

1. Ve a "Explorar" en Google Analytics
2. Haz clic en "Crear exploración"
3. Selecciona "Exploración libre"
4. Agrega dimensiones:
   - Nombre del evento
   - Página
   - Dispositivo
5. Agrega métricas:
   - Recuento de eventos
   - Usuarios
   - Sesiones
6. Guarda el informe

---

## 🎯 PASO 6: MÉTRICAS CLAVE (KPIs)

### KPIs Iniciales para Beta

1. **Activación:**
   - % de usuarios que completan perfil
   - % de usuarios que suben foto
   - Tiempo promedio para completar perfil

2. **Engagement:**
   - Swipes por sesión
   - Mensajes enviados por usuario
   - Stories creadas por usuario

3. **Retención:**
   - % de usuarios que regresan al día siguiente
   - % de usuarios activos después de 7 días
   - % de usuarios activos después de 30 días

4. **Conversión:**
   - Tasa de match (matches / swipes)
   - Tasa de conversación (mensajes / matches)
   - Tasa de respuesta

---

## 🔐 PASO 7: PRIVACIDAD Y GDPR

### 7.1 Configuración de Privacidad

El sistema ya está configurado con:
- ✅ Anonimización de IP (`anonymize_ip: true`)
- ✅ No se envían datos personales sensibles
- ✅ User ID hasheado

### 7.2 Consentimiento de Cookies

**IMPORTANTE:** Antes del lanzamiento público, debes:
1. Agregar banner de consentimiento de cookies
2. Permitir que usuarios rechacen tracking
3. Actualizar Política de Privacidad

---

## 🚀 PASO 8: INTEGRACIÓN CON SENTRY (OPCIONAL)

Para error tracking más avanzado, puedes integrar Sentry:

### 8.1 Instalar Sentry

```bash
npm install @sentry/react @sentry/tracing
```

### 8.2 Configurar Sentry

```typescript
// En App.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### 8.3 Actualizar errorTrackingService

```typescript
// En errorTrackingService.ts
private sendToErrorService(errorReport: ErrorReport) {
  if (window.Sentry) {
    window.Sentry.captureException(new Error(errorReport.message), {
      level: errorReport.severity,
      contexts: { error: errorReport },
    });
  }
}
```

---

## 📊 PASO 9: FIREBASE PERFORMANCE MONITORING

Firebase Performance ya está incluido en tu proyecto:

### 9.1 Activar en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/project/citard-fbc26)
2. Haz clic en "Performance" en el menú lateral
3. Haz clic en "Comenzar"
4. Espera unos minutos para que se recopilen datos

### 9.2 Métricas Automáticas

Firebase Performance trackea automáticamente:
- Tiempo de carga de la página
- Tiempo de respuesta de red
- Tiempo de renderizado

---

## 🎓 RECURSOS ADICIONALES

### Documentación
- [Google Analytics 4 Docs](https://support.google.com/analytics/answer/9304153)
- [Firebase Performance](https://firebase.google.com/docs/perf-mon)
- [Sentry Docs](https://docs.sentry.io/)

### Tutoriales
- [GA4 para Principiantes](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
- [Análisis de Eventos en GA4](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

- [x] Servicio de Analytics creado
- [x] Servicio de Error Tracking creado
- [x] Hook useAnalytics creado
- [x] Integración en App.tsx
- [x] Integración en ErrorBoundary
- [x] Eventos automáticos configurados
- [ ] Google Analytics 4 configurado
- [ ] Measurement ID agregado a .env.local
- [ ] Build y deploy realizados
- [ ] Verificación en tiempo real
- [ ] Dashboards configurados
- [ ] KPIs definidos

---

## 🎯 PRÓXIMOS PASOS

1. **Inmediato:**
   - Configurar Google Analytics 4
   - Agregar Measurement ID
   - Deploy y verificar

2. **Primera Semana:**
   - Monitorear eventos en tiempo real
   - Ajustar tracking según necesidad
   - Crear dashboards personalizados

3. **Primer Mes:**
   - Analizar KPIs
   - Identificar puntos de fricción
   - Optimizar basado en datos

---

**¡Analytics y Monitoreo listos para usar! 📊**

