# 🧪 Guía de Pruebas: API Keys Restringidas

**Fecha:** 1 de Febrero 2026  
**Estado:** 🟡 LISTO PARA PROBAR  
**Tiempo estimado:** 10 minutos

---

## ⏱️ IMPORTANTE: Esperar 5 Minutos

Los cambios en Google Cloud pueden tardar hasta **5 minutos** en propagarse.

**Hora de aplicación:** Verificar en Google Cloud Console  
**Hora de prueba:** Esperar 5 minutos después

---

## 🧹 Paso 1: Limpiar Caché del Navegador

Antes de probar, limpia el caché:

1. Presiona `Ctrl + Shift + Delete`
2. Selecciona "Imágenes y archivos en caché"
3. Click en "Borrar datos"
4. Cierra y abre el navegador nuevamente

---

## ✅ Paso 2: Pruebas Básicas

### Abrir la Aplicación

```
http://localhost:3000
```

### Prueba 1: Login/Registro ✅

**Qué probar:**
- Crear una cuenta nueva
- Iniciar sesión con cuenta existente
- Cerrar sesión

**Resultado esperado:**
- ✅ Todo funciona normalmente
- ✅ No hay errores en la consola

**Si falla:**
- ❌ Error: "API key not valid"
- ❌ Error: "This API project is not authorized"

---

### Prueba 2: Ver Perfiles (Discovery) ✅

**Qué probar:**
- Ir a la página de Discovery
- Ver perfiles de otros usuarios
- Hacer swipe (like/dislike)

**Resultado esperado:**
- ✅ Los perfiles se cargan correctamente
- ✅ Las fotos se muestran
- ✅ Los swipes funcionan

**Si falla:**
- ❌ Error al cargar perfiles
- ❌ Fotos no se muestran

---

### Prueba 3: Mensajes ✅

**Qué probar:**
- Abrir un chat existente
- Enviar un mensaje
- Ver mensajes anteriores

**Resultado esperado:**
- ✅ Los mensajes se envían
- ✅ Los mensajes se reciben en tiempo real
- ✅ El historial se carga

**Si falla:**
- ❌ Error al enviar mensajes
- ❌ Mensajes no se guardan

---

### Prueba 4: Stories ✅

**Qué probar:**
- Ver stories de otros usuarios
- Crear una nueva story
- Reaccionar a una story

**Resultado esperado:**
- ✅ Las stories se cargan
- ✅ Se puede crear una story
- ✅ Las reacciones funcionan

**Si falla:**
- ❌ Error al cargar stories
- ❌ No se puede crear story

---

### Prueba 5: Editar Perfil ✅

**Qué probar:**
- Ir a configuración de perfil
- Cambiar información (nombre, bio, etc.)
- Guardar cambios

**Resultado esperado:**
- ✅ Los cambios se guardan
- ✅ El perfil se actualiza

**Si falla:**
- ❌ Error al guardar cambios
- ❌ Cambios no se reflejan

---

## 🔍 Paso 3: Verificar Consola del Navegador

### Abrir DevTools

Presiona `F12` o `Ctrl + Shift + I`

### Buscar Errores

**Errores que NO deberías ver:**
- ❌ "API key not valid"
- ❌ "This API project is not authorized to use this API"
- ❌ "Firebase: Error (auth/api-key-not-valid)"

**Warnings normales (OK):**
- ⚠️ Warnings de desarrollo de React
- ⚠️ Warnings de performance

---

## 🚨 Troubleshooting

### Error: "API key not valid"

**Causa:** La restricción está bloqueando localhost

**Solución:**

1. Ir a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. Click en "Browser key (auto created by Firebase)"
3. Verificar que en "Restricciones de aplicaciones" está:
   - Tipo: "HTTP referrers (sitios web)"
   - Referrers: `localhost:*` y `127.0.0.1:*`
4. Guardar y esperar 5 minutos más
5. Limpiar caché nuevamente

---

### Error: "This API project is not authorized to use this API"

**Causa:** Falta una API en la lista de APIs permitidas

**Solución:**

1. Ir a: https://console.cloud.google.com/apis/credentials?project=citard-fbc26
2. Click en "Browser key (auto created by Firebase)"
3. En "API restrictions", verificar que están:
   - Cloud Firestore API
   - Cloud Storage for Firebase API
   - Firebase Management API
   - Identity Toolkit API
   - Token Service API
4. Si falta alguna, agregarla
5. Guardar y esperar 5 minutos

---

### Todo funciona pero muy lento

**Causa:** Los cambios aún se están propagando

**Solución:**
- Esperar 5-10 minutos más
- Limpiar caché nuevamente
- Reiniciar el navegador

---

## ✅ Checklist de Pruebas

Marca cada prueba cuando la completes:

- [ ] Caché del navegador limpiado
- [ ] Login/Registro funciona
- [ ] Discovery carga perfiles
- [ ] Mensajes se envían y reciben
- [ ] Stories se cargan y crean
- [ ] Editar perfil funciona
- [ ] No hay errores en consola
- [ ] Velocidad normal de la app

---

## 📊 Resultados Esperados

### ✅ Todo Funciona Correctamente

Si todas las pruebas pasan:

**Resultado:**
- 🟢 Las restricciones están correctamente configuradas
- 🟢 La API Key está protegida
- 🟢 La aplicación funciona normalmente

**Próximo paso:**
- Documentar los resultados
- Hacer commit de la documentación
- Continuar con otras mejoras de seguridad

---

### ❌ Algunas Pruebas Fallan

Si alguna prueba falla:

**Resultado:**
- 🔴 Hay un problema con las restricciones
- 🔴 Necesitas ajustar la configuración

**Próximo paso:**
- Seguir el troubleshooting de arriba
- Verificar la configuración en Google Cloud
- Esperar más tiempo para propagación

---

## 📝 Documentar Resultados

Después de probar, documenta los resultados:

### Si todo funciona:

```markdown
## Resultados de Pruebas - API Keys Restringidas

**Fecha:** [fecha]
**Hora:** [hora]

✅ Login/Registro: OK
✅ Discovery: OK
✅ Mensajes: OK
✅ Stories: OK
✅ Editar Perfil: OK
✅ Sin errores en consola: OK

**Conclusión:** Las restricciones funcionan correctamente.
```

### Si algo falla:

```markdown
## Resultados de Pruebas - API Keys Restringidas

**Fecha:** [fecha]
**Hora:** [hora]

❌ [Funcionalidad]: ERROR
Error: [descripción del error]

**Acción tomada:** [qué hiciste para resolverlo]
```

---

## 🎯 Próximos Pasos

Después de verificar que todo funciona:

1. ✅ Documentar resultados en `RESUMEN_SESION_01_FEB_2026.md`
2. ✅ Hacer commit de los cambios
3. ✅ Continuar con otras mejoras de seguridad
4. ✅ Monitorear uso de API Key en Google Cloud Console

---

**Creado por:** Kiro AI  
**Fecha:** 1 de Febrero 2026  
**Versión:** 1.0
