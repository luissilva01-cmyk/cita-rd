# 🔧 Solución: Error de Login después de Restringir API Keys

**Fecha:** 1 de Febrero 2026  
**Problema:** Error al iniciar sesión después de aplicar restricciones a API Keys  
**Estado:** 🔴 EN DIAGNÓSTICO

---

## 🚨 Problema Reportado

**Error mostrado:**
```
Error al iniciar sesión. Por favor verifica tus datos e intenta de nuevo.
```

**Causa probable:** Las restricciones de API Keys están bloqueando las peticiones de Firebase Auth.

---

## 🔍 Diagnóstico Paso a Paso

### Paso 1: Verificar Error Exacto en Consola

**Abrir DevTools:**
1. Presiona `F12` en el navegador
2. Ve a la pestaña "Console"
3. Intenta hacer login nuevamente
4. Busca errores en rojo

**Errores posibles:**

#### Error 1: API Key Not Valid
```
Firebase: Error (auth/api-key-not-valid)
```

**Causa:** La restricción de referrers está bloqueando localhost

**Solución:** Verificar configuración de referrers en Google Cloud Console

---

#### Error 2: API Project Not Authorized
```
This API project is not authorized to use this API
```

**Causa:** Falta "Identity Toolkit API" en las APIs permitidas

**Solución:** Agregar la API faltante

---

#### Error 3: Requests from Referer Blocked
```
Requests from referer http://localhost:3000 are blocked
```

**Causa:** El formato del referrer no es correcto

**Solución:** Ajustar el formato del referrer

---

## 🛠️ Soluciones Rápidas

### Solución 1: Verificar Configuración de Referrers

1. **Ir a Google Cloud Console:**
   ```
   https://console.cloud.google.com/apis/credentials?project=citard-fbc26
   ```

2. **Click en "Browser key (auto created by Firebase)"**

3. **Verificar "Restricciones de aplicaciones":**
   - Tipo: "HTTP referrers (sitios web)"
   - Referrers permitidos:
     ```
     localhost:*
     127.0.0.1:*
     ```

4. **Si los referrers están correctos, probar agregar también:**
   ```
   http://localhost:*
   https://localhost:*
   http://127.0.0.1:*
   https://127.0.0.1:*
   ```

5. **Guardar cambios y esperar 5 minutos**

---

### Solución 2: Verificar APIs Permitidas

1. **En la misma página de la API Key**

2. **Ir a "Restricciones de API"**

3. **Verificar que están seleccionadas TODAS estas APIs:**
   - ✅ Cloud Firestore API
   - ✅ Cloud Storage for Firebase API
   - ✅ Firebase Management API
   - ✅ **Identity Toolkit API** ← CRÍTICO para Auth
   - ✅ Token Service API

4. **Si falta alguna, agregarla**

5. **Guardar y esperar 5 minutos**

---

### Solución 3: Remover Temporalmente las Restricciones

**Solo para probar si las restricciones son el problema:**

1. **Ir a Google Cloud Console**

2. **Click en "Browser key (auto created by Firebase)"**

3. **En "Restricciones de aplicaciones":**
   - Cambiar a: "Ninguna"

4. **En "Restricciones de API":**
   - Cambiar a: "No restringir clave"

5. **Guardar cambios**

6. **Esperar 2-3 minutos**

7. **Probar login nuevamente**

**Si funciona:** Las restricciones estaban mal configuradas  
**Si no funciona:** El problema es otro (no relacionado con API Keys)

---

## 🔄 Solución Temporal: Usar Restricciones Más Amplias

Mientras diagnosticamos, podemos usar restricciones más amplias:

### Configuración Temporal

**Restricciones de aplicaciones:**
- Tipo: "HTTP referrers (sitios web)"
- Referrers:
  ```
  *localhost*
  *127.0.0.1*
  ```

**Restricciones de API:**
- Tipo: "No restringir clave" (temporalmente)

**Nota:** Esta configuración es menos segura pero permitirá que la app funcione mientras ajustamos.

---

## 📊 Checklist de Diagnóstico

Marca cada paso cuando lo completes:

- [ ] Abrí DevTools (F12)
- [ ] Vi la pestaña Console
- [ ] Intenté hacer login
- [ ] Copié el error exacto
- [ ] Verifiqué los referrers en Google Cloud
- [ ] Verifiqué las APIs permitidas
- [ ] Esperé 5 minutos después de cambios
- [ ] Limpié caché del navegador
- [ ] Probé login nuevamente

---

## 🎯 Próximos Pasos

### Si el error persiste:

1. **Compartir el error exacto de la consola**
   - Copia el mensaje completo
   - Incluye el stack trace si hay

2. **Verificar que Firebase está configurado correctamente**
   - Revisar `services/firebase.ts`
   - Verificar que la API Key es correcta

3. **Probar con restricciones removidas**
   - Si funciona sin restricciones, el problema es la configuración
   - Si no funciona, el problema es otro

---

## 💡 Información Adicional

### Formato Correcto de Referrers

Google Cloud acepta varios formatos:

**Formato 1: Sin protocolo (recomendado)**
```
localhost:*
127.0.0.1:*
```

**Formato 2: Con protocolo**
```
http://localhost:*
https://localhost:*
```

**Formato 3: Con wildcard**
```
*localhost*
*127.0.0.1*
```

**Formato 4: Puerto específico**
```
localhost:3000
127.0.0.1:3000
```

---

## 🔒 Configuración Recomendada Final

Una vez que funcione, usar esta configuración:

**Restricciones de aplicaciones:**
```
localhost:*
127.0.0.1:*
```

**Restricciones de API:**
- Cloud Firestore API
- Cloud Storage for Firebase API
- Firebase Management API
- Identity Toolkit API
- Token Service API

---

## 📝 Notas

- Los cambios en Google Cloud pueden tardar hasta 5 minutos
- Siempre limpiar caché después de cambios
- Si el problema persiste, podemos remover restricciones temporalmente
- Las restricciones se pueden ajustar después de que funcione

---

**Creado por:** Kiro AI  
**Fecha:** 1 de Febrero 2026  
**Estado:** En diagnóstico
