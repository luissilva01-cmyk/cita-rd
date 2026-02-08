// cita-rd/utils/logger.ts
// Sistema de Logging Profesional para Ta' Pa' Ti

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

type LogCategory = 
  | 'auth'        // Autenticación y sesiones
  | 'profile'     // Perfiles de usuario
  | 'chat'        // Mensajes y chats
  | 'stories'     // Sistema de stories
  | 'match'       // Sistema de matches
  | 'firebase'    // Operaciones de Firebase
  | 'api'         // Llamadas a APIs
  | 'ui'          // Interacciones de UI
  | 'privacy'     // Configuración de privacidad
  | 'verification' // Verificación de identidad
  | 'notification' // Push notifications
  | 'general';    // General

interface LogConfig {
  enabled: boolean;
  level: LogLevel;
  categories: LogCategory[];
  showTimestamp: boolean;
  showCategory: boolean;
}

class Logger {
  private config: LogConfig;
  private isDevelopment: boolean;

  // Emojis por categoría para mejor visualización
  private categoryEmojis: Record<LogCategory, string> = {
    auth: '🔐',
    profile: '👤',
    chat: '💬',
    stories: '📱',
    match: '💕',
    firebase: '🔥',
    api: '🌐',
    ui: '🎨',
    privacy: '🔒',
    verification: '✅',
    notification: '🔔',
    general: '📋'
  };

  // Colores por nivel de log
  private levelColors: Record<LogLevel, string> = {
    debug: '#6B7280',   // Gris
    info: '#3B82F6',    // Azul
    warn: '#F59E0B',    // Amarillo
    error: '#EF4444',   // Rojo
    success: '#10B981'  // Verde
  };

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
    
    // Configuración por defecto
    this.config = {
      enabled: this.isDevelopment,
      level: 'debug',
      categories: [], // Vacío = todas las categorías
      showTimestamp: true,
      showCategory: true
    };

    // Cargar configuración desde localStorage si existe
    this.loadConfig();
  }

  private loadConfig(): void {
    try {
      const savedConfig = localStorage.getItem('tapati-logger-config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      // Ignorar errores de localStorage
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem('tapati-logger-config', JSON.stringify(this.config));
    } catch (error) {
      // Ignorar errores de localStorage
    }
  }

  // Configurar el logger
  configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveConfig();
  }

  // Verificar si debe loggear
  private shouldLog(level: LogLevel, category: LogCategory): boolean {
    if (!this.config.enabled) return false;
    
    // En producción, solo errores
    if (!this.isDevelopment && level !== 'error') return false;
    
    // Filtrar por categorías si están especificadas
    if (this.config.categories.length > 0 && !this.config.categories.includes(category)) {
      return false;
    }
    
    return true;
  }

  // Formatear mensaje
  private formatMessage(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any
  ): string {
    const parts: string[] = [];
    
    // Timestamp
    if (this.config.showTimestamp) {
      const now = new Date();
      const time = now.toLocaleTimeString('es-DO', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      parts.push(`[${time}]`);
    }
    
    // Categoría con emoji
    if (this.config.showCategory) {
      const emoji = this.categoryEmojis[category];
      parts.push(`${emoji} ${category.toUpperCase()}`);
    }
    
    // Mensaje
    parts.push(message);
    
    return parts.join(' ');
  }

  // Método principal de logging
  private log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    data?: any
  ): void {
    if (!this.shouldLog(level, category)) return;
    
    const formattedMessage = this.formatMessage(level, category, message, data);
    const color = this.levelColors[level];
    
    // Estilo para el mensaje
    const style = `color: ${color}; font-weight: bold;`;
    
    // Loggear según el nivel
    switch (level) {
      case 'error':
        console.error(`%c${formattedMessage}`, style, data || '');
        break;
      case 'warn':
        console.warn(`%c${formattedMessage}`, style, data || '');
        break;
      case 'success':
      case 'info':
        console.info(`%c${formattedMessage}`, style, data || '');
        break;
      case 'debug':
        console.log(`%c${formattedMessage}`, style, data || '');
        break;
    }
  }

  // Métodos públicos por nivel
  debug(category: LogCategory, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  info(category: LogCategory, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  warn(category: LogCategory, message: string, data?: any): void {
    this.log('warn', category, message, data);
  }

  error(category: LogCategory, message: string, error?: any): void {
    this.log('error', category, message, error);
    
    // En producción, enviar a servicio de monitoreo (ej: Sentry)
    if (!this.isDevelopment) {
      this.reportToMonitoring(category, message, error);
    }
  }

  success(category: LogCategory, message: string, data?: any): void {
    this.log('success', category, message, data);
  }

  // Métodos de conveniencia por categoría
  auth = {
    debug: (msg: string, data?: any) => this.debug('auth', msg, data),
    info: (msg: string, data?: any) => this.info('auth', msg, data),
    warn: (msg: string, data?: any) => this.warn('auth', msg, data),
    error: (msg: string, error?: any) => this.error('auth', msg, error),
    success: (msg: string, data?: any) => this.success('auth', msg, data)
  };

  profile = {
    debug: (msg: string, data?: any) => this.debug('profile', msg, data),
    info: (msg: string, data?: any) => this.info('profile', msg, data),
    warn: (msg: string, data?: any) => this.warn('profile', msg, data),
    error: (msg: string, error?: any) => this.error('profile', msg, error),
    success: (msg: string, data?: any) => this.success('profile', msg, data)
  };

  chat = {
    debug: (msg: string, data?: any) => this.debug('chat', msg, data),
    info: (msg: string, data?: any) => this.info('chat', msg, data),
    warn: (msg: string, data?: any) => this.warn('chat', msg, data),
    error: (msg: string, error?: any) => this.error('chat', msg, error),
    success: (msg: string, data?: any) => this.success('chat', msg, data)
  };

  stories = {
    debug: (msg: string, data?: any) => this.debug('stories', msg, data),
    info: (msg: string, data?: any) => this.info('stories', msg, data),
    warn: (msg: string, data?: any) => this.warn('stories', msg, data),
    error: (msg: string, error?: any) => this.error('stories', msg, error),
    success: (msg: string, data?: any) => this.success('stories', msg, data)
  };

  match = {
    debug: (msg: string, data?: any) => this.debug('match', msg, data),
    info: (msg: string, data?: any) => this.info('match', msg, data),
    warn: (msg: string, data?: any) => this.warn('match', msg, data),
    error: (msg: string, error?: any) => this.error('match', msg, error),
    success: (msg: string, data?: any) => this.success('match', msg, data)
  };

  firebase = {
    debug: (msg: string, data?: any) => this.debug('firebase', msg, data),
    info: (msg: string, data?: any) => this.info('firebase', msg, data),
    warn: (msg: string, data?: any) => this.warn('firebase', msg, data),
    error: (msg: string, error?: any) => this.error('firebase', msg, error),
    success: (msg: string, data?: any) => this.success('firebase', msg, data)
  };

  api = {
    debug: (msg: string, data?: any) => this.debug('api', msg, data),
    info: (msg: string, data?: any) => this.info('api', msg, data),
    warn: (msg: string, data?: any) => this.warn('api', msg, data),
    error: (msg: string, error?: any) => this.error('api', msg, error),
    success: (msg: string, data?: any) => this.success('api', msg, data)
  };

  ui = {
    debug: (msg: string, data?: any) => this.debug('ui', msg, data),
    info: (msg: string, data?: any) => this.info('ui', msg, data),
    warn: (msg: string, data?: any) => this.warn('ui', msg, data),
    error: (msg: string, error?: any) => this.error('ui', msg, error),
    success: (msg: string, data?: any) => this.success('ui', msg, data)
  };

  privacy = {
    debug: (msg: string, data?: any) => this.debug('privacy', msg, data),
    info: (msg: string, data?: any) => this.info('privacy', msg, data),
    warn: (msg: string, data?: any) => this.warn('privacy', msg, data),
    error: (msg: string, error?: any) => this.error('privacy', msg, error),
    success: (msg: string, data?: any) => this.success('privacy', msg, data)
  };

  verification = {
    debug: (msg: string, data?: any) => this.debug('verification', msg, data),
    info: (msg: string, data?: any) => this.info('verification', msg, data),
    warn: (msg: string, data?: any) => this.warn('verification', msg, data),
    error: (msg: string, error?: any) => this.error('verification', msg, error),
    success: (msg: string, data?: any) => this.success('verification', msg, data)
  };

  notification = {
    debug: (msg: string, data?: any) => this.debug('notification', msg, data),
    info: (msg: string, data?: any) => this.info('notification', msg, data),
    warn: (msg: string, data?: any) => this.warn('notification', msg, data),
    error: (msg: string, error?: any) => this.error('notification', msg, error),
    success: (msg: string, data?: any) => this.success('notification', msg, data)
  };

  // Reportar a servicio de monitoreo (placeholder para Sentry, etc.)
  private reportToMonitoring(category: string, message: string, error?: any): void {
    // TODO: Integrar con Sentry o servicio similar
    // Ejemplo:
    // Sentry.captureException(error, {
    //   tags: { category },
    //   extra: { message }
    // });
  }

  // Utilidades para debugging
  group(label: string): void {
    if (this.config.enabled && this.isDevelopment) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.config.enabled && this.isDevelopment) {
      console.groupEnd();
    }
  }

  table(data: any): void {
    if (this.config.enabled && this.isDevelopment) {
      console.table(data);
    }
  }

  time(label: string): void {
    if (this.config.enabled && this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.config.enabled && this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  // Habilitar/deshabilitar logging
  enable(): void {
    this.config.enabled = true;
    this.saveConfig();
  }

  disable(): void {
    this.config.enabled = false;
    this.saveConfig();
  }

  // Filtrar por categorías
  filterCategories(categories: LogCategory[]): void {
    this.config.categories = categories;
    this.saveConfig();
  }

  clearFilters(): void {
    this.config.categories = [];
    this.saveConfig();
  }
}

// Instancia singleton
export const logger = new Logger();

// Exponer en window para debugging en consola
if (typeof window !== 'undefined') {
  (window as any).tapatiLogger = logger;
}

export default logger;
