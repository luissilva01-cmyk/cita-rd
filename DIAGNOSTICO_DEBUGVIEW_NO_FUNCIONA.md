# 🔍 Diagnóstico: DebugView No Muestra Eventos - 16 Feb 2026

## Problema

DebugView muestra: "Esperando eventos de depuración" y no aparecen eventos.

Esto significa que el parámetro `?debug_mode=true` no está activando el modo debug correctamente.

---

## Verificación Inmediata: Logs de Consola

Necesitamos verificar si los eventos se están enviando aunque DebugView no los muestre.

### Paso 1: Abrir App y DevTools

1. Abre esta URL: `https://citard-fbc26.web.app/app`
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña **Console**

### Paso 2: Buscar Logs de Analytics

Busca logs que empiecen con:
- `📊 ANALYTICS`
- `✅ [ANALYTICS]`
- `🔧 [ANALYTICS]`

**Comparte aquí todos los logs que veas con estos emojis.**

---

## Posibles Causas

### 1. Ad Blocker Bloqueando gtag.js

**Síntoma:** No ves ningún log de Analytics en consola

**Solución:**
1. Desactiva temporalmente tu ad blocker
2. O usa modo incógnito sin extensiones
3. Recarga la página

### 2. Código No Desplegado Correctamente

**Síntoma:** Ves logs antiguos sin los nuevos logs con emojis

**Solución:** Necesitamos verificar que el último deploy se completó correctamente

### 3. Variable de Entorno No Cargada

**Síntoma:** Ves un error sobre Measurement ID undefined

**Solución:** Verificar que `.env.local` tiene la variable correcta

---

## Verificación de Network Requests

### Paso 1: Abrir Network Tab

1. En DevTools, ve a la pestaña **Network**
2. Recarga la página (Ctrl+R o Cmd+R)

### Paso 2: Buscar gtag.js

1. En el filtro, escribe: `gtag`
2. Deberías ver: `gtag/js?id=G-3J77FEQ9PN`
3. **Status debe ser:** 200

**Si no ves este request:** Ad blocker está bloqueando o hay un error en el código

### Paso 3: Buscar Requests de Collect

1. En el filtro, escribe: `collect`
2. Deberías ver múltiples requests a: `google-analytics.com/g/collect`
3. **Status debe ser:** 200

**Si ves estos requests con status 200:** Los eventos SÍ se están enviando a Google, solo DebugView no los muestra

---

## Qué Hacer Según los Resultados

### ✅ Si Ves Logs de Analytics en Consola

**Significa:** El código funciona correctamente

**Problema:** DebugView no está detectando el modo debug

**Solución:** Los eventos se están enviando correctamente, solo necesitas esperar 24-48 horas para ver datos en los informes. DebugView es opcional.

### ✅ Si Ves Requests a google-analytics.com/g/collect

**Significa:** Los eventos están llegando a Google

**Problema:** DebugView no está detectando el modo debug

**Solución:** Los eventos se están enviando correctamente, solo necesitas esperar 24-48 horas. DebugView es opcional.

### ❌ Si NO Ves Logs NI Requests

**Significa:** Hay un problema con el código o ad blocker

**Solución:** Necesitamos revisar el código y verificar el deploy

---

## Comandos de Verificación

### Ver Último Deploy

```bash
cd cita-rd
firebase hosting:channel:list
```

### Ver Logs de Build

```bash
cd cita-rd
type dist\index.html | findstr "gtag"
```

Debería mostrar el script de gtag con el Measurement ID.

### Verificar Variable de Entorno

```bash
cd cita-rd
type .env.local | findstr GA_MEASUREMENT_ID
```

Debe mostrar: `VITE_GA_MEASUREMENT_ID=G-3J77FEQ9PN`

---

## Alternativa: Verificar Sin DebugView

Si DebugView no funciona, podemos verificar de otras formas:

### 1. Logs de Consola

Los logs con emoji 📊 confirman que el código funciona.

### 2. Network Requests

Los requests a `google-analytics.com/g/collect` con status 200 confirman que los eventos llegan a Google.

### 3. Esperar 24-48 Horas

Si los logs y requests funcionan, los datos aparecerán en los informes en 24-48 horas.

---

## Próximos Pasos

1. **Ahora:** Abre la app y comparte los logs de consola
2. **Verifica:** Network tab para ver si hay requests a google-analytics.com
3. **Comparte:** Captura de pantalla de Console y Network tab
4. **Decide:** Según los resultados, determinamos si hay un problema real o solo DebugView no funciona

---

## Importante

**DebugView es solo una herramienta de verificación.** Si los logs de consola y los network requests muestran que los eventos se envían, Analytics funciona correctamente aunque DebugView no muestre nada.

---

**Fecha:** 16 de Febrero 2026  
**Measurement ID:** G-3J77FEQ9PN  
**Acción:** Verificar logs de consola y network requests

