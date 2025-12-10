# 📝 Changelog - CitaRD

## [2.0.0] - 2024-12-09

### ✨ Nuevas Funcionalidades

#### 🛡️ Seguridad y Privacidad
- **Sistema de bloqueos**: Los usuarios pueden bloquear/desbloquear a otros usuarios
- **Sistema de reportes**: Reportar usuarios con motivos predefinidos
- **Página de usuarios bloqueados**: Ver y gestionar lista de bloqueados
- **Reglas de Firestore mejoradas**: Validación robusta de datos y permisos

#### 🔍 Exploración Mejorada
- **Filtros avanzados**: 
  - Rango de edad personalizable (18-99)
  - Distancia máxima configurable (1-200 km)
  - Filtro por género de interés
- **Algoritmo de relevancia**: Ordenamiento inteligente basado en:
  - Intereses comunes
  - Proximidad geográfica
  - Completitud del perfil
- **Nueva página de exploración mejorada** con UI moderna

#### ⚙️ Preferencias y Configuración
- **Página de preferencias**: Configurar filtros de búsqueda
- **Configuración de notificaciones**: Controlar qué notificaciones recibir
- **Configuración de cuenta**: Gestión de email, contraseña y seguridad
- **Verificación de email**: Envío de email de verificación

#### 📸 Gestión de Imágenes
- **Componente de subida de fotos**: Upload con preview y compresión
- **Integración con Cloudinary**: Subida optimizada de imágenes
- **Compresión automática**: Reducción de tamaño antes de subir
- **Validación de archivos**: Solo JPG, PNG, WEBP (máx 5MB)

#### 🎨 Experiencia de Usuario
- **Modal de onboarding**: Tutorial interactivo para nuevos usuarios
- **Modal de reportes**: Interfaz amigable para reportar usuarios
- **Animaciones mejoradas**: Transiciones fluidas con Framer Motion
- **Indicadores de distancia**: Mostrar distancia en km entre usuarios

### 🔧 Mejoras Técnicas

#### Base de Datos
- **Índices compuestos en Firestore**: Optimización de queries
- **Nuevas colecciones**:
  - `bloqueos`: Gestión de usuarios bloqueados
  - `reportes`: Sistema de reportes
  - `preferencias`: Preferencias de usuario
- **Reglas de seguridad actualizadas**: Protección completa de datos

#### Servicios
- `bloqueosService.js`: CRUD de bloqueos
- `reportesService.js`: Sistema de reportes
- `preferenciasService.js`: Gestión de preferencias
- `uploadService.js`: Subida y compresión de imágenes

#### Utilidades
- `filtrarPerfilesAvanzado.js`: Filtrado y ordenamiento inteligente
- `useOnboarding.js`: Hook para gestionar onboarding

#### Componentes
- `ReportarModal.jsx`: Modal para reportar usuarios
- `SubirFoto.jsx`: Componente de upload de imágenes
- `OnboardingModal.jsx`: Tutorial interactivo

#### Páginas
- `Preferencias.jsx`: Configuración de filtros
- `UsuariosBloqueados.jsx`: Lista de bloqueados
- `ConfiguracionCuenta.jsx`: Gestión de cuenta
- `ExplorarPerfilesMejorado.jsx`: Exploración con filtros

### 📚 Documentación
- **README.md actualizado**: Documentación completa del proyecto
- **CHANGELOG.md**: Registro de cambios
- **.env.example**: Plantilla de variables de entorno

### 🔄 Rutas Nuevas
- `/preferencias` - Configuración de filtros
- `/bloqueados` - Usuarios bloqueados
- `/configuracion` - Configuración de cuenta
- `/matches` - Lista de matches
- `/swipe` - Exploración tipo swipe

### 🐛 Correcciones
- Corrección en reglas de Firestore para colecciones `likes` y `matches`
- Validación de datos en creación de perfiles
- Mejora en la gestión de errores de Firebase

---

## [1.0.0] - Versión Inicial

### Funcionalidades Base
- Autenticación con Firebase
- Perfiles de usuario
- Sistema de likes y matches
- Chat en tiempo real
- Exploración de perfiles
- Sistema de swipe básico
