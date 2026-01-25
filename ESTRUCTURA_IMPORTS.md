# Guía de Estructura de Imports - Ta' Pa' Ti

## Fecha: 20 de enero, 2026

## Estructura del Proyecto

```
cita-rd/
├── services/              ← Servicios principales (TypeScript)
│   ├── firebase.ts
│   ├── profileService.ts
│   ├── chatService.ts
│   └── ...
├── components/            ← Componentes principales
├── views/                 ← Vistas principales
├── types.ts              ← Tipos TypeScript globales
├── App.tsx               ← App principal
│
└── src/                  ← Código legacy/adicional
    ├── pages/
    │   └── Auth/
    │       ├── Login.tsx
    │       └── Register.tsx
    ├── services/         ← Servicios legacy (JavaScript)
    │   ├── consentService.ts
    │   └── ...
    └── utils/
        └── firebase.js   ← Firebase legacy
```

## Reglas de Imports

### Desde `cita-rd/src/pages/Auth/Register.tsx`:

**Ubicación del archivo:** `cita-rd/src/pages/Auth/Register.tsx`

**Para importar desde `cita-rd/services/`:**
```typescript
// ✅ CORRECTO - Sube 3 niveles (Auth → pages → src → cita-rd)
import { createOrUpdateProfile } from "../../../services/profileService";
import { UserProfile } from "../../../types";
```

**Para importar desde `cita-rd/src/services/`:**
```typescript
// ✅ CORRECTO - Sube 2 niveles (Auth → pages → src)
import { consentService } from "../../services/consentService";
```

**Para importar desde `cita-rd/src/components/`:**
```typescript
// ✅ CORRECTO - Sube 2 niveles
import ConsentModal from "../../components/Legal/ConsentModal";
```

**Para importar desde `cita-rd/src/utils/`:**
```typescript
// ✅ CORRECTO - Sube 2 niveles
import { auth } from "../../utils/firebase";
```

### Desde `cita-rd/App.tsx`:

**Ubicación del archivo:** `cita-rd/App.tsx`

**Para importar servicios:**
```typescript
// ✅ CORRECTO - Mismo nivel
import { getUserProfile } from './services/profileService';
import { auth } from './services/firebase';
```

**Para importar componentes:**
```typescript
// ✅ CORRECTO - Mismo nivel
import Layout from './components/components/Layout';
```

## Diferencia entre `services/` y `src/services/`

### `cita-rd/services/` (TypeScript - Principal)
- Servicios principales de la app
- Escritos en TypeScript
- Usados por App.tsx y componentes principales
- Ejemplos: firebase.ts, profileService.ts, chatService.ts

### `cita-rd/src/services/` (JavaScript - Legacy)
- Servicios legacy o adicionales
- Algunos en JavaScript, otros en TypeScript
- Usados por páginas en `src/pages/`
- Ejemplos: consentService.ts, geminiService.js

## Corrección Aplicada

### Archivo: `cita-rd/src/pages/Auth/Register.tsx`

**ANTES (❌ Incorrecto):**
```typescript
import { createOrUpdateProfile } from "../../services/profileService";
import { UserProfile } from "../../types";
```

**DESPUÉS (✅ Correcto):**
```typescript
import { createOrUpdateProfile } from "../../../services/profileService";
import { UserProfile } from "../../../types";
```

**Razón:** 
- `Register.tsx` está en `cita-rd/src/pages/Auth/`
- `profileService.ts` está en `cita-rd/services/` (NO en `cita-rd/src/services/`)
- Necesita subir 3 niveles: `Auth/` → `pages/` → `src/` → `cita-rd/`

## Cómo Contar los Niveles

Desde `cita-rd/src/pages/Auth/Register.tsx`:

```
cita-rd/src/pages/Auth/Register.tsx  ← Estás aquí
         ↑
         ../                          ← Nivel 1: sales a pages/
         ../../                       ← Nivel 2: sales a src/
         ../../../                    ← Nivel 3: sales a cita-rd/
         ../../../services/           ← Ahora puedes acceder a services/
```

## Estado Actual
✅ Import corregido en Register.tsx
✅ Servidor reiniciado
✅ Corriendo en localhost:3000
✅ Listo para probar

## Próximo Paso
Hacer hard refresh del navegador (Ctrl + Shift + R)
