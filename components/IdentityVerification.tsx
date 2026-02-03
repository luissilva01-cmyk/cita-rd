// cita-rd/components/IdentityVerification.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Shield, CheckCircle, AlertCircle, Clock, Star } from 'lucide-react';
import { verificationService, VerificationAttempt, UserVerification } from '../services/verificationService';
import { useTranslation } from '../hooks/useTranslation';
import ReliableCamera, { ReliableCameraRef } from './ReliableCamera';
import { logger } from '../utils/logger';

interface IdentityVerificationProps {
  isOpen: boolean;
  currentUserId: string;
  profilePhotos: string[];
  onClose: () => void;
  onVerificationComplete?: (success: boolean) => void;
}

type VerificationStep = 'intro' | 'camera' | 'capture' | 'processing' | 'result';

const IdentityVerification: React.FC<IdentityVerificationProps> = ({
  isOpen,
  currentUserId,
  profilePhotos,
  onClose,
  onVerificationComplete
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<VerificationStep>('intro');
  const [userVerification, setUserVerification] = useState<UserVerification | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<VerificationAttempt | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [canAttempt, setCanAttempt] = useState(true);
  const [attemptInfo, setAttemptInfo] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<ReliableCameraRef>(null);

  // Cargar información de verificación al abrir
  useEffect(() => {
    if (isOpen) {
      loadVerificationInfo();
    }
  }, [isOpen, currentUserId]);

  // Limpiar cámara al cerrar
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const loadVerificationInfo = async () => {
    try {
      const verification = await verificationService.getUserVerification(currentUserId);
      setUserVerification(verification);

      const attemptCheck = await verificationService.canAttemptVerification(currentUserId);
      setCanAttempt(attemptCheck.canAttempt);
      
      if (!attemptCheck.canAttempt) {
        setAttemptInfo(attemptCheck.reason || '');
      }
    } catch (error) {
      logger.verification.error('Error loading verification info', { error, userId: currentUserId });
    }
  };

  const startCamera = async () => {
    try {
      logger.verification.info('Starting camera for identity verification');
      setCameraError(null);
      setIsVideoReady(false);
      
      // Cambiar al paso de captura inmediatamente
      setCurrentStep('capture');
      
      logger.verification.debug('Changed to capture step, ReliableCamera will render now');
      
    } catch (error) {
      logger.verification.error('Error in startCamera', { error });
      
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
        logger.verification.error('Camera error details', { 
          name: error.name, 
          message: error.message,
          stack: error.stack
        });
        
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Acceso a la cámara denegado. Haz clic en el candado 🔒 junto a la URL y permite el acceso.';
            break;
          case 'NotFoundError':
            errorMessage = 'No se encontró cámara. Conecta una webcam e intenta de nuevo.';
            break;
          case 'NotReadableError':
            errorMessage = 'Cámara en uso por otra aplicación. Cierra otras apps e intenta de nuevo.';
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
      } else {
        logger.verification.error('Unknown camera error', { error: typeof error, value: error });
        errorMessage = 'Error desconocido en la cámara';
      }
      
      setCameraError(errorMessage);
    }
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const blob = await cameraRef.current.capturePhoto();
      if (!blob) return;

      // Crear URL para preview
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // Detener cámara completamente
      logger.verification.success('Photo captured, stopping camera');
      if (cameraRef.current) {
        cameraRef.current.stopCamera();
      }
      
      // Limpiar stream adicional si existe
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }

      // Iniciar verificación
      setCurrentStep('processing');
      
      try {
        const attempt = await verificationService.startVerification(
          currentUserId,
          blob,
          profilePhotos
        );
        
        setCurrentAttempt(attempt);
        
        // Monitorear progreso
        monitorVerificationProgress(attempt.id);
        
      } catch (error) {
        logger.verification.error('Error starting verification', { error });
        setCurrentStep('result');
      }
    } catch (error) {
      logger.verification.error('Error capturing photo', { error });
      setCameraError('Error capturando la foto');
    }
  };

  const monitorVerificationProgress = async (attemptId: string) => {
    const checkProgress = async () => {
      try {
        const attempt = await verificationService.getVerificationAttempt(attemptId);
        
        if (attempt) {
          setCurrentAttempt(attempt);
          
          if (attempt.status === 'approved' || attempt.status === 'rejected') {
            setCurrentStep('result');
            
            if (onVerificationComplete) {
              onVerificationComplete(attempt.status === 'approved');
            }
            
            return;
          }
        }
        
        // Continuar monitoreando si aún está procesando
        setTimeout(checkProgress, 1000);
        
      } catch (error) {
        logger.verification.error('Error monitoring verification progress', { error, attemptId });
        setCurrentStep('result');
      }
    };

    checkProgress();
  };

  const resetVerification = () => {
    logger.verification.debug('Cleaning up verification');
    
    // Detener cámara usando el método del ReliableCamera
    if (cameraRef.current) {
      cameraRef.current.stopCamera();
    }
    
    // Limpiar stream adicional si existe
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    // Resetear estados
    setCurrentStep('intro');
    setCapturedImage(null);
    setCurrentAttempt(null);
    setIsVideoReady(false);
    setCameraError(null);
    
    logger.verification.debug('Verification cleaned up successfully');
  };

  const handleClose = () => {
    resetVerification();
    onClose();
  };

  if (!isOpen) return null;

  // Si ya está verificado
  if (userVerification?.isVerified) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500" size={40} />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('alreadyVerified')}
          </h2>
          
          <p className="text-gray-600 mb-4">
            Tu identidad fue verificada el {userVerification.verifiedAt?.toLocaleDateString()}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="text-blue-500" size={20} />
            <span className="font-semibold text-blue-600">
              {t('verified')}
            </span>
          </div>
          
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <Shield className="text-blue-500" size={20} />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('identityVerification')}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="text-center">
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="text-blue-500" size={32} />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t('verifyIdentity')}
              </h3>
              
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                {t('takeASelfie')}
              </p>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 text-left">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-xs sm:text-sm text-gray-700">{t('increasesVisibility')}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-left">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-xs sm:text-sm text-gray-700">{t('verificationBadge')}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-left">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-xs sm:text-sm text-gray-700">{t('greaterTrust')}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-left">
                  <CheckCircle className="text-green-500" size={18} />
                  <span className="text-xs sm:text-sm text-gray-700">{t('quickAndSecure')}</span>
                </div>
              </div>
              
              {!canAttempt ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
                  <p className="text-red-700 text-sm">{attemptInfo}</p>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentStep('camera')}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  {t('startVerification')}
                </button>
              )}
            </div>
          )}

          {/* Camera Step */}
          {currentStep === 'camera' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="text-blue-500" size={40} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('cameraAccess')}
              </h3>
              
              <p className="text-gray-600 mb-6">
                Necesitamos acceso a tu cámara para tomar una selfie. 
                Por favor, permite el acceso cuando te lo solicite el navegador.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">{t('goodSelfieTitle')}</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• {t('goodLighting')}</li>
                  <li>• {t('lookDirectly')}</li>
                  <li>• {t('neutralExpression')}</li>
                  <li>• {t('noSunglasses')}</li>
                </ul>
              </div>
              
              {/* BOTÓN HORIZONTAL MEJORADO - RESPONSIVE */}
              <div className="w-full">
                <button
                  onClick={startCamera}
                  className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 min-h-[48px] sm:min-h-[56px]"
                >
                  <Camera size={20} />
                  <span>{t('activateCamera')}</span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </button>
              </div>
              
              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
                  <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
                  <p className="text-red-700 text-sm mb-3">{cameraError}</p>
                  <p className="text-red-600 text-xs">
                    💡 Solución: Haz clic en el candado 🔒 junto a la URL, permite acceso a la cámara y recarga la página.
                  </p>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      startCamera();
                    }}
                    className="mt-3 w-full py-2 px-4 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Capture Step */}
          {currentStep === 'capture' && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('takeASelfie')}
              </h3>
              
              {/* Error de cámara */}
              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
                  <p className="text-red-700 text-sm">{cameraError}</p>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      setCurrentStep('camera');
                    }}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                  >
                    {t('tryAgain')}
                  </button>
                </div>
              )}
              
              <div className="relative mb-4 sm:mb-6">
                {/* Componente de cámara confiable - SE INICIA AUTOMÁTICAMENTE */}
                <ReliableCamera
                  ref={cameraRef}
                  onStreamReady={(stream) => {
                    setCameraStream(stream);
                    logger.verification.debug('Stream ready from ReliableCamera');
                  }}
                  onVideoReady={() => {
                    setIsVideoReady(true);
                    logger.verification.debug('Video ready from ReliableCamera');
                  }}
                  onError={(error) => {
                    setCameraError(error);
                    logger.verification.error('Error from ReliableCamera', { error });
                  }}
                  className="w-full h-48 sm:h-64 object-cover rounded-xl bg-gray-900"
                  autoStart={true}
                />
                
                {/* Loading overlay simplificado */}
                {!isVideoReady && !cameraError && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-90 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-8 sm:h-12 w-8 sm:w-12 border-b-2 border-white mx-auto mb-2 sm:mb-3"></div>
                      <p className="text-base sm:text-lg font-semibold">Iniciando cámara...</p>
                      <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-75">Configurando video...</p>
                    </div>
                  </div>
                )}
                
                {/* Guía visual simple */}
                {isVideoReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 sm:w-40 h-40 sm:h-52 border-4 border-white rounded-full opacity-60 shadow-2xl"></div>
                  </div>
                )}
                
                {/* Indicador de estado mejorado */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                  <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg ${
                    isVideoReady ? 'bg-green-500 text-white' : 
                    cameraError ? 'bg-red-500 text-white' : 
                    'bg-yellow-500 text-black'
                  }`}>
                    <div className={`w-2 sm:w-3 h-2 sm:h-3 rounded-full ${
                      isVideoReady ? 'bg-white animate-pulse' : 
                      cameraError ? 'bg-white' : 
                      'bg-white animate-bounce'
                    }`}></div>
                    {isVideoReady ? '✅ LISTO' : 
                     cameraError ? '❌ ERROR' : 
                     '⏳ CARGANDO'}
                  </div>
                </div>
                
                {/* Información técnica para debug */}
                {cameraStream && (
                  <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Stream: {cameraStream.active ? 'Activo' : 'Inactivo'}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">
                {isVideoReady 
                  ? t('positionYourFace')
                  : cameraError
                  ? t('cameraProblems')
                  : t('waitingCamera')
                }
              </p>
              
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    logger.verification.debug('Canceling capture, stopping camera');
                    
                    // Detener cámara usando ReliableCamera
                    if (cameraRef.current) {
                      cameraRef.current.stopCamera();
                    }
                    
                    // Limpiar stream adicional si existe
                    if (cameraStream) {
                      cameraStream.getTracks().forEach(track => track.stop());
                      setCameraStream(null);
                    }
                    
                    setIsVideoReady(false);
                    setCameraError(null);
                    setCurrentStep('camera');
                  }}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors min-h-[44px] text-sm sm:text-base"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!isVideoReady || !!cameraError}
                  className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px] text-sm sm:text-base"
                >
                  {isVideoReady ? t('capture') : t('loading')}
                </button>
              </div>
            </div>
          )}

          {/* Processing Step */}
          {currentStep === 'processing' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="text-blue-500 animate-spin" size={40} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('processingVerification')}
              </h3>
              
              {capturedImage && (
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Selfie capturada"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <p className="text-gray-600 mb-6">
                {t('analyzingPhoto')}
              </p>
              
              {/* Progress Steps */}
              {currentAttempt && (
                <div className="space-y-3 mb-6">
                  {currentAttempt.verificationSteps.map((step, index) => (
                    <div key={step.step} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        step.status === 'passed' ? 'bg-green-500' :
                        step.status === 'failed' ? 'bg-red-500' :
                        step.status === 'pending' ? 'bg-gray-300' : 'bg-blue-500'
                      }`}>
                        {step.status === 'passed' && <CheckCircle className="text-white" size={16} />}
                        {step.status === 'failed' && <X className="text-white" size={16} />}
                        {step.status === 'pending' && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                      </div>
                      <span className="text-sm text-gray-700">
                        {step.step === 'face_detection' && t('detectingFace')}
                        {step.step === 'quality_check' && t('verifyingQuality')}
                        {step.step === 'liveness_check' && t('verifyingAuthenticity')}
                        {step.step === 'face_comparison' && t('comparingWithProfile')}
                      </span>
                      {step.confidence > 0 && (
                        <span className="text-xs text-gray-500 ml-auto">
                          {step.confidence}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Result Step */}
          {currentStep === 'result' && currentAttempt && (
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                currentAttempt.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {currentAttempt.status === 'approved' ? (
                  <CheckCircle className="text-green-500" size={40} />
                ) : (
                  <AlertCircle className="text-red-500" size={40} />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {currentAttempt.status === 'approved' ? t('verificationSuccessful') : t('verificationFailed')}
              </h3>
              
              {currentAttempt.status === 'approved' ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    {t('congratulations')} {t('identityVerified')}. 
                    {t('verificationBadgeEarned')}.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="text-green-600" size={20} />
                      <span className="font-semibold text-green-800">{t('verified')}</span>
                    </div>
                    <p className="text-sm text-green-700">
                      {t('confidence')}: {currentAttempt.confidence}%
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    {currentAttempt.rejectionReason || t('canTryAgain')}
                  </p>
                  
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-red-700">
                      {t('followRecommendations')}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                {currentAttempt.status === 'rejected' && canAttempt && (
                  <button
                    onClick={resetVerification}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    {t('tryAgain')}
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  {t('close')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;