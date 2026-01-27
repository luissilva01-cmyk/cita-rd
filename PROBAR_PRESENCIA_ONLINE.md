# 🧪 Guía de Pruebas - Sistema de Presencia Online/Offline

**Fecha:** 26 de enero de 2026  
**Servidor:** http://localhost:3000

---

## 🎯 Qué Vamos a Probar

El sistema de presencia en tiempo real que muestra:
- 🟢 **En línea** - Usuario activo ahora
- ⚪ **Activo hace X tiempo** - Usuario offline

---

## 📋 Preparación

### Requisitos

1. ✅ Servidor corriendo en puerto 3000
2. ✅ Dos navegadores o ventanas de incógnito
3. ✅ Dos usuarios diferentes (o dos cuentas)

### Usuarios de Prueba

Puedes usar:
- **Usuario 1:** Tu cuenta principal
- **Usuario 2:** Otra cuenta o crear una nueva

---

## 🧪 Pruebas a Realizar

### Prueba 1: Estado "En Línea" ✅

**Objetivo:** Verificar que se muestra "En línea" cuando el usuario está activo

**Pasos:**

1. **Navegador 1** - Iniciar sesión con Usuario A
2. **Navegador 2** - Iniciar sesión con Usuario B
3. En Navegador 2, ir a **Mensajes** y abrir chat con Usuario A
4. **Verificar:**
   - ✅ Debe mostrar "EN LÍNEA" en verde
   - ✅ Debe haber un punto verde al lado del nombre
   - ✅ El texto debe estar en mayúsculas

**Resultado Esperado:**
```
[Foto] Carolina
       🟢 EN LÍNEA
```

---

### Prueba 2: Estado "Activo justo ahora" ⏱️

**Objetivo:** Verificar que se muestra "Activo justo ahora" cuando el usuario acaba de cerrar

**Pasos:**

1. Con ambos usuarios online (Prueba 1)
2. En **Navegador 1**, cerrar la pestaña o ventana
3. Esperar 2-3 segundos
4. En **Navegador 2**, observar el estado en el chat
5. **Verificar:**
   - ✅ Debe cambiar a "ACTIVO JUSTO AHORA" en gris
   - ✅ El punto debe cambiar a gris
   - ✅ El cambio debe ser automático (sin recargar)

**Resultado Esperado:**
```
[Foto] Carolina
       ⚪ ACTIVO JUSTO AHORA
```

---

### Prueba 3: Estado "Activo hace X min" ⏰

**Objetivo:** Verificar que se muestra el tiempo transcurrido en minutos

**Pasos:**

1. Usuario A debe estar offline (cerrar navegador)
2. Esperar 5 minutos
3. Usuario B abre el chat
4. **Verificar:**
   - ✅ Debe mostrar "ACTIVO HACE 5 MIN" (o el tiempo real)
   - ✅ Punto gris
   - ✅ El número debe actualizarse automáticamente

**Resultado Esperado:**
```
[Foto] Carolina
       ⚪ ACTIVO HACE 5 MIN
```

---

### Prueba 4: Cambio de Pestaña 🔄

**Objetivo:** Verificar que cambiar de pestaña marca como offline

**Pasos:**

1. Usuario A online en el chat
2. Usuario A cambia a otra pestaña (Gmail, YouTube, etc.)
3. Usuario B observa el estado
4. **Verificar:**
   - ✅ Debe cambiar a offline inmediatamente
   - ✅ Debe mostrar "ACTIVO JUSTO AHORA"

5. Usuario A vuelve a la pestaña de Ta' Pa' Ti
6. **Verificar:**
   - ✅ Debe volver a "EN LÍNEA" automáticamente
   - ✅ Punto verde

---

### Prueba 5: Actualización en Tiempo Real 🔄

**Objetivo:** Verificar que los cambios se ven sin recargar

**Pasos:**

1. Usuario B tiene el chat abierto
2. Usuario A cierra la app
3. **NO RECARGAR** la página de Usuario B
4. **Verificar:**
   - ✅ El estado debe cambiar automáticamente
   - ✅ No debe requerir F5 o recarga
   - ✅ El cambio debe ser instantáneo (1-2 segundos)

---

### Prueba 6: Múltiples Chats 💬

**Objetivo:** Verificar que funciona con varios chats abiertos

**Pasos:**

1. Usuario B tiene matches con Usuario A y Usuario C
2. Abrir chat con Usuario A → Verificar estado
3. Volver a lista de mensajes
4. Abrir chat con Usuario C → Verificar estado
5. **Verificar:**
   - ✅ Cada chat muestra el estado correcto
   - ✅ Los estados son independientes
   - ✅ No hay conflictos entre chats

---

### Prueba 7: Responsive Design 📱

**Objetivo:** Verificar que funciona en móvil

**Pasos:**

1. Abrir DevTools (F12)
2. Activar modo responsive (Ctrl + Shift + M)
3. Seleccionar "iPhone 12 Pro" o similar
4. Abrir un chat
5. **Verificar:**
   - ✅ El estado se ve correctamente
   - ✅ El punto verde/gris es visible
   - ✅ El texto no se corta
   - ✅ Touch targets son de 44px mínimo

---

## 🐛 Problemas Comunes

### Problema 1: No se actualiza el estado

**Síntomas:**
- El estado se queda en "EN LÍNEA" aunque el usuario cerró

**Solución:**
1. Abrir DevTools (F12)
2. Ir a Console
3. Buscar errores en rojo
4. Verificar que Firebase está conectado
5. Verificar reglas de Firestore

### Problema 2: Muestra "undefined" o error

**Síntomas:**
- En lugar del estado, muestra "undefined"

**Solución:**
1. Verificar que las traducciones están cargadas
2. Abrir Console y buscar: `🌍 LanguageProvider`
3. Verificar que `languageService.ts` tiene las claves:
   - `online`
   - `activeJustNow`
   - `activeMinutesAgo`
   - `activeHoursAgo`
   - `activeDaysAgo`

### Problema 3: No cambia automáticamente

**Síntomas:**
- Necesito recargar para ver el cambio

**Solución:**
1. Verificar que el listener está activo
2. Abrir Console y buscar: `👁️ Setting up presence listener`
3. Verificar que no hay errores de Firestore
4. Verificar conexión a internet

---

## 📊 Checklist de Verificación

Marca cada item cuando lo hayas probado:

- [ ] Estado "En línea" se muestra correctamente
- [ ] Punto verde aparece cuando está online
- [ ] Estado cambia a "Activo justo ahora" al cerrar
- [ ] Punto cambia a gris cuando está offline
- [ ] Muestra "Activo hace X min" correctamente
- [ ] Cambio de pestaña marca como offline
- [ ] Volver a pestaña marca como online
- [ ] Actualización en tiempo real sin recargar
- [ ] Funciona con múltiples chats
- [ ] Responsive en móvil
- [ ] No hay errores en Console
- [ ] Traducciones funcionan en todos los idiomas

---

## 🎨 Apariencia Visual

### Estado Online
```
┌─────────────────────────────────┐
│ ← [Foto] Carolina        📞 📹 │
│    🟢 EN LÍNEA                  │
└─────────────────────────────────┘
```

### Estado Offline
```
┌─────────────────────────────────┐
│ ← [Foto] Carolina        📞 📹 │
│    ⚪ ACTIVO HACE 5 MIN         │
└─────────────────────────────────┘
```

---

## 🔍 Logs en Console

Deberías ver estos logs:

```javascript
// Al abrir la app
🟢 Setting up presence system for user: userId123

// Al abrir un chat
👁️ Setting up presence listener for: userId456

// Cuando cambia el estado
🟢 Presence status updated: { userId: 'userId456', status: { online: true, lastSeen: 1737936000000 } }

// Al cerrar la app
🔴 Cleaning up presence system for user: userId123
```

---

## ✅ Resultado Esperado

Si todo funciona correctamente:

1. ✅ El estado se actualiza en tiempo real
2. ✅ No requiere recargar la página
3. ✅ Funciona en desktop y móvil
4. ✅ Los colores son correctos (verde/gris)
5. ✅ El texto está en el idioma correcto
6. ✅ No hay errores en Console
7. ✅ La experiencia es fluida y natural

---

## 📝 Notas Adicionales

### Firestore Rules

Las reglas permiten:
- ✅ Cualquiera puede **leer** el estado de presencia
- ✅ Solo el usuario puede **escribir** su propio estado

### Performance

- El sistema usa listeners en tiempo real (muy eficiente)
- No hace polling constante
- Solo actualiza cuando hay cambios reales
- Limpia automáticamente al cerrar

### Idiomas Soportados

- 🇩🇴 Español (ES)
- 🇺🇸 Inglés (EN)
- 🇧🇷 Portugués (PT)
- 🇫🇷 Francés (FR)

---

## 🚀 Próximos Pasos

Después de probar, puedes:

1. **Agregar presencia en lista de mensajes**
   - Mostrar punto verde en `Messages.tsx`

2. **Agregar presencia en Discovery**
   - Mostrar usuarios online en tarjetas

3. **Notificaciones**
   - "Carolina está en línea ahora"

---

**¡Listo para probar!** 🎉

Abre http://localhost:3000 y comienza con la Prueba 1.
