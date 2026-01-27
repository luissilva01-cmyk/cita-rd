# 🧪 Cómo Probar el Sistema de Stories con Firestore

**Fecha:** 27 de enero de 2026  
**Cambio:** Stories ahora se guardan en Firestore y se comparten entre usuarios

## ✅ Cambios Implementados

1. **Persistencia en Firestore** - Stories se guardan en colección `stories`
2. **Compartición entre usuarios** - Todos ven las mismas stories
3. **Reglas de seguridad** - Desplegadas en Firebase
4. **Índices compuestos** - Optimización de queries

## 🚀 Instrucciones de Prueba

### Preparación

**Servidor debe estar corriendo:**
```bash
cd cita-rd
npm run dev
```

**URL:** http://localhost:3000

---

## 📱 Test 1: Crear Story como Juan Pérez

### Paso 1: Login como Juan Pérez
1. Abrir http://localhost:3000
2. Login con las credenciales de Juan Pérez
3. Ir a la vista Discovery (icono de corazón)

### Paso 2: Crear Story
1. Click en el botón "+" (Tu Story) en la parte superior
2. Seleccionar tipo de story:
   - **Texto:** Escribir mensaje, elegir color de fondo
   - **Imagen:** Subir foto desde galería
3. Click en "Publicar"
4. Debe aparecer mensaje: "✅ Story creada exitosamente"

### Paso 3: Verificar en Firebase Console
1. Abrir https://console.firebase.google.com/project/citard-fbc26/firestore
2. Ir a colección `stories`
3. Debe aparecer un nuevo documento con:
   ```
   userId: "KU5ZalR92QcPV7RGbLFTjEjTXZm2" (o el ID de Juan)
   type: "text" o "image"
   content: "..." (texto o URL)
   createdAt: Timestamp
   expiresAt: Timestamp (24h después)
   viewedBy: [] (array vacío)
   ```

### Paso 4: Ver Propia Story
1. En Discovery, debe aparecer tu ring con gradiente rosa
2. Click en tu ring
3. Debe abrir el visor de stories
4. Ver tu story creada

---

## 👥 Test 2: Ver Story desde Otro Usuario (Luis Silva)

### Paso 1: Abrir en Otro Navegador
1. Abrir **navegador diferente** o **ventana incógnito**
2. Ir a http://localhost:3000
3. Login como Luis Silva (correo diferente)

### Paso 2: Verificar Ring de Juan Pérez
1. Ir a Discovery
2. Debe aparecer el ring de Juan Pérez con **gradiente rosa/morado**
3. El gradiente indica que hay stories no vistas

### Paso 3: Ver Story de Juan Pérez
1. Click en el ring de Juan Pérez
2. Debe abrir el visor de stories
3. Ver la story que Juan creó
4. Story debe mostrarse correctamente (texto o imagen)

### Paso 4: Verificar Marca de Vista
1. Después de ver la story, cerrar el visor
2. El ring de Juan Pérez debe cambiar a **gris**
3. Esto indica que ya viste todas sus stories

### Paso 5: Verificar en Firebase Console
1. Ir a Firebase Console → `stories`
2. Abrir el documento de la story
3. El campo `viewedBy` debe contener el userId de Luis Silva
4. Ejemplo: `viewedBy: ["abc123", "def456"]`

---

## 🔄 Test 3: Persistencia (Recargar Página)

### Paso 1: Recargar como Juan Pérez
1. En el navegador de Juan Pérez
2. Presionar F5 o recargar página
3. Las stories deben seguir apareciendo
4. No se pierden al recargar

### Paso 2: Recargar como Luis Silva
1. En el navegador de Luis Silva
2. Presionar F5 o recargar página
3. El ring de Juan Pérez debe seguir apareciendo
4. Si ya la viste, debe estar en gris
5. Si no la viste, debe estar con gradiente

---

## 🕐 Test 4: Múltiples Stories

### Paso 1: Crear Varias Stories
1. Como Juan Pérez, crear 3 stories diferentes:
   - Story de texto con fondo rojo
   - Story de texto con fondo azul
   - Story de imagen
2. Todas deben guardarse en Firestore

### Paso 2: Ver Contador
1. Como Luis Silva, ver el ring de Juan Pérez
2. Debe aparecer un **número "3"** en la esquina del ring
3. Indica que hay 3 stories disponibles

### Paso 3: Ver Todas las Stories
1. Click en el ring de Juan Pérez
2. Debe mostrar las 3 stories en secuencia
3. Swipe o click para avanzar
4. Después de ver todas, el ring debe cambiar a gris

---

## 🔒 Test 5: Privacidad

### Paso 1: Cambiar Configuración de Privacidad
1. Como Juan Pérez, ir a Configuración de Cuenta
2. En "Privacidad de Stories", cambiar a "Solo Matches"
3. Guardar cambios

### Paso 2: Verificar Visibilidad
1. Como Luis Silva (si NO es match de Juan)
2. El ring de Juan Pérez NO debe aparecer
3. Las stories están ocultas por privacidad

### Paso 3: Restaurar Configuración
1. Como Juan Pérez, cambiar de nuevo a "Todos"
2. Como Luis Silva, el ring debe reaparecer

---

## 📊 Verificación en Logs de Consola

### Logs Esperados al Cargar Stories

```
📊 === CARGANDO STORY GROUPS DESDE FIRESTORE ===
📊 Current User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📊 Stories encontradas en Firestore: 3
✅ Stories activas cargadas: 3
📊 Usuarios con stories: 2
🔍 Procesando usuario: abc123 - Stories: 2
👁️ ¿Puede ver? true
✅ Agregando grupo: Juan Pérez - No vistas: true
🔍 Procesando usuario: def456 - Stories: 1
👁️ ¿Puede ver? true
✅ Agregando grupo: María García - No vistas: false
📊 === RESULTADO FINAL ===
📊 Grupos filtrados: 2
📊 Grupos: ['Juan Pérez', 'María García']
```

### Logs al Crear Story

```
✅ Story creada en Firestore: abc123xyz
✅ Story de texto creada
```

### Logs al Marcar como Vista

```
✅ Story marcada como vista: abc123xyz por def456
```

---

## ❌ Problemas Comunes y Soluciones

### Problema 1: "No aparecen stories"
**Causa:** Índices de Firestore aún se están creando  
**Solución:** Esperar 5-10 minutos después del deploy

### Problema 2: "Error al crear story"
**Causa:** Reglas de Firestore no desplegadas  
**Solución:**
```bash
cd cita-rd
firebase deploy --only firestore:rules
```

### Problema 3: "Stories no se comparten"
**Causa:** Usuarios tienen el mismo userId  
**Solución:** Verificar que cada usuario tenga userId diferente en Firebase Auth

### Problema 4: "Ring no cambia de color"
**Causa:** viewedBy no se actualiza  
**Solución:** Verificar logs de consola, puede ser problema de permisos

---

## 🎯 Checklist de Verificación

- [ ] Story se crea correctamente
- [ ] Story aparece en Firebase Console
- [ ] Story se ve en el mismo navegador
- [ ] Story se ve en otro navegador (otro usuario)
- [ ] Ring tiene gradiente para stories no vistas
- [ ] Ring cambia a gris después de ver
- [ ] Contador muestra número correcto de stories
- [ ] Stories persisten después de recargar
- [ ] viewedBy se actualiza en Firestore
- [ ] Privacidad funciona correctamente

---

## 📸 Capturas Esperadas

### Firebase Console - Colección Stories
```
stories/
  ├── abc123xyz/
  │   ├── userId: "KU5ZalR92QcPV7RGbLFTjEjTXZm2"
  │   ├── type: "text"
  │   ├── content: "¡Hola mundo!"
  │   ├── backgroundColor: "#FF6B6B"
  │   ├── textColor: "#FFFFFF"
  │   ├── createdAt: January 27, 2026 at 10:30:00 AM
  │   ├── expiresAt: January 28, 2026 at 10:30:00 AM
  │   └── viewedBy: ["def456"]
```

### App - Vista Discovery
```
┌─────────────────────────────────────┐
│  [+]  [Juan]  [María]  [⚙️]         │
│  Tu   Pérez   García   Config       │
│ Story                                │
└─────────────────────────────────────┘
```

---

## ✅ Resultado Esperado

**ANTES:**
- Juan crea story → Solo Juan la ve
- Luis abre app → No ve nada
- Recargar → Stories desaparecen

**AHORA:**
- Juan crea story → Se guarda en Firestore
- Luis abre app → Ve story de Juan
- Recargar → Stories persisten
- **¡FUNCIONA! 🎉**

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de consola del navegador
2. Verificar Firebase Console → Firestore → `stories`
3. Verificar que reglas e índices estén desplegados
4. Verificar que servidor esté corriendo en puerto 3000

**Email:** tapapatisoporte@gmail.com
