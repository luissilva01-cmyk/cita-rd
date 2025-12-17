// src/components/VerificacionModal.jsx
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CheckCircle, XCircle, Loader } from "lucide-react";
import { iniciarVerificacion, verificacionAutomatica } from "../services/verificacionService";
import { subirImagenCloudinary } from "../services/uploadService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function VerificacionModal({ isOpen, onClose, fotoPerfil }) {
  const { user } = useAuth();
  const [paso, setPaso] = useState(1); // 1: instrucciones, 2: camara, 3: procesando, 4: resultado
  const [fotoSelfie, setFotoSelfie] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: "user" 
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setPaso(2);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      toast.error("No se pudo acceder a la cámara");
    }
  };

  const tomarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'selfie-verificacion.jpg', { type: 'image/jpeg' });
        setFotoSelfie(file);
        
        // Detener la cámara
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        procesarVerificacion(file);
      }, 'image/jpeg', 0.8);
    }
  };

  const procesarVerificacion = async (archivoSelfie) => {
    setPaso(3);
    setProcesando(true);

    try {
      // Subir selfie a Cloudinary
      const resultadoSubida = await subirImagenCloudinary(archivoSelfie, "citard/verificaciones");
      
      if (!resultadoSubida.ok) {
        throw new Error("Error al subir la foto");
      }

      // Iniciar verificación en Firestore
      await iniciarVerificacion(user.uid, resultadoSubida.url);

      // Simular verificación automática
      const resultadoVerificacion = await verificacionAutomatica(
        user.uid, 
        resultadoSubida.url, 
        fotoPerfil
      );

      setResultado(resultadoVerificacion);
      setPaso(4);
      
      if (resultadoVerificacion.verificado) {
        toast.success("¡Perfil verificado exitosamente!");
      } else {
        toast.error("Verificación fallida. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error en verificación:", error);
      toast.error("Error durante la verificación");
      setResultado({ ok: false, verificado: false });
      setPaso(4);
    } finally {
      setProcesando(false);
    }
  };

  const reintentar = () => {
    setPaso(1);
    setFotoSelfie(null);
    setResultado(null);
  };

  const cerrar = () => {
    // Detener cámara si está activa
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setPaso(1);
    setFotoSelfie(null);
    setResultado(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cerrar}
            className="fixed inset-0 bg-black/60 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              
              {/* Paso 1: Instrucciones */}
              {paso === 1 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-blue-500" size={32} />
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">Verificar Perfil</h2>
                  
                  <div className="text-left space-y-3 mb-6">
                    <p className="text-gray-600">Para verificar tu perfil:</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Toma una selfie mirando a la cámara
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Asegúrate de tener buena iluminación
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        Tu rostro debe ser claramente visible
                      </li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={cerrar}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={iniciarCamera}
                      className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Cámara */}
              {paso === 2 && (
                <div className="text-center">
                  <h2 className="text-xl font-bold mb-4">Toma tu selfie</h2>
                  
                  <div className="relative mb-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg"
                    />
                    <div className="absolute inset-0 border-4 border-dashed border-white/50 rounded-lg pointer-events-none"></div>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />

                  <div className="flex gap-3">
                    <button
                      onClick={cerrar}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={tomarFoto}
                      className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition flex items-center justify-center gap-2"
                    >
                      <Camera size={20} />
                      Tomar Foto
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 3: Procesando */}
              {paso === 3 && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader className="text-orange-500 animate-spin" size={32} />
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">Verificando...</h2>
                  <p className="text-gray-600 mb-6">
                    Estamos comparando tu selfie con tu foto de perfil
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full animate-pulse" style={{width: "60%"}}></div>
                  </div>
                </div>
              )}

              {/* Paso 4: Resultado */}
              {paso === 4 && resultado && (
                <div className="text-center">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    resultado.verificado ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {resultado.verificado ? (
                      <CheckCircle className="text-green-500" size={32} />
                    ) : (
                      <XCircle className="text-red-500" size={32} />
                    )}
                  </div>
                  
                  <h2 className="text-xl font-bold mb-2">
                    {resultado.verificado ? "¡Verificado!" : "Verificación Fallida"}
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    {resultado.verificado 
                      ? "Tu perfil ha sido verificado exitosamente. Ahora tendrás una insignia de verificación."
                      : "No pudimos verificar tu identidad. Asegúrate de que tu rostro sea claramente visible y coincida con tu foto de perfil."
                    }
                  </p>

                  <div className="flex gap-3">
                    {!resultado.verificado && (
                      <button
                        onClick={reintentar}
                        className="flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition"
                      >
                        Reintentar
                      </button>
                    )}
                    <button
                      onClick={cerrar}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition"
                    >
                      {resultado.verificado ? "Continuar" : "Cerrar"}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}