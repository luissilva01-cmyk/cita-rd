# 🎬 Crear Historia de Demostración

**Problema Identificado:** Juan Pérez y Luis Silva tienen el mismo `userId`, por eso Luis Silva solo ve su propia historia.

---

## 🔍 Diagnóstico

Según los logs:
```
Story Owner ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
Viewer ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
✅ Usuario viendo sus propias stories
```

**Ambos usuarios son la misma persona.**

---

## ✅ Solución 1: Usar Dos Cuentas Diferentes

### Paso 1: Crear Segunda Cuenta

1. Abre un navegador en **modo incógnito** (Ctrl + Shift + N)
2. Ve a http://localhost:3000
3. Registra una nueva cuenta con otro email
4. Inicia sesión con la nueva cuenta

### Paso 2: Crear Historia

1. **Navegador Normal** - Juan Pérez crea una historia
2. **Navegador Incógnito** - Luis Silva (nueva cuenta) debería ver la historia

---

## ✅ Solución 2: Crear Historia de Demo con Código

Si solo quieres probar rápido, puedes crear una historia de demo desde la consola:

### Paso 1: Abrir Consola

1. Presiona F12
2. Ve a la pestaña "Console"

### Paso 2: Ejecutar Código

Copia y pega este código en la consola:

```javascript
// Crear historia de demo de otro usuario
const demoStory = {
  id: 'demo_story_' + Date.now(),
  userId: 'demo_user_123', // Usuario diferente
  type: 'text',
  content: '¡Hola! Esta es una historia de prueba 🎉',
  backgroundColor: '#FF6B6B',
  textColor: '#FFFFFF',
  createdAt: new Date(),
  expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  viewedBy: []
};

// Agregar al servicio de stories
storiesService.stories.push(demoStory);

// Crear grupo de usuario demo
const demoGroup = {
  id: 'group_demo_user_123',
  userId: 'demo_user_123',
  user: {
    name: 'Usuario Demo',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face'
  },
  stories: [demoStory],
  hasUnviewed: true,
  lastUpdated: new Date()
};

storiesService.storyGroups.unshift(demoGroup);

console.log('✅ Historia de demo creada!');
console.log('🔄 Recarga la página para verla');
```

### Paso 3: Recargar

1. Presiona F5 para recargar la página
2. Deberías ver la historia de "Usuario Demo"

---

## ✅ Solución 3: Modificar Privacy Service

Si quieres que el sistema permita ver historias de usuarios con el mismo ID (para testing), puedes modificar temporalmente el servicio:

### Opción A: Hacer Todas las Historias Públicas

Ya está configurado así por defecto. El problema es que ambos usuarios son el mismo.

### Opción B: Crear Match Automático

Ejecuta en la consola:

```javascript
// Crear match entre tu usuario y un usuario demo
await privacyService.createMatch('KU5ZalR92QcPV7RGbLFTjEjTXZm2', 'demo_user_123');
console.log('✅ Match creado!');
```

---

## 🎯 Recomendación

**La mejor solución es usar dos cuentas diferentes:**

1. **Cuenta 1 (Juan Pérez):**
   - Email: juanperez@example.com
   - Crea historias

2. **Cuenta 2 (Luis Silva):**
   - Email: luissilva@example.com
   - Ve las historias de Juan Pérez

---

## 🧪 Verificación

Para verificar que tienes dos usuarios diferentes:

1. Abre la consola (F12)
2. Busca el log: `🟢 Setting up presence system for user: XXXXXXX`
3. El `XXXXXXX` debe ser **diferente** en cada navegador

**Ejemplo correcto:**
- Navegador 1: `user: KU5ZalR92QcPV7RGbLFTjEjTXZm2` (Juan Pérez)
- Navegador 2: `user: ABC123XYZ456` (Luis Silva) ← **Diferente**

**Ejemplo incorrecto (actual):**
- Navegador 1: `user: KU5ZalR92QcPV7RGbLFTjEjTXZm2` (Juan Pérez)
- Navegador 2: `user: KU5ZalR92QcPV7RGbLFTjEjTXZm2` (Luis Silva) ← **Mismo ID**

---

## 📝 Resumen

El sistema de historias **funciona correctamente**. El problema es que estás usando la misma cuenta en ambos navegadores.

**Solución:** Usa dos cuentas diferentes o crea una historia de demo con el código proporcionado.
