# 🔍 Cómo Ver Logs de Stories - Guía Rápida

**Fecha:** 26 de enero de 2026  
**Problema:** Stories no visibles - Necesitamos ver los logs

---

## 🎯 Objetivo

Ver los logs en la consola del navegador para diagnosticar por qué Luis Silva no puede ver las historias.

---

## 📋 Pasos para Ver los Logs

### 1. Abrir la Consola del Navegador

**Windows/Linux:**
- Presiona `F12` o `Ctrl + Shift + I`

**Mac:**
- Presiona `Cmd + Option + I`

**Alternativa:**
- Click derecho en la página → "Inspeccionar" → Pestaña "Console"

### 2. Limpiar la Consola

- Click en el icono 🚫 (Clear console) en la parte superior izquierda de la consola
- O presiona `Ctrl + L` (Windows/Linux) o `Cmd + K` (Mac)

### 3. Recargar la Página

- Presiona `F5` o `Ctrl + R` (Windows/Linux)
- O `Cmd + R` (Mac)

### 4. Buscar Logs Importantes

Busca estos logs en la consola (usa `Ctrl + F` para buscar):

#### A. Usuario ID Actual
```
🟢 Setting up presence system for user: XXXXXXX
```
Este es el `userId` de Luis Silva.

#### B. Carga de Stories
```
📊 === CARGANDO STORY GROUPS ===
📊 Current User ID: XXXXXXX
📊 Total Stories en memoria: X
📊 Total Story Groups en memoria: X
```

#### C. Verificación de Privacidad
```
🔍 Verificando grupo de: NOMBRE (userId: XXXXXXX)
👁️ ¿Puede ver? true/false
```

#### D. Resultado Final
```
📊 === RESULTADO FINAL ===
📊 Grupos filtrados: X
📊 Grupos: [nombres]
```

---

## 🐛 Qué Buscar en los Logs

### ✅ Caso Normal (Funciona)

```
📊 === CARGANDO STORY GROUPS ===
📊 Current User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📊 Total Stories en memoria: 3
📊 Total Story Groups en memoria: 2
✅ Stories activas (no expiradas): 3
🔍 Verificando grupo de: Carolina (userId: 1)
🔒 Obteniendo configuración de privacidad para: 1
✅ Configuración obtenida: { storiesVisibility: 'everyone', ... }
👁️ Verificando si KU5ZalR92QcPV7RGbLFTjEjTXZm2 puede ver stories de 1
✅ Stories públicas - todos pueden ver
👁️ ¿Puede ver? true
📝 Stories activas en este grupo: 2
✅ Agregando grupo: Carolina - No vistas: true
📊 === RESULTADO FINAL ===
📊 Grupos filtrados: 1
📊 Grupos: ['Carolina']
```

### ❌ Caso Problema (No Funciona)

```
📊 === CARGANDO STORY GROUPS ===
📊 Current User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📊 Total Stories en memoria: 0  ← ⚠️ NO HAY STORIES
📊 Total Story Groups en memoria: 0  ← ⚠️ NO HAY GRUPOS
✅ Stories activas (no expiradas): 0
📊 === RESULTADO FINAL ===
📊 Grupos filtrados: 0  ← ⚠️ NINGÚN GRUPO VISIBLE
📊 Grupos: []
```

O:

```
📊 === CARGANDO STORY GROUPS ===
📊 Current User ID: KU5ZalR92QcPV7RGbLFTjEjTXZm2
📊 Total Stories en memoria: 2
📊 Total Story Groups en memoria: 1
✅ Stories activas (no expiradas): 2
🔍 Verificando grupo de: Usuario X (userId: ABC123)
🔒 Obteniendo configuración de privacidad para: ABC123
✅ Configuración obtenida: { storiesVisibility: 'matches_only', ... }  ← ⚠️ SOLO MATCHES
👁️ Verificando si KU5ZalR92QcPV7RGbLFTjEjTXZm2 puede ver stories de ABC123
🔍 Verificando match entre KU5ZalR92QcPV7RGbLFTjEjTXZm2 y ABC123 : false  ← ⚠️ NO HAY MATCH
🔒 Stories solo para matches: false
👁️ ¿Puede ver? false  ← ⚠️ NO PUEDE VER
📊 === RESULTADO FINAL ===
📊 Grupos filtrados: 0
📊 Grupos: []
```

---

## 🔧 Soluciones Según el Problema

### Problema 1: "Total Stories en memoria: 0"

**Causa:** No se creó ninguna historia o se perdió al recargar.

**Solución:**
1. Crear una nueva historia
2. Click en el botón "+" en Stories
3. Publicar una historia de texto o foto

### Problema 2: "Stories activas (no expiradas): 0"

**Causa:** Las historias expiraron (más de 24 horas).

**Solución:**
1. Crear una nueva historia
2. Las historias duran 24 horas

### Problema 3: "storiesVisibility: 'matches_only'" y "No hay match"

**Causa:** La historia es privada y no hay match entre usuarios.

**Solución A - Cambiar a Público:**
1. El usuario que publicó la historia debe:
2. Click en el icono de engranaje ⚙️ en Stories
3. Ir a "Privacidad de Stories"
4. Seleccionar "Todos"
5. Guardar

**Solución B - Crear Match:**
1. Abrir consola del navegador
2. Ejecutar:
```javascript
await privacyService.createMatch('USERID_LUIS', 'USERID_OTRO');
```

### Problema 4: "¿Puede ver? false"

**Causa:** Configuración de privacidad bloqueando.

**Solución:**
1. Ver el log anterior para saber por qué
2. Aplicar Solución A o B del Problema 3

---

## 📸 Captura de Pantalla

Si necesitas ayuda, toma una captura de pantalla de la consola mostrando:

1. Los logs de `=== CARGANDO STORY GROUPS ===`
2. Los logs de verificación de privacidad
3. El resultado final

---

## 🎯 Información que Necesito

Para ayudarte, copia y pega estos logs de la consola:

1. **Usuario ID:**
   ```
   🟢 Setting up presence system for user: XXXXXXX
   ```

2. **Total Stories:**
   ```
   📊 Total Stories en memoria: X
   📊 Total Story Groups en memoria: X
   ```

3. **Verificación de Privacidad:**
   ```
   🔍 Verificando grupo de: NOMBRE (userId: XXXXXXX)
   👁️ ¿Puede ver? true/false
   ```

4. **Resultado Final:**
   ```
   📊 Grupos filtrados: X
   📊 Grupos: [nombres]
   ```

---

## 🚀 Prueba Rápida

Para verificar que el sistema funciona:

1. **Crear una historia de prueba:**
   - Click en el botón "+" en Stories
   - Escribir "Prueba 123"
   - Publicar

2. **Verificar en consola:**
   - Deberías ver: `📊 Total Stories en memoria: 1`
   - Deberías ver: `📊 Grupos filtrados: 1`

3. **Verificar visualmente:**
   - La historia debería aparecer en el ring de stories

---

## ✅ Checklist de Verificación

- [ ] Abrí la consola del navegador (F12)
- [ ] Limpié la consola (Ctrl + L)
- [ ] Recargué la página (F5)
- [ ] Vi los logs de "CARGANDO STORY GROUPS"
- [ ] Copié los logs importantes
- [ ] Identifiqué el problema según los logs

---

**¿Listo?** Abre la consola, recarga la página, y comparte los logs que veas. Con esa información podré identificar el problema exacto.
