# 🔍 Verificar Google Analytics - AHORA

**Fecha:** 10 de Febrero 2026  
**Measurement ID:** G-3J77FEQ9PN  
**URL:** https://citard-fbc26.web.app

---

## ✅ PASO 1: Verificar en Tiempo Real

### Opción A: Google Analytics Console

1. **Abre Google Analytics:**
   - Ve a: https://analytics.google.com/
   - Inicia sesión con tu cuenta

2. **Selecciona la Propiedad:**
   - Busca "Ta' Pa' Ti - Producción"
   - Haz clic para seleccionarla

3. **Ve a Tiempo Real:**
   - En el menú lateral, haz clic en "Informes"
   - Luego haz clic en "Tiempo real"

4. **Abre la App:**
   - En otra pestaña, abre: https://citard-fbc26.web.app
   - Navega por la app (login, swipe, etc.)

5. **Verifica:**
   - Deberías ver tu visita aparecer en tiempo real
   - Deberías ver los eventos que generas (page_view, login, etc.)

---

## ✅ PASO 2: Verificar en Consola del Navegador

1. **Abre la App:**
   - Ve a: https://citard-fbc26.web.app

2. **Abre DevTools:**
   - Presiona F12 (o Ctrl+Shift+I)
   - O clic derecho → "Inspeccionar"

3. **Ve a la Pestaña Console:**
   - Busca logs que empiecen con `📊 [ANALYTICS]`

4. **Logs Esperados:**
   ```
   📊 [ANALYTICS] Analytics initialized {measurementId: "G-3J77FEQ9PN"}
   📊 [ANALYTICS] Event: app_open {session_id: "...", timestamp: ...}
   📊 [ANALYTICS] Event: page_view {page_path: "/", page_title: "..."}
   ```

---

## ✅ PASO 3: Verificar Network Requests

1. **En DevTools, ve a la Pestaña Network:**
   - Haz clic en "Network" (Red)

2. **Filtra por "google":**
   - En el campo de búsqueda, escribe "google"

3. **Requests Esperados:**
   - `gtag/js?id=G-3J77FEQ9PN` - Script de Google Analytics
   - `g/collect` - Envío de eventos

4. **Verifica Status:**
   - Todos los requests deben tener status 200 (OK)

---

## 🎯 EVENTOS A PROBAR

### 1. App Open (Automático)
- **Acción:** Simplemente abre la app
- **Evento esperado:** `app_open`

### 2. Page View (Automático)
- **Acción:** Navega entre páginas
- **Evento esperado:** `page_view`

### 3. Login
- **Acción:** Inicia sesión
- **Evento esperado:** `login`

### 4. Profile View
- **Acción:** Ve tu perfil o el de otro usuario
- **Evento esperado:** `profile_view`

### 5. Swipe
- **Acción:** Haz swipe en Discovery
- **Evento esperado:** `profile_swipe_right` o `profile_swipe_left`

### 6. Message Sent
- **Acción:** Envía un mensaje
- **Evento esperado:** `message_sent`

### 7. Story Created
- **Acción:** Crea una story
- **Evento esperado:** `story_created`

---

## 🐛 TROUBLESHOOTING

### No Veo Eventos en Google Analytics

**Posibles Causas:**
1. **Espera unos minutos:** Los datos pueden tardar 1-2 minutos en aparecer
2. **Verifica la propiedad:** Asegúrate de estar viendo "Ta' Pa' Ti - Producción"
3. **Hard refresh:** Presiona Ctrl+Shift+R para recargar sin caché
4. **Verifica consola:** Busca errores en la consola del navegador

### No Veo Logs en la Consola

**Posibles Causas:**
1. **Filtros activos:** Desactiva todos los filtros en la consola
2. **Nivel de log:** Asegúrate de que "Info" esté habilitado
3. **Hard refresh:** Presiona Ctrl+Shift+R

### Errores en Network Tab

**Si ves errores 403 o 404:**
1. Verifica que el Measurement ID sea correcto: `G-3J77FEQ9PN`
2. Verifica que la propiedad de Google Analytics esté activa
3. Espera unos minutos y vuelve a intentar

---

## 📊 QUÉ ESPERAR EN GOOGLE ANALYTICS

### Tiempo Real (Primeras Horas)
- Usuarios activos ahora: 1+ (tú)
- Eventos por segundo: Variable
- Páginas vistas: Múltiples
- Eventos personalizados: Los que generes

### Primeros Días
- Usuarios activos diarios (DAU)
- Sesiones por usuario
- Duración promedio de sesión
- Páginas por sesión

### Primera Semana
- Usuarios nuevos vs recurrentes
- Tasa de retención D1, D7
- Eventos más populares
- Páginas más visitadas

---

## 🎯 PRÓXIMOS PASOS DESPUÉS DE VERIFICAR

### Si Todo Funciona ✅
1. Crear dashboards personalizados
2. Configurar alertas para eventos clave
3. Definir KPIs a monitorear
4. Compartir acceso con el equipo (si aplica)

### Si Hay Problemas ❌
1. Revisar logs de consola para errores
2. Verificar que el Measurement ID sea correcto
3. Verificar que la propiedad de GA4 esté activa
4. Contactar soporte si el problema persiste

---

## 📚 RECURSOS ÚTILES

### Consolas
- [Google Analytics](https://analytics.google.com/)
- [Firebase Console](https://console.firebase.google.com/project/citard-fbc26)
- [App en Producción](https://citard-fbc26.web.app)

### Documentación
- [ANALYTICS_CONFIGURADO_10_FEB_2026.md](./ANALYTICS_CONFIGURADO_10_FEB_2026.md)
- [ANALYTICS_SETUP_GUIDE.md](./ANALYTICS_SETUP_GUIDE.md)
- [Google Analytics 4 Help](https://support.google.com/analytics/)

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [ ] Abrir Google Analytics Console
- [ ] Ver sección "Tiempo real"
- [ ] Abrir app en producción
- [ ] Ver mi visita en tiempo real
- [ ] Ver eventos en consola del navegador
- [ ] Ver requests en Network tab
- [ ] Probar login (evento `login`)
- [ ] Probar swipe (evento `profile_swipe_right`)
- [ ] Probar enviar mensaje (evento `message_sent`)
- [ ] Confirmar que todos los eventos aparecen en GA4

---

**¡Verifica ahora que Analytics está funcionando correctamente! 📊✅**
