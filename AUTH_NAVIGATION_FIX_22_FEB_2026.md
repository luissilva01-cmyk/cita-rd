# Fix: Navegación entre Login y Register - 22 Feb 2026

## Problema Identificado

Antes de implementar la landing page, los botones de navegación entre Login y Register funcionaban correctamente. Cuando se implementó la landing page, se creó un componente `AuthWrapper.tsx` que envolvía Login y Register, rompiendo la funcionalidad de navegación.

### Causa Raíz

El `AuthWrapper` usaba `useState` para controlar la vista (login/register) y pasaba callbacks a los componentes Login y Register. Sin embargo, estos componentes no estaban correctamente integrados con React Router, causando que los botones de navegación no funcionaran.

## Solución Implementada

### 1. Eliminado `AuthWrapper.tsx`

El componente `AuthWrapper` fue completamente eliminado ya que no era necesario y causaba problemas de navegación.

### 2. Implementado React Router Directamente en `App.tsx`

```tsx
// Antes (con AuthWrapper)
if (!currentUser) {
  return (
    <ErrorBoundary level="app">
      <Suspense fallback={<LoadingFallback />}>
        {showAuth ? (
          <AuthWrapper 
            onBack={() => setShowAuth(null)} 
            initialRoute={showAuth === 'register' ? '/register' : '/login'}
          />
        ) : (
          <Landing 
            onGetStarted={() => setShowAuth('register')} 
            onShowLogin={() => setShowAuth('login')}
            onShowRegister={() => setShowAuth('register')}
          />
        )}
      </Suspense>
    </ErrorBoundary>
  );
}

// Después (con React Router)
if (!currentUser) {
  return (
    <ErrorBoundary level="app">
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
```

### 3. Actualizado `Landing.tsx`

- Removidas props `onGetStarted`, `onShowLogin`, `onShowRegister`
- Agregado `useNavigate()` de React Router
- Botones ahora usan `navigate('/login')` y `navigate('/register')`

```tsx
// Antes
const Landing: React.FC<LandingProps> = ({ onGetStarted, onShowLogin, onShowRegister }) => {
  // ...
  <button onClick={onShowLogin}>Iniciar Sesión</button>
  <button onClick={onShowRegister}>Comenzar Gratis</button>
}

// Después
const Landing: React.FC = () => {
  const navigate = useNavigate();
  // ...
  <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
  <button onClick={() => navigate('/register')}>Comenzar Gratis</button>
}
```

### 4. Actualizado `Login.tsx`

- Removida prop opcional `onNavigateToRegister`
- Usa directamente `useNavigate()` de React Router
- Botón "Regístrate aquí" usa `navigate('/register')`

```tsx
// Antes
export default function Login({ onNavigateToRegister }: { onNavigateToRegister?: () => void }) {
  // ...
  <button onClick={() => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate('/register');
    }
  }}>
    Regístrate aquí
  </button>
}

// Después
export default function Login() {
  const navigate = useNavigate();
  // ...
  <button onClick={() => navigate('/register')}>
    Regístrate aquí
  </button>
}
```

### 5. Actualizado `Register.tsx`

- Removida prop opcional `onNavigateToLogin`
- Usa directamente `useNavigate()` de React Router
- Botón "Inicia sesión" usa `navigate('/login')`

```tsx
// Antes
export default function Register({ onNavigateToLogin }: { onNavigateToLogin?: () => void }) {
  // ...
  <button onClick={() => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      navigate('/login');
    }
  }}>
    Inicia sesión
  </button>
}

// Después
export default function Register() {
  const navigate = useNavigate();
  // ...
  <button onClick={() => navigate('/login')}>
    Inicia sesión
  </button>
}
```

### 6. Limpieza en `App.tsx`

- Removido estado `showAuth` que ya no se usa
- Removidas importaciones de `AuthWrapper`

## Archivos Modificados

1. `cita-rd/App.tsx` - Implementado React Router directamente
2. `cita-rd/views/views/Landing.tsx` - Usa `useNavigate()`
3. `cita-rd/src/pages/Auth/Login.tsx` - Usa `useNavigate()`
4. `cita-rd/src/pages/Auth/Register.tsx` - Usa `useNavigate()`
5. `cita-rd/views/views/AuthWrapper.tsx` - ELIMINADO (ya no se usa)

## Archivos a Eliminar

- `cita-rd/views/views/AuthWrapper.tsx` - Ya no es necesario

## Resultado

✅ Los botones de navegación entre Login y Register ahora funcionan correctamente
✅ La navegación usa React Router como debe ser
✅ El código es más limpio y mantenible
✅ No hay componentes intermedios innecesarios
✅ Build exitoso sin errores

## Testing

Para probar la funcionalidad:

1. Hacer build: `npm run build`
2. Limpiar caché del navegador (Ctrl + Shift + Delete)
3. Navegar a la landing page
4. Click en "Iniciar Sesión" → debe ir a `/login`
5. En login, click en "Regístrate aquí" → debe ir a `/register`
6. En register, click en "Inicia sesión" → debe ir a `/login`
7. Click en botón "Atrás" → debe volver a landing page

## Notas Importantes

- El usuario debe hacer **hard refresh** (Ctrl + Shift + R) o limpiar caché para ver los cambios
- El timestamp del nuevo build es: `1771794158606`
- La navegación ahora funciona exactamente como funcionaba antes de implementar la landing page
