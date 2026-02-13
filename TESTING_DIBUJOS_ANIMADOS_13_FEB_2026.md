# 🧪 Guía de Testing: Detección de Dibujos Animados

## 🎯 Objetivo del Testing

Verificar que el sistema rechaza correctamente:
- ✅ Dibujos animados (anime, caricaturas)
- ✅ Ilustraciones digitales
- ✅ Pósters de artistas
- ✅ Fotos con filtros extremos

Y acepta:
- ✅ Selfies normales
- ✅ Fotos con filtros sutiles

---

## 📋 Casos de Prueba

### Test 1: Dibujo Animado ❌
**Qué probar:** Subir imagen de personaje de anime/manga

**Resultado esperado:**
```
❌ Foto no válida
❌ No se detectó un rostro en la foto
Por favor usa una foto donde se vea tu cara claramente
No se permiten paisajes, avatares, dibujos o fondos oscuros

💡 Tip: Usa una foto donde se vea tu rostro claramente con buena iluminación
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 65-85%
🔍 [SATURATION] Píxeles muy saturados: 45-70%
❌ [SATURATION] RECHAZADO: Saturación promedio muy alta (dibujo animado)
🔍 [ADVANCED] Resultado: hasFace: false, confidence: 20-40
```

---

### Test 2: Ilustración Digital ❌
**Qué probar:** Subir retrato digital estilizado o fan art

**Resultado esperado:**
```
❌ Foto no válida
❌ No se detectó un rostro en la foto
Por favor usa una foto donde se vea tu cara claramente
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 45-55%
🔍 [SATURATION] Píxeles muy saturados: 35-50%
❌ [SATURATION] RECHAZADO: Demasiados píxeles saturados (ilustración)
🔍 [ADVANCED] Resultado: hasFace: false, confidence: 30-50
```

---

### Test 3: Póster de Artista ❌
**Qué probar:** Foto de un póster en la pared o pantalla

**Resultado esperado:**
```
❌ Foto no válida
❌ No se detectó un rostro en la foto
(o puede pasar si el póster es de muy buena calidad)
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 40-60%
🔍 [SATURATION] Píxeles muy saturados: 25-40%
🔍 [ADVANCED] Resultado: hasFace: false, confidence: 45-65
```

---

### Test 4: Filtro Extremo (Anime/Cartoon) ❌
**Qué probar:** Selfie con filtro de anime o cartoon de Instagram/Snapchat

**Resultado esperado:**
```
❌ Foto no válida
❌ No se detectó un rostro en la foto
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 55-70%
🔍 [SATURATION] Píxeles muy saturados: 35-55%
❌ [SATURATION] RECHAZADO: Saturación promedio muy alta
🔍 [ADVANCED] Resultado: hasFace: false, confidence: 40-60
```

---

### Test 5: Selfie Normal ✅
**Qué probar:** Selfie sin filtros o con filtros muy sutiles

**Resultado esperado:**
```
✅ Foto subida exitosamente
(Sin mensajes de error)
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 25-40%
🔍 [SATURATION] Píxeles muy saturados: 5-15%
✅ [SATURATION] APROBADO: Saturación natural de foto real
🔍 [ADVANCED] Resultado: hasFace: true, confidence: 75-95
✅ Foto VÁLIDA, continuando con guardado...
```

---

### Test 6: Foto con Filtro Sutil ✅
**Qué probar:** Foto con filtro de Instagram sutil (ajuste de brillo/contraste)

**Resultado esperado:**
```
✅ Foto subida exitosamente
(Puede mostrar advertencia pero se acepta)
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 35-48%
🔍 [SATURATION] Píxeles muy saturados: 10-25%
✅ [SATURATION] APROBADO: Saturación natural de foto real
🔍 [ADVANCED] Resultado: hasFace: true, confidence: 70-85
✅ Foto VÁLIDA, continuando con guardado...
```

---

### Test 7: Emoji Grande ❌
**Qué probar:** Subir emoji o emoticón grande

**Resultado esperado:**
```
❌ Foto no válida
❌ No se detectó un rostro en la foto
```

**Logs esperados:**
```
🔍 [SATURATION] Saturación promedio: 75-95%
🔍 [SATURATION] Píxeles muy saturados: 60-90%
❌ [SATURATION] RECHAZADO: Saturación promedio muy alta
🔍 [ADVANCED] Resultado: hasFace: false, confidence: 10-25
```

---

## 🔍 Cómo Ver los Logs

### En el Navegador (Chrome/Edge)
1. Abrir DevTools (F12)
2. Ir a la pestaña "Console"
3. Subir una foto
4. Buscar logs que empiecen con 🔍

### Logs Importantes
```
🔍 [SATURATION] - Análisis de saturación
🔍 [SKIN] - Detección de tonos de piel
🔍 [CONTRAST] - Análisis de contraste
🔍 [FEATURES] - Detección de patrones faciales
🔍 [PROPORTIONS] - Análisis de proporciones
🔍 [ADVANCED] - Resultado final
```

---

## 📊 Tabla de Resultados Esperados

| Tipo de Imagen | Saturación Promedio | Píxeles Saturados | Confianza | Resultado |
|----------------|---------------------|-------------------|-----------|-----------|
| Dibujo animado | 65-85% | 45-70% | 20-40 | ❌ RECHAZADO |
| Ilustración digital | 45-55% | 35-50% | 30-50 | ❌ RECHAZADO |
| Póster/pantalla | 40-60% | 25-40% | 45-65 | ❌ RECHAZADO |
| Filtro extremo | 55-70% | 35-55% | 40-60 | ❌ RECHAZADO |
| Emoji | 75-95% | 60-90% | 10-25 | ❌ RECHAZADO |
| Selfie normal | 25-40% | 5-15% | 75-95 | ✅ ACEPTADO |
| Filtro sutil | 35-48% | 10-25% | 70-85 | ✅ ACEPTADO |

---

## ✅ Checklist de Testing

### Preparación
- [ ] Abrir https://citard-fbc26.web.app
- [ ] Iniciar sesión o crear cuenta
- [ ] Ir a sección de editar perfil
- [ ] Abrir DevTools (F12) → Console

### Tests de Rechazo (Deben Fallar)
- [ ] Test 1: Subir dibujo animado → ❌ Rechazado
- [ ] Test 2: Subir ilustración digital → ❌ Rechazado
- [ ] Test 3: Subir póster de artista → ❌ Rechazado
- [ ] Test 4: Subir filtro extremo → ❌ Rechazado
- [ ] Test 7: Subir emoji grande → ❌ Rechazado

### Tests de Aceptación (Deben Pasar)
- [ ] Test 5: Subir selfie normal → ✅ Aceptado
- [ ] Test 6: Subir foto con filtro sutil → ✅ Aceptado

### Verificación Final
- [ ] Revisar logs en consola
- [ ] Verificar mensajes de error claros
- [ ] Confirmar que fotos rechazadas no se guardan
- [ ] Confirmar que fotos aceptadas se guardan correctamente

---

## 🐛 Problemas Comunes

### Problema 1: Dibujo se acepta
**Causa posible:** Saturación baja en el dibujo
**Solución:** Revisar umbrales en `advancedFaceDetection.ts`

### Problema 2: Selfie se rechaza
**Causa posible:** Filtro muy saturado o iluminación artificial
**Solución:** Probar con foto sin filtros

### Problema 3: No aparecen logs
**Causa posible:** Console no está abierta o filtros activos
**Solución:** Limpiar console y recargar página

---

## 📸 Dónde Conseguir Imágenes de Prueba

### Dibujos Animados
- Google Images: "anime character"
- Pinterest: "manga illustration"
- DeviantArt: "anime art"

### Ilustraciones Digitales
- ArtStation: "digital portrait"
- Behance: "character design"
- Instagram: #digitalart

### Selfies de Prueba
- Tomar selfie propia con cámara del teléfono
- Usar fotos de stock: Unsplash, Pexels

---

## 📝 Reporte de Resultados

Después de completar el testing, documentar:

```markdown
## Resultados de Testing - [Fecha]

### Tests Exitosos ✅
- Dibujo animado: RECHAZADO ✅
- Ilustración digital: RECHAZADO ✅
- Póster: RECHAZADO ✅
- Filtro extremo: RECHAZADO ✅
- Emoji: RECHAZADO ✅
- Selfie normal: ACEPTADO ✅
- Filtro sutil: ACEPTADO ✅

### Problemas Encontrados ❌
(Listar cualquier comportamiento inesperado)

### Observaciones
(Notas adicionales sobre el comportamiento del sistema)
```

---

**URL de Testing:** https://citard-fbc26.web.app  
**Fecha:** 13 de Febrero 2026  
**Estado:** ✅ Listo para testing
