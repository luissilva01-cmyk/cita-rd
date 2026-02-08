# 🧪 Guía de Testing - Notificaciones FCM y Matching AI

## 🚀 Servidor Iniciado

✅ **Servidor corriendo en**: http://localhost:3000

---

## 📋 Test 1: Notificaciones FCM

### Objetivo:
Verificar que el campo `deleted` se actualiza correctamente al activar/desactivar notificaciones.

### Pasos:

1. **Abre la app**: http://localhost:3000
2. **Inicia sesión** con tu cuenta
3. **Ve a**: Perfil (ícono de usuario) > Configuración (ícono de engranaje)
4. **Abre la consola del navegador** (F12)
5. **Activa las notificaciones**:
   - Click en "Activar Notificaciones"
   - Acepta el permiso del navegador
   - Busca en consola:
     ```
     ✅ [AccountSettings] Token obtenido y guardado: SÍ
     📄 [AccountSettings] Datos del token: {deleted: false, ...}
     ```
   - ✅ **ESPERADO**: `deleted: false`

6. **Desactiva las notificaciones**:
   - Click en "Desactivar Notificaciones"
   - Confirma la acción
   - Busca en consola:
     ```
     📄 [AccountSettings] Datos del token: {deleted: true, ...}
     ```
   - ✅ **ESPERADO**: `deleted: true`

7. **Vuelve a activar las notificaciones**:
   - Click en "Activar Notificaciones"
   - Busca en consola:
     ```
     📄 [AccountSettings] Datos del token: {deleted: false, ...}
     ```
   - ✅ **ESPERADO**: `deleted: false` (ESTE ES EL FIX)

### ✅ Resultado Esperado:

```javascript
// Primera activación
{
  token: 'abc123...',
  deleted: false,  // ✅
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// Desactivación
{
  token: null,
  deleted: true,  // ✅
  createdAt: Timestamp (preservado),
  updatedAt: Timestamp (actualizado)
}

// Reactivación
{
  token: 'abc123...',
  deleted: false,  // ✅ CORREGIDO
  createdAt: Timestamp (preservado),
  updatedAt: Timestamp (actualizado)
}
```

### 🔍 Verificación en Firestore:

1. Abre Firebase Console: https://console.firebase.google.com
2. Ve a tu proyecto
3. Firestore Database
4. Colección `fcmTokens`
5. Busca tu documento (tu userId)
6. Verifica que `deleted: false` cuando las notificaciones están activas

---

## 📋 Test 2: Matching AI

### Objetivo:
Verificar que el sistema de IA calcula compatibilidad correctamente.

### Pasos:

1. **Abre la app**: http://localhost:3000
2. **Inicia sesión** con tu cuenta
3. **Ve a**: Discovery (ícono de corazón/swipe)
4. **Abre la consola del navegador** (F12)
5. **Busca estos logs**:
   ```
   🎯 Generando predicciones para: [tu userId] con [N] candidatos
   ✅ Perfil del usuario obtenido: [tu nombre]
   💕 Calculando compatibilidad entre: [tu nombre] y [otro usuario]
   ✅ [N] predicciones generadas exitosamente
   ```

### ✅ Resultado Esperado:

- ✅ No debe aparecer error "Usuario no encontrado"
- ✅ Los perfiles deben aparecer ordenados por compatibilidad
- ✅ Cada perfil debe tener un score de compatibilidad
- ✅ Los logs deben mostrar el proceso completo de IA

### 🎯 Indicadores de Éxito:

1. **Logs sin errores**: No debe haber `❌ Error generando predicciones`
2. **Perfiles ordenados**: Los mejores matches aparecen primero
3. **Scores visibles**: Cada perfil muestra su % de compatibilidad
4. **Razones de compatibilidad**: Se muestran las razones del match

---

## 📊 Checklist de Verificación

### Notificaciones FCM:
- [ ] Token se genera sin error 403
- [ ] Token se guarda con `deleted: false` al activar
- [ ] Token se marca como `deleted: true` al desactivar
- [ ] Token se reactiva con `deleted: false` (FIX PRINCIPAL)
- [ ] `createdAt` se preserva en reactivaciones
- [ ] `updatedAt` se actualiza en cada cambio
- [ ] Notificación de prueba aparece

### Matching AI:
- [ ] No hay error "Usuario no encontrado"
- [ ] Perfil del usuario se obtiene desde Firestore
- [ ] Compatibilidad se calcula para cada candidato
- [ ] Perfiles se ordenan por score de IA
- [ ] Predicciones se generan exitosamente
- [ ] Logs muestran proceso completo

---

## 🐛 Problemas Comunes

### Notificaciones:

**Problema**: Token sigue con `deleted: true` después de reactivar
- **Solución**: Limpia el caché del navegador (Ctrl+Shift+Delete)
- **Solución**: Reinicia el servidor (ya hecho)
- **Solución**: Verifica que el código esté actualizado

**Problema**: Error 403 al generar token
- **Solución**: Verifica que la API Key tenga permisos de FCM
- **Solución**: Espera 2-3 minutos para propagación de cambios

### Matching AI:

**Problema**: Error "Usuario no encontrado"
- **Solución**: Verifica que el usuario exista en Firestore
- **Solución**: Verifica que el userId sea correcto
- **Solución**: Reinicia el servidor (ya hecho)

**Problema**: Perfiles no se ordenan por compatibilidad
- **Solución**: Verifica que haya candidatos disponibles
- **Solución**: Verifica los logs de IA en consola

---

## 📝 Logs Importantes

### Notificaciones - Logs Correctos:
```
🔔 [AccountSettings] Solicitando permiso de notificaciones...
🔔 [AccountSettings] Permiso concedido: true
🎫 [AccountSettings] Obteniendo y guardando token para userId: [tu userId]
✅ [AccountSettings] Token obtenido y guardado: SÍ
🔍 [AccountSettings] Verificando que el token se guardó en Firestore...
📄 [AccountSettings] Token existe en Firestore: true
📄 [AccountSettings] Datos del token: {deleted: false, ...}
```

### Matching AI - Logs Correctos:
```
🎯 Generando predicciones para: [userId] con [N] candidatos
✅ Perfil del usuario obtenido: [nombre]
💕 Calculando compatibilidad entre: [nombre1] y [nombre2]
✅ [N] predicciones generadas exitosamente
```

---

## 🎉 Estado Final Esperado

### ✅ Notificaciones FCM - 100% Funcional
- Tokens se generan correctamente
- Tokens se guardan con estado correcto
- Activar/desactivar funciona perfectamente
- `createdAt` se preserva
- `updatedAt` se actualiza

### ✅ Matching AI - 100% Funcional
- Obtiene perfil del usuario desde Firestore
- Calcula compatibilidad con candidatos
- Ordena perfiles por score de IA
- Genera predicciones exitosamente
- Muestra razones de compatibilidad

---

## 📞 Soporte

Si encuentras algún problema:
1. Copia los logs de la consola
2. Toma screenshot del error
3. Comparte conmigo para análisis

---

**Fecha**: 08 de febrero de 2026
**Versión**: 2.0.0
**Estado**: ✅ Listo para testing
