# Fix: Layout Fijo en Chat Móvil
**Fecha:** 10 de Marzo 2026  
**Estado:** ✅ COMPLETADO

## Problema Reportado
En la versión móvil, el usuario tenía que hacer scroll hasta el final de la página para poder enviar un mensaje. El input de mensajes no estaba visible de forma permanente en la parte inferior de la pantalla.

## Diagnóstico
El ChatView en móvil no tenía un layout de altura fija como en desktop. El contenedor principal no ocupaba el 100% de la altura de la pantalla, lo que causaba que el contenido completo (header + mensajes + input) se renderizara con altura automática, requiriendo scroll para llegar al input.

## Solución Implementada

### 1. Contenedor Principal - Layout Fijo en Móvil
```typescript
<div 
  className="flex flex-col bg-white chat-view-container" 
  style={{ 
    minWidth: 0,
    ...(isDesktop ? {
      height: 'calc(100vh - 8rem)',
      maxHeight: 'calc(100vh - 8rem)',
      overflow: 'hidden',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    } : {
      // Mobile: Fixed height layout
      height: '100dvh',
      maxHeight: '100dvh',
      overflow: 'hidden'
    })
  }}
>
```

**Cambios:**
- Móvil ahora usa `height: 100dvh` (dynamic viewport height)
- `maxHeight: 100dvh` para evitar que crezca más allá de la pantalla
- `overflow: hidden` para evitar scroll en el contenedor principal

### 2. Área de Mensajes - Scroll Interno
```typescript
<div 
  ref={scrollRef} 
  className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 chat-messages-area"
  style={{
    background: 'linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%)',
    flex: '1 1 auto',
    minHeight: 0,
    maxHeight: '100%',
    overflowY: 'auto',
    overflowX: 'hidden'
  }}
>
```

**Cambios:**
- Aplicado en móvil y desktop por igual
- `flex: 1 1 auto` permite que el área de mensajes ocupe el espacio disponible
- `minHeight: 0` es crítico para que flexbox respete el scroll interno
- `overflowY: auto` permite scroll solo en esta área

### 3. Input Area - Siempre Visible
```typescript
<div 
  className="p-3 sm:p-4 lg:p-5 bg-white border-t border-slate-200 safe-area-bottom chat-input-area flex-shrink-0"
  style={{
    flexShrink: 0,
    flexGrow: 0,
    ...(isDesktop ? {
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px',
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
    } : {
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
    })
  }}
>
```

**Cambios:**
- `flexShrink: 0` aplicado en móvil y desktop
- `flexGrow: 0` evita que el input crezca
- Input permanece fijo en la parte inferior
- Sombra superior para mejor separación visual

## Estructura del Layout

```
┌─────────────────────────────┐
│ Header (flex-shrink-0)      │ ← Fijo arriba
├─────────────────────────────┤
│                             │
│ Messages Area               │ ← Scroll interno
│ (flex: 1 1 auto)            │    (flex-1)
│ (overflow-y: auto)          │
│                             │
├─────────────────────────────┤
│ Input Area (flex-shrink-0)  │ ← Fijo abajo
└─────────────────────────────┘
```

## Beneficios

✅ Input siempre visible en la parte inferior  
✅ No requiere scroll para enviar mensajes  
✅ Experiencia similar a WhatsApp/Telegram  
✅ Mejor UX en móvil  
✅ Consistencia entre móvil y desktop  
✅ Uso de `100dvh` para mejor soporte en navegadores móviles  

## Archivos Modificados
- `cita-rd/views/views/ChatView.tsx`

## Resultado
El chat en móvil ahora tiene un layout fijo donde:
- El header permanece en la parte superior
- Los mensajes tienen scroll interno
- El input permanece siempre visible en la parte inferior
- No se requiere hacer scroll para enviar mensajes

## Deploy
- Build: ✅ Exitoso
- Hosting: ✅ Desplegado
- URL: https://citard-fbc26.web.app

## Notas Técnicas
- Uso de `100dvh` en lugar de `100vh` para mejor soporte en navegadores móviles con barras de navegación dinámicas
- `minHeight: 0` en el área de mensajes es crítico para que flexbox respete el scroll interno
- `flex-shrink-0` en header e input evita que se compriman cuando el contenido es grande
