# 🎯 ¿Cuál Logo Usar? - Guía Rápida

**Última actualización:** 27 de Febrero 2026

---

## 🚀 RESPUESTA RÁPIDA

**Para la mayoría de casos, usa:**
```tsx
<Logo size={50} variant="color" version="v2" />
```

**Por qué:** Es la versión más versátil, moderna y funciona en todos los tamaños.

---

## 📍 GUÍA POR UBICACIÓN

### 🏠 Landing Page (Hero Section)
```tsx
<Logo size={100} variant="color" version="v2" showText={true} />
```
**Razón:** Impacto visual + texto para reconocimiento de marca

---

### 📱 Navbar / Header
```tsx
<Logo size={45} variant="color" version="v2" />
```
**Razón:** Compacto, no ocupa mucho espacio, se ve profesional

---

### 🌙 Navbar con Fondo Oscuro
```tsx
<Logo size={45} variant="white" version="v2" />
```
**Razón:** Contraste perfecto en fondos oscuros

---

### 👣 Footer
```tsx
<Logo size={40} variant="color" version="v2" />
```
**Razón:** Tamaño discreto pero visible

---

### 📄 Páginas Internas
```tsx
<Logo size={50} variant="color" version="v2" />
```
**Razón:** Tamaño estándar para uso general

---

### 🎨 Splash Screen / Loading
```tsx
<Logo size={120} variant="color" version="v2" showText={true} />
```
**Razón:** Grande y centrado, con texto para reconocimiento

---

### 📧 Emails
```tsx
<Logo size={80} variant="color" version="v2" />
```
**Razón:** Visible pero no demasiado grande

---

### 🖼️ Favicon (en index.html)
```html
<link rel="icon" href="/logo-tapati-v2.svg" type="image/svg+xml">
```
**Razón:** SVG escala perfectamente en todos los tamaños

---

### 📱 PWA Icons (en manifest.json)
```json
{
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
**Razón:** Formatos estándar para PWA

---

## 🎨 GUÍA POR FONDO

### Fondo Claro (Blanco, Gris claro)
```tsx
<Logo variant="color" version="v2" />
```
**Razón:** El gradiente se ve perfecto en fondos claros

---

### Fondo Oscuro (Negro, Gris oscuro)
```tsx
<Logo variant="white" version="v2" />
```
**Razón:** Máximo contraste y visibilidad

---

### Fondo con Gradiente
```tsx
<Logo variant="white" version="v2" />
```
**Razón:** Blanco funciona mejor sobre gradientes

---

### Impresión / Documentos
```tsx
<Logo variant="black" version="v2" />
```
**Razón:** Negro sólido para impresión

---

## 📏 GUÍA POR TAMAÑO

### Muy Pequeño (16-32px)
```tsx
<Logo size={24} variant="color" version="v2" />
```
**Uso:** Favicon, iconos pequeños  
**Versión:** v2 (mejor legibilidad en tamaños pequeños)

---

### Pequeño (32-50px)
```tsx
<Logo size={40} variant="color" version="v2" />
```
**Uso:** Navbar, footer, botones  
**Versión:** v2 (compacto y limpio)

---

### Mediano (50-80px)
```tsx
<Logo size={60} variant="color" version="v2" />
```
**Uso:** Headers, páginas internas  
**Versión:** v2 o v1 (ambos funcionan bien)

---

### Grande (80-120px)
```tsx
<Logo size={100} variant="color" version="v1" />
```
**Uso:** Landing page, splash screen  
**Versión:** v1 (mayor impacto visual)

---

### Muy Grande (120px+)
```tsx
<Logo size={150} variant="color" version="v1" showText={true} />
```
**Uso:** Hero sections, presentaciones  
**Versión:** v1 con texto (máximo impacto)

---

## 🎯 GUÍA POR PROPÓSITO

### Branding / Reconocimiento de Marca
```tsx
<Logo size={100} variant="color" version="v2" showText={true} />
```
**Por qué:** Logo + texto = máximo reconocimiento

---

### Navegación / UI
```tsx
<Logo size={45} variant="color" version="v2" />
```
**Por qué:** Compacto, no distrae, profesional

---

### Marketing / Publicidad
```tsx
<Logo size={120} variant="color" version="v1" />
```
**Por qué:** Mayor impacto visual, más memorable

---

### App Móvil / PWA
```tsx
<Logo size={50} variant="color" version="v2" />
```
**Por qué:** Optimizado para pantallas pequeñas

---

### Redes Sociales
```tsx
<Logo size={200} variant="color" version="v2" />
```
**Por qué:** Grande y claro para perfiles

---

## 🤔 DECISIONES COMUNES

### "¿v1 o v2?"

**Usa v2 si:**
- ✅ Necesitas versatilidad
- ✅ Usarás en tamaños pequeños
- ✅ Quieres algo moderno y limpio
- ✅ Es para favicon o app icons
- ✅ No estás seguro (v2 es la opción segura)

**Usa v1 si:**
- ✅ Necesitas impacto visual
- ✅ Es para landing page o hero section
- ✅ Tienes mucho espacio disponible
- ✅ Es para marketing o presentaciones
- ✅ Quieres algo más llamativo

---

### "¿Con texto o sin texto?"

**Con texto (`showText={true}`) si:**
- ✅ Es la primera vez que ven tu marca
- ✅ Necesitas reconocimiento de marca
- ✅ Tienes espacio vertical
- ✅ Es para landing page o splash screen

**Sin texto (`showText={false}`) si:**
- ✅ Es para navegación (navbar, footer)
- ✅ Espacio limitado
- ✅ Los usuarios ya conocen tu marca
- ✅ Es para favicon o iconos pequeños

---

### "¿Color, blanco o negro?"

**Color (`variant="color"`) si:**
- ✅ Fondo claro
- ✅ Uso general
- ✅ Quieres mostrar tu identidad de marca
- ✅ No estás seguro (color es la opción por defecto)

**Blanco (`variant="white"`) si:**
- ✅ Fondo oscuro
- ✅ Navbar oscuro
- ✅ Footer oscuro
- ✅ Sobre gradientes

**Negro (`variant="black"`) si:**
- ✅ Impresión
- ✅ Documentos oficiales
- ✅ Necesitas máximo contraste en fondo blanco
- ✅ Diseño minimalista en blanco y negro

---

## 📱 EJEMPLOS RESPONSIVE

### Móvil
```tsx
<Logo 
  size={40} 
  variant="color" 
  version="v2" 
  className="sm:hidden"
/>
```

### Tablet
```tsx
<Logo 
  size={50} 
  variant="color" 
  version="v2" 
  className="hidden sm:block md:hidden"
/>
```

### Desktop
```tsx
<Logo 
  size={60} 
  variant="color" 
  version="v2" 
  className="hidden md:block"
/>
```

### O con Tailwind
```tsx
<Logo 
  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
  variant="color" 
  version="v2" 
/>
```

---

## ⚡ CASOS DE USO REALES

### Caso 1: Landing Page
```tsx
// Hero section
<Logo size={100} variant="color" version="v2" showText={true} />

// Navbar
<Logo size={45} variant="color" version="v2" />

// Footer
<Logo size={40} variant="color" version="v2" />
```

---

### Caso 2: App Interna
```tsx
// Sidebar
<Logo size={50} variant="color" version="v2" />

// Header móvil
<Logo size={40} variant="color" version="v2" />

// Loading screen
<Logo size={80} variant="color" version="v2" />
```

---

### Caso 3: Email Marketing
```tsx
// Header del email
<Logo size={80} variant="color" version="v2" />

// Footer del email
<Logo size={40} variant="color" version="v2" />
```

---

### Caso 4: Presentación / Pitch Deck
```tsx
// Portada
<Logo size={150} variant="color" version="v1" showText={true} />

// Slides internas
<Logo size={60} variant="color" version="v2" />
```

---

## 🎨 COMBINACIONES RECOMENDADAS

### Combinación 1: Moderna y Limpia
```tsx
// Navbar
<Logo size={45} variant="color" version="v2" />

// Hero
<Logo size={100} variant="color" version="v2" showText={true} />

// Footer
<Logo size={40} variant="white" version="v2" />
```

---

### Combinación 2: Impacto Visual
```tsx
// Navbar
<Logo size={50} variant="color" version="v2" />

// Hero
<Logo size={120} variant="color" version="v1" showText={true} />

// Footer
<Logo size={45} variant="color" version="v2" />
```

---

### Combinación 3: Minimalista
```tsx
// Navbar
<Logo size={40} variant="color" version="simple" />

// Hero
<Logo size={80} variant="color" version="simple" />

// Footer
<Logo size={35} variant="color" version="simple" />
```

---

## ✅ CHECKLIST RÁPIDO

Antes de usar un logo, pregúntate:

- [ ] ¿Qué tamaño necesito? (pequeño/mediano/grande)
- [ ] ¿Qué fondo tengo? (claro/oscuro)
- [ ] ¿Cuánto espacio tengo? (limitado/amplio)
- [ ] ¿Necesito texto? (sí/no)
- [ ] ¿Qué versión? (v1/v2/simple)

**Si no estás seguro, usa:**
```tsx
<Logo size={50} variant="color" version="v2" />
```

---

## 🚫 ERRORES COMUNES

### ❌ NO hagas esto:
```tsx
// Logo muy grande en navbar
<Logo size={150} variant="color" version="v1" />

// Logo de color en fondo oscuro
<Logo size={50} variant="color" version="v2" />

// Logo muy pequeño en hero
<Logo size={30} variant="color" version="v2" />

// v1 como favicon
<Logo size={16} variant="color" version="v1" />
```

### ✅ HAZ esto:
```tsx
// Logo apropiado en navbar
<Logo size={45} variant="color" version="v2" />

// Logo blanco en fondo oscuro
<Logo size={50} variant="white" version="v2" />

// Logo grande en hero
<Logo size={100} variant="color" version="v2" showText={true} />

// v2 como favicon
<Logo size={16} variant="color" version="v2" />
```

---

## 💡 TIPS FINALES

1. **Consistencia:** Usa la misma versión en toda la app (preferiblemente v2)
2. **Contraste:** Siempre verifica que el logo sea visible en su fondo
3. **Tamaño:** Más grande no siempre es mejor - considera el contexto
4. **Texto:** Solo usa `showText={true}` cuando sea necesario
5. **Responsive:** Ajusta el tamaño según el dispositivo

---

## 🎯 RECOMENDACIÓN FINAL

**Para el 90% de los casos:**
```tsx
<Logo size={50} variant="color" version="v2" />
```

**Es:**
- ✅ Versátil
- ✅ Moderno
- ✅ Profesional
- ✅ Funciona en todos los tamaños
- ✅ La opción más segura

---

**¿Aún tienes dudas?**

1. Abre `LOGO_DEMO.html` para ver todas las opciones
2. Prueba diferentes combinaciones en desarrollo
3. Pregúntame - puedo ayudarte a decidir

---

**Última actualización:** 27 de Febrero 2026  
**Archivo:** `CUAL_LOGO_USAR.md`
