# 📊 Guía Rápida: Verificar Google Analytics

**Fecha:** 16 de Febrero 2026  
**Measurement ID:** G-3J77FEQ9PN  
**Estado:** ✅ Configurado y Listo

---

## ✅ TU ANALYTICS YA ESTÁ CONFIGURADO

Tu aplicación ya tiene Google Analytics 4 completamente configurado e implementado. Solo necesitas verificar que esté funcionando correctamente.

---

## 🔍 PASO 1: Verificar en Tiempo Real (2 minutos)

### ⚠️ IMPORTANTE: Retraso de Datos

Google Analytics tiene un retraso natural en mostrar datos:
- **Tiempo Real:** 1-5 minutos de retraso
- **Informes Estándar:** 24-48 horas de retraso
- **Datos Completos:** Hasta 72 horas

**Si acabas de configurar Analytics, espera 24-48 horas para ver datos completos.**

### Opción A: DebugView (Verificación Inmediata)

1. Ve a: https://analytics.google.com/
2. Selecciona tu propiedad "Ta' Pa' Ti"
3. Admin → **DebugView**
4. Abre la app con `?debug_mode=true` en la URL
5. Verás eventos en tiempo real (1-2 segundos de retraso)

### Opción B: Tiempo Real (Después de 30-60 minutos)

1. Abre Google Analytics

Ve a: https://analytics.google.com/

2. Selecciona tu Propiedad

Busca y selecciona "Ta' Pa' Ti" o la propiedad asociada al ID `G-3J77FEQ9PN`

3. Ve a Informes en Tiempo Real

- Haz clic en "Informes" en el menú lateral
- Luego haz clic en "Tiempo real"

4. Abre tu App

En otra pestaña, abre: https://citard-fbc26.web.app

5. Verifica

Deberías ver:
- Tu visita aparecer en tiempo real
- Eventos como `page_view`, `app_open`
- Ubicación geográfica
- Dispositivo utilizado

---

## 🎯 PASO 2: Probar Eventos Específicos

### Eventos Automáticos (Ya Funcionan)

1. **App Open** - Se envía al abrir la app
2. **Page View** - Se envía al cambiar de página
3. **Session Start** - Se envía al iniciar sesión

### Eventos que Puedes Probar

1. **Login:**
   - Inicia sesión en la app
   - Evento: `login`

2. **Profile View:**
   - Ve a tu perfil o el de otro usuario
   - Evento: `profile_view`

3. **Swipe:**
   - Haz swipe en Discovery
   - Evento: `profile_swipe_right` o `profile_swipe_left`

4. **Send Message:**
   - Envía un mensaje en un chat
   - Evento: `message_sent`

5. **Create Story:**
   - Crea una story
   - Evento: `story_created`

---

## 🐛 PASO 3: Verificar en Consola del Navegador (✅ Ya Funciona)

### 1. Abre DevTools

- Presiona F12 (o Ctrl+Shift+I en Windows)
- O clic derecho → "Inspeccionar"

### 2. Ve a la Pestaña Console

Busca logs como:

```
📊 [ANALYTICS] Analytics initialized {measurementId: "G-3J77FEQ9PN"}
📊 [ANALYTICS] Event: session_start
📊 [ANALYTICS] Event: app_open
📊 [ANALYTICS] Event: page_view
📊 [ANALYTICS] User ID set {userId: "je1HdwssPigxtDyHKZpkXNMOGY32"}
```

**✅ Si ves estos logs, Analytics está funcionando correctamente.** Solo necesitas esperar 24-48 horas para ver los datos en los informes de Google Analytics.

### 3. Ve a la Pestaña Network

- Filtra por "google" o "analytics"
- Deberías ver requests a:
  - `gtag/js?id=G-3J77FEQ9PN` (Status: 200)
  - `g/collect` (envío de eventos, Status: 200)

---

## 📊 EVENTOS QUE SE TRACKEAN AUTOMÁTICAMENTE

### Autenticación
- ✅ `login` - Usuario inicia sesión
- ✅ `register` - Usuario se registra
- ✅ `logout` - Usuario cierra sesión

### Perfil
- ✅ `profile_view` - Vista de perfil
- ✅ `profile_edit` - Edición de perfil
- ✅ `photo_upload` - Subida de foto
- ✅ `photo_delete` - Eliminación de foto

### Discovery & Matching
- ✅ `profile_swipe_left` - Swipe izquierda
- ✅ `profile_swipe_right` - Swipe derecha
- ✅ `super_like` - Super like
- ✅ `match_created` - Match creado

### Chat
- ✅ `message_sent` - Mensaje enviado
- ✅ `message_received` - Mensaje recibido
- ✅ `voice_message_sent` - Mensaje de voz
- ✅ `video_message_sent` - Video mensaje
- ✅ `photo_message_sent` - Foto en chat

### Stories
- ✅ `story_created` - Story creada
- ✅ `story_viewed` - Story vista
- ✅ `story_reaction` - Reacción a story

### Engagement
- ✅ `app_open` - App abierta
- ✅ `session_start` - Sesión iniciada
- ✅ `session_end` - Sesión terminada
- ✅ `page_view` - Vista de página

---

## 🎯 MÉTRICAS CLAVE A MONITOREAR

### Primeros Días

1. **Usuarios Activos:**
   - Usuarios activos diarios (DAU)
   - Usuarios activos mensuales (MAU)

2. **Engagement:**
   - Duración promedio de sesión
   - Páginas por sesión
   - Eventos por usuario

3. **Conversión:**
   - Tasa de registro
   - Tasa de completar perfil
   - Tasa de match

### Primera Semana

1. **Retención:**
   - % usuarios que regresan al día siguiente (D1)
   - % usuarios activos después de 7 días (D7)

2. **Comportamiento:**
   - Swipes por sesión
   - Mensajes por usuario
   - Stories creadas

---

## 🚨 TROUBLESHOOTING

### No Veo Datos en Google Analytics

**Solución 1: Espera 24-48 horas**
- Google Analytics tiene un retraso natural en procesar datos
- Los datos en tiempo real pueden tardar 30-60 minutos en aparecer
- Los informes completos tardan 24-48 horas
- **Esto es completamente normal para propiedades nuevas**

**Solución 2: Usa DebugView para Verificación Inmediata**
- Admin → DebugView
- Abre la app con `?debug_mode=true`
- Verás eventos en 1-2 segundos

**Solución 3: Verifica la Propiedad**
- Asegúrate de estar viendo la propiedad correcta
- Busca el Measurement ID: `G-3J77FEQ9PN`

**Solución 4: Hard Refresh**
- Presiona Ctrl+Shift+R para recargar sin caché
- Cierra y vuelve a abrir la app

### No Veo Logs en la Consola

**Solución 1: Verifica Filtros**
- Desactiva todos los filtros en la consola
- Asegúrate de que "Info" esté habilitado

**Solución 2: Verifica Variables de Entorno**
- El archivo `.env.local` debe tener:
  ```
  VITE_GA_MEASUREMENT_ID=G-3J77FEQ9PN
  ```

---

## 📈 DASHBOARDS RECOMENDADOS

### Dashboard 1: Engagement Diario

**Métricas:**
- Usuarios activos
- Sesiones
- Duración promedio de sesión
- Eventos por usuario

**Dimensiones:**
- Fecha
- Dispositivo
- Ubicación

### Dashboard 2: Conversión

**Métricas:**
- Registros
- Perfiles completados
- Matches creados
- Mensajes enviados

**Dimensiones:**
- Fuente de tráfico
- Fecha de registro
- Cohorte

### Dashboard 3: Retención

**Métricas:**
- Usuarios nuevos
- Usuarios recurrentes
- Tasa de retención D1, D7, D30

**Dimensiones:**
- Cohorte de registro
- Fecha

---

## 🎓 RECURSOS ADICIONALES

### Documentación Completa
- [ANALYTICS_SETUP_GUIDE.md](./ANALYTICS_SETUP_GUIDE.md) - Guía completa de configuración
- [ANALYTICS_CONFIGURADO_10_FEB_2026.md](./ANALYTICS_CONFIGURADO_10_FEB_2026.md) - Historial de configuración

### Consolas
- [Google Analytics](https://analytics.google.com/)
- [Firebase Console](https://console.firebase.google.com/project/citard-fbc26)
- [App en Producción](https://citard-fbc26.web.app)

### Soporte
- [Google Analytics Help](https://support.google.com/analytics/)
- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)

---

## ✅ CHECKLIST RÁPIDO

- [ ] Abrir Google Analytics
- [ ] Ver sección "Tiempo real"
- [ ] Abrir app en producción
- [ ] Ver mi visita en tiempo real
- [ ] Ver eventos en consola del navegador
- [ ] Probar login (evento `login`)
- [ ] Probar swipe (evento `profile_swipe_right`)
- [ ] Confirmar que eventos aparecen en GA4

---

## 🎯 PRÓXIMOS PASOS

### Hoy
1. ✅ Verificar que Analytics funciona
2. ✅ Ver datos en tiempo real
3. ✅ Probar eventos principales

### Esta Semana
1. Crear dashboards personalizados
2. Configurar alertas para eventos clave
3. Definir KPIs a monitorear

### Este Mes
1. Analizar patrones de uso
2. Identificar puntos de fricción
3. Optimizar basado en datos

---

**¡Tu Analytics está listo y funcionando! 📊✅**

Solo abre Google Analytics y verifica que los datos estén llegando.
