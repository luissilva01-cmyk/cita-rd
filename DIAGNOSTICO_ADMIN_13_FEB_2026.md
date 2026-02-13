# Diagnóstico: Botón de Admin No Visible

## Problema
El botón "Panel de Administración" no aparece en la vista de Perfil.

## Posibles Causas

### 1. Campo isAdmin no configurado correctamente
El usuario debe tener `isAdmin: true` en Firestore en la colección `users`.

**Verificar en Firebase Console:**
1. Ir a https://console.firebase.google.com/project/citard-fbc26/firestore
2. Navegar a la colección `users`
3. Buscar el documento con ID: `je1HdwssPigxtDyHKZpkXNMOGY32`
4. Verificar que tenga el campo `isAdmin: true`

### 2. Hook useAdmin no está funcionando
El hook puede estar retornando `isAdmin: false` por algún error.

**Verificar en consola del navegador:**
```javascript
// Abrir DevTools (F12) y ejecutar:
firebase.auth().currentUser.uid
// Debería mostrar: je1HdwssPigxtDyHKZpkXNMOGY32

// Luego verificar el documento:
firebase.firestore().collection('users').doc('je1HdwssPigxtDyHKZpkXNMOGY32').get().then(doc => {
  console.log('Usuario admin:', doc.data());
  console.log('isAdmin:', doc.data().isAdmin);
});
```

### 3. Caché del navegador
El navegador puede estar usando una versión antigua del código.

**Solución:**
1. Hacer hard refresh: Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
2. O limpiar caché del navegador

## Solución Rápida

Voy a crear un script para configurar el campo isAdmin directamente desde la consola del navegador.
