# ✅ Cómo Verificar Analytics con DebugView - 16 Feb 2026

## ¿Por Qué DebugView?

El informe de "Tiempo Real" puede ser poco confiable y tener retrasos de hasta 5 minutos. **DebugView muestra eventos en 1-2 segundos**, por lo que es la mejor forma de verificar que Analytics funciona.

---

## Paso 1: Acceder a DebugView

### 1.1 Abrir Google Analytics

Ve a: https://analytics.google.com/

### 1.2 Seleccionar tu Propiedad

En el selector de propiedades (arriba a la izquierda), busca y selecciona la propiedad asociada a `G-3J77FEQ9PN`

### 1.3 Ir a DebugView

1. En el menú lateral izquierdo, haz scroll hasta abajo
2. Haz clic en **"Admin"** (ícono de engranaje)
3. En la columna de "Propiedad" (columna del medio), busca **"DebugView"**
4. Haz clic en **"DebugView"**

**Ruta completa:** Admin → Propiedad → DebugView

---

## Paso 2: Activar Modo Debug en tu App

### 2.1 Abrir App con Parámetro Debug

Abre tu app con esta URL exacta:

```
https://citard-fbc26.web.app?debug_mode=true
```

**IMPORTANTE:** Debe incluir `?debug_mode=true` al final

### 2.2 Mantener la Pestaña Abierta

- Mantén la pestaña de la app abierta
- Mantén la pestaña de DebugView abierta
- Colócalas lado a lado para ver ambas

---

## Paso 3: Ver Eventos en Tiempo Real

### 3.1 Esperar Unos Segundos

Después de abrir la app con `?debug_mode=true`, espera **10-30 segundos**.

### 3.2 Verificar en DebugView

En la página de DebugView deberías ver:

1. **Tu dispositivo aparece en la lista** (arriba)
2. **Eventos apareciendo en tiempo real** (centro)
3. **Detalles de cada evento** (derecha)

### 3.3 Eventos que Deberías Ver

Al abrir la app:
- ✅ `session_start` - Sesión iniciada
- ✅ `page_view` - Vista de página
- ✅ `app_open` - App abierta

Al navegar:
- ✅ `page_view` - Cada vez que cambias de vista

Al hacer swipe:
- ✅ `profile_swipe_right` - Swipe derecha
- ✅ `profile_swipe_left` - Swipe izquierda

Al enviar mensaje:
- ✅ `message_sent` - Mensaje enviado

---

## Paso 4: Interpretar los Resultados

### ✅ SI VES EVENTOS EN DEBUGVIEW

**¡Felicidades! Analytics está funcionando perfectamente.**

Esto significa:
- El código está correcto ✅
- Los eventos se están enviando ✅
- Google los está recibiendo ✅
- Solo necesitas esperar 24-48 horas para ver datos históricos

**Próximos pasos:**
1. Cierra DebugView
2. Usa la app normalmente
3. Mañana revisa el informe de "Tiempo Real"
4. En 2-3 días revisa los informes completos

### ❌ SI NO VES EVENTOS EN DEBUGVIEW

**Hay un problema con la configuración.**

Posibles causas:
1. Ad blocker está bloqueando gtag.js
2. Measurement ID incorrecto
3. Propiedad no configurada correctamente
4. Dominio no autorizado

**Soluciones:**
1. Desactiva ad blocker temporalmente
2. Verifica el Measurement ID en `.env.local`
3. Verifica la configuración de la propiedad en Google Analytics
4. Revisa la guía de diagnóstico detallado

---

## Paso 5: Verificación Adicional (Opcional)

### 5.1 Verificar en DevTools

1. Abre tu app: https://citard-fbc26.web.app?debug_mode=true
2. Abre DevTools (F12)
3. Ve a la pestaña **Console**
4. Busca logs como:

```
📊 [ANALYTICS] Analytics initialized
📊 [ANALYTICS] Event: session_start
📊 [ANALYTICS] Event: app_open
```

**Si ves estos logs:** El código está ejecutándose correctamente ✅

### 5.2 Verificar Network Requests

1. En DevTools, ve a la pestaña **Network**
2. Filtra por "gtag"
3. Deberías ver: `gtag/js?id=G-3J77FEQ9PN` (Status: 200)
4. Filtra por "collect"
5. Deberías ver múltiples requests a `g/collect` (Status: 200)

**Si ves estos requests:** Los eventos se están enviando a Google ✅

---

## Troubleshooting Común

### Problema: "No veo mi dispositivo en DebugView"

**Solución:**
1. Asegúrate de usar `?debug_mode=true` en la URL
2. Espera 30 segundos
3. Recarga la página de DebugView
4. Recarga la app con `?debug_mode=true`

### Problema: "Veo eventos pero no en Tiempo Real"

**Esto es normal.** DebugView es para desarrollo. Los eventos aparecerán en "Tiempo Real" después de 1-5 minutos, y en los informes completos después de 24-48 horas.

### Problema: "Ad blocker está bloqueando gtag.js"

**Solución:**
1. Desactiva tu ad blocker para `citard-fbc26.web.app`
2. O usa modo incógnito sin extensiones
3. Recarga la página

### Problema: "Measurement ID incorrecto"

**Verificación:**
```bash
# En la carpeta cita-rd
cat .env.local | grep GA_MEASUREMENT_ID
```

Debe mostrar: `VITE_GA_MEASUREMENT_ID=G-3J77FEQ9PN`

**Si es diferente:**
1. Corrige el ID
2. `npm run build`
3. `firebase deploy --only hosting`

---

## Resumen Visual

```
┌─────────────────────────────────────────────────────────┐
│  1. Abrir Google Analytics                              │
│     https://analytics.google.com/                       │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  2. Admin → DebugView                                   │
│     (Menú lateral izquierdo, abajo)                     │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  3. Abrir App con Debug Mode                            │
│     https://citard-fbc26.web.app?debug_mode=true        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  4. Esperar 10-30 segundos                              │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  5. Ver Eventos en DebugView                            │
│     ✅ session_start                                    │
│     ✅ page_view                                        │
│     ✅ app_open                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Conclusión

**DebugView es la prueba definitiva.** Si ves eventos ahí, tu Analytics está funcionando perfectamente y solo necesitas esperar a que Google procese los datos históricos.

**Tiempo de espera:**
- DebugView: 1-2 segundos ✅
- Tiempo Real: 1-5 minutos
- Informes completos: 24-48 horas

---

**Fecha:** 16 de Febrero 2026  
**Measurement ID:** G-3J77FEQ9PN  
**URL de prueba:** https://citard-fbc26.web.app?debug_mode=true
