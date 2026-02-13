# Fix Chat Layout Desktop - Ancho Limitado (11 Feb 2026) - SOLUCIONADO

## Problema
El chat en desktop se expandía a pantalla completa en lugar de mantener un ancho limitado (estilo WhatsApp Web). El `max-w-5xl` aparecía por un segundo pero luego se expandía.

## Causa Raíz REAL
El problema NO era solo el flexbox. Había **estilos inline con `width: '100%'`** en varios elementos dentro de ChatView que estaban sobrescribiendo el `max-w-5xl` del contenedor padre.

## Solución Aplicada

### 1. DesktopLayout.tsx
Agregado `minWidth: 0` al contenedor principal (main) para que respete el `max-w-5xl`:

```tsx
<main className="flex-1 flex items-center justify-center p-8" style={{ minWidth: 0 }}>
  <div className="w-full max-w-5xl h-full">
    {children}
  </div>
</main>
```

### 2. ChatView.tsx - Contenedor Principal
Agregado `minWidth: 0` al contenedor principal del chat:

```tsx
<div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 chat-view-container lg:max-w-5xl lg:mx-auto" style={{ minWidth: 0 }}>
```

### 3. ChatView.tsx - CRÍTICO: Eliminados Estilos Inline
Eliminados todos los estilos inline que forzaban `width: '100%'`:

**Línea ~889 - Contenedor de mensajes:**
```tsx
// ANTES:
<div 
  key={msg.id} 
  className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
  style={{ maxWidth: '100%', width: '100%', boxSizing: 'border-box' }}
>

// DESPUÉS:
<div 
  key={msg.id} 
  className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
>
```

**Línea ~1119 - Indicador de grabación de voz:**
```tsx
// ANTES:
<div className="..." style={{ maxWidth: '100%', boxSizing: 'border-box' }}>

// DESPUÉS:
<div className="...">
```

**Línea ~1145 - Indicador de grabación de video:**
```tsx
// ANTES:
<div className="..." style={{ maxWidth: '100%', boxSizing: 'border-box' }}>

// DESPUÉS:
<div className="...">
```

**Línea ~1265 - Textarea de input:**
```tsx
// ANTES:
<textarea 
  className="..."
  style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}
/>

// DESPUÉS:
<textarea 
  className="..."
/>
```

## Por Qué Funcionó

El problema tenía DOS capas:

1. **Flexbox sin minWidth:** Los contenedores flex sin `minWidth: 0` no respetan las restricciones de `max-width` de sus hijos
2. **Estilos inline sobrescribiendo:** Los estilos inline con `width: '100%'` tenían mayor especificidad que las clases de Tailwind y estaban forzando el ancho completo

Al eliminar AMBOS problemas, el chat ahora respeta el `max-w-5xl` correctamente.

## Resultado

✅ El chat en desktop mantiene un ancho máximo de `max-w-5xl` (80rem / 1280px)
✅ El contenido está centrado con `mx-auto`
✅ El ancho limitado se mantiene permanentemente
✅ La versión móvil sigue funcionando perfectamente
✅ Los mensajes, indicadores y textarea respetan el ancho del contenedor

## Archivos Modificados

1. `cita-rd/components/DesktopLayout.tsx`
   - Agregado `style={{ minWidth: 0 }}` al main
   - Agregado `flex-shrink-0` al aside

2. `cita-rd/views/views/ChatView.tsx`
   - Agregado `style={{ minWidth: 0 }}` al contenedor principal
   - **CRÍTICO:** Eliminados estilos inline `width: '100%'` en:
     - Contenedor de mensajes (línea ~889)
     - Indicador de grabación de voz (línea ~1119)
     - Indicador de grabación de video (línea ~1145)
     - Textarea de input (línea ~1265)

## Deploy

- Build: ✅ Exitoso
- Deploy: ✅ Exitoso
- URL: https://citard-fbc26.web.app

## Testing

Para verificar:
1. Abrir https://citard-fbc26.web.app en desktop (pantalla > 1024px)
2. Navegar a un chat
3. Verificar que el chat tiene un ancho limitado (no ocupa toda la pantalla)
4. Enviar mensajes y verificar que el ancho se mantiene
5. Grabar audio/video y verificar que los indicadores respetan el ancho
6. Verificar que en móvil sigue funcionando correctamente

## Lección Aprendida

Cuando un estilo CSS no se aplica correctamente:
1. Verificar la jerarquía de flexbox (minWidth/minHeight)
2. **Buscar estilos inline que puedan estar sobrescribiendo** (tienen mayor especificidad)
3. Usar DevTools para inspeccionar qué estilos están siendo aplicados y cuáles sobrescritos

Los estilos inline siempre ganan sobre las clases, incluso con `!important` en algunos casos.

## Referencias

- Fix móvil original: `CHAT_LAYOUT_FIX_WEB_11_FEB_2026.md`
- Layout móvil: `cita-rd/components/components/Layout.tsx` (línea 73)
- CSS Flexbox min-size: https://www.w3.org/TR/css-flexbox-1/#min-size-auto
- CSS Specificity: https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

