# 🧪 Checklist de Testing Completo - Ta' Pa' Ti

## Fecha de Testing
**Inicio:** _________  
**Completado:** _________  
**Tester:** _________

---

## 📱 Configuración Inicial

### Preparación
- [ ] Servidor corriendo en http://localhost:3000
- [ ] Consola del navegador abierta (F12)
- [ ] Firebase Console abierta en otra pestaña
- [ ] Notepad/documento para anotar bugs

### Dispositivos a Probar
- [ ] Desktop (Chrome/Edge)
- [ ] Mobile (Chrome en modo responsive F12)
- [ ] Tablet (opcional)

---

## 🔐 FASE 1: Autenticación

### 1.1 Página de Login
**URL:** http://localhost:3000/login

- [ ] La página carga correctamente
- [ ] Logo "Ta' Pa' Ti" visible
- [ ] Campos de email y contraseña presentes
- [ ] Botón "Iniciar Sesión" visible
- [ ] Link "¿Olvidaste tu contraseña?" funciona
- [ ] Link "Crear cuenta" funciona
- [ ] Footer con enlaces legales visible
- [ ] Diseño responsive en mobile

**Pruebas de Validación:**
- [ ] Email inválido muestra error
- [ ] Contraseña vacía muestra error
- [ ] Credenciales incorrectas muestran error apropiado

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 1.2 Página de Registro
**URL:** http://localhost:3000/register

- [ ] La página carga correctamente
- [ ] Campos: Nombre, Email, Contraseña, Confirmar Contraseña
- [ ] Texto de aceptación incluye "mayor de 18 años"
- [ ] Enlaces a Términos y Privacidad funcionan
- [ ] Botón "Crear Cuenta" visible
- [ ] Link "Ya tengo cuenta" funciona
- [ ] Diseño responsive en mobile

**Pruebas de Registro:**
- [ ] Registrar con email válido funciona
- [ ] Contraseñas no coinciden muestra error
- [ ] Email ya registrado muestra error
- [ ] Registro exitoso redirige a la app

**Credenciales de prueba creadas:**
```
Email: _______________________
Contraseña: __________________
```

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 1.3 Recuperar Contraseña
**URL:** http://localhost:3000/forgot-password

- [ ] La página carga correctamente
- [ ] Campo de email presente
- [ ] Botón "Enviar enlace" funciona
- [ ] Mensaje de confirmación aparece
- [ ] Email de recuperación llega (revisar inbox)
- [ ] Link en email funciona
- [ ] Botón "Volver" funciona

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 1.4 Documentos Legales (Sin Login)

**Términos de Servicio:**
- [ ] Accesible desde login: http://localhost:3000/terms-of-service
- [ ] Accesible directamente sin login
- [ ] Botón "Atrás" funciona
- [ ] Scroll funciona correctamente
- [ ] Todas las secciones visibles
- [ ] Marca "Ta' Pa' Ti" consistente (no "CitaRD")
- [ ] Sección "Estado Beta" presente
- [ ] Email de contacto correcto: tapapatisoporte@gmail.com
- [ ] Responsive en mobile

**Política de Privacidad:**
- [ ] Accesible desde login: http://localhost:3000/privacy-policy
- [ ] Accesible directamente sin login
- [ ] Botón "Atrás" funciona
- [ ] Scroll funciona correctamente
- [ ] Todas las secciones visibles
- [ ] Marca "Ta' Pa' Ti" consistente
- [ ] Lenguaje sobre IA moderado
- [ ] Responsive en mobile

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 🏠 FASE 2: Navegación Principal

### 2.1 Home / Dashboard
**Después de login exitoso**

- [ ] Redirige automáticamente a /app
- [ ] Header con logo "Ta' Pa' Ti" visible
- [ ] Navegación inferior/lateral visible
- [ ] Sección de Stories visible
- [ ] Matches recientes visibles (si hay)
- [ ] Botones de navegación funcionan
- [ ] Diseño responsive

**Desktop:**
- [ ] Sidebar izquierdo visible
- [ ] Contenido principal centrado
- [ ] Layout profesional

**Mobile:**
- [ ] Bottom navigation visible
- [ ] Contenido ocupa pantalla completa
- [ ] Gestos de swipe funcionan

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 2.2 Navegación entre Secciones

**Tabs/Secciones principales:**
- [ ] Home/Inicio
- [ ] Discovery/Explorar
- [ ] Messages/Mensajes
- [ ] Matches
- [ ] Profile/Perfil

**Pruebas:**
- [ ] Cada tab carga correctamente
- [ ] Transiciones suaves
- [ ] Estado activo visible
- [ ] No hay errores en consola

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 👤 FASE 3: Perfil de Usuario

### 3.1 Ver Perfil Propio
**Navegar a: Perfil/Profile**

- [ ] Foto de perfil visible (o placeholder)
- [ ] Nombre visible
- [ ] Edad visible
- [ ] Biografía visible
- [ ] Intereses visibles
- [ ] Botón "Editar Perfil" presente
- [ ] Botón "Configuración" presente
- [ ] Diseño responsive

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 3.2 Editar Perfil

- [ ] Modal/página de edición abre
- [ ] Campos editables: Nombre, Edad, Bio
- [ ] Selector de intereses funciona
- [ ] Botón "Subir foto" presente
- [ ] Botón "Guardar" funciona
- [ ] Cambios se reflejan inmediatamente
- [ ] Validación de campos funciona

**Pruebas de Fotos:**
- [ ] Subir foto desde galería funciona
- [ ] Tomar foto con cámara funciona (si disponible)
- [ ] Preview de foto antes de subir
- [ ] Foto se guarda en Firebase Storage
- [ ] Foto se muestra en perfil

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 3.3 Configuración de Cuenta

- [ ] Página de configuración abre
- [ ] Opciones de privacidad visibles
- [ ] Configuración de notificaciones
- [ ] Opción de cambiar idioma
- [ ] Botón "Cerrar Sesión" funciona
- [ ] Botón "Eliminar Cuenta" presente (si aplica)

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 💘 FASE 4: Discovery/Swipe

### 4.1 Ver Perfiles

- [ ] Perfiles se cargan correctamente
- [ ] Fotos se muestran claramente
- [ ] Información básica visible (nombre, edad, distancia)
- [ ] Biografía legible
- [ ] Intereses visibles
- [ ] Diseño de tarjeta atractivo

**Desktop:**
- [ ] Tarjeta centrada
- [ ] Tamaño apropiado
- [ ] Botones de acción visibles

**Mobile:**
- [ ] Tarjeta ocupa pantalla
- [ ] Gestos de swipe funcionan
- [ ] Botones táctiles grandes

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 4.2 Interacciones de Swipe

**Swipe Left (No me gusta):**
- [ ] Gesto funciona
- [ ] Animación suave
- [ ] Siguiente perfil aparece
- [ ] No hay errores

**Swipe Right (Me gusta):**
- [ ] Gesto funciona
- [ ] Animación suave
- [ ] Si hay match, modal aparece
- [ ] Siguiente perfil aparece

**Super Like:**
- [ ] Botón/gesto funciona
- [ ] Animación especial visible
- [ ] Efecto visual distintivo

**Botones de Acción:**
- [ ] Botón X (rechazar) funciona
- [ ] Botón ❤️ (like) funciona
- [ ] Botón ⭐ (super like) funciona
- [ ] Botón ℹ️ (ver más info) funciona

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 4.3 Match Modal

**Cuando hay match:**
- [ ] Modal aparece automáticamente
- [ ] Fotos de ambos usuarios visibles
- [ ] Mensaje "¡Es un Match!" visible
- [ ] Botón "Enviar Mensaje" funciona
- [ ] Botón "Seguir Explorando" funciona
- [ ] Animación celebratoria (si aplica)

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 💬 FASE 5: Mensajería

### 5.1 Lista de Matches/Chats

- [ ] Lista de matches visible
- [ ] Fotos de matches visibles
- [ ] Último mensaje visible
- [ ] Timestamp visible
- [ ] Badge de mensajes no leídos (si aplica)
- [ ] Click en match abre chat
- [ ] Lista se actualiza en tiempo real

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 5.2 Chat Individual

**Interfaz:**
- [ ] Header con foto y nombre del match
- [ ] Historial de mensajes visible
- [ ] Input de texto presente
- [ ] Botón enviar funciona
- [ ] Scroll automático a último mensaje
- [ ] Diseño de burbujas claro

**Enviar Mensajes:**
- [ ] Mensaje de texto se envía
- [ ] Mensaje aparece inmediatamente
- [ ] Mensaje se guarda en Firebase
- [ ] Otro usuario puede ver mensaje (probar con 2 cuentas)
- [ ] Timestamp visible

**Funciones Avanzadas (si implementadas):**
- [ ] Emojis funcionan
- [ ] GIFs funcionan
- [ ] Mensajes de voz funcionan
- [ ] Compartir fotos funciona
- [ ] Indicador "escribiendo..." funciona

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 📖 FASE 6: Stories

### 6.1 Ver Stories

- [ ] Ring de stories visible en home
- [ ] Stories de matches visibles
- [ ] Click en story abre viewer
- [ ] Navegación entre stories funciona
- [ ] Barra de progreso visible
- [ ] Auto-avance funciona
- [ ] Botón cerrar funciona

**Interacciones:**
- [ ] Reaccionar a story funciona
- [ ] Responder a story funciona
- [ ] Respuesta crea mensaje en chat

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 6.2 Crear Story

- [ ] Botón "Crear Story" visible
- [ ] Modal de creación abre
- [ ] Subir foto funciona
- [ ] Tomar foto funciona
- [ ] Agregar texto funciona
- [ ] Preview antes de publicar
- [ ] Publicar funciona
- [ ] Story aparece en tu perfil
- [ ] Matches pueden ver tu story

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 🔔 FASE 7: Notificaciones

### 7.1 Sistema de Notificaciones

- [ ] Notificación de nuevo match
- [ ] Notificación de nuevo mensaje
- [ ] Notificación de like recibido
- [ ] Badge de contador funciona
- [ ] Click en notificación navega correctamente

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 🌐 FASE 8: Responsive Design

### 8.1 Mobile (320px - 640px)

**Páginas a probar:**
- [ ] Login responsive
- [ ] Register responsive
- [ ] Home responsive
- [ ] Discovery responsive
- [ ] Chat responsive
- [ ] Profile responsive

**Elementos:**
- [ ] Texto legible
- [ ] Botones táctiles (min 44px)
- [ ] Imágenes se adaptan
- [ ] No hay scroll horizontal
- [ ] Bottom navigation visible

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 8.2 Tablet (641px - 1023px)

- [ ] Layout se adapta
- [ ] Contenido centrado
- [ ] Espaciado apropiado
- [ ] Navegación funcional

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 8.3 Desktop (1024px+)

- [ ] Sidebar visible
- [ ] Layout profesional
- [ ] Contenido no demasiado ancho
- [ ] Hover effects funcionan
- [ ] Keyboard navigation funciona

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 🔒 FASE 9: Seguridad y Privacidad

### 9.1 Autenticación

- [ ] Sesión persiste al recargar
- [ ] Logout funciona correctamente
- [ ] Rutas protegidas redirigen a login
- [ ] Token expira apropiadamente

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 9.2 Privacidad

- [ ] Solo matches pueden enviar mensajes
- [ ] Perfil privado no visible para bloqueados
- [ ] Configuración de privacidad funciona
- [ ] Bloquear usuario funciona
- [ ] Reportar usuario funciona

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## ⚡ FASE 10: Performance

### 10.1 Velocidad de Carga

- [ ] Página inicial carga en < 3 segundos
- [ ] Imágenes cargan progresivamente
- [ ] No hay lag al navegar
- [ ] Transiciones suaves
- [ ] No hay memory leaks (revisar en DevTools)

**Tiempos medidos:**
```
Login: _______ segundos
Home: _______ segundos
Discovery: _______ segundos
Chat: _______ segundos
```

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 10.2 Optimización

- [ ] Imágenes optimizadas (< 500KB)
- [ ] Lazy loading funciona
- [ ] Cache funciona correctamente
- [ ] Bundle size razonable

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 🐛 FASE 11: Errores y Edge Cases

### 11.1 Manejo de Errores

- [ ] Error de red muestra mensaje apropiado
- [ ] Error de Firebase muestra mensaje claro
- [ ] 404 maneja correctamente
- [ ] Error boundary funciona
- [ ] Errores no rompen la app

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

### 11.2 Edge Cases

- [ ] Sin conexión a internet
- [ ] Sin perfiles disponibles
- [ ] Sin matches
- [ ] Sin mensajes
- [ ] Perfil sin foto
- [ ] Biografía muy larga
- [ ] Nombre muy largo

**Bugs encontrados:**
```
_______________________________________________________
_______________________________________________________
```

---

## 🔍 FASE 12: Consola del Navegador

### 12.1 Errores en Consola

**Revisar en cada página:**
- [ ] Login: Sin errores
- [ ] Register: Sin errores
- [ ] Home: Sin errores
- [ ] Discovery: Sin errores
- [ ] Chat: Sin errores
- [ ] Profile: Sin errores

**Errores encontrados:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

### 12.2 Warnings

**Warnings aceptables:**
- Tailwind CDN warning (ya conocido)
- React DevTools warnings menores

**Warnings a investigar:**
```
_______________________________________________________
_______________________________________________________
```

---

## 📊 RESUMEN FINAL

### Estadísticas de Testing

**Total de pruebas:** _______  
**Pruebas exitosas:** _______  
**Bugs encontrados:** _______  
**Bugs críticos:** _______  
**Bugs menores:** _______

---

### Bugs Críticos (Bloquean lanzamiento)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

### Bugs Menores (No bloquean lanzamiento)

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

### Mejoras Sugeridas

1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## ✅ Decisión Final

**¿La app está lista para beta?**

- [ ] ✅ SÍ - Proceder con deployment
- [ ] ⚠️ CASI - Corregir bugs críticos primero
- [ ] ❌ NO - Requiere más trabajo

**Próximos pasos:**
```
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

## 📝 Notas Adicionales

```
_______________________________________________________
_______________________________________________________
_______________________________________________________
_______________________________________________________
_______________________________________________________
```

---

**Fecha de completado:** _________  
**Firma del tester:** _________
