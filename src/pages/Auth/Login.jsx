// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, parseFirebaseError } from "../../utils/firebase";
import { Eye, EyeOff } from "lucide-react";

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
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-200 via-pink-100 to-yellow-200 p-5">

      {/* Contenedor aislado */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 animate-[fadeIn_0.4s_ease]">

        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Bienvenido 👋
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Correo */}
          <div>
            <label className="text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              placeholder="tucorreo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-2 text-gray-500 hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Recuperar contraseña */}
          <div className="text-right -mt-2">
            <Link className="text-sm text-orange-600 hover:underline" to="/recuperar">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón de Login */}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-orange-600 transition-all active:scale-[0.97] flex justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>

        {/* Enlace a registro */}
        <p className="text-center text-gray-700 mt-6">
          ¿No tienes cuenta?
          <Link to="/register" className="text-orange-600 font-semibold ml-1 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
