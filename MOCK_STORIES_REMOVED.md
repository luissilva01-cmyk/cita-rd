# Fix: Eliminación de Stories Mock y Foto de Usuario

## Problemas Identificados

1. **Stories mock aparecían**: Carolina, Marcos, Isabella y Rafael seguían apareciendo
2. **Foto del usuario no se mostraba**: El círculo de "Mi Story" no mostraba la foto del perfil del usuario

## Solución Implementada

### 1. Eliminación de Datos Mock
**Archivo:** `cita-rd/services/storiesService.ts`

Modificado el método `initializeDemoData()` para NO cargar datos hardcodeados:

```typescript
private initializeDemoData() {
  // ✅ NO cargar datos mock - solo stories reales
  this.stories = [];
  this.storyGroups = [];
  console.log('✅ StoriesService inicializado sin datos mock');
}
```

**Antes:** Cargaba 6 stories de 4 usuarios mock (Carolina, Marcos, Isabella, Rafael)
**Después:** Arrays vacíos, solo stories reales creadas por usuarios

### 2. Foto del Usuario en Stories
**Archivos modificados:**
- `cita-rd/services/storiesService.ts`
- `cita-rd/components/CreateStoryModal.tsx`
- `cita-rd/App.tsx`

#### Cambios en storiesService.ts

Agregado parámetro opcional `userProfile` al método `createStory`:

```typescript
async createStory(
  userId: string, 
  type: 'image' | 'text', 
  content: string, 
  options?: {
    backgroundColor?: string;
    textColor?: string;
  },
  userProfile?: { name: string; avatar: string } // ✅ NUEVO
): Promise<Story>
```

Cuando se crea un nuevo grupo de stories, ahora usa la información del perfil:

```typescript
userGroup = {
  id: `group_${userId}`,
  userId,
  user: {
    name: userProfile?.name || 'Mi Story',
    avatar: userProfile?.avatar || 'https://...' // ✅ Foto del usuario
  },
  stories: [newStory],
  hasUnviewed: true,
  lastUpdated: new Date()
};
```

#### Cambios en CreateStoryModal.tsx

Agregado prop `userProfile`:

```typescript
interface CreateStoryModalProps {
  isOpen: boolean;
  currentUserId: string;
  onClose: () => void;
  onStoryCreated?: () => void;
  userProfile?: { name: string; avatar: string }; // ✅ NUEVO
}
```

Pasa el perfil al crear la story:

```typescript
await storiesService.createStory(
  currentUserId,
  'text',
  textContent.trim(),
  { backgroundColor, textColor },
  userProfile // ✅ Pasa el perfil
);
```

#### Cambios en App.tsx

Pasa la información del usuario al modal:

```typescript
<CreateStoryModal
  isOpen={showCreateStoryModal}
  currentUserId={currentUser!.id}
  onClose={() => setShowCreateStoryModal(false)}
  onStoryCreated={() => {
    console.log('✅ Story creada, recargando stories...');
    setShowCreateStoryModal(false);
    setStoriesRefreshKey(prev => prev + 1);
  }}
  userProfile={{
    name: currentUser!.name,
    avatar: currentUser!.images?.[0] || 'https://...' // ✅ Primera foto del perfil
  }}
/>
```

## Resultado

✅ **No más usuarios mock**: Carolina, Marcos, Isabella y Rafael eliminados
✅ **Foto del usuario visible**: El círculo de "Mi Story" muestra la primera foto del perfil del usuario
✅ **Nombre correcto**: Muestra el nombre real del usuario en lugar de "Mi Story"
✅ **Stories persistentes**: Las stories creadas se mantienen hasta que expiren (24 horas)

## Testing

Para probar:

1. **Recargar la página** con `Ctrl + Shift + R`
2. **Verificar que NO aparezcan** Carolina, Marcos, Isabella ni Rafael
3. **Crear una story** (texto o imagen)
4. **Verificar que aparezca tu foto** en el círculo de stories
5. **Verificar que aparezca tu nombre** debajo del círculo

## Notas Técnicas

- El servicio `storiesService` es un singleton en memoria
- Las stories expiran automáticamente después de 24 horas
- La foto del usuario se obtiene de `currentUser.images[0]`
- Si el usuario no tiene foto, se usa una imagen por defecto de Unsplash
- El sistema de privacidad sigue filtrando qué stories puede ver cada usuario

## Próximos Pasos (Opcional)

- [ ] Persistir stories en Firebase Firestore
- [ ] Sincronizar stories entre dispositivos
- [ ] Agregar indicador de "visto" en tiempo real
- [ ] Implementar notificaciones cuando alguien ve tu story
