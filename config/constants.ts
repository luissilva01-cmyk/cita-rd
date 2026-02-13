// cita-rd/config/constants.ts
// Constantes de configuración de la aplicación Ta' Pa' Ti

/**
 * Configuración general de la aplicación
 */
export const APP_CONFIG = {
  // Información de la app
  APP_NAME: "Ta' Pa' Ti",
  APP_TAGLINE: "Cuando alguien sí te elige",
  APP_VERSION: "2.0.0",
  
  // Ubicación por defecto
  DEFAULT_LOCATION: "Santo Domingo",
  DEFAULT_COUNTRY: "República Dominicana",
  
  // Límites de uso
  MAX_LIKES_PER_DAY: 50,
  MAX_SUPER_LIKES_PER_MONTH: 5,
  MAX_PHOTOS_PER_PROFILE: 6,
  MAX_BIO_LENGTH: 500,
  MAX_ABOUT_ME_LENGTH: 1000,
  
  // Stories
  STORY_DURATION_HOURS: 24,
  MAX_STORY_SIZE_MB: 10,
  MAX_STORIES_PER_DAY: 10,
  
  // Mensajes
  MAX_MESSAGE_LENGTH: 2000,
  MAX_VOICE_MESSAGE_DURATION_SECONDS: 60,
  MAX_VIDEO_MESSAGE_DURATION_SECONDS: 30,
  
  // Distancia
  DEFAULT_MAX_DISTANCE_KM: 50,
  MIN_DISTANCE_KM: 5,
  MAX_DISTANCE_KM: 100,
  
  // Edad
  MIN_AGE: 18,
  MAX_AGE: 99,
  DEFAULT_MIN_AGE: 18,
  DEFAULT_MAX_AGE: 35,
  
  // Verificación
  MIN_PHOTOS_FOR_VERIFICATION: 1,
  VERIFICATION_EXPIRY_DAYS: 365,
  
  // Presencia
  ONLINE_TIMEOUT_MINUTES: 5,
  TYPING_TIMEOUT_SECONDS: 3,
  
  // Notificaciones
  NOTIFICATION_BATCH_SIZE: 10,
  NOTIFICATION_RETRY_ATTEMPTS: 3,
} as const;

/**
 * Configuración de fotos
 */
export const PHOTO_CONFIG = {
  // Dimensiones
  MAX_WIDTH: 800,
  MAX_HEIGHT: 1066, // Ratio 3:4
  ASPECT_RATIO: 3 / 4,
  
  // Tamaño
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  
  // Calidad
  JPEG_QUALITY: 0.85,
  
  // Formatos aceptados
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const;

/**
 * Configuración de AI
 */
export const AI_CONFIG = {
  // Gemini API
  GEMINI_MODEL: "gemini-1.5-flash",
  GEMINI_MAX_TOKENS: 1000,
  GEMINI_TEMPERATURE: 0.7,
  
  // Matching AI
  MIN_COMPATIBILITY_SCORE: 0.5,
  HIGH_COMPATIBILITY_THRESHOLD: 0.8,
  
  // Emotional AI
  SENTIMENT_ANALYSIS_ENABLED: true,
  EMOTION_DETECTION_ENABLED: true,
} as const;

/**
 * Configuración de Analytics
 */
export const ANALYTICS_CONFIG = {
  // Google Analytics
  MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
  
  // Eventos personalizados
  TRACK_PAGE_VIEWS: true,
  TRACK_USER_INTERACTIONS: true,
  TRACK_ERRORS: true,
  
  // Sampling
  SAMPLE_RATE: 100, // 100% en desarrollo, ajustar en producción
} as const;

/**
 * Configuración de Premium
 */
export const PREMIUM_CONFIG = {
  // Precios (USD)
  MONTHLY_PRICE: 9.99,
  QUARTERLY_PRICE: 24.99,
  BIANNUAL_PRICE: 44.99,
  
  // Features
  UNLIMITED_LIKES: true,
  SEE_WHO_LIKED_YOU: true,
  REWIND_ENABLED: true,
  ADVANCED_FILTERS: true,
  MONTHLY_BOOST: 1,
  NO_ADS: true,
  PRIORITY_DISCOVERY: true,
  
  // Boost
  BOOST_24H_PRICE: 2.99,
  BOOST_7D_PRICE: 9.99,
  BOOST_30D_PRICE: 29.99,
  
  // Super Likes
  SUPER_LIKE_5_PRICE: 4.99,
  SUPER_LIKE_25_PRICE: 19.99,
  SUPER_LIKE_60_PRICE: 39.99,
} as const;

/**
 * URLs de la aplicación
 */
export const APP_URLS = {
  PRODUCTION: "https://citard-fbc26.web.app",
  TERMS_OF_SERVICE: "/terms-of-service.html",
  PRIVACY_POLICY: "/privacy-policy.html",
  SUPPORT_EMAIL: "soporte@tapati.app",
  INSTAGRAM: "https://instagram.com/tapati.app",
  TWITTER: "https://twitter.com/tapati_app",
} as const;

/**
 * Configuración de Firebase
 */
export const FIREBASE_CONFIG = {
  // Collections
  COLLECTIONS: {
    PROFILES: "perfiles",
    CHATS: "chats",
    MESSAGES: "messages",
    STORIES: "stories",
    LIKES: "likes",
    MATCHES: "matches",
    REPORTS: "reports",
    BLOCKS: "blocks",
    NOTIFICATIONS: "notifications",
    PRESENCE: "presence",
    ANALYTICS: "analytics",
  },
  
  // Batch sizes
  BATCH_SIZE: 20,
  MAX_BATCH_SIZE: 500,
  
  // Cache
  CACHE_SIZE_BYTES: 40 * 1024 * 1024, // 40MB
} as const;

/**
 * Configuración de desarrollo
 */
export const DEV_CONFIG = {
  // Logging
  ENABLE_LOGGING: import.meta.env.DEV,
  LOG_LEVEL: import.meta.env.DEV ? 'debug' : 'error',
  
  // Mock data
  USE_MOCK_DATA: false,
  MOCK_USER_COUNT: 20,
  
  // Performance
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_TRACKING: true,
} as const;

/**
 * Textos de la aplicación (i18n básico)
 */
export const APP_TEXTS = {
  es: {
    APP_NAME: "Ta' Pa' Ti",
    TAGLINE: "Cuando alguien sí te elige",
    WELCOME: "Bienvenido a Ta' Pa' Ti",
    LOADING: "Cargando...",
    ERROR: "Ocurrió un error",
    SUCCESS: "¡Éxito!",
    CANCEL: "Cancelar",
    CONFIRM: "Confirmar",
    SAVE: "Guardar",
    DELETE: "Eliminar",
    EDIT: "Editar",
    BACK: "Volver",
    NEXT: "Siguiente",
    FINISH: "Finalizar",
  },
  en: {
    APP_NAME: "Ta' Pa' Ti",
    TAGLINE: "When someone actually chooses you",
    WELCOME: "Welcome to Ta' Pa' Ti",
    LOADING: "Loading...",
    ERROR: "An error occurred",
    SUCCESS: "Success!",
    CANCEL: "Cancel",
    CONFIRM: "Confirm",
    SAVE: "Save",
    DELETE: "Delete",
    EDIT: "Edit",
    BACK: "Back",
    NEXT: "Next",
    FINISH: "Finish",
  },
} as const;

/**
 * Regex patterns comunes
 */
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  URL: /^https?:\/\/.+/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
} as const;

/**
 * Códigos de error personalizados
 */
export const ERROR_CODES = {
  // Auth
  AUTH_INVALID_CREDENTIALS: "auth/invalid-credentials",
  AUTH_USER_NOT_FOUND: "auth/user-not-found",
  AUTH_EMAIL_IN_USE: "auth/email-already-in-use",
  AUTH_WEAK_PASSWORD: "auth/weak-password",
  
  // Profile
  PROFILE_INCOMPLETE: "profile/incomplete",
  PROFILE_PHOTOS_REQUIRED: "profile/photos-required",
  PROFILE_NOT_FOUND: "profile/not-found",
  
  // Upload
  UPLOAD_FILE_TOO_LARGE: "upload/file-too-large",
  UPLOAD_INVALID_FORMAT: "upload/invalid-format",
  UPLOAD_FAILED: "upload/failed",
  
  // Permissions
  PERMISSION_DENIED: "permission/denied",
  PERMISSION_LOCATION_REQUIRED: "permission/location-required",
  PERMISSION_CAMERA_REQUIRED: "permission/camera-required",
  
  // Network
  NETWORK_ERROR: "network/error",
  NETWORK_TIMEOUT: "network/timeout",
} as const;

export default {
  APP_CONFIG,
  PHOTO_CONFIG,
  AI_CONFIG,
  ANALYTICS_CONFIG,
  PREMIUM_CONFIG,
  APP_URLS,
  FIREBASE_CONFIG,
  DEV_CONFIG,
  APP_TEXTS,
  REGEX_PATTERNS,
  ERROR_CODES,
};
