import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { Heart, Mail, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginProps {
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // El onAuthStateChanged en App.tsx manejará la navegación
    } catch (err: any) {
      let friendlyMessage = 'Error al procesar tu solicitud';
      
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
          friendlyMessage = 'Correo o contraseña incorrectos';
          break;
        case 'auth/user-not-found':
          friendlyMessage = 'No existe una cuenta con este correo';
          break;
        case 'auth/email-already-in-use':
          friendlyMessage = 'Este correo ya está registrado';
          break;
        case 'auth/weak-password':
          friendlyMessage = 'La contraseña debe tener al menos 6 caracteres';
          break;
        case 'auth/invalid-email':
          friendlyMessage = 'El formato del correo no es válido';
          break;
        case 'auth/too-many-requests':
          friendlyMessage = 'Demasiados intentos. Intenta más tarde';
          break;
        default:
          friendlyMessage = err.message || 'Error al procesar tu solicitud';
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 ml-4">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}
            >
              <Heart className="w-8 h-8 text-white" fill="currentColor" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Ta' Pa' Ti</h1>
            <p className="text-gray-600 text-center">
              {isLogin ? '¡Bienvenido de nuevo!' : 'Encuentra tu match perfecto'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                  placeholder="ejemplo@email.com"
                  required
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (only for register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-white rounded-full font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)', boxShadow: '0 10px 25px rgba(255, 128, 82, 0.25)'}}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
              {' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="font-bold hover:opacity-80 transition-colors"
                style={{color: '#ec4913'}}
                type="button"
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
