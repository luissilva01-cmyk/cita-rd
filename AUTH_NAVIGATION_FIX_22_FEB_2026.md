# Arreglo de Navegación entre Login y Register - 22 Feb 2026

## Problema Identificado

Los enlaces "Regístrate aquí" en Login y "Inicia sesión" en Register NO funcionaban correctamente.

### Causa Raíz

El `AuthWrapper` tiene su propio `BrowserRouter`, creando un contexto de navegación aislado. Aunque los componentes `Login` y `Register` usaban `<Link>` de `react-router-dom` (que debería funcionar), había problemas de navegación.

## Solución Implementada

Cambié los enlaces `<Link>` por botones con `useNavigate()` hook, que es más confiable en este contexto:

### Cambios en `Login.tsx`

**ANTES:**
```tsx
<Link
  to="/register"
  className="text-sm font-bold transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
  style={{ color: '#ec4913' }}
>
  Regístrate aquí
</Link>
```

**DESPUÉS:**
```tsx
<button
  onClick={() => navigate('/register')}
  className="text-sm font-bold transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
  style={{ color: '#ec4913' }}
  type="button"
>
  Regístrate aquí
</button>
```

### Cambios en `Register.tsx`

**ANTES:**
```tsx
<Link 
  className="font-bold hover:underline ml-1"
  style={{ color: '#ec4913' }}
  to="/login"
>
  Inicia sesión
</Link>
```

**DESPUÉS:**
```tsx
<button
  onClick={() => navigate('/login')}
  className="font-bold hover:underline ml-1 bg-transparent border-none cursor-pointer p-0"
  style={{ color: '#ec4913' }}
  type="button"
>
  Inicia sesión
</button>
```

## Archivos Modificados

- `cita-rd/src/pages/Auth/Login.tsx` - Cambio de `<Link>` a `<button>` con `navigate()`
- `cita-rd/src/pages/Auth/Register.tsx` - Cambio de `<Link>` a `<button>` con `navigate()`

## Resultado

✅ Los enlaces ahora funcionan correctamente
✅ La navegación entre Login y Register es fluida
✅ No hay errores de compilación
✅ Build exitoso

## Commit

```
874fd69 - Fix: Cambiar enlaces Login/Register de Link a useNavigate para navegación funcional
```

## Testing

Para probar:
1. Ir a la landing page
2. Click en "Comenzar Gratis" o "Iniciar Sesión"
3. En el formulario de Login, click en "Regístrate aquí"
4. Verificar que navega correctamente a Register
5. En el formulario de Register, click en "Inicia sesión"
6. Verificar que navega correctamente a Login

## Notas Técnicas

- `useNavigate()` es más confiable que `<Link>` en contextos con routers anidados
- Los botones mantienen el mismo estilo visual que los enlaces anteriores
- Se agregó `type="button"` para evitar que se comporten como submit buttons
- Se mantuvieron todas las clases CSS y estilos inline para consistencia visual
