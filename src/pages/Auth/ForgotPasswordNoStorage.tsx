// cita-rd/src/pages/Auth/ForgotPasswordNoStorage.tsx - Sin localStorage ni tracking
import React, { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordNoStorage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  console.log('🔐 ForgotPasswordNoStorage renderizando...');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Por favor ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Simular envío de email (sin Firebase para evitar tracking prevention)
      console.log('📧 Simulando envío de email a:', email);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      console.log('✅ Email de recuperación "enviado" exitosamente');
    } catch (err: any) {
      setError("Error al enviar el correo de recuperación. Intenta más tarde.");
      console.error('❌ Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    // Usar window.location para evitar React Router
    window.location.href = '/login';
  };

  if (success) {
    return (
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
            onClick={goToLogin}
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            style={{ color: '#1b110d' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h2 
            className="text-lg font-bold leading-tight tracking-[-0.015em] text-center absolute left-1/2 -translate-x-1/2"
            style={{ color: '#1b110d' }}
          >
            Recuperar Contraseña
          </h2>
          <div className="size-10"></div>
        </div>

        {/* Success Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div
            className="size-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}
          >
            <CheckCircle size={40} />
          </div>
          
          <h1 
            className="tracking-tight text-[28px] font-extrabold leading-tight text-center mb-4"
            style={{ color: '#1b110d' }}
          >
            ¡Correo enviado! 📧
          </h1>
          
          <p 
            className="text-base font-medium leading-normal text-center max-w-[320px] mb-8"
            style={{ color: '#9a5f4c' }}
          >
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>. 
            Revisa tu bandeja de entrada y sigue las instrucciones.
          </p>

          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={goToLogin}
              className="w-full flex items-center justify-center overflow-hidden rounded-full h-14 px-4 text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 active:scale-[0.98] transition-all shadow-lg"
              style={{ 
                backgroundColor: '#ec4913',
                boxShadow: '0 10px 25px rgba(236, 73, 19, 0.25)'
              }}
            >
              Volver al Login
            </button>
            
            <button
              onClick={() => setSuccess(false)}
              className="w-full flex items-center justify-center overflow-hidden rounded-full h-14 px-4 text-base font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 active:scale-[0.98] transition-all border"
              style={{ 
                color: '#ec4913',
                borderColor: '#e7d5cf',
                backgroundColor: '#ffffff'
              }}
            >
              Enviar otro correo
            </button>
          </div>

          <p 
            className="text-sm text-center mt-6 max-w-[300px]"
            style={{ color: '#9a5f4c' }}
          >
            ¿No recibiste el correo? Revisa tu carpeta de spam o intenta con otro correo.
          </p>
        </div>
      </div>
    );
  }

  return (
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
          onClick={goToLogin}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          style={{ color: '#1b110d' }}
        >
          <ArrowLeft size={24} />
        </button>
        <h2 
          className="text-lg font-bold leading-tight tracking-[-0.015em] text-center absolute left-1/2 -translate-x-1/2"
          style={{ color: '#1b110d' }}
        >
          Recuperar Contraseña
        </h2>
        <div className="size-10"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-8">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center pb-8">
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
        {error && (
          <div className="mb-6 p-4 border rounded-xl text-center bg-red-50 border-red-200 text-red-700">
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Reset Form */}
        <form className="flex flex-col gap-6 w-full" onSubmit={handleResetPassword}>
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label 
              className="text-sm font-semibold leading-normal ml-1"
              style={{ color: '#1b110d' }}
            >
              Correo Electrónico
            </label>
            <div className="relative flex items-center">
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-2 border h-14 p-[15px] text-base font-normal leading-normal shadow-sm transition-all focus:ring-orange-200 focus:border-orange-500"
                style={{
                  color: '#1b110d',
                  backgroundColor: '#ffffff',
                  borderColor: '#e7d5cf'
                }}
                placeholder="ejemplo@email.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Enviar Enlace de Recuperación"
            )}
          </button>
        </form>

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
            onClick={goToLogin}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}