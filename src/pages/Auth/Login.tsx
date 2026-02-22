// cita-rd/src/pages/Auth/Login.tsx - DISEÑO MODERNO UNIFICADO CON FORGOT PASSWORD INTEGRADO
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../services/firebase";
import { checkStorageAvailability, showStorageWarning } from "../../utils/storageHelper";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Heart, Mail, AlertTriangle, CheckCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [storageBlocked, setStorageBlocked] = useState(false);
  
  // Estados para forgot password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);

  useEffect(() => {
    // Verificar si el storage está disponible al cargar el componente
    const isStorageAvailable = checkStorageAvailability();
    if (!isStorageAvailable) {
      setStorageBlocked(true);
      setError("Tu navegador está bloqueando el almacenamiento necesario para Firebase. Por favor, ajusta la configuración de privacidad.");
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar storage antes de proceder
    if (!checkStorageAvailability()) {
      setStorageBlocked(true);
      setError("Tu navegador está bloqueando el almacenamiento necesario. Por favor, ajusta la configuración de privacidad o usa modo incógnito.");
      showStorageWarning();
      return;
    }
    
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    setError("");
    setStorageBlocked(false);
    
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/");
    } catch (firebaseErr: any) {
      let friendlyMessage = "Error al iniciar sesión.";
      
      // Detectar errores específicos de storage/tracking prevention
      if (firebaseErr.code === 'auth/web-storage-unsupported' || 
          firebaseErr.message?.includes('storage') ||
          firebaseErr.message?.includes('tracking')) {
        setStorageBlocked(true);
        friendlyMessage = "Tu navegador está bloqueando el almacenamiento necesario para Firebase. Ajusta la configuración de privacidad.";
        showStorageWarning();
      } else {
        switch (firebaseErr.code) {
          case 'auth/invalid-credential':
            friendlyMessage = "Correo o contraseña incorrectos. Por favor verifica tus datos.";
            break;
          case 'auth/user-not-found':
            friendlyMessage = "No existe una cuenta con este correo.";
            break;
          case 'auth/wrong-password':
            friendlyMessage = "Contraseña incorrecta.";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "El formato del correo no es válido.";
            break;
          case 'auth/too-many-requests':
            friendlyMessage = "Demasiados intentos. Intenta más tarde.";
            break;
          case 'auth/user-disabled':
            friendlyMessage = "Esta cuenta ha sido deshabilitada. Contacta a soporte.";
            break;
          case 'auth/network-request-failed':
            friendlyMessage = "Error de conexión. Verifica tu internet e intenta de nuevo.";
            break;
          default:
            friendlyMessage = "Error al iniciar sesión. Por favor verifica tus datos e intenta de nuevo.";
        }
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      setForgotError("Por favor ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) {
      setForgotError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setForgotLoading(true);
    setForgotError("");
    
    try {
      // Verificar storage antes de proceder con Firebase
      if (!checkStorageAvailability()) {
        // Si hay tracking prevention, mostrar instrucciones pero continuar
        console.log('⚠️ Tracking prevention detectado, pero continuando...');
      }
      
      // Importar Firebase Auth dinámicamente para evitar problemas de carga
      const { sendPasswordResetEmail } = await import("firebase/auth");
      
      console.log('📧 Enviando email de recuperación real a:', forgotEmail);
      
      // Enviar email de recuperación real con Firebase
      await sendPasswordResetEmail(auth, forgotEmail, {
        // Configuración adicional para evitar problemas
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      
      // Configurar idioma español para Firebase Auth
      auth.languageCode = 'es';
      
      console.log('✅ Email de recuperación enviado exitosamente');
      setForgotSuccess(true);
      
    } catch (firebaseErr: any) {
      console.error('❌ Error de Firebase:', firebaseErr);
      
      let friendlyMessage = "Error al enviar el correo de recuperación.";
      
      // Manejar errores específicos de Firebase
      if (firebaseErr.code === 'auth/web-storage-unsupported' || 
          firebaseErr.message?.includes('storage') ||
          firebaseErr.message?.includes('tracking')) {
        friendlyMessage = "Tu navegador está bloqueando algunas funciones. El email podría no enviarse correctamente. Intenta en modo incógnito.";
      } else {
        switch (firebaseErr.code) {
          case 'auth/user-not-found':
            friendlyMessage = "No existe una cuenta con este correo electrónico.";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "El formato del correo no es válido.";
            break;
          case 'auth/too-many-requests':
            friendlyMessage = "Demasiados intentos. Intenta más tarde.";
            break;
          case 'auth/network-request-failed':
            friendlyMessage = "Error de conexión. Verifica tu internet e intenta de nuevo.";
            break;
          default:
            friendlyMessage = firebaseErr.message || "Error al enviar el correo de recuperación.";
        }
      }
      
      setForgotError(friendlyMessage);
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotEmail("");
    setForgotError("");
    setForgotSuccess(false);
    setForgotLoading(false);
  };

  return (
    <>
      <style>
        {`
          body {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
          }
          
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      
      <div 
        className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl"
        style={{ 
          backgroundColor: '#f8f6f6',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#1b110d',
          minHeight: 'max(884px, 100dvh)'
        }}
      >
        {/* Top Bar */}
        <div 
          className="flex items-center p-4 justify-between sticky top-0 z-10 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(248, 246, 246, 0.95)' }}
        >
          <button 
            onClick={() => showForgotPassword ? resetForgotPassword() : navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            style={{ color: '#1b110d' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 
            className="text-lg font-bold leading-tight tracking-[-0.015em] text-center absolute left-1/2 -translate-x-1/2"
            style={{ color: '#1b110d' }}
          >
            {showForgotPassword ? 'Recuperar Contraseña' : "Ta' Pa' Ti"}
          </h2>
          <div className="size-10"></div>
        </div>

        {/* Main Content Scrollable Area */}
        <div className="flex-1 flex flex-col px-6 pt-4 pb-8">
          
          {!showForgotPassword ? (
            <>
              {/* Login Form */}
              {/* Hero Section */}
              <div className="flex flex-col items-center justify-center pt-6 pb-8">
                <div 
                  className="size-20 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', color: '#FF6B6B' }}
                >
                  <Heart size={40} />
                </div>
                <h1 
                  className="tracking-tight text-[32px] font-extrabold leading-tight text-center mb-2"
                  style={{ color: '#1b110d' }}
                >
                  ¡Hola de nuevo! 💕
                </h1>
                <p 
                  className="text-base font-medium leading-normal text-center max-w-[280px]"
                  style={{ color: '#9a5f4c' }}
                >
                  Encuentra quien ta' pa' ti hoy mismo.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`mb-6 p-4 border rounded-xl text-center ${
                    storageBlocked 
                      ? 'bg-orange-50 border-orange-200 text-orange-800' 
                      : 'bg-red-50 border-red-200 text-red-700'
                  }`}
                >
                  {storageBlocked && (
                    <div className="flex items-center justify-center mb-2">
                      <AlertTriangle size={20} className="mr-2" />
                      <strong>Problema de Privacidad del Navegador</strong>
                    </div>
                  )}
                  <div className="text-sm">{error}</div>
                  {storageBlocked && (
                    <div className="mt-3 text-xs text-left">
                      <strong>Soluciones:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><strong>Safari:</strong> Preferencias → Privacidad → Desactiva "Prevenir seguimiento entre sitios"</li>
                        <li><strong>Firefox:</strong> Configuración → Privacidad → Cambia a "Estándar"</li>
                        <li><strong>Chrome:</strong> Desactiva extensiones de privacidad temporalmente</li>
                        <li><strong>Alternativa:</strong> Usa modo incógnito/privado</li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Login Form */}
              <form className="flex flex-col gap-5 w-full" onSubmit={handleLogin}>
                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label 
                    htmlFor="login-email"
                    className="text-sm font-semibold leading-normal ml-1"
                    style={{ color: '#1b110d' }}
                  >
                    Correo Electrónico
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="login-email"
                      name="email"
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 border h-14 p-[15px] text-base font-normal leading-normal shadow-sm transition-all focus:ring-orange-200 focus:border-orange-500"
                      style={{
                        color: '#1b110d',
                        backgroundColor: '#ffffff',
                        borderColor: '#e7d5cf'
                      }}
                      placeholder="ejemplo@email.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                    <div 
                      className="absolute right-4 pointer-events-none"
                      style={{ color: '#9a5f4c' }}
                    >
                      <Mail size={20} />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2">
                  <label 
                    htmlFor="login-password"
                    className="text-sm font-semibold leading-normal ml-1"
                    style={{ color: '#1b110d' }}
                  >
                    Contraseña
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="login-password"
                      name="password"
                      className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 border h-14 p-[15px] pr-12 text-base font-normal leading-normal shadow-sm transition-all focus:ring-orange-200 focus:border-orange-500"
                      style={{
                        color: '#1b110d',
                        backgroundColor: '#ffffff',
                        borderColor: '#e7d5cf'
                      }}
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                    <button
                      className="absolute right-0 top-0 h-full w-12 flex items-center justify-center transition-colors focus:outline-none rounded-r-xl"
                      style={{ color: '#9a5f4c' }}
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('🔐 Mostrando forgot password integrado');
                        setShowForgotPassword(true);
                      }}
                      className="text-sm font-semibold transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
                      style={{ color: '#ec4913' }}
                      type="button"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  className="mt-4 flex w-full items-center justify-center overflow-hidden rounded-full h-14 px-4 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg"
                  style={{ 
                    backgroundColor: '#ec4913',
                    boxShadow: '0 10px 25px rgba(236, 73, 19, 0.25)'
                  }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </button>
              </form>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Footer Sign Up */}
              <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                <p 
                  className="text-sm font-normal"
                  style={{ color: '#1b110d' }}
                >
                  ¿No tienes una cuenta?
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="text-sm font-bold transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
                  style={{ color: '#ec4913' }}
                  type="button"
                >
                  Regístrate aquí
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Form Integrado */}
              {!forgotSuccess ? (
                <>
                  {/* Hero Section */}
                  <div className="flex flex-col items-center justify-center pt-6 pb-8">
                    <div 
                      className="size-20 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: 'rgba(236, 73, 19, 0.1)', color: '#ec4913' }}
                    >
                      <Mail size={40} />
                    </div>
                    <h1 
                      className="tracking-tight text-[28px] font-extrabold leading-tight text-center mb-2"
                      style={{ color: '#1b110d' }}
                    >
                      ¿Olvidaste tu contraseña? 🔐
                    </h1>
                    <p 
                      className="text-base font-medium leading-normal text-center max-w-[300px]"
                      style={{ color: '#9a5f4c' }}
                    >
                      No te preocupes, te enviaremos un enlace para que puedas crear una nueva.
                    </p>
                  </div>

                  {/* Error message */}
                  {forgotError && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="mb-6 p-4 border rounded-xl text-center bg-red-50 border-red-200 text-red-700"
                    >
                      <div className="text-sm">{forgotError}</div>
                    </motion.div>
                  )}

                  {/* Reset Form */}
                  <form className="flex flex-col gap-6 w-full" onSubmit={handleForgotPassword}>
                    {/* Email Field */}
                    <div className="flex flex-col gap-2">
                      <label 
                        htmlFor="forgot-password-email"
                        className="text-sm font-semibold leading-normal ml-1"
                        style={{ color: '#1b110d' }}
                      >
                        Correo Electrónico
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="forgot-password-email"
                          name="email"
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 border h-14 p-[15px] text-base font-normal leading-normal shadow-sm transition-all focus:ring-orange-200 focus:border-orange-500"
                          style={{
                            color: '#1b110d',
                            backgroundColor: '#ffffff',
                            borderColor: '#e7d5cf'
                          }}
                          placeholder="ejemplo@email.com"
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                        <div 
                          className="absolute right-4 pointer-events-none"
                          style={{ color: '#9a5f4c' }}
                        >
                          <Mail size={20} />
                        </div>
                      </div>
                      <p 
                        className="text-xs mt-1 ml-1"
                        style={{ color: '#9a5f4c' }}
                      >
                        Ingresa el correo asociado a tu cuenta de Ta' Pa' Ti
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      className="mt-4 flex w-full items-center justify-center overflow-hidden rounded-full h-14 px-4 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg"
                      style={{ 
                        backgroundColor: '#ec4913',
                        boxShadow: '0 10px 25px rgba(236, 73, 19, 0.25)'
                      }}
                      type="submit"
                      disabled={forgotLoading}
                    >
                      {forgotLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Enviar Enlace de Recuperación"
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="flex flex-col items-center justify-center pt-6 pb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="size-20 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
                    >
                      <CheckCircle size={40} />
                    </motion.div>
                    
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="tracking-tight text-[28px] font-extrabold leading-tight text-center mb-4"
                      style={{ color: '#1b110d' }}
                    >
                      ¡Correo enviado! 📧
                    </motion.h1>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-base font-medium leading-normal text-center max-w-[320px] mb-8"
                      style={{ color: '#9a5f4c' }}
                    >
                      Hemos enviado un enlace de recuperación a <strong>{forgotEmail}</strong>. 
                      Revisa tu bandeja de entrada y sigue las instrucciones.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="w-full max-w-sm space-y-4"
                    >
                      <button
                        onClick={resetForgotPassword}
                        className="w-full flex items-center justify-center overflow-hidden rounded-full h-14 px-4 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg"
                        style={{ 
                          backgroundColor: '#ec4913',
                          boxShadow: '0 10px 25px rgba(236, 73, 19, 0.25)'
                        }}
                      >
                        Volver al Login
                      </button>
                      
                      <button
                        onClick={() => setForgotSuccess(false)}
                        className="w-full flex items-center justify-center overflow-hidden rounded-full h-14 px-4 text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 active:scale-[0.98] transition-all border"
                        style={{ 
                          color: '#ec4913',
                          borderColor: '#e7d5cf',
                          backgroundColor: '#ffffff'
                        }}
                      >
                        Enviar otro correo
                      </button>
                    </motion.div>
                  </div>
                </>
              )}

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Footer Back to Login */}
              <div className="flex items-center justify-center gap-2 mt-8 pb-4">
                <p 
                  className="text-sm font-normal"
                  style={{ color: '#1b110d' }}
                >
                  ¿Recordaste tu contraseña?
                </p>
                <button 
                  className="text-sm font-bold transition-colors hover:opacity-80 bg-transparent border-none cursor-pointer p-0"
                  style={{ color: '#ec4913' }}
                  onClick={resetForgotPassword}
                >
                  Iniciar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}