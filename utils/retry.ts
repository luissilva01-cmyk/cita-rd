// cita-rd/utils/retry.ts
// Utilidades para retry logic con exponential backoff

import { logger } from './logger';

/**
 * Opciones para retry logic
 */
export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  exponentialBackoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Ejecuta una función con retry logic y exponential backoff
 * 
 * @example
 * const data = await retryWithBackoff(
 *   () => fetchUserProfile(userId),
 *   { maxRetries: 3, baseDelay: 1000 }
 * );
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    exponentialBackoff = true,
    onRetry
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Si es el último intento, lanzar el error
      if (attempt === maxRetries) {
        logger.error('Retry failed', { 
          maxRetries, 
          error: lastError.message 
        });
        throw lastError;
      }

      // Calcular delay con exponential backoff
      const delay = exponentialBackoff
        ? Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
        : baseDelay;

      logger.debug('Retrying request', {
        attempt: attempt + 1,
        maxRetries,
        delay,
        error: lastError.message
      });

      // Callback de retry
      if (onRetry) {
        onRetry(attempt + 1, lastError);
      }

      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Verifica si un error es recuperable (vale la pena reintentar)
 */
export function isRetryableError(error: any): boolean {
  // Errores de red
  if (error.code === 'unavailable' || error.code === 'UNAVAILABLE') {
    return true;
  }

  // Timeout
  if (error.code === 'deadline-exceeded' || error.code === 'DEADLINE_EXCEEDED') {
    return true;
  }

  // Rate limiting
  if (error.code === 'resource-exhausted' || error.code === 'RESOURCE_EXHAUSTED') {
    return true;
  }

  // Network errors
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return true;
  }

  // Firebase specific
  if (error.code === 'unavailable' || error.message?.includes('unavailable')) {
    return true;
  }

  return false;
}

/**
 * Retry solo si el error es recuperable
 */
export async function retryIfRecoverable<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (isRetryableError(error)) {
      logger.info('Retrying recoverable error', {
        error: (error as Error).message
      });
      return await retryWithBackoff(fn, options);
    }
    throw error;
  }
}

/**
 * Ejecuta múltiples funciones en paralelo con retry
 */
export async function retryAll<T>(
  fns: Array<() => Promise<T>>,
  options: RetryOptions = {}
): Promise<T[]> {
  return Promise.all(
    fns.map(fn => retryWithBackoff(fn, options))
  );
}

/**
 * Ejecuta función con timeout
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutError: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
    )
  ]);
}

/**
 * Combina retry con timeout
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  retryOptions: RetryOptions = {}
): Promise<T> {
  return retryWithBackoff(
    () => withTimeout(fn, timeoutMs),
    retryOptions
  );
}

export default {
  retryWithBackoff,
  isRetryableError,
  retryIfRecoverable,
  retryAll,
  withTimeout,
  retryWithTimeout
};
