# Script para Configurar Usuario Admin

## Instrucciones

1. Abre la app en el navegador: https://citard-fbc26.web.app
2. Inicia sesión con tu cuenta
3. Abre las DevTools (F12)
4. Ve a la pestaña "Console"
5. Copia y pega el siguiente script:

```javascript
// Script para configurar usuario como admin
(async function() {
  try {
    const userId = 'je1HdwssPigxtDyHKZpkXNMOGY32';
    
    // Verificar usuario actual
    const currentUser = firebase.auth().currentUser;
    console.log('👤 Usuario actual:', currentUser.uid);
    
    if (currentUser.uid !== userId) {
      console.error('❌ Debes iniciar sesión con la cuenta admin');
      return;
    }
    
    // Obtener documento actual
    const userRef = firebase.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.error('❌ Usuario no encontrado en Firestore');
      return;
    }
    
    console.log('📄 Datos actuales:', userDoc.data());
    console.log('🔐 isAdmin actual:', userDoc.data().isAdmin);
    
    // Actualizar campo isAdmin
    await userRef.update({
      isAdmin: true
    });
    
    console.log('✅ Campo isAdmin configurado correctamente');
    console.log('🔄 Recarga la página para ver los cambios');
    
    // Verificar actualización
    const updatedDoc = await userRef.get();
    console.log('✅ Verificación:', updatedDoc.data().isAdmin);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
```

## Verificar que funcionó

Después de ejecutar el script, deberías ver:
- ✅ Campo isAdmin configurado correctamente
- ✅ Verificación: true

Luego recarga la página (F5) y ve a tu perfil. Deberías ver el botón "Panel de Administración" con gradiente púrpura.

## Si el script falla

Si el script da error, es posible que necesites usar la Firebase Console:

1. Ve a: https://console.firebase.google.com/project/citard-fbc26/firestore
2. Navega a: `users` > `je1HdwssPigxtDyHKZpkXNMOGY32`
3. Click en "Editar documento"
4. Agregar campo:
   - Campo: `isAdmin`
   - Tipo: `boolean`
   - Valor: `true`
5. Guardar

## Verificar en la App

Una vez configurado, ve a tu perfil y deberías ver:

```
┌─────────────────────────────────────────┐
│  🛡️  Panel de Administración           │
│     Gestionar reportes y usuarios    →  │
└─────────────────────────────────────────┘
```

El botón tiene:
- Gradiente púrpura-índigo
- Icono de escudo (Shield)
- Flecha a la derecha
- Efecto hover
