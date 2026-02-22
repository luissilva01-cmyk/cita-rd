# Arreglo de Navegación entre Login y Register - 22 Feb 2026

## Problema Identificado

Los enlaces "Regístrate aquí" en Login y "Inicia sesión" en Register NO funcionaban correctamente.

### Causa Raíz

El `AuthWrapper` tenía su propio `BrowserRouter`, creando un contexto de navegación aislado. Aunque los componentes `Login` y `Register` usaban `useNavigate()` de `react-router-dom`, el router aislado impedía la navegación correcta.

## Solución Implementada (v2 - DEFINITIVA)

Eliminé completamente el `BrowserRouter` del `AuthWrapper` y lo reemplacé con un estado local simple (`useState`) que controla qué vista mostrar. Los componentes `Login` y `Register` ahora aceptan callbacks opcionales para la navegación.

### Cambios en `AuthWrapper.tsx`

**ANTES:**
```tsx
const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack, initialRoute = '/login' }) => {
  return (
    <Router>
      <AuthRoutes initialRoute={initialRoute} />
    </Router>
  );
};
```

**DESPUÉS:**
```tsx
const AuthWrapper: React.FC<AuthWrapperProps> = ({ onBack, initialRoute = '/login' }) => {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(
    initialRoute === '/register' ? 'register' : 'login'
  );

  const LoginWithNavigation = () => {
    return <Login onNavigateToRegister={() => setCurrentView('register')} />;
  };

  const RegisterWithNavigation = () => {
    return <Register onNavigateToLogin={() => setCurrentView('login')} />;
  };

  return (
    <>
      {currentView === 'login' ? <LoginWithNavigation /> : <RegisterWithNavigation />}
    </>
  );
};
```

### Cambios en `Login.tsx`

**Firma del componente:**
```tsx
export default function Login({ onNavigateToRegister }: { onNavigateToRegister?: () => void })
```

**Botón de navegación:**
```tsx
<button
  onClick={() => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate('/register');
    }
  }}
  className="text-sm font-bold transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
  style={{ color: '#ec4913' }}
  type="button"
>
  Regístrate aquí
</button>
```

### Cambios en `Register.tsx`

**Firma del componente:**
```tsx
export default function Register({ onNavigateToLogin }: { onNavigateToLogin?: () => void })
```

**Botón de navegación:**
```tsx
<button
  onClick={() => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      navigate('/login');
    }
  }}
  className="font-bold hover:underline ml-1 bg-transparent border-none cursor-pointer p-0"
  style={{ color: '#ec4913' }}
  type="button"
>
  Inicia sesión
</button>
```

## Archivos Modificados

- `cita-rd/views/views/AuthWrapper.tsx` - Eliminado `BrowserRouter`, agregado estado local
- `cita-rd/src/pages/Auth/Login.tsx` - Agregado prop `onNavigateToRegister`
- `cita-rd/src/pages/Auth/Register.tsx` - Agregado prop `onNavigateToLogin`

## Resultado

✅ Los enlaces ahora funcionan correctamente
✅ La navegación entre Login y Register es instantánea
✅ No hay routers anidados ni contextos aislados
✅ Fallback a `navigate()` si no se pasa el callback (compatibilidad)
✅ No hay errores de compilación
✅ Build exitoso

## Commits

```
874fd69 - Fix: Cambiar enlaces Login/Register de Link a useNavigate para navegación funcional
07c5735 - Fix: Reemplazar BrowserRouter con estado local en AuthWrapper para navegación funcional
```

## Testing

Para probar:
1. Ir a la landing page
2. Click en "Comenzar Gratis" o "Iniciar Sesión"
3. En el formulario de Login, click en "Regístrate aquí"
4. Verificar que navega correctamente a Register (instantáneo)
5. En el formulario de Register, click en "Inicia sesión"
6. Verificar que navega correctamente a Login (instantáneo)

## Notas Técnicas

- Eliminado `BrowserRouter` del `AuthWrapper` para evitar contextos de navegación aislados
- Usamos `useState` simple para controlar qué vista mostrar
- Los componentes `Login` y `Register` aceptan callbacks opcionales para navegación
- Si no se pasa el callback, usan `navigate()` como fallback (compatibilidad)
- Esta solución es más simple, más rápida y más confiable que usar routers anidados
- No hay efectos secundarios ni `useEffect` que puedan interferir con la navegación
