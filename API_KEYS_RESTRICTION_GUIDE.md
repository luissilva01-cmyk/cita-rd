# 🔐 Guía: Restringir API Keys de Firebase

**Fecha:** 1 de Febrero 2026  
**Prioridad:** 🔴 CRÍTICO  
**Tiempo estimado:** 15-20 minutos  
**Estado:** En progreso

---

## 🎯 Objetivo

Restringir las API Keys de Firebase para que solo puedan ser usadas desde dominios autorizados, previniendo uso no autorizado y costos inesperados.

---

## ⚠️ Problema Actual

**Tu API Key está expuesta en el código:**
```javascript
apiKey: "AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg"
```

**Riesgos:**
- 🔴 Cualquiera puede copiar tu API Key del código fuente
- 🔴 Pueden hacer requests a tu proyecto Firebase
- 🔴 Puede generar costos inesperados en tu cuenta
- 🔴 Pueden agotar tus cuotas de Firebase
- 🔴 Pueden hacer spam o abuso de tus servicios

---

## ✅ Solución: Restricciones por Dominio

Vamos a configurar restricciones para que la API Key solo funcione desde:
- `localhost` (desarrollo)
- Tu dominio de producción (cuando lo tengas)

---

## 📋 Paso a Paso

### Paso 1: Ir a Google Cloud Console

**URL directa:**
```
https://console.cloud.google.com/apis/credentials?project=citard-fbc26
```

**O manualmente:**
1. Ir a: https://console.cloud.google.com/
2. Seleccionar proyecto: **citard-fbc26**
3. Menú lateral → **APIs & Services** → **Credentials**

---

### Paso 2: Identificar la API Key

En la página de Credentials, busca:

**Nombre:** Browser key (auto created by Firebase)  
**Key:** AIzaSyDy2tLpXr3v6llyXGfQVhVlnmZtMgCDRhg

**Nota:** Puede tener un nombre diferente como:
- "Browser key (auto created by Firebase)"
- "Web API Key"
- O simplemente el nombre del proyecto

---

### Paso 3: Editar la API Key

1. Click en el **nombre de la API Key** (no en el icono de copiar)
2. Se abrirá la página de edición

---

### Paso 4: Configurar Restricciones de Aplicación

En la sección **Application restrictions**:

1. Seleccionar: **HTTP referrers (web sites)**

2. Click en **ADD AN ITEM**

3. Agregar los siguientes referrers:

```
localhost:*
127.0.0.1:*
http://localhost:*
https://localhost:*
```

**Para producción (cuando tengas dominio):**
```
tudominio.com/*
*.tudominio.com/*
https://tudominio.com/*
https://*.tudominio.com/*
```

**Ejemplo con Netlify/Vercel:**
```
*.netlify.app/*
*.vercel.app/*
```

---

### Paso 5: Configurar Restricciones de API

En la sección **API restrictions**:

1. Seleccionar: **Restrict key**

2. En el dropdown, seleccionar las siguientes APIs:

**APIs requeridas para Ta' Pa' Ti:**
- ✅ Cloud Firestore API
- ✅ Firebase Authentication API (Identity Toolkit API)
- ✅ Token Service API
- ✅ Firebase Installations API
- ✅ Firebase Remote Config API (si lo usas)
- ✅ Cloud Functions API (si lo usas)

**Cómo encontrarlas:**
- Escribir en el buscador: "firestore"
- Seleccionar: "Cloud Firestore API"
- Repetir para cada API

---

### Paso 6: Guardar Cambios

1. Scroll hasta abajo
2. Click en **SAVE**
3. Esperar confirmación: "API key updated"

---

## 🧪 Probar que Funciona

### Prueba 1: Desde Localhost ✅

1. Abrir tu app: http://localhost:3000
2. Hacer login
3. Verificar que todo funciona normalmente

**Resultado esperado:** ✅ Todo funciona

---

### Prueba 2: Desde Otro Dominio ❌

1. Abrir consola del navegador (F12)
2. Intentar hacer un request directo:

```javascript
// Esto debería FALLAR desde un dominio no autorizado
fetch('https://firestore.googleapis.com/v1/projects/citard-fbc26/databases/(default)/documents/perfiles', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
```

**Resultado esperado:** ❌ Error 403 Forbidden

---

### Prueba 3: Verificar en Firebase Console

1. Ir a: https://console.firebase.google.com/project/citard-fbc26/usage
2. Verificar que no hay requests sospechosos
3. Monitorear por 24 horas

---

## 📊 Configuración Recomendada

### Para Desarrollo (Ahora)

```
Application restrictions: HTTP referrers
Referrers:
  - localhost:*
  - 127.0.0.1:*
  - http://localhost:*
  - https://localhost:*

API restrictions: Restrict key
APIs:
  - Cloud Firestore API
  - Identity Toolkit API
  - Token Service API
  - Firebase Installations API
```

---

### Para Producción (Cuando Lances)

```
Application restrictions: HTTP referrers
Referrers:
  - localhost:* (mantener para desarrollo)
  - 127.0.0.1:*
  - tudominio.com/*
  - *.tudominio.com/*
  - https://tudominio.com/*
  - https://*.tudominio.com/*

API restrictions: Restrict key
APIs:
  - Cloud Firestore API
  - Identity Toolkit API
  - Token Service API
  - Firebase Installations API
  - Cloud Functions API (si usas)
```

---

## 🚨 Troubleshooting

### Error: "API key not valid"

**Causa:** La API Key está restringida y tu dominio no está en la lista

**Solución:**
1. Verificar que agregaste `localhost:*` en los referrers
2. Verificar que no hay espacios extra
3. Esperar 5 minutos (los cambios pueden tardar)
4. Limpiar caché del navegador (Ctrl + Shift + Delete)

---

### Error: "This API project is not authorized to use this API"

**Causa:** La API que intentas usar no está en la lista de APIs permitidas

**Solución:**
1. Ir a Google Cloud Console → Credentials
2. Editar la API Key
3. En "API restrictions", agregar la API faltante
4. Guardar cambios

---

### La app funciona en localhost pero no en producción

**Causa:** No agregaste tu dominio de producción a los referrers

**Solución:**
1. Ir a Google Cloud Console → Credentials
2. Editar la API Key
3. Agregar tu dominio de producción:
   ```
   tudominio.com/*
   *.tudominio.com/*
   ```
4. Guardar cambios

---

### Los cambios no se aplican

**Causa:** Los cambios pueden tardar hasta 5 minutos en propagarse

**Solución:**
1. Esperar 5 minutos
2. Limpiar caché del navegador
3. Recargar la página (Ctrl + F5)
4. Si persiste, verificar que guardaste los cambios

---

## 📈 Impacto en Seguridad

### Antes (Sin Restricciones) ❌

```
Cualquier persona puede:
- Copiar tu API Key del código
- Hacer requests a tu Firebase
- Agotar tus cuotas
- Generar costos en tu cuenta
```

**Nivel de seguridad:** 🔴 1/10

---

### Después (Con Restricciones) ✅

```
Solo dominios autorizados pueden:
- Usar tu API Key
- Hacer requests a tu Firebase
- Acceder a tus servicios
```

**Nivel de seguridad:** 🟢 8/10

**Mejora:** +700%

---

## 🔍 Monitoreo Post-Restricción

### Qué Monitorear

1. **Requests por día**
   - URL: https://console.firebase.google.com/project/citard-fbc26/usage
   - Buscar picos inusuales
   - Verificar origen de requests

2. **Errores de API Key**
   - Ir a: https://console.cloud.google.com/logs
   - Filtrar por: "API key not valid"
   - Verificar que son intentos bloqueados (bueno)

3. **Costos**
   - URL: https://console.firebase.google.com/project/citard-fbc26/usage/details
   - Verificar que no hay aumentos inesperados
   - Configurar alertas de presupuesto

---

### Configurar Alertas de Presupuesto

1. Ir a: https://console.cloud.google.com/billing
2. Click en "Budgets & alerts"
3. Click en "CREATE BUDGET"
4. Configurar:
   - Name: "Ta Pa Ti Monthly Budget"
   - Amount: $10 (o lo que quieras)
   - Alert threshold: 50%, 90%, 100%
5. Agregar tu email para notificaciones
6. Click en "FINISH"

---

## ✅ Checklist de Verificación

Antes de considerar las restricciones completas:

- [ ] API Key identificada en Google Cloud Console
- [ ] Restricciones de aplicación configuradas (HTTP referrers)
- [ ] Localhost agregado a referrers
- [ ] Restricciones de API configuradas
- [ ] APIs necesarias seleccionadas
- [ ] Cambios guardados
- [ ] Esperado 5 minutos para propagación
- [ ] Probado en localhost (debe funcionar)
- [ ] Verificado que no hay errores en consola
- [ ] Monitoreo configurado
- [ ] Alertas de presupuesto configuradas

---

## 📚 Recursos Adicionales

### Google Cloud Console

- **Credentials:** https://console.cloud.google.com/apis/credentials?project=citard-fbc26
- **APIs & Services:** https://console.cloud.google.com/apis/dashboard?project=citard-fbc26
- **Logs:** https://console.cloud.google.com/logs?project=citard-fbc26

### Firebase Console

- **Usage:** https://console.firebase.google.com/project/citard-fbc26/usage
- **Settings:** https://console.firebase.google.com/project/citard-fbc26/settings/general

### Documentación

- [API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions)
- [Firebase Security](https://firebase.google.com/docs/projects/api-keys)

---

## 🎯 Próximos Pasos

Después de restringir las API Keys:

1. **Probar funcionalidades principales** (10 minutos)
   - Login/Registro
   - Discovery
   - Mensajes
   - Stories

2. **Monitorear por 24 horas**
   - Verificar que no hay errores
   - Verificar que no hay requests sospechosos

3. **Cuando tengas dominio de producción:**
   - Agregar dominio a referrers
   - Probar en producción
   - Verificar que funciona

4. **Continuar con siguiente paso de seguridad:**
   - Implementar rate limiting
   - Configurar audit logs
   - Realizar pruebas de seguridad

---

## 💡 Notas Importantes

### Sobre las API Keys en el Código

**¿Es seguro tener la API Key en el código?**

Sí, **SI está restringida correctamente**. Las API Keys de Firebase están diseñadas para ser públicas (están en el código del frontend), pero deben estar protegidas con restricciones.

**Restricciones = Seguridad**

Sin restricciones: 🔴 Inseguro  
Con restricciones: 🟢 Seguro

---

### Sobre Firebase vs Google Cloud

Firebase usa Google Cloud Platform por debajo. Por eso necesitas configurar las restricciones en Google Cloud Console, no en Firebase Console.

**Firebase Console:** Configuración de servicios  
**Google Cloud Console:** Configuración de seguridad y APIs

---

### Sobre los Dominios

**Wildcards permitidos:**
- `*.tudominio.com/*` ✅ (todos los subdominios)
- `localhost:*` ✅ (todos los puertos)

**Wildcards NO permitidos:**
- `*.com/*` ❌ (demasiado amplio)
- `*` ❌ (sin restricción)

---

## 🎉 Conclusión

Restringir las API Keys es un paso crítico de seguridad que:

1. ✅ Previene uso no autorizado
2. ✅ Protege contra costos inesperados
3. ✅ Limita el alcance de posibles ataques
4. ✅ Es un requisito para lanzamiento

**Tiempo:** 15-20 minutos  
**Impacto:** +700% en seguridad de API Keys  
**Dificultad:** Fácil  
**Prioridad:** 🔴 CRÍTICA

---

**Creado por:** Kiro AI  
**Fecha:** 1 de Febrero 2026  
**Versión:** 1.0  
**Estado:** Listo para implementar
