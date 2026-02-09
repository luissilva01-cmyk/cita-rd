# 🧪 Guía de Testing Completo - Ta' Pa' Ti
## Fecha: 9 de Febrero 2026

**Objetivo:** Probar todas las funcionalidades críticas antes del lanzamiento

---

## 📋 CHECKLIST DE TESTING

### ✅ = Funciona correctamente
### ⚠️ = Funciona con advertencias
### ❌ = No funciona / Bug encontrado

---

## 🔐 1. AUTENTICACIÓN (15 minutos)

### 1.1 Registro de Usuario
- [ ] Abrir http://localhost:3000/
- [ ] Hacer clic en "Registrarse"
- [ ] Completar formulario con email válido
- [ ] Verificar que se cree la cuenta
- [ ] Verificar que redirija a completar perfil

**Resultado:** ___________

**Errores encontrados:**
```
(Anotar aquí cualquier error)
```

---

### 1.2 Login con Email/Password
- [ ] Hacer logout si estás logueado
- [ ] Ingresar email y contraseña
- [ ] Verificar que inicie sesión correctamente
- [ ] Verificar que redirija a Home

**Resultado:** ___________

---

### 1.3 Login con Google
- [ ] Hacer clic en "Continuar con Google"
- [ ] Seleccionar cuenta de Google
- [ ] Verificar que inicie sesión
- [ ] Verificar que cree/actualice perfil

**Resultado:** ___________

---

### 1.4 Recuperar Contraseña
- [ ] Hacer clic en "¿Olvidaste tu contraseña?"
- [ ] Ingresar email
- [ ] Verificar que llegue email de recuperación
- [ ] Seguir link y cambiar contraseña
- [ ] Verificar que puedas iniciar sesión con nueva contraseña

**Resultado:** ___________

---

## 👤 2. PERFIL DE USUARIO (20 minutos)

### 2.1 Completar Perfil
- [ ] Ir a Perfil
- [ ] Completar todos los campos obligatorios:
  - [ ] Nombre
  - [ ] Edad
  - [ ] Género
  - [ ] Ubicación
  - [ ] Intereses (mínimo 3)
  - [ ] Bio
- [ ] Guardar cambios
- [ ] Verificar que se guarden en Firestore

**Resultado:** ___________

---

### 2.2 Subir Fotos con ImageKit
- [ ] Ir a Perfil
- [ ] Hacer clic en "Agregar foto"
- [ ] Seleccionar una imagen (JPG/PNG, < 5MB)
- [ ] Verificar que se suba correctamente
- [ ] Verificar que la foto se muestre en el perfil
- [ ] Verificar URL en consola (debe ser de ImageKit)

**URL de la foto:** ___________

**Resultado:** ___________

---

### 2.3 Validación de Fotos Obligatorias
- [ ] Intentar guardar perfil sin fotos
- [ ] Verificar que muestre error: "Debes tener al menos 1 foto"
- [ ] Subir una foto
- [ ] Verificar que ahora permita guardar

**Resultado:** ___________

---

### 2.4 Validación de Rostro en Fotos
- [ ] Intentar subir una foto de paisaje
- [ ] Verificar que rechace la foto
- [ ] Intentar subir un avatar/dibujo
- [ ] Verificar que rechace la foto
- [ ] Subir una foto con rostro claro
- [ ] Verificar que acepte la foto

**Resultado:** ___________

---

### 2.5 Eliminar Fotos
- [ ] Hacer clic en "X" en una foto
- [ ] Confirmar eliminación
- [ ] Verificar que se elimine de la UI
- [ ] Verificar que se elimine de Firestore

**Resultado:** ___________

---

### 2.6 Cambiar Idioma
- [ ] Ir a Configuración
- [ ] Cambiar idioma a Inglés
- [ ] Verificar que toda la UI cambie a inglés
- [ ] Cambiar de vuelta a Español
- [ ] Verificar que vuelva a español

**Resultado:** ___________

---

## 🔍 3. DISCOVERY / SWIPE (15 minutos)

### 3.1 Ver Perfiles
- [ ] Ir a Discovery
- [ ] Verificar que carguen perfiles de otros usuarios
- [ ] Verificar que NO aparezcan perfiles sin fotos
- [ ] Verificar que las fotos se vean correctamente

**Cantidad de perfiles mostrados:** ___________

**Resultado:** ___________

---

### 3.2 Dar Like
- [ ] Deslizar a la derecha (o hacer clic en ❤️)
- [ ] Verificar animación de like
- [ ] Verificar que el perfil desaparezca
- [ ] Verificar que se guarde en Firestore

**Resultado:** ___________

---

### 3.3 Dar Dislike
- [ ] Deslizar a la izquierda (o hacer clic en ✖️)
- [ ] Verificar que el perfil desaparezca
- [ ] Verificar que NO se cree match

**Resultado:** ___________

---

### 3.4 Super Like
- [ ] Hacer clic en ⭐ (Super Like)
- [ ] Verificar animación especial
- [ ] Verificar que se guarde como super like

**Resultado:** ___________

---

### 3.5 Crear Match
- [ ] Usuario A da like a Usuario B
- [ ] Usuario B da like a Usuario A
- [ ] Verificar que aparezca modal "¡Es un Match!"
- [ ] Verificar que ambos aparezcan en Matches

**Resultado:** ___________

---

## 💬 4. CHAT Y MENSAJES (20 minutos)

### 4.1 Enviar Mensaje de Texto
- [ ] Ir a Matches
- [ ] Abrir un match
- [ ] Escribir mensaje
- [ ] Enviar
- [ ] Verificar que aparezca en el chat
- [ ] Verificar timestamp

**Resultado:** ___________

---

### 4.2 Typing Indicator
- [ ] Abrir chat en 2 navegadores (2 usuarios)
- [ ] Usuario A empieza a escribir
- [ ] Verificar que Usuario B vea "escribiendo..."
- [ ] Usuario A deja de escribir
- [ ] Verificar que desaparezca el indicador

**Resultado:** ___________

---

### 4.3 Presencia Online
- [ ] Verificar que se muestre "En línea" cuando el usuario está activo
- [ ] Cerrar sesión del otro usuario
- [ ] Verificar que cambie a "Última vez: hace X minutos"

**Resultado:** ___________

---

### 4.4 Enviar Foto en Chat
- [ ] Hacer clic en 📷
- [ ] Seleccionar foto
- [ ] Enviar
- [ ] Verificar que se suba a ImageKit
- [ ] Verificar que se muestre en el chat
- [ ] Hacer clic en la foto
- [ ] Verificar que abra modal de preview

**Resultado:** ___________

---

### 4.5 Mensaje de Voz
- [ ] Hacer clic en 🎤
- [ ] Permitir acceso al micrófono
- [ ] Grabar mensaje (5-10 segundos)
- [ ] Enviar
- [ ] Verificar que se suba
- [ ] Reproducir mensaje
- [ ] Verificar que se escuche correctamente

**Resultado:** ___________

---

### 4.6 Video Mensaje
- [ ] Hacer clic en 📹
- [ ] Permitir acceso a cámara
- [ ] Grabar video (5-10 segundos)
- [ ] Enviar
- [ ] Verificar que se suba
- [ ] Reproducir video
- [ ] Verificar que se vea correctamente

**Resultado:** ___________

---

## 📖 5. STORIES (15 minutos)

### 5.1 Crear Story de Texto
- [ ] Ir a Home
- [ ] Hacer clic en "Tu Story"
- [ ] Escribir texto
- [ ] Publicar
- [ ] Verificar que aparezca en tu ring
- [ ] Verificar que tus matches puedan verla

**Resultado:** ___________

---

### 5.2 Crear Story con Foto
- [ ] Hacer clic en "Tu Story"
- [ ] Seleccionar foto
- [ ] Agregar texto (opcional)
- [ ] Publicar
- [ ] Verificar que se suba a ImageKit
- [ ] Verificar que se muestre correctamente

**Resultado:** ___________

---

### 5.3 Ver Stories de Matches
- [ ] Hacer clic en ring de un match
- [ ] Verificar que se abra viewer
- [ ] Verificar que se muestre la story
- [ ] Deslizar para ver siguiente story
- [ ] Verificar que funcione correctamente

**Resultado:** ___________

---

### 5.4 Reaccionar a Story
- [ ] Abrir story de un match
- [ ] Hacer clic en emoji de reacción
- [ ] Verificar que se envíe
- [ ] Verificar que el otro usuario reciba notificación

**Resultado:** ___________

---

### 5.5 Responder a Story
- [ ] Abrir story de un match
- [ ] Escribir mensaje
- [ ] Enviar
- [ ] Verificar que se cree conversación en chat

**Resultado:** ___________

---

### 5.6 Privacidad de Stories
- [ ] Ir a Configuración de Stories
- [ ] Cambiar a "Solo matches"
- [ ] Publicar story
- [ ] Verificar que solo matches puedan verla
- [ ] Cambiar a "Todos"
- [ ] Verificar que todos puedan verla

**Resultado:** ___________

---

## 🔔 6. NOTIFICACIONES PUSH (15 minutos)

### 6.1 Activar Notificaciones
- [ ] Esperar 3 segundos después de login
- [ ] Verificar que aparezca prompt de notificaciones
- [ ] Hacer clic en "Activar"
- [ ] Aceptar permiso del navegador
- [ ] Verificar que se guarde token en Firestore
- [ ] Verificar campo `deleted: false`

**Resultado:** ___________

---

### 6.2 Notificación de Mensaje
- [ ] Usuario A envía mensaje a Usuario B
- [ ] Verificar que Usuario B reciba notificación push
- [ ] Hacer clic en notificación
- [ ] Verificar que abra el chat

**Resultado:** ___________

---

### 6.3 Notificación de Match
- [ ] Crear un match nuevo
- [ ] Verificar que ambos usuarios reciban notificación
- [ ] Verificar texto: "🎉 ¡Nuevo Match!"

**Resultado:** ___________

---

### 6.4 Notificación de Story
- [ ] Usuario A publica story
- [ ] Verificar que sus matches reciban notificación
- [ ] Verificar texto: "[Nombre] publicó una historia"

**Resultado:** ___________

---

### 6.5 Desactivar Notificaciones
- [ ] Ir a Configuración
- [ ] Desactivar notificaciones
- [ ] Verificar que se actualice `deleted: true` en Firestore
- [ ] Enviar mensaje de prueba
- [ ] Verificar que NO llegue notificación

**Resultado:** ___________

---

## 🤖 7. MATCHING AI (10 minutos)

### 7.1 Predicciones de Compatibilidad
- [ ] Ir a Discovery
- [ ] Verificar que se muestre % de compatibilidad
- [ ] Verificar que NO haya errores en consola
- [ ] Verificar que funcione con perfiles completos
- [ ] Verificar que maneje perfiles incompletos sin romper

**Resultado:** ___________

---

### 7.2 Insights Emocionales
- [ ] Abrir perfil de un match
- [ ] Verificar que se muestren insights
- [ ] Verificar que sean relevantes

**Resultado:** ___________

---

## 🔒 8. PRIVACIDAD Y SEGURIDAD (10 minutos)

### 8.1 Bloquear Usuario
- [ ] Ir a perfil de un usuario
- [ ] Hacer clic en "Bloquear"
- [ ] Confirmar
- [ ] Verificar que desaparezca de Discovery
- [ ] Verificar que no pueda enviar mensajes

**Resultado:** ___________

---

### 8.2 Reportar Usuario
- [ ] Ir a perfil de un usuario
- [ ] Hacer clic en "Reportar"
- [ ] Seleccionar motivo
- [ ] Enviar reporte
- [ ] Verificar que se guarde en Firestore

**Resultado:** ___________

---

### 8.3 Eliminar Cuenta
- [ ] Ir a Configuración
- [ ] Hacer clic en "Eliminar cuenta"
- [ ] Ingresar contraseña para confirmar
- [ ] Confirmar eliminación
- [ ] Verificar que se eliminen todos los datos
- [ ] Verificar que no puedas iniciar sesión

**Resultado:** ___________

---

## 📱 9. RESPONSIVE DESIGN (15 minutos)

### 9.1 Desktop (1920x1080)
- [ ] Abrir en pantalla grande
- [ ] Verificar que se muestre sidebar
- [ ] Verificar que el layout sea de 3 columnas
- [ ] Verificar que todo se vea bien

**Resultado:** ___________

---

### 9.2 Tablet (768x1024)
- [ ] Redimensionar ventana a tablet
- [ ] Verificar que se adapte correctamente
- [ ] Verificar que la navegación funcione

**Resultado:** ___________

---

### 9.3 Mobile (375x667)
- [ ] Redimensionar ventana a móvil
- [ ] Verificar que se muestre bottom navigation
- [ ] Verificar que todo sea accesible
- [ ] Verificar que los gestos funcionen

**Resultado:** ___________

---

## ⚡ 10. PERFORMANCE (10 minutos)

### 10.1 Tiempo de Carga Inicial
- [ ] Abrir DevTools > Network
- [ ] Recargar página
- [ ] Anotar tiempo de carga

**Tiempo:** ___________ segundos

**Resultado:** ___________

---

### 10.2 Carga de Imágenes
- [ ] Ir a Discovery
- [ ] Verificar que las imágenes carguen rápido
- [ ] Verificar que usen ImageKit CDN

**Resultado:** ___________

---

### 10.3 Navegación entre Vistas
- [ ] Navegar entre Home, Discovery, Matches, Profile
- [ ] Verificar que sea fluido
- [ ] Verificar que no haya lag

**Resultado:** ___________

---

## 🐛 BUGS ENCONTRADOS

### Bug #1
**Descripción:** ___________
**Severidad:** Alta / Media / Baja
**Pasos para reproducir:**
1. ___________
2. ___________
3. ___________

**Screenshot/Log:** ___________

---

### Bug #2
**Descripción:** ___________
**Severidad:** Alta / Media / Baja
**Pasos para reproducir:**
1. ___________
2. ___________
3. ___________

**Screenshot/Log:** ___________

---

### Bug #3
**Descripción:** ___________
**Severidad:** Alta / Media / Baja
**Pasos para reproducir:**
1. ___________
2. ___________
3. ___________

**Screenshot/Log:** ___________

---

## 📊 RESUMEN FINAL

### Funcionalidades Probadas
- Total: _____ / 50
- Funcionando: _____ 
- Con advertencias: _____
- Con errores: _____

### Bugs Críticos Encontrados
- Total: _____
- Descripción: ___________

### Bugs Menores Encontrados
- Total: _____
- Descripción: ___________

### Recomendación
- [ ] ✅ Listo para lanzamiento
- [ ] ⚠️ Listo con advertencias (especificar)
- [ ] ❌ NO listo (corregir bugs críticos primero)

**Notas adicionales:**
___________

---

## 🎯 PRÓXIMOS PASOS

Después de completar este testing:

1. **Si hay bugs críticos:**
   - Documentar en `BUGS_CRITICOS_09_FEB_2026.md`
   - Corregir antes de lanzar
   - Re-testear

2. **Si todo funciona:**
   - Proceder con optimización de queries
   - Preparar para producción
   - Configurar dominio

3. **Testing adicional:**
   - Testing en múltiples navegadores
   - Testing en dispositivos reales
   - Testing de carga con múltiples usuarios

---

**Tester:** ___________  
**Fecha:** 9 de Febrero 2026  
**Duración:** ___________ minutos  
**Navegador:** ___________  
**Sistema Operativo:** ___________
