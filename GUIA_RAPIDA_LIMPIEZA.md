# 🚀 GUÍA RÁPIDA: Nuevas Herramientas de Limpieza

**Fecha:** 12 de Febrero 2026  
**Para:** Desarrolladores de Ta' Pa' Ti

---

## 📋 RESUMEN

Después de la Fase 1 de limpieza, ahora tienes acceso a:
1. ✅ Logger profesional
2. ✅ Constantes centralizadas
3. ✅ Estructura organizada

---

## 🔧 LOGGER PROFESIONAL

### Uso Básico

```typescript
import { logger } from '../utils/logger';

// Logging por categoría
logger.firebase.info('Mensaje informativo', { data: 'opcional' });
logger.api.error('Error en API', error);
logger.auth.success('Login exitoso', { userId: '123' });
logger.profile.warn('Advertencia', { message: 'Perfil incompleto' });
```

### Categorías Disponibles

```typescript
logger.auth         // 🔐 Autenticación y sesiones
logger.profile      // 👤 Perfiles de usuario
logger.chat         // 💬 Mensajes y chats
logger.stories      // 📱 Sistema de stories
logger.match        // 💕 Sistema de matches
logger.firebase     // 🔥 Operaciones de Firebase
logger.api          // 🌐 Llamadas a APIs
logger.ui           // 🎨 Interacciones de UI
logger.privacy      // 🔒 Configuración de privacidad
logger.verification // ✅ Verificación de identidad
logger.notification // 🔔 Push notifications
logger.analytics    // 📊 Google Analytics
```

### Niveles de Log

```typescript
logger.category.debug('Debug info', data);   // Gris - Solo desarrollo
logger.category.info('Info message', data);  // Azul - Información
logger.category.warn('Warning', data);       // Amarillo - Advertencia
logger.category.error('Error', error);       // Rojo - Error
logger.category.success('Success!', data);   // Verde - Éxito
```

### Configuración desde Consola

```javascript
// Abrir consola del navegador (F12)

// Ver configuración actual
window.tapatiLogger

// Habilitar/deshabilitar
window.tapatiLogger.enable()
window.tapatiLogger.disable()

// Filtrar por categorías específicas
window.tapatiLogger.filterCategories(['firebase', 'api'])

// Ver todas las categorías
window.tapatiLogger.clearFilters()

// Configuración avanzada
window.tapatiLogger.configure({
  enabled: true,
  level: 'debug',
  categories: ['auth', 'firebase'],
  showTimestamp: true,
  showCategory: true
})
```

### Ejemplos Prácticos

```typescript
// Ejemplo 1: Login
logger.auth.info('Iniciando login', { email: user.email });
try {
  await signInWithEmailAndPassword(auth, email, password);
  logger.auth.success('Login exitoso', { userId: user.uid });
} catch (error) {
  logger.auth.error('Error en login', error);
}

// Ejemplo 2: Subida de foto
logger.api.info('Subiendo foto', { fileName: file.name, size: file.size });
const result = await uploadPhoto(file, userId);
if (result.success) {
  logger.api.success('Foto subida', { url: result.url });
} else {
  logger.api.error('Error subiendo foto', result.error);
}

// Ejemplo 3: Match
logger.match.info('Procesando like', { fromUser, toUser });
const isMatch = await checkMatch(fromUser, toUser);
if (isMatch) {
  logger.match.success('¡Match creado!', { matchId });
}
```

---

## 📦 CONSTANTES CENTRALIZADAS

### Importar Constantes

```typescript
import { 
  APP_CONFIG,
  PHOTO_CONFIG,
  FIREBASE_CONFIG,
  PREMIUM_CONFIG,
  ERROR_CODES,
  APP_TEXTS
} from '../config/constants';
```

### Uso de APP_CONFIG

```typescript
// Límites de la app
const maxLikes = APP_CONFIG.MAX_LIKES_PER_DAY;           // 50
const maxPhotos = APP_CONFIG.MAX_PHOTOS_PER_PROFILE;     // 6
const storyDuration = APP_CONFIG.STORY_DURATION_HOURS;   // 24

// Ubicación por defecto
const location = user.location || APP_CONFIG.DEFAULT_LOCATION; // "Santo Domingo"

// Edad
const minAge = APP_CONFIG.MIN_AGE;  // 18
const maxAge = APP_CONFIG.MAX_AGE;  // 99

// Mensajes
const maxLength = APP_CONFIG.MAX_MESSAGE_LENGTH;  // 2000
```

### Uso de PHOTO_CONFIG

```typescript
// Validar tamaño de foto
if (file.size > PHOTO_CONFIG.MAX_SIZE_BYTES) {
  throw new Error(`Foto debe ser menor a ${PHOTO_CONFIG.MAX_SIZE_MB}MB`);
}

// Validar formato
if (!PHOTO_CONFIG.ACCEPTED_FORMATS.includes(file.type)) {
  throw new Error('Formato no válido. Usa JPG, PNG o WebP');
}

// Redimensionar
const resized = await resizeImage(
  file,
  PHOTO_CONFIG.MAX_WIDTH,    // 800
  PHOTO_CONFIG.MAX_HEIGHT,   // 1066
  PHOTO_CONFIG.JPEG_QUALITY  // 0.85
);
```

### Uso de FIREBASE_CONFIG

```typescript
// Colecciones
const profilesRef = collection(db, FIREBASE_CONFIG.COLLECTIONS.PROFILES);
const chatsRef = collection(db, FIREBASE_CONFIG.COLLECTIONS.CHATS);
const storiesRef = collection(db, FIREBASE_CONFIG.COLLECTIONS.STORIES);

// Batch size
const profiles = await getDocs(
  query(profilesRef, limit(FIREBASE_CONFIG.BATCH_SIZE))
);
```

### Uso de PREMIUM_CONFIG

```typescript
// Precios
const monthlyPrice = PREMIUM_CONFIG.MONTHLY_PRICE;      // 9.99
const quarterlyPrice = PREMIUM_CONFIG.QUARTERLY_PRICE;  // 24.99
const boostPrice = PREMIUM_CONFIG.BOOST_24H_PRICE;      // 2.99

// Features
if (user.isPremium) {
  const unlimitedLikes = PREMIUM_CONFIG.UNLIMITED_LIKES;  // true
  const canRewind = PREMIUM_CONFIG.REWIND_ENABLED;        // true
}
```

### Uso de ERROR_CODES

```typescript
// Lanzar errores con códigos
if (!user.photos || user.photos.length === 0) {
  throw new Error(ERROR_CODES.PROFILE_PHOTOS_REQUIRED);
}

if (file.size > maxSize) {
  throw new Error(ERROR_CODES.UPLOAD_FILE_TOO_LARGE);
}

// Manejar errores
try {
  await uploadPhoto(file);
} catch (error) {
  if (error.code === ERROR_CODES.PERMISSION_DENIED) {
    logger.api.error('Permiso denegado', error);
  }
}
```

### Uso de APP_TEXTS (i18n)

```typescript
// Obtener textos en español
const appName = APP_TEXTS.es.APP_NAME;      // "Ta' Pa' Ti"
const tagline = APP_TEXTS.es.TAGLINE;       // "Cuando alguien sí te elige"
const loading = APP_TEXTS.es.LOADING;       // "Cargando..."

// Obtener textos en inglés
const appNameEn = APP_TEXTS.en.APP_NAME;    // "Ta' Pa' Ti"
const taglineEn = APP_TEXTS.en.TAGLINE;     // "When someone actually chooses you"
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

### Dónde Poner Nuevos Archivos

```
cita-rd/
├── components/          → Componentes React
├── views/              → Páginas/vistas principales
├── services/           → Servicios (Firebase, APIs)
├── hooks/              → Custom hooks
├── contexts/           → React contexts
├── utils/              → Utilidades (logger, helpers)
├── config/             → Configuración (constants.ts)
├── types/              → Tipos de TypeScript
├── public/             → Archivos estáticos
└── docs/               → Documentación
    ├── sessions/       → Sesiones de trabajo
    ├── analysis/       → Análisis técnicos
    ├── guides/         → Guías y tutoriales
    ├── features/       → Documentación de features
    └── fixes/          → Documentación de fixes
```

### Archivos de Testing

```
cita-rd/.archive/       → NO TOCAR (archivos históricos)
├── testing/            → test-*.html
├── demos/              → demo-*.html
└── debug/              → debug-*.html
```

---

## ✅ CHECKLIST PARA NUEVO CÓDIGO

Antes de hacer commit, verifica:

- [ ] ¿Usaste `logger` en lugar de `console.log`?
- [ ] ¿Usaste constantes de `config/constants.ts`?
- [ ] ¿Los archivos están en la carpeta correcta?
- [ ] ¿No hay valores hardcodeados?
- [ ] ¿No hay errores de TypeScript?
- [ ] ¿El código es limpio y legible?

---

## 🚫 QUÉ NO HACER

❌ **NO usar console.log directamente**
```typescript
// ❌ MAL
console.log('Usuario logueado');

// ✅ BIEN
logger.auth.info('Usuario logueado', { userId });
```

❌ **NO hardcodear valores**
```typescript
// ❌ MAL
const maxSize = 5 * 1024 * 1024;

// ✅ BIEN
const maxSize = PHOTO_CONFIG.MAX_SIZE_BYTES;
```

❌ **NO crear archivos en raíz**
```typescript
// ❌ MAL
cita-rd/mi-nuevo-archivo.ts

// ✅ BIEN
cita-rd/utils/mi-nuevo-archivo.ts
cita-rd/services/mi-nuevo-servicio.ts
```

❌ **NO usar strings mágicos**
```typescript
// ❌ MAL
const ref = collection(db, 'perfiles');

// ✅ BIEN
const ref = collection(db, FIREBASE_CONFIG.COLLECTIONS.PROFILES);
```

---

## 🎯 EJEMPLOS COMPLETOS

### Ejemplo 1: Nuevo Servicio

```typescript
// services/newService.ts
import { logger } from '../utils/logger';
import { APP_CONFIG, FIREBASE_CONFIG } from '../config/constants';
import { db } from './firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

export const fetchProfiles = async () => {
  try {
    logger.profile.info('Cargando perfiles');
    
    const profilesRef = collection(db, FIREBASE_CONFIG.COLLECTIONS.PROFILES);
    const q = query(profilesRef, limit(FIREBASE_CONFIG.BATCH_SIZE));
    const snapshot = await getDocs(q);
    
    const profiles = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    logger.profile.success('Perfiles cargados', { count: profiles.length });
    return profiles;
    
  } catch (error) {
    logger.profile.error('Error cargando perfiles', error);
    throw error;
  }
};
```

### Ejemplo 2: Nuevo Componente

```typescript
// components/NewComponent.tsx
import { useState } from 'react';
import { logger } from '../utils/logger';
import { APP_CONFIG } from '../config/constants';

export const NewComponent = () => {
  const [loading, setLoading] = useState(false);
  
  const handleAction = async () => {
    try {
      logger.ui.info('Acción iniciada');
      setLoading(true);
      
      // Tu lógica aquí
      
      logger.ui.success('Acción completada');
    } catch (error) {
      logger.ui.error('Error en acción', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1>{APP_CONFIG.APP_NAME}</h1>
      <button onClick={handleAction}>
        {loading ? 'Cargando...' : 'Acción'}
      </button>
    </div>
  );
};
```

---

## 📚 RECURSOS

- **Logger:** `cita-rd/utils/logger.ts`
- **Constantes:** `cita-rd/config/constants.ts`
- **Documentación completa:** `cita-rd/LIMPIEZA_FASE_1_COMPLETADA_12_FEB_2026.md`
- **Resumen visual:** `cita-rd/FASE_1_RESUMEN_VISUAL.md`

---

## 🆘 AYUDA

Si tienes dudas:
1. Lee la documentación completa
2. Revisa ejemplos en el código existente
3. Usa `window.tapatiLogger` en consola para debugging
4. Consulta `config/constants.ts` para ver todas las constantes

---

**Documentado por:** Kiro AI  
**Fecha:** 12 de Febrero 2026  
**Versión:** 1.0

