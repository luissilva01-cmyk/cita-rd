/**
 * Error Tracking Service - Ta' Pa' Ti
 * Sistema de captura y reporte de errores en producción
 */

import { logger } from '../utils/logger';
import { analyticsService } from './analyticsService';

interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  context?: string;
  userId?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

class ErrorTrackingService {
  private errors: ErrorReport[] = [];
  private maxErrors = 50; // Máximo de errores en memoria
  private isInitialized = false;

  /**
   * Inicializar el servicio de tracking de errores
   */
  initialize() {
    if (this.isInitialized) return;

    // Capturar errores no manejados
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        context: 'Unhandled Error',
        severity: 'high',
      });
    });

    // Capturar promesas rechazadas no manejadas
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(event.reason?.message || 'Unhandled Promise Rejection'),
        {
          context: 'Unhandled Promise Rejection',
          severity: 'medium',
          stack: event.reason?.stack,
        }
      );
    });

    this.isInitialized = true;
    logger.error.info('Error tracking initialized');
  }

  /**
   * Capturar un error
   */
  captureError(
    error: Error,
    options: {
      context?: string;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      componentStack?: string;
      userId?: string;
    } = {}
  ) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: options.componentStack,
      context: options.context,
      userId: options.userId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      severity: options.severity || 'medium',
    };

    // Guardar en memoria
    this.errors.push(errorReport);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remover el más antiguo
    }

    // Log local
    logger.error.error('Error captured', errorReport);

    // Enviar a analytics
    analyticsService.trackError(error, options.context);

    // En producción, aquí enviarías a un servicio como Sentry
    this.sendToErrorService(errorReport);
  }

  /**
   * Capturar error de React Error Boundary
   */
  captureReactError(
    error: Error,
    errorInfo: { componentStack: string },
    userId?: string
  ) {
    this.captureError(error, {
      context: 'React Error Boundary',
      severity: 'high',
      componentStack: errorInfo.componentStack,
      userId,
    });
  }

  /**
   * Capturar error de API
   */
  captureAPIError(
    endpoint: string,
    statusCode: number,
    errorMessage: string,
    userId?: string
  ) {
    const error = new Error(`API Error: ${endpoint} - ${statusCode}`);
    
    this.captureError(error, {
      context: `API: ${endpoint}`,
      severity: statusCode >= 500 ? 'high' : 'medium',
      userId,
    });

    // Track en analytics
    analyticsService.trackEvent('api_error' as any, {
      endpoint,
      status_code: statusCode,
      error_message: errorMessage,
    });
  }

  /**
   * Obtener todos los errores capturados
   */
  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  /**
   * Limpiar errores
   */
  clearErrors() {
    this.errors = [];
    logger.error.info('Errors cleared');
  }

  /**
   * Enviar error a servicio externo (Sentry, LogRocket, etc.)
   */
  private sendToErrorService(errorReport: ErrorReport) {
    // Por ahora solo guardamos en Firestore
    // En el futuro puedes integrar Sentry aquí
    
    try {
      // Ejemplo de cómo enviarías a Sentry:
      // if (window.Sentry) {
      //   window.Sentry.captureException(new Error(errorReport.message), {
      //     level: errorReport.severity,
      //     contexts: {
      //       error: errorReport,
      //     },
      //   });
      // }

      // Por ahora, solo log
      if (import.meta.env.PROD) {
        // En producción, podrías enviar a un endpoint
        console.error('Error Report:', errorReport);
      }
    } catch (error) {
      logger.error.error('Failed to send error to service', error);
    }
  }

  /**
   * Obtener estadísticas de errores
   */
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      bySeverity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      },
      byContext: {} as Record<string, number>,
      recent: this.errors.slice(-5), // Últimos 5 errores
    };

    this.errors.forEach((error) => {
      stats.bySeverity[error.severity]++;
      
      const context = error.context || 'Unknown';
      stats.byContext[context] = (stats.byContext[context] || 0) + 1;
    });

    return stats;
  }
}

// Exportar instancia singleton
export const errorTrackingService = new ErrorTrackingService();
