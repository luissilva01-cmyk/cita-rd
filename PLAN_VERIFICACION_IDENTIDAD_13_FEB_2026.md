# 🔐 Plan: Sistema Anti-Catfishing - 13 Feb 2026

## 🎯 Objetivo

Prevenir suplantación de identidad (uso de fotos de celebridades, otras personas) mediante:
1. Sistema de reportes mejorado
2. Verificación de identidad con selfie en tiempo real

---

## 📊 Problema Identificado

**Riesgo:** Usuarios pueden subir fotos de celebridades (Shakira, Manny Machado, etc.) o de otras personas.

**Consecuencias:**
- Catfishing y fraude
- Pérdida de confianza de usuarios
- Riesgos legales (violación de derechos de imagen)
- Mala reputación de la plataforma

---

## ✅ FASE 1: Sistema de Reportes Mejorado

### Objetivo
Protección inmediata mediante reportes de usuarios y moderación.

### Componentes a Crear

#### 1. Servicio de Reportes (`reportService.ts`)
```typescript
interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  category: 'fake_profile' | 'inappropriate' | 'harassment' | 'spam';
  reason: string;
  timestamp: number;
  status: 'pending' | 'reviewed' | 'resolved';
}

// Funciones:
- reportUser()
- getReportsByUser()
- getReportCount()
- autoBlockUser() // Después de 3 reportes
```

#### 2. Componente de Reporte (`ReportProfileModal.tsx`)
- Modal con categorías de reporte
- Campo de texto para detalles
- Botón de envío
- Confirmación visual

#### 3. Integración en Perfiles
- Botón "Reportar" en menú de opciones
- Visible en Discovery, Matches, Chat

#### 4. Sistema de Auto-Bloqueo
- Después de 3 reportes → Perfil bloqueado temporalmente
- Notificación a moderadores
- Usuario puede apelar

### Firestore Structure
```
reports/
  {reportId}/
    reporterId: string
    reportedUserId: string
    category: string
    reason: string
    timestamp: number
    status: string

perfiles/
  {userId}/
    reportCount: number
    isBlocked: boolean
    blockReason: string
```

---

## ⭐ FASE 2: Verificación de Identidad

### Objetivo
Verificar que las fotos del perfil corresponden a la persona real mediante selfie en tiempo real.

### Componentes Existentes (Revisar)
- ✅ `IdentityVerification.tsx` - Ya existe
- ✅ `verificationService.ts` - Ya existe
- ✅ `VerificationBadge.tsx` - Ya existe

### Mejoras Necesarias

#### 1. Actualizar `verificationService.ts`
```typescript
interface VerificationRequest {
  userId: string;
  selfieUrl: string; // Selfie en tiempo real
  profilePhotos: string[]; // Fotos del perfil
  timestamp: number;
}

interface VerificationResult {
  isVerified: boolean;
  confidence: number; // 0-100
  matchedPhotos: number;
  verifiedAt: number;
}

// Funciones:
- requestVerification()
- compareFaces() // Comparar selfie con fotos del perfil
- updateVerificationStatus()
- getVerificationBadge()
```

#### 2. Mejorar `IdentityVerification.tsx`
- Captura de selfie en tiempo real
- Instrucciones claras (mirar a cámara, buena luz)
- Comparación con fotos del perfil
- Resultado inmediato

#### 3. Badge de Verificado
- Icono azul con checkmark
- Visible en:
  - Tarjetas de Discovery
  - Perfil completo
  - Lista de matches
  - Chat

#### 4. Incentivos para Verificarse
- Perfiles verificados aparecen primero
- Badge visible aumenta confianza
- Mensaje: "Verifica tu perfil para más matches"

### Algoritmo de Comparación

```typescript
// Usar sistema de detección de rostros existente
async function compareFaces(selfie: string, profilePhotos: string[]) {
  // 1. Detectar rostro en selfie
  const selfieFace = await detectFaceAdvanced(selfie);
  
  // 2. Detectar rostros en fotos del perfil
  const profileFaces = await Promise.all(
    profilePhotos.map(photo => detectFaceAdvanced(photo))
  );
  
  // 3. Comparar características
  // - Proporciones faciales
  // - Tonos de piel
  // - Patrones faciales
  
  // 4. Calcular confianza
  const confidence = calculateSimilarity(selfieFace, profileFaces);
  
  // 5. Verificar si confidence >= 70%
  return {
    isVerified: confidence >= 70,
    confidence,
    matchedPhotos: profileFaces.filter(f => similarity > 60).length
  };
}
```

### Firestore Structure
```
perfiles/
  {userId}/
    isVerified: boolean
    verifiedAt: number
    verificationConfidence: number

verifications/
  {verificationId}/
    userId: string
    selfieUrl: string
    profilePhotos: string[]
    result: VerificationResult
    timestamp: number
```

---

## 🚀 Plan de Implementación

### Orden de Ejecución

#### Paso 1: Fase 1 - Reportes (30 min)
1. Crear `reportService.ts`
2. Crear `ReportProfileModal.tsx`
3. Integrar botón en perfiles
4. Actualizar Firestore rules

#### Paso 2: Fase 2 - Verificación (2-3 horas)
1. Revisar componentes existentes
2. Actualizar `verificationService.ts`
3. Mejorar `IdentityVerification.tsx`
4. Agregar badge en todos los lugares
5. Implementar incentivos

#### Paso 3: Testing (30 min)
1. Probar flujo de reporte
2. Probar flujo de verificación
3. Verificar badges visibles
4. Confirmar auto-bloqueo funciona

#### Paso 4: Deploy (15 min)
1. Build
2. Deploy a Firebase
3. Commit y push
4. Documentación

---

## 📊 Métricas de Éxito

### Fase 1: Reportes
- Tasa de reportes < 5% de usuarios
- Tiempo de respuesta < 24 horas
- Falsos positivos < 10%

### Fase 2: Verificación
- Tasa de verificación > 50% en 1 mes
- Precisión de comparación > 85%
- Reducción de catfishing > 90%

---

## 🔐 Consideraciones de Privacidad

### GDPR/Privacidad
- ✅ Verificación es opcional
- ✅ Selfie se elimina después de verificación
- ✅ Solo se guarda resultado (isVerified: true/false)
- ✅ Usuario puede revocar verificación

### Términos de Servicio
Agregar cláusula:
> "Está prohibido usar fotos de otras personas, celebridades o figuras públicas. Los perfiles que violen esta norma serán eliminados permanentemente. Nos reservamos el derecho de solicitar verificación de identidad."

---

## 💰 Costos

### Fase 1: Reportes
- **Costo:** $0
- **Firestore:** Incluido en plan actual

### Fase 2: Verificación
- **Costo:** $0
- **Procesamiento:** Cliente-side (navegador)
- **Storage:** Temporal, se elimina después

**Total:** $0 (completamente gratis)

---

## 📅 Timeline

| Fase | Tiempo | Estado |
|------|--------|--------|
| Planificación | 30 min | ✅ COMPLETADO |
| Fase 1: Reportes | 30 min | 🔄 SIGUIENTE |
| Fase 2: Verificación | 2-3 horas | ⏳ PENDIENTE |
| Testing | 30 min | ⏳ PENDIENTE |
| Deploy | 15 min | ⏳ PENDIENTE |

**Total estimado:** 4-5 horas

---

## 🎯 Próximos Pasos

1. ✅ Crear este documento de planificación
2. 🔄 Implementar Fase 1: Sistema de Reportes
3. ⏳ Implementar Fase 2: Verificación de Identidad
4. ⏳ Testing completo
5. ⏳ Deploy a producción

---

**Fecha:** 13 de Febrero 2026  
**Prioridad:** 🔴 CRÍTICA  
**Impacto:** Alto - Seguridad y confianza de usuarios
