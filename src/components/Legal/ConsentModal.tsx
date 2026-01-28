// cita-rd/src/components/Legal/ConsentModal.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Shield, Eye, FileText, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (consents: ConsentData) => void;
  userEmail?: string;
}

interface ConsentData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  ageConfirmed: boolean;
  marketingOptIn: boolean;
  timestamp: string;
  userEmail?: string;
}

export default function ConsentModal({ isOpen, onClose, onAccept, userEmail }: ConsentModalProps) {
  const navigate = useNavigate();
  const [consents, setConsents] = useState<ConsentData>({
    termsAccepted: false,
    privacyAccepted: false,
    ageConfirmed: false,
    marketingOptIn: false,
    timestamp: new Date().toISOString(),
    userEmail
  });

  const handleConsentChange = (field: keyof ConsentData, value: boolean) => {
    setConsents(prev => ({
      ...prev,
      [field]: value,
      timestamp: new Date().toISOString()
    }));
  };

  const canProceed = consents.termsAccepted && consents.privacyAccepted && consents.ageConfirmed;

  const handleAccept = () => {
    if (canProceed) {
      onAccept(consents);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl"
          style={{ backgroundColor: '#f8f6f6' }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b"
            style={{ borderColor: '#e7d5cf' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="size-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'rgba(236, 73, 19, 0.1)', color: '#ec4913' }}
              >
                <Shield size={20} />
              </div>
              <div>
                <h2 
                  className="text-lg font-bold leading-tight"
                  style={{ color: '#1b110d' }}
                >
                  Términos y Privacidad
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: '#9a5f4c' }}
                >
                  Antes de continuar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"
              style={{ color: '#9a5f4c' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="text-center">
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: '#1b110d' }}
                >
                  ¡Bienvenido a Ta' Pa' Ti! 🔥
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: '#9a5f4c' }}
                >
                  Para crear tu cuenta, necesitamos que aceptes nuestros términos y confirmes algunos aspectos importantes.
                </p>
              </div>

              {/* Age Confirmation */}
              <div 
                className="p-4 rounded-xl border"
                style={{ backgroundColor: 'rgba(236, 73, 19, 0.05)', borderColor: 'rgba(236, 73, 19, 0.2)' }}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={consents.ageConfirmed}
                      onChange={(e) => handleConsentChange('ageConfirmed', e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                        consents.ageConfirmed 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {consents.ageConfirmed && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p 
                      className="font-semibold text-sm mb-1"
                      style={{ color: '#ec4913' }}
                    >
                      Confirmo que tengo 18 años o más
                    </p>
                    <p 
                      className="text-xs leading-relaxed"
                      style={{ color: '#9a5f4c' }}
                    >
                      Ta' Pa' Ti es exclusivamente para adultos. Debes tener al menos 18 años para usar nuestra plataforma.
                    </p>
                  </div>
                </label>
              </div>

              {/* Terms of Service */}
              <div 
                className="p-4 rounded-xl border"
                style={{ backgroundColor: '#ffffff', borderColor: '#e7d5cf' }}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={consents.termsAccepted}
                      onChange={(e) => handleConsentChange('termsAccepted', e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                        consents.termsAccepted 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {consents.termsAccepted && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText size={16} style={{ color: '#ec4913' }} />
                      <p 
                        className="font-semibold text-sm"
                        style={{ color: '#1b110d' }}
                      >
                        Acepto los Términos de Servicio
                      </p>
                    </div>
                    <p 
                      className="text-xs leading-relaxed mb-2"
                      style={{ color: '#9a5f4c' }}
                    >
                      Reglas de uso, comportamiento y responsabilidades en Ta' Pa' Ti.
                    </p>
                    <button
                      onClick={() => navigate('/terms-of-service')}
                      className="text-xs font-semibold underline hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
                      style={{ color: '#ec4913' }}
                    >
                      Leer Términos de Servicio →
                    </button>
                  </div>
                </label>
              </div>

              {/* Privacy Policy */}
              <div 
                className="p-4 rounded-xl border"
                style={{ backgroundColor: '#ffffff', borderColor: '#e7d5cf' }}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={consents.privacyAccepted}
                      onChange={(e) => handleConsentChange('privacyAccepted', e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                        consents.privacyAccepted 
                          ? 'bg-orange-500 border-orange-500' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {consents.privacyAccepted && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye size={16} style={{ color: '#3b82f6' }} />
                      <p 
                        className="font-semibold text-sm"
                        style={{ color: '#1b110d' }}
                      >
                        Acepto la Política de Privacidad
                      </p>
                    </div>
                    <p 
                      className="text-xs leading-relaxed mb-2"
                      style={{ color: '#9a5f4c' }}
                    >
                      Cómo recopilamos, usamos y protegemos tu información personal.
                    </p>
                    <button
                      onClick={() => navigate('/privacy-policy')}
                      className="text-xs font-semibold underline hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
                      style={{ color: '#3b82f6' }}
                    >
                      Leer Política de Privacidad →
                    </button>
                  </div>
                </label>
              </div>

              {/* Marketing Opt-in (Optional) */}
              <div 
                className="p-4 rounded-xl border"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-1">
                    <input
                      type="checkbox"
                      checked={consents.marketingOptIn}
                      onChange={(e) => handleConsentChange('marketingOptIn', e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                        consents.marketingOptIn 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {consents.marketingOptIn && (
                        <CheckCircle size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p 
                      className="font-semibold text-sm mb-1"
                      style={{ color: '#1b110d' }}
                    >
                      Recibir consejos y novedades (Opcional)
                    </p>
                    <p 
                      className="text-xs leading-relaxed"
                      style={{ color: '#9a5f4c' }}
                    >
                      Ocasionalmente te enviaremos consejos para citas y actualizaciones sobre nuevas funciones.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="p-6 border-t"
            style={{ borderColor: '#e7d5cf' }}
          >
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 h-12 rounded-xl border font-semibold transition-colors hover:bg-gray-50"
                style={{ 
                  color: '#9a5f4c',
                  borderColor: '#e7d5cf',
                  backgroundColor: '#ffffff'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                disabled={!canProceed}
                className={`flex-1 h-12 rounded-xl font-semibold transition-all ${
                  canProceed 
                    ? 'hover:bg-opacity-90 active:scale-[0.98] shadow-lg' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ 
                  backgroundColor: canProceed ? '#ec4913' : '#d1d5db',
                  color: 'white',
                  boxShadow: canProceed ? '0 4px 12px rgba(236, 73, 19, 0.25)' : 'none'
                }}
              >
                Crear Cuenta
              </button>
            </div>
            
            {!canProceed && (
              <p 
                className="text-xs text-center mt-3"
                style={{ color: '#9a5f4c' }}
              >
                Debes aceptar los términos obligatorios para continuar
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}