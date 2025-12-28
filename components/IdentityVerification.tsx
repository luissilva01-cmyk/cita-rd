// cita-rd/components/IdentityVerification.tsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Shield, CheckCircle, AlertCircle, Clock, Star } from 'lucide-react';
import { verificationService, VerificationAttempt, UserVerification } from '../services/verificationService';
import { useTranslation } from '../hooks/useTranslation';
import SimpleCamera, { SimpleCameraRef } from './SimpleCamera';

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
  const cameraRef = useRef<SimpleCameraRef>(null);

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
      console.error('Error cargando información de verificación:', error);
    }
  };

  const startCamera = async () => {
    try {
      console.log('🎥 Iniciando cámara - método simple...');
      setCameraError(null);
      setIsVideoReady(false);
      
      // Limpiar stream anterior si existe
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }

      // Método simple como test-camera.html
      console.log('📋 Solicitando acceso a cámara...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      console.log('✅ Stream obtenido:', stream.active);
      console.log('📹 Tracks:', stream.getTracks().length);
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('📊 Video metadata cargada');
          console.log('📐 Dimensiones:', videoRef.current?.videoWidth + 'x' + videoRef.current?.videoHeight);
        };
        
        videoRef.current.oncanplay = () => {
          console.log('▶️ Video listo para reproducir');
          setIsVideoReady(true);
        };
        
        videoRef.current.onerror = (error) => {
          console.log('❌ Error en video:', error);
          setCameraError('Error en elemento de video');
        };
        
        // FORZAR REPRODUCCIÓN INMEDIATA - Como en test-camera.html
        setTimeout(() => {
          if (videoRef.current && stream.active) {
            console.log('🎬 Forzando reproducción...');
            videoRef.current.play().then(() => {
              console.log('✅ Video reproduciendo exitosamente');
              setIsVideoReady(true);
            }).catch(error => {
              console.error('❌ Error reproduciendo:', error);
              // Si falla el play(), aún así marcar como listo
              setIsVideoReady(true);
            });
          }
        }, 200);
        
        // BACKUP: Forzar isVideoReady después de 1 segundo si no se disparan los eventos
        setTimeout(() => {
          if (stream.active && !isVideoReady) {
            console.log('⏰ Timeout - Forzando video ready');
            setIsVideoReady(true);
          }
        }, 1000);
      }
      
      setCurrentStep('capture');
      
    } catch (error) {
      console.error('❌ Error:', error);
      
      let errorMessage = 'Error desconocido';
      
      if (error instanceof Error) {
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
      console.log('📸 Foto capturada, deteniendo cámara...');
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
        console.error('Error iniciando verificación:', error);
        setCurrentStep('result');
      }
    } catch (error) {
      console.error('Error capturando foto:', error);
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
        console.error('Error monitoreando progreso:', error);
        setCurrentStep('result');
      }
    };

    checkProgress();
  };

  const resetVerification = () => {
    console.log('🧹 Limpiando verificación...');
    
    // Detener cámara usando el método del SimpleCamera
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
    
    console.log('✅ Verificación limpiada completamente');
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
            ¡Ya estás verificado!
          </h2>
          
          <p className="text-gray-600 mb-4">
            Tu identidad fue verificada el {userVerification.verifiedAt?.toLocaleDateString()}
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="text-blue-500" size={20} />
            <span className="font-semibold text-blue-600">
              {userVerification.verificationLevel === 'premium' ? 'Verificación Premium' : 'Verificado'}
            </span>
            {userVerification.verificationLevel === 'premium' && (
              <Star className="text-yellow-500" size={16} />
            )}
          </div>
          
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Verificación de Identidad</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Intro Step */}
          {currentStep === 'intro' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="text-blue-500" size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Verifica tu identidad
              </h3>
              
              <p className="text-gray-600 mb-6">
                Toma una selfie para confirmar que eres una persona real. 
                Esto aumentará tu confiabilidad y visibilidad en la app.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm text-gray-700">Aumenta tu visibilidad en un 300%</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm text-gray-700">Badge de verificación visible</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm text-gray-700">Mayor confianza de otros usuarios</span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm text-gray-700">Proceso rápido y seguro</span>
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
                  Comenzar verificación
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
                Acceso a la cámara
              </h3>
              
              <p className="text-gray-600 mb-6">
                Necesitamos acceso a tu cámara para tomar una selfie. 
                Por favor, permite el acceso cuando te lo solicite el navegador.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Consejos para una buena selfie:</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Asegúrate de tener buena iluminación</li>
                  <li>• Mira directamente a la cámara</li>
                  <li>• Mantén una expresión neutral</li>
                  <li>• No uses lentes oscuros o sombreros</li>
                </ul>
              </div>
              
              <button
                onClick={startCamera}
                className="w-full py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors mb-3"
              >
                Activar cámara
              </button>
              
              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                  <AlertCircle className="text-red-500 mx-auto mb-2" size={24} />
                  <p className="text-red-700 text-sm mb-3">{cameraError}</p>
                  <p className="text-red-600 text-xs">
                    💡 Solución: Haz clic en el candado 🔒 junto a la URL, permite acceso a la cámara y recarga la página.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Capture Step */}
          {currentStep === 'capture' && (
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Toma tu selfie
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
                    Intentar de nuevo
                  </button>
                </div>
              )}
              
              <div className="relative mb-6">
                {/* Componente de cámara simple */}
                <SimpleCamera
                  ref={cameraRef}
                  onStreamReady={(stream) => {
                    setCameraStream(stream);
                    console.log('🎯 Stream listo desde SimpleCamera');
                  }}
                  onVideoReady={() => {
                    setIsVideoReady(true);
                    console.log('🎯 Video listo desde SimpleCamera');
                  }}
                  onError={(error) => {
                    setCameraError(error);
                    console.error('🎯 Error desde SimpleCamera:', error);
                  }}
                />
                
                {/* Loading overlay simplificado */}
                {!isVideoReady && !cameraError && (
                  <div className="absolute inset-0 bg-gray-900 bg-opacity-90 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-3"></div>
                      <p className="text-lg font-semibold">Iniciando cámara...</p>
                      <p className="text-sm mt-2 opacity-75">Configurando video...</p>
                    </div>
                  </div>
                )}
                
                {/* Guía visual simple */}
                {isVideoReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-40 h-52 border-4 border-white rounded-full opacity-60 shadow-2xl"></div>
                  </div>
                )}
                
                {/* Indicador de estado mejorado */}
                <div className="absolute top-3 left-3">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold shadow-lg ${
                    isVideoReady ? 'bg-green-500 text-white' : 
                    cameraError ? 'bg-red-500 text-white' : 
                    'bg-yellow-500 text-black'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
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
                  <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    Stream: {cameraStream.active ? 'Activo' : 'Inactivo'}
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-6">
                {isVideoReady 
                  ? 'Posiciona tu rostro dentro del círculo y presiona capturar'
                  : cameraError
                  ? 'Hay un problema con la cámara. Revisa los permisos e intenta de nuevo.'
                  : 'Esperando acceso a la cámara...'
                }
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('❌ Cancelando captura, deteniendo cámara...');
                    
                    // Detener cámara usando SimpleCamera
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
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!isVideoReady || !!cameraError}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isVideoReady ? 'Capturar' : 'Esperando...'}
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
                Procesando verificación
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
                Estamos analizando tu foto y comparándola con tu perfil. 
                Esto puede tomar unos segundos...
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
                        {step.step === 'face_detection' && 'Detectando rostro'}
                        {step.step === 'quality_check' && 'Verificando calidad'}
                        {step.step === 'liveness_check' && 'Verificando autenticidad'}
                        {step.step === 'face_comparison' && 'Comparando con perfil'}
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
                {currentAttempt.status === 'approved' ? '¡Verificación exitosa!' : 'Verificación fallida'}
              </h3>
              
              {currentAttempt.status === 'approved' ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    ¡Felicidades! Tu identidad ha sido verificada exitosamente. 
                    Ahora tienes un badge de verificación y mayor visibilidad.
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="text-green-600" size={20} />
                      <span className="font-semibold text-green-800">Verificado</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Confianza: {currentAttempt.confidence}%
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    {currentAttempt.rejectionReason || 'No se pudo verificar tu identidad en este momento.'}
                  </p>
                  
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-red-700">
                      Puedes intentar nuevamente. Asegúrate de seguir las recomendaciones 
                      para obtener una mejor foto.
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
                    Intentar de nuevo
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                >
                  Cerrar
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