// src/pages/Login.jsx
import { useState } from "react";
import { auth, parseFirebaseError } from "../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validaciones
  const validateForm = () => {
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return false;
    }
    // Validación simple de email
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
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/perfil");
    } catch (err) {
      setError(parseFirebaseError(err));
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

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
              error.includes("Correo") ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
              error.includes("contraseña") ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center`}
          >
            {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span> : null}
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-700">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-purple-500 font-semibold hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
