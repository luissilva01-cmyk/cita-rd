// src/pages/Auth/Register.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || !confirm) {
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
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/crear-perfil");
    } catch (e) {
      setError(e.message || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-200 via-pink-100 to-orange-200 p-5">
      
      {/* Contenedor principal */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 animate-[fadeIn_0.4s_ease]">

        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Crear Cuenta ✨
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-5">

          {/* Correo */}
          <div>
            <label className="text-sm font-medium text-gray-700">Correo</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
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
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-2 text-gray-500 hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <div className="relative mt-1">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(p => !p)}
                className="absolute right-3 top-2 text-gray-500 hover:text-orange-500"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Botón principal */}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:bg-orange-600 transition-all active:scale-[0.97] flex justify-center"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Registrarse"
            )}
          </button>
        </form>

        {/* Enlace a iniciar sesión */}
        <p className="text-center text-gray-700 mt-6">
          ¿Ya tienes cuenta?
          <Link to="/login" className="text-orange-600 font-semibold ml-1 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
