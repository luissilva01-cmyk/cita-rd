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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Iniciar Sesión
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Campo de correo */}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          {/* Campo de contraseña con botón 👁️ */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-purple-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-purple-600"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Enlace de recuperación justo debajo del campo */}
          <div className="text-right -mt-2">
            <Link
              to="/recuperar"
              className="text-sm text-purple-600 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center"
          >
            {loading && (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2" />
            )}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {/* Enlace para registrarse */}
        <div className="flex justify-center mt-6">
          <p className="text-sm text-gray-700">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-purple-600 hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
