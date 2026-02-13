# Fix: Botón de Reportar No Respondía al Click
**Fecha:** 13 de Febrero 2026  
**Commit:** e308105  
**Deploy:** ✅ Completado en https://citard-fbc26.web.app

## 🐛 Problema

El botón de bandera (reportar perfil) era visible en Discovery pero NO respondía al click.

### Causa Raíz

El botón estaba DENTRO del contenedor del SwipeCard:

```tsx
<div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
  <SwipeCard ... />
  
  {/* ❌ PROBLEMA: Botón dentro del contenedor del SwipeCard */}
  <button onClick={handleReportUser}>
    <Flag />
  </button>
</div>
```

El SwipeCard captura todos los eventos de touch/click para detectar gestos de swipe, bloqueando el evento del botón.

## ✅ Solución

Mover el botón FUERA del contenedor del SwipeCard, al nivel del contenedor padre:

```tsx
<div className="relative group w-full max-w-lg">
  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
    <SwipeCard ... />
  </div>
  
  {/* ✅ SOLUCIÓN: Botón fuera del contenedor del SwipeCard */}
  <button 
    onClick={handleReportUser}
    className="absolute top-4 right-4 z-50 ... pointer-events-auto"
  >
    <Flag />
  </button>
</div>
```

### Cambios Clave

1. **Posición del botón:** Movido fuera del `<div>` con `overflow-hidden`
2. **z-index:** Mantiene `z-50` para estar encima de todo
3. **pointer-events:** Agregado `pointer-events-auto` para asegurar interactividad
4. **Posicionamiento:** Usa `absolute` relativo al contenedor padre

## 🧪 Testing

Para verificar que funciona:

1. Ir a Discovery (https://citard-fbc26.web.app)
2. Ver perfil de usuario
3. Click en botón de bandera (esquina superior derecha)
4. Debe abrir modal de reporte con 6 categorías
5. Seleccionar categoría y agregar descripción
6. Enviar reporte
7. Verificar en Firestore que se creó documento en colección `reports`

## 📊 Estado del Sistema de Reportes

### ✅ Completado

- [x] Servicio de reportes (`reportService.ts`)
- [x] Modal de reporte (`ReportProfileModal.tsx`)
- [x] Integración en Discovery.tsx
- [x] Integración en Profile.tsx
- [x] Reglas de Firestore para colección `reports`
- [x] Auto-bloqueo después de 3 reportes
- [x] Build y deploy
- [x] **FIX: Botón ahora responde al click**

### 🎯 Próximos Pasos (Fase 2 - Sesión Futura)

- [ ] Sistema de verificación de identidad con selfie
- [ ] Detección de celebridades con API de reconocimiento facial
- [ ] Badge de "Verificado" en perfiles
- [ ] Panel de administración para revisar reportes

## 📁 Archivos Modificados

- `cita-rd/views/views/Discovery.tsx` - Movido botón fuera del SwipeCard

## 🚀 Deploy

```bash
npm run build
firebase deploy --only hosting
git add -A
git commit -m "Fix: Mover boton de reportar fuera del SwipeCard para evitar conflictos de eventos"
git push
```

## 📝 Notas Técnicas

### Por qué el botón no funcionaba

Los componentes de swipe (como SwipeCard) usan event listeners para detectar gestos:
- `touchstart` / `mousedown`
- `touchmove` / `mousemove`
- `touchend` / `mouseup`

Cuando un elemento está dentro del contenedor del swipe, estos eventos se capturan ANTES de que lleguen al botón, causando que el click no se registre.

### Solución alternativa considerada

Se consideró usar `pointer-events: none` en el SwipeCard y `pointer-events: auto` solo en elementos interactivos, pero esto habría requerido modificar el componente SwipeCard y podría afectar la detección de gestos.

La solución de mover el botón fuera del contenedor es más limpia y no requiere cambios en SwipeCard.

---

**Resultado:** Sistema de reportes completamente funcional en producción 🎉
