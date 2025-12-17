// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, parseFirebaseError } from "../../utils/firebase";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Heart, ArrowRight } from "lucide-react";
import SimpleButton from "../../components/comunes/SimpleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Correo no válido.");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/perfil");
    } catch (firebaseErr) {
      const friendly =
        typeof parseFirebaseError === "function"
          ? parseFirebaseError(firebaseErr)
          : firebaseErr.message || "Error al iniciar sesión.";
      setError(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ rotate: -360, scale: [1.2, 1, 1.2] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo y título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow"
          >
            <Heart className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ¡Bienvenido de vuelta!
          </h1>
          <p className="text-gray-200">
            Inicia sesión para continuar tu búsqueda del amor
          </p>
        </div>

        {/* Formulario */}
        <div className="card-glass">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo de email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-12 w-full"
                  required
                />
              </div>
            </div>

            {/* Campo de contraseña */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pl-12 pr-12 w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Enlace de recuperación */}
            <div className="text-right">
              <Link 
                to="/recuperar" 
                className="text-sm text-purple-300 hover:text-white transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de login */}
            <SimpleButton
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight size={20} />
                </>
              )}
            </SimpleButton>
          </form>

          {/* Enlace a registro */}
          <div className="mt-8 text-center">
            <p className="text-gray-200 mb-4">¿No tienes una cuenta?</p>
            <Link to="/register">
              <SimpleButton variant="outline" className="w-full">
                Crear cuenta nueva
              </SimpleButton>
            </Link>
          </div>
        </div>

        {/* Características */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="flex justify-center items-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Verificado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Privado</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
