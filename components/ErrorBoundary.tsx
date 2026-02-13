import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorTrackingService } from '../services/errorTrackingService';
import { auth } from '../services/firebase';
import { logger } from '../utils/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'app' | 'section' | 'component'; // Nivel del error boundary
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: any[]; // Keys para resetear el error boundary
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCount: number;
}

/**
 * Error Boundary mejorado con niveles y retry logic
 * 
 * Niveles:
 * - app: Error crítico, muestra pantalla completa
 * - section: Error en una sección, muestra fallback en esa sección
 * - component: Error en un componente, muestra fallback mínimo
 * 
 * @example
 * <ErrorBoundary level="section">
 *   <Discovery />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { level = 'app', onError } = this.props;
    
    // Log según nivel
    if (level === 'app') {
      logger.error('App-level error', { error, errorInfo });
    } else if (level === 'section') {
      logger.error('Section-level error', { error, errorInfo });
    } else {
      logger.error('Component-level error', { error, errorInfo });
    }
    
    // Enviar a error tracking
    const userId = auth.currentUser?.uid;
    if (errorInfo.componentStack) {
      errorTrackingService.captureReactError(error, { componentStack: errorInfo.componentStack }, userId);
    }
    
    // Callback personalizado
    if (onError) {
      onError(error, errorInfo);
    }
    
    this.setState(prev => ({
      error,
      errorInfo,
      errorCount: prev.errorCount + 1
    }));
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error si cambian las resetKeys
    if (this.props.resetKeys && prevProps.resetKeys) {
      const hasChanged = this.props.resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );
      
      if (hasChanged && this.state.hasError) {
        this.setState({ 
          hasError: false, 
          error: undefined, 
          errorInfo: undefined 
        });
      }
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined 
    });
  };

  renderFallback() {
    const { level = 'app', fallback } = this.props;
    const { error, errorCount } = this.state;

    // Fallback personalizado
    if (fallback) {
      return fallback;
    }

    // Fallback según nivel
    if (level === 'component') {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            Error cargando componente
          </p>
          <button
            onClick={this.handleReset}
            className="text-red-600 text-sm underline mt-2"
          >
            Reintentar
          </button>
        </div>
      );
    }

    if (level === 'section') {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Error en esta sección</h3>
              <p className="text-red-600 text-sm">
                {error?.message || 'Error desconocido'}
              </p>
            </div>
          </div>
          
          {errorCount < 3 && (
            <button
              onClick={this.handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Reintentar
            </button>
          )}
          
          {errorCount >= 3 && (
            <div className="bg-red-100 border border-red-300 rounded p-3 mt-3">
              <p className="text-red-800 text-sm">
                Múltiples errores detectados. Por favor recarga la página.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors mt-2"
              >
                Recargar Página
              </button>
            </div>
          )}
        </div>
      );
    }

    // App-level fallback (pantalla completa)
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-800">¡Oops! Algo salió mal</h2>
              <p className="text-red-600 text-sm">La aplicación encontró un error inesperado</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">Detalles del error:</h3>
            <p className="text-red-700 text-sm font-mono">
              {error?.message || 'Error desconocido'}
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <summary className="font-semibold text-gray-800 cursor-pointer">
                Stack Trace (Desarrollo)
              </summary>
              <pre className="text-xs text-gray-600 mt-2 overflow-auto max-h-40">
                {error?.stack}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Recargar Página
            </button>
            {errorCount < 3 && (
              <button
                onClick={this.handleReset}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Intentar de Nuevo
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;