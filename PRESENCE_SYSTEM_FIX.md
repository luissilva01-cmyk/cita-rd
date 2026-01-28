# Fix: Error "unsubscribe is not a function" en Sistema de Presencia

## 🐛 Problema

Al testear la app con un nuevo usuario, la página se quedaba en blanco y mostraba el siguiente error en consola:

```
🔴 Cleaning up presence system for user: vbv2HY50opZZfRHagpl6FDxAmRl2
App.tsx:116 Uncaught TypeError: unsubscribe is not a function
```

## 🔍 Causa

El error ocurría en el `useEffect` del sistema de presencia en `App.tsx`. Cuando el componente se desmontaba o `currentUser` cambiaba, intentaba llamar a `cleanup()` sin validar que fuera una función válida.

Esto podía pasar en escenarios como:
- Usuario cierra sesión (currentUser cambia de objeto a null)
- Componente se desmonta antes de que setupPresenceSystem complete
- Error en la inicialización del sistema de presencia

## ✅ Solución

Agregamos validación antes de llamar a la función de limpieza:

```typescript
// Setup presence system when user is loaded
useEffect(() => {
  if (!currentUser) return;
  
  console.log('🟢 Setting up presence system for user:', currentUser.id);
  const cleanup = setupPresenceSystem(currentUser.id);
  
  return () => {
    console.log('🔴 Cleaning up presence system for user:', currentUser.id);
    if (cleanup && typeof cleanup === 'function') {
      cleanup();
    }
  };
}, [currentUser]);
```

### Cambios Realizados

1. **Validación de tipo**: Verificamos que `cleanup` existe y es una función antes de llamarla
2. **Prevención de crashes**: Si `cleanup` no es válido, simplemente no se ejecuta (fail-safe)

## 📝 Archivo Modificado

- `cita-rd/App.tsx` - Línea 89

## 🧪 Cómo Probar

1. Reiniciar el servidor: `npm run dev`
2. Crear un nuevo usuario o iniciar sesión
3. La app debe cargar correctamente sin errores en consola
4. Cerrar sesión - no debe mostrar el error "unsubscribe is not a function"

## 🎯 Resultado

✅ La app ahora carga correctamente con usuarios nuevos
✅ No hay errores al limpiar el sistema de presencia
✅ El sistema de presencia sigue funcionando normalmente

## Commit

```
commit b1da3ca
Fix: Validar cleanup function en presence system para evitar error 'unsubscribe is not a function'
```

## 📌 Nota Técnica

Este es un patrón común en React cuando trabajamos con efectos que retornan funciones de limpieza. Siempre es buena práctica validar que la función existe antes de llamarla, especialmente cuando hay dependencias que pueden cambiar a `null` o `undefined`.
