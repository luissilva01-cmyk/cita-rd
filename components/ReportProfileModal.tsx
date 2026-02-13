import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle } from 'lucide-react';
import { reportUser, getReportCategories, ReportCategory } from '../services/reportService';
import { logger } from '../utils/logger';

interface ReportProfileModalProps {
  isOpen: boolean;
  reportedUserId: string;
  reportedUserName: string;
  currentUserId: string;
  onClose: () => void;
}

const ReportProfileModal: React.FC<ReportProfileModalProps> = ({
  isOpen,
  reportedUserId,
  reportedUserName,
  currentUserId,
  onClose
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | ''>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = getReportCategories();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔴 REPORTE - handleSubmit llamado', { selectedCategory, reason });
    
    if (!selectedCategory) {
      console.log('🔴 REPORTE - Error: No hay categoría seleccionada');
      setError('Por favor selecciona una categoría');
      return;
    }

    console.log('🔴 REPORTE - Iniciando envío...');
    setIsSubmitting(true);
    setError('');

    try {
      console.log('🔴 REPORTE - Llamando a reportUser...', {
        currentUserId,
        reportedUserId,
        category: selectedCategory,
        reason: reason.trim() || ''
      });

      const result = await reportUser(
        currentUserId,
        reportedUserId,
        selectedCategory as ReportCategory,
        reason.trim() || '' // Permitir envío sin detalles adicionales
      );

      console.log('🔴 REPORTE - Resultado:', result);
      console.log('🔴 REPORTE - Resultado:', result);

      if (result.success) {
        console.log('🔴 REPORTE - Éxito! Mostrando mensaje...');
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset form
          setSelectedCategory('');
          setReason('');
          setShowSuccess(false);
        }, 2000);
      } else {
        console.log('🔴 REPORTE - Error en resultado:', result.error);
        setError(result.error || 'Error al enviar el reporte');
      }
    } catch (err) {
      console.error('🔴 REPORTE - Excepción capturada:', err);
      setError('Error al enviar el reporte. Intenta de nuevo.');
    } finally {
      console.log('🔴 REPORTE - Finalizando...');
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          // Success State
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Reporte Enviado
            </h3>
            <p className="text-slate-600">
              Gracias por ayudarnos a mantener Ta' Pa' Ti seguro. Revisaremos tu reporte pronto.
            </p>
          </div>
        ) : (
          // Form State
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Reportar Usuario
                  </h3>
                  <p className="text-sm text-slate-600">
                    {reportedUserName}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                disabled={isSubmitting}
              >
                <X className="text-slate-600" size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  ¿Por qué reportas este perfil?
                </label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category.value
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={selectedCategory === category.value}
                        onChange={(e) => setSelectedCategory(e.target.value as ReportCategory)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">
                          {category.label}
                        </div>
                        <div className="text-sm text-slate-600">
                          {category.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason Text Area */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Detalles adicionales <span className="text-slate-500 font-normal">(opcional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Describe el problema con más detalle... (opcional)"
                  maxLength={500}
                />
                <div className="text-xs text-slate-500 mt-1 text-right">
                  {reason.length}/500
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Info Box */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  💡 Tu reporte es anónimo. Revisaremos el perfil y tomaremos las medidas necesarias.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 border border-slate-200 rounded-lg text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !selectedCategory}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportProfileModal;
