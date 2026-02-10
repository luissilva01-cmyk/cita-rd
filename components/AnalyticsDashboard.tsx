/**
 * Analytics Dashboard - Ta' Pa' Ti
 * Dashboard simple para ver métricas en desarrollo
 * Solo visible en modo desarrollo
 */

import React, { useState, useEffect } from 'react';
import { errorTrackingService } from '../services/errorTrackingService';
import { X, AlertTriangle, Activity, TrendingUp } from 'lucide-react';

export function AnalyticsDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorStats, setErrorStats] = useState<any>(null);

  // Solo mostrar en desarrollo
  if (import.meta.env.PROD) {
    return null;
  }

  useEffect(() => {
    if (isOpen) {
      const stats = errorTrackingService.getErrorStats();
      setErrorStats(stats);
    }
  }, [isOpen]);

  const refreshStats = () => {
    const stats = errorTrackingService.getErrorStats();
    setErrorStats(stats);
  };

  return (
    <>
      {/* Botón flotante para abrir dashboard */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        title="Analytics Dashboard (Dev Only)"
      >
        <Activity className="w-6 h-6" />
      </button>

      {/* Dashboard Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                <h2 className="text-xl font-bold">Analytics Dashboard</h2>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">DEV ONLY</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Error Stats */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Error Tracking
                  </h3>
                  <button
                    onClick={refreshStats}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                {errorStats && (
                  <>
                    {/* Error Summary */}
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">
                          {errorStats.total}
                        </div>
                        <div className="text-sm text-gray-600">Total Errors</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">
                          {errorStats.bySeverity.critical}
                        </div>
                        <div className="text-sm text-red-600">Critical</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {errorStats.bySeverity.high}
                        </div>
                        <div className="text-sm text-orange-600">High</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {errorStats.bySeverity.medium}
                        </div>
                        <div className="text-sm text-yellow-600">Medium</div>
                      </div>
                    </div>

                    {/* Errors by Context */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-semibold mb-2">Errors by Context</h4>
                      <div className="space-y-2">
                        {Object.entries(errorStats.byContext).map(([context, count]) => (
                          <div key={context} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">{context}</span>
                            <span className="text-sm font-semibold text-gray-900">{count as number}</span>
                          </div>
                        ))}
                        {Object.keys(errorStats.byContext).length === 0 && (
                          <div className="text-sm text-gray-500 text-center py-2">
                            No errors captured yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Errors */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Recent Errors</h4>
                      <div className="space-y-2">
                        {errorStats.recent.map((error: any, index: number) => (
                          <div
                            key={index}
                            className="bg-white p-3 rounded border border-gray-200"
                          >
                            <div className="flex items-start justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-800">
                                {error.message}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  error.severity === 'critical'
                                    ? 'bg-red-100 text-red-700'
                                    : error.severity === 'high'
                                    ? 'bg-orange-100 text-orange-700'
                                    : error.severity === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {error.severity}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              {error.context && <span>Context: {error.context} • </span>}
                              {new Date(error.timestamp).toLocaleString()}
                            </div>
                          </div>
                        ))}
                        {errorStats.recent.length === 0 && (
                          <div className="text-sm text-gray-500 text-center py-4">
                            No recent errors
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Analytics Info */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Google Analytics</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Status:</strong>{' '}
                    {import.meta.env.VITE_GA_MEASUREMENT_ID
                      ? '✅ Configured'
                      : '⚠️ Not configured'}
                  </p>
                  {import.meta.env.VITE_GA_MEASUREMENT_ID && (
                    <p>
                      <strong>Measurement ID:</strong>{' '}
                      {import.meta.env.VITE_GA_MEASUREMENT_ID}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 mt-2">
                    Check browser console for analytics events
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Development Mode Only</span>
                <button
                  onClick={() => {
                    errorTrackingService.clearErrors();
                    refreshStats();
                  }}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All Errors
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
