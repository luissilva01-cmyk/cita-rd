# 🚀 Guía Rápida de Testing - Ta' Pa' Ti

## Empezar Ahora (5 minutos)

### 1. Abre el Checklist
Abre el archivo `TESTING_CHECKLIST.md` en un editor o imprime una copia.

### 2. Prepara tu Entorno
```bash
# Asegúrate de que el servidor está corriendo
cd cita-rd
npm run dev
```

Deberías ver:
```
VITE v7.1.5  ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 3. Abre las Herramientas
- **Navegador:** Chrome o Edge
- **DevTools:** Presiona F12
- **Tab Console:** Para ver errores
- **Tab Network:** Para ver peticiones
- **Responsive Mode:** Ctrl+Shift+M (para probar mobile)

### 4. Abre Firebase Console
https://console.firebase.google.com/
- Ve a tu proyecto
- Abre Firestore Database
- Abre Authentication

---

## 🎯 Testing Rápido (30 minutos)

Si tienes poco tiempo, prueba esto primero:

### Prueba 1: Registro (5 min)
1. Ve a http://localhost:3000/register
2. Crea una cuenta con email real
3. Verifica que llegues a la app

### Prueba 2: Documentos Legales (3 min)
1. Ve a http://localhost:3000/terms-of-service
2. Verifica que se vea bien
3. Ve a http://localhost:3000/privacy-policy
4. Verifica que se vea bien

### Prueba 3: Perfil (5 min)
1. Ve a tu perfil
2. Edita tu información
3. Sube una foto
4. Guarda cambios

### Prueba 4: Discovery (5 min)
1. Ve a Discovery/Explorar
2. Haz swipe en algunos perfiles
3. Da like a alguien
4. Verifica que funcione

### Prueba 5: Mobile (5 min)
1. Presiona F12 → Responsive Mode
2. Selecciona "iPhone 12 Pro"
3. Navega por la app
4. Verifica que todo se vea bien

### Prueba 6: Consola (2 min)
1. Revisa la consola (F12)
2. Anota cualquier error en rojo
3. Ignora warnings de Tailwind CDN

### Prueba 7: Logout (2 min)
1. Cierra sesión
2. Intenta acceder a /app
3. Verifica que redirija a login

### Prueba 8: Login (3 min)
1. Inicia sesión con tu cuenta
2. Verifica que llegues a la app
3. Verifica que tus datos estén ahí

---

## 📋 Checklist Mínimo

Antes de lanzar beta, DEBES verificar:

- [ ] ✅ Registro funciona
- [ ] ✅ Login funciona
- [ ] ✅ Logout funciona
- [ ] ✅ Documentos legales accesibles
- [ ] ✅ Perfil se puede editar
- [ ] ✅ Fotos se pueden subir
- [ ] ✅ Swipe funciona
- [ ] ✅ Responsive en mobile
- [ ] ✅ Sin errores críticos en consola
- [ ] ✅ Firebase conectado correctamente

---

## 🐛 Cómo Reportar Bugs

Cuando encuentres un bug, anota:

### Formato de Reporte
```
BUG #X: [Título corto]

Severidad: [Crítico / Alto / Medio / Bajo]

Pasos para reproducir:
1. Ir a...
2. Hacer click en...
3. Ver que...

Resultado esperado:
[Qué debería pasar]

Resultado actual:
[Qué pasa realmente]

Navegador: [Chrome/Edge/Firefox]
Dispositivo: [Desktop/Mobile]
Screenshot: [Si aplica]

Error en consola:
[Copiar error si hay]
```

### Ejemplo
```
BUG #1: Foto de perfil no se guarda

Severidad: Alto

Pasos para reproducir:
1. Ir a Perfil
2. Click en "Editar"
3. Subir foto desde galería
4. Click en "Guardar"
5. Recargar página

Resultado esperado:
La foto debería aparecer en el perfil

Resultado actual:
La foto desaparece al recargar

Navegador: Chrome
Dispositivo: Desktop

Error en consola:
Error: Failed to upload image to Firebase Storage
```

---

## 🎨 Testing de Diseño

### Checklist Visual
- [ ] Colores consistentes con marca
- [ ] Fuentes legibles
- [ ] Espaciado apropiado
- [ ] Botones tienen buen tamaño
- [ ] Imágenes no pixeladas
- [ ] Iconos alineados
- [ ] Textos sin errores ortográficos

### Responsive
- [ ] Mobile (375px): iPhone
- [ ] Tablet (768px): iPad
- [ ] Desktop (1440px): Laptop

---

## 🔥 Testing de Firebase

### Verificar en Firebase Console

**Authentication:**
- [ ] Usuario aparece en lista
- [ ] Email correcto
- [ ] UID generado

**Firestore:**
- [ ] Colección "users" existe
- [ ] Documento de usuario creado
- [ ] Datos correctos guardados

**Storage:**
- [ ] Carpeta de usuario creada
- [ ] Fotos subidas correctamente
- [ ] URLs públicas funcionan

---

## 💡 Tips de Testing

### 1. Usa Incógnito
Abre una ventana incógnita para probar sin cache:
- Ctrl+Shift+N (Chrome)
- Ctrl+Shift+P (Edge)

### 2. Limpia Cache
Si algo no funciona:
- Ctrl+Shift+Delete
- Selecciona "Cached images and files"
- Clear data

### 3. Prueba con 2 Cuentas
Para probar chat y matches:
1. Crea cuenta A en navegador normal
2. Crea cuenta B en incógnito
3. Haz que se den like mutuamente
4. Prueba el chat entre ellas

### 4. Simula Conexión Lenta
En DevTools:
- Tab Network
- Throttling: "Slow 3G"
- Verifica que la app siga funcionando

### 5. Revisa Mobile Real
Si puedes, prueba en tu teléfono real:
1. Encuentra tu IP local: `ipconfig` (Windows)
2. Abre http://TU_IP:3000 en el móvil
3. Prueba la app

---

## 📊 Métricas a Medir

### Performance
- Tiempo de carga inicial: _____ segundos
- Tiempo de login: _____ segundos
- Tiempo de carga de perfil: _____ segundos
- Tiempo de carga de imagen: _____ segundos

### Usabilidad
- ¿Es intuitivo? _____ / 10
- ¿Es rápido? _____ / 10
- ¿Es atractivo? _____ / 10
- ¿Funciona bien? _____ / 10

---

## ✅ Cuando Termines

### Si TODO funciona:
1. Marca el checklist completo
2. Anota cualquier mejora sugerida
3. Procede con deployment

### Si hay BUGS CRÍTICOS:
1. Lista los bugs críticos
2. Prioriza por severidad
3. Corrige antes de lanzar

### Si hay BUGS MENORES:
1. Anótalos para después
2. No bloquean el lanzamiento
3. Corrige en próxima iteración

---

## 🆘 Necesitas Ayuda?

Si encuentras algo que no entiendes:
1. Revisa la consola del navegador
2. Revisa Firebase Console
3. Busca el error en Google
4. Pregunta en la comunidad

---

## 📞 Contacto de Soporte

**Email:** tapapatisoporte@gmail.com  
**Proyecto:** Ta' Pa' Ti  
**Versión:** Beta 1.0

---

**¡Buena suerte con el testing! 🚀**
