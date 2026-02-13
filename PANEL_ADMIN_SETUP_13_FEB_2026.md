# Panel de Administración - Setup Completo
**Fecha:** 13 de Febrero 2026  
**Tu UID:** je1HdwssPigxtDyHKZpkXNMOGY32

## ✅ Lo Que Ya Está Creado

1. **Servicio de Administración** (`services/adminService.ts`)
   - Verificación de admin
   - Obtener reportes pendientes y todos
   - Marcar reportes como revisados
   - Estadísticas de reportes
   - Bloquear/desbloquear usuarios

## 🔧 Configuración Requerida (5 minutos)

### Paso 1: Agregarte como Admin en Firestore

1. Ve a [Firebase Console - Firestore](https://console.firebase.google.com/project/citard-fbc26/firestore)
2. Busca la colección `users`
3. Busca tu documento con ID: `je1HdwssPigxtDyHKZpkXNMOGY32`
4. Click en "Edit document" (ícono de lápiz)
5. Agregar nuevo campo:
   - **Field:** `isAdmin`
   - **Type:** boolean
   - **Value:** `true`
6. Click en "Update"

### Paso 2: Verificar que Funciona

1. Abre la consola del navegador en https://citard-fbc26.web.app
2. Pega este código:
```javascript
fetch('https://firestore.googleapis.com/v1/projects/citard-fbc26/databases/(default)/documents/users/je1HdwssPigxtDyHKZpkXNMOGY32')
  .then(r => r.json())
  .then(d => console.log('isAdmin:', d.fields.isAdmin?.booleanValue))
```
3. Debería mostrar: `isAdmin: true`

## 📋 Próximos Pasos (Implementación Pendiente)

Necesito crear:

1. **Hook useAdmin** - Para verificar si eres admin
2. **Componente AdminPanel** - Panel visual con lista de reportes
3. **Ruta /admin** - Ruta protegida
4. **Botón en Profile** - Acceso rápido (solo visible para admins)
5. **Actualizar App.tsx** - Agregar ruta de admin

## 🎯 Funcionalidades del Panel (Cuando esté completo)

- Ver todos los reportes (pendientes, revisados, resueltos)
- Filtrar por categoría y estado
- Ver detalles del reporte
- Marcar como revisado
- Bloquear/desbloquear usuarios
- Estadísticas en tiempo real
- Contador de reportes por usuario

## 🔐 Seguridad

- Solo usuarios con `isAdmin: true` pueden acceder
- Verificación en el frontend Y en Firestore Rules
- Logs de todas las acciones de admin
- Historial de revisiones

## 📊 Estructura de Datos

### Usuario Admin
```typescript
{
  uid: "je1HdwssPigxtDyHKZpkXNMOGY32",
  email: "tu-email@example.com",
  isAdmin: true,  // ← AGREGAR ESTE CAMPO
  name: "Tu Nombre",
  // ... otros campos
}
```

### Reporte
```typescript
{
  id: "report-id",
  reporterId: "user-id",
  reportedUserId: "reported-user-id",
  category: "fake_profile",
  description: "Descripción del reporte",
  timestamp: Date,
  status: "pending" | "reviewed" | "resolved",
  reviewedBy: "admin-id",  // Cuando se revisa
  reviewedAt: Date,        // Cuando se revisa
  action: "blocked" | "warning" | "dismissed"  // Acción tomada
}
```

## 🚀 Acceso al Panel (Cuando esté completo)

1. **URL Directa:** https://citard-fbc26.web.app/admin
2. **Desde Perfil:** Botón "Panel de Admin" (solo visible si eres admin)
3. **Protección:** Redirección automática si no eres admin

## ⏱️ Tiempo Estimado de Implementación

- Hook useAdmin: 5 min
- Componente AdminPanel: 20 min
- Integración y rutas: 10 min
- Testing: 5 min
- **Total: ~40 minutos**

---

**¿Quieres que continúe con la implementación del panel ahora?**

Necesito crear:
1. Hook `useAdmin`
2. Componente `AdminPanel`
3. Actualizar `App.tsx` con la ruta
4. Agregar botón en `Profile.tsx`
5. Actualizar `firestore.rules` para proteger acciones de admin
