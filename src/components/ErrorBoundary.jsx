import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error capturado por ErrorBoundary:', error);
    console.error('📋 Error info:', errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          <div className="max-w-md mx-auto text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
            <div className="text-6xl mb-4">💔</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              ¡Oops! Algo salió mal
            </h1>
            <p className="text-gray-200 mb-6">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Recargar página
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
              <details className="mt-6 text-left">
                <summary className="text-gray-300 cursor-pointer mb-2">
                  Detalles del error (desarrollo)
                </summary>
                <div className="bg-black/30 p-4 rounded-lg text-xs text-gray-300 overflow-auto max-h-40">
                  <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                  <p><strong>Stack:</strong></p>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;