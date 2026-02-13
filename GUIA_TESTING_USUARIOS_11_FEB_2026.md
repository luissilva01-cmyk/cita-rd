# Guía de Testing con Otros Usuarios - 11 Febrero 2026

## 🎯 Objetivo

Realizar testing de la aplicación Ta' Pa' Ti con usuarios reales para validar funcionalidad, UX y detectar bugs antes del lanzamiento oficial.

---

## 📱 URL de la Aplicación

**Producción:** https://citard-fbc26.web.app

---

## 👥 Cómo Invitar Usuarios para Testing

### Opción 1: Compartir Link Directo (Más Simple)

1. Envía el link de la app: **https://citard-fbc26.web.app**
2. Pide a los usuarios que:
   - Abran el link en su navegador (Chrome, Safari, Firefox)
   - Se registren con email y contraseña
   - Completen su perfil con fotos y datos

### Opción 2: Crear Usuarios de Prueba (Más Controlado)

1. Crea cuentas de prueba manualmente:
   - Ve a https://citard-fbc26.web.app
   - Haz clic en "Registrarse"
   - Usa emails de prueba: `usuario1@test.com`, `usuario2@test.com`, etc.
   - Contraseña: `Test123!` (o la que prefieras)

2. Comparte las credenciales con los testers:
   ```
   Email: usuario1@test.com
   Contraseña: Test123!
   ```

### Opción 3: Testing en Grupo (Recomendado)

1. Organiza una sesión de testing en vivo (presencial o virtual)
2. Pide a cada persona que:
   - Traiga su celular o laptop
   - Se registre con su email personal
   - Complete su perfil
3. Observa cómo usan la app en tiempo real

---

## ✅ Checklist de Testing

### 1. Registro y Login
- [ ] Registro con email funciona
- [ ] Login con email funciona
- [ ] Recuperar contraseña funciona
- [ ] Validación de campos funciona

### 2. Perfil
- [ ] Subir fotos funciona (mínimo 2 fotos)
- [ ] Editar información personal funciona
- [ ] Cambiar idioma (Español/Inglés) funciona
- [ ] Configuración de privacidad funciona

### 3. Explorar Perfiles (Swipe)
- [ ] Ver perfiles de otros usuarios
- [ ] Swipe derecha (Like) funciona
- [ ] Swipe izquierda (Pass) funciona
- [ ] Super Like funciona
- [ ] Ver detalles del perfil funciona

### 4. Matches
- [ ] Recibir notificación de match
- [ ] Ver lista de matches
- [ ] Abrir chat desde match

### 5. Chat
- [ ] Enviar mensajes de texto
- [ ] Enviar emojis
- [ ] Enviar fotos
- [ ] Enviar mensajes de voz
- [ ] Enviar videomensajes
- [ ] Ver mensajes leídos (doble check azul)
- [ ] Borrar mensajes
- [ ] Indicador de "escribiendo..."
- [ ] Estado online/offline

### 6. Stories
- [ ] Crear story (foto/video)
- [ ] Ver stories de matches
- [ ] Reaccionar a stories
- [ ] Configurar privacidad de stories

### 7. Notificaciones
- [ ] Recibir notificaciones de nuevos mensajes
- [ ] Recibir notificaciones de matches
- [ ] Configurar notificaciones

### 8. Responsive
- [ ] Funciona en móvil (iOS/Android)
- [ ] Funciona en tablet
- [ ] Funciona en desktop
- [ ] Chat en desktop tiene ancho limitado (no ocupa toda la pantalla)

---

## 🐛 Cómo Reportar Bugs

### Información Necesaria

Cuando encuentres un bug, anota:

1. **Qué estabas haciendo:** "Estaba enviando una foto en el chat"
2. **Qué esperabas:** "La foto debería enviarse"
3. **Qué pasó:** "La foto no se envió y apareció un error"
4. **Dispositivo:** iPhone 13, Android Samsung S21, Windows PC, etc.
5. **Navegador:** Chrome, Safari, Firefox, etc.
6. **Captura de pantalla:** Si es posible

### Ejemplo de Reporte

```
BUG: No puedo enviar fotos en el chat

Pasos:
1. Abrí un chat con un match
2. Hice clic en el botón de foto
3. Seleccioné una foto de mi galería
4. La foto no se envió

Esperado: La foto debería enviarse al chat
Actual: No pasa nada, la foto no aparece

Dispositivo: iPhone 13 Pro
Navegador: Safari
```

---

## 📊 Métricas a Observar

### Engagement
- ¿Cuánto tiempo pasan en la app?
- ¿Cuántos perfiles ven?
- ¿Cuántos likes dan?
- ¿Cuántos matches logran?

### Usabilidad
- ¿Encuentran las funciones fácilmente?
- ¿Entienden cómo usar el swipe?
- ¿Saben cómo enviar mensajes?
- ¿Tienen dudas sobre alguna función?

### Performance
- ¿La app carga rápido?
- ¿Las fotos se cargan bien?
- ¿Hay lag o freezes?
- ¿Los mensajes se envían rápido?

---

## 🎤 Preguntas para los Testers

### Después de 5 minutos de uso:
1. ¿Qué te pareció la primera impresión?
2. ¿Fue fácil registrarte?
3. ¿Entendiste cómo funciona el swipe?

### Después de 15 minutos de uso:
1. ¿Qué función te gustó más?
2. ¿Qué función te confundió?
3. ¿Encontraste algún bug?
4. ¿Qué mejorarías?

### Al final de la sesión:
1. ¿Usarías esta app en tu vida real?
2. ¿Se la recomendarías a un amigo?
3. ¿Qué le falta a la app?
4. ¿Qué le sobra a la app?

---

## 🔧 Solución de Problemas Comunes

### "No puedo subir fotos"
- Verifica que el navegador tenga permisos de cámara/galería
- Intenta con una foto más pequeña (< 5MB)
- Prueba en otro navegador

### "No recibo notificaciones"
- Ve a Perfil → Configuración → Notificaciones
- Activa las notificaciones
- Permite notificaciones en el navegador cuando lo pida

### "La app se ve rara en mi celular"
- Actualiza el navegador a la última versión
- Limpia el caché del navegador
- Intenta en modo incógnito

### "No veo perfiles para hacer swipe"
- Verifica que tu perfil esté completo (mínimo 2 fotos)
- Ajusta tus preferencias de búsqueda
- Espera a que otros usuarios se registren

---

## 📱 Dispositivos Recomendados para Testing

### Móviles
- ✅ iPhone (iOS 14+)
- ✅ Android (Android 10+)
- ✅ Chrome, Safari, Firefox

### Tablets
- ✅ iPad
- ✅ Android Tablet

### Desktop
- ✅ Windows PC (Chrome, Edge, Firefox)
- ✅ Mac (Chrome, Safari, Firefox)
- ✅ Linux (Chrome, Firefox)

---

## 🎯 Escenarios de Testing Específicos

### Escenario 1: Primer Uso
1. Usuario nuevo se registra
2. Completa su perfil
3. Sube 3 fotos
4. Empieza a hacer swipe
5. Logra su primer match
6. Envía su primer mensaje

### Escenario 2: Chat Activo
1. Dos usuarios hacen match
2. Inician conversación
3. Envían mensajes de texto
4. Envían fotos
5. Envían mensajes de voz
6. Prueban videomensajes

### Escenario 3: Stories
1. Usuario crea una story
2. Otro usuario ve la story
3. Reacciona a la story
4. Inician conversación desde la story

### Escenario 4: Configuración
1. Usuario cambia idioma
2. Ajusta preferencias de búsqueda
3. Configura privacidad
4. Activa/desactiva notificaciones

---

## 📈 Siguiente Paso Después del Testing

1. **Recopila feedback:** Anota todos los comentarios y bugs
2. **Prioriza:** Clasifica bugs en críticos, importantes y menores
3. **Corrige bugs críticos:** Los que impiden usar funciones principales
4. **Mejora UX:** Implementa sugerencias de usabilidad
5. **Segundo round de testing:** Valida que los fixes funcionan
6. **Lanzamiento:** Cuando todo esté estable

---

## 🚀 Lanzamiento Oficial

### Checklist Pre-Lanzamiento
- [ ] Todos los bugs críticos resueltos
- [ ] Testing con al menos 10 usuarios reales
- [ ] Performance optimizado
- [ ] Analytics configurado
- [ ] Notificaciones funcionando
- [ ] Reglas de seguridad de Firebase configuradas
- [ ] Términos y condiciones publicados
- [ ] Política de privacidad publicada

---

## 📞 Contacto para Soporte

Si los testers tienen problemas técnicos, pueden:
- Reportar bugs en el grupo de testing
- Enviar email a: [tu-email@ejemplo.com]
- Contactarte directamente

---

## 🎉 Incentivos para Testers (Opcional)

Considera ofrecer:
- Acceso anticipado a nuevas funciones
- Badge de "Beta Tester" en su perfil
- Créditos gratis para funciones premium (si las hay)
- Reconocimiento en los créditos de la app

---

**Fecha:** 11 de Febrero 2026  
**Versión:** 2.0.0  
**URL:** https://citard-fbc26.web.app  
**Estado:** Lista para testing con usuarios reales
