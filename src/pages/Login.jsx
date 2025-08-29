// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { usuario, setUsuario } = useAuth();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const navigate = useNavigate();

  // Redirección silenciosa si ya está logueado
  useEffect(() => {
    if (usuario) {
      navigate("/ver-perfil", { replace: true });
    }
  }, [usuario, navigate]);

  // Validación básica de email
  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setError("Correo electrónico inválido");
      return;
    }

    if (clave.trim() === "") {
      setError("La contraseña no puede estar vacía");
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, clave);
      setUsuario(cred.user);
      setError("");
      navigate("/ver-perfil");
    } catch (err) {
      // Manejo de errores de Firebase
      let mensaje = "Correo o contraseña incorrectos.";

      if (import.meta.env.MODE === "development") {
        console.error("Error en login:", err);
      }

      switch (err.code) {
        case "auth/user-not-found":
          mensaje = "No existe una cuenta con este correo.";
          break;
        case "auth/wrong-password":
          mensaje = "La contraseña es incorrecta.";
          break;
        case "auth/invalid-email":
          mensaje = "El formato del correo no es válido.";
          break;
        case "auth/user-disabled":
          mensaje = "Esta cuenta ha sido deshabilitada.";
          break;
        default:
          mensaje = "Error al iniciar sesión. Intenta de nuevo.";
      }

      setError(mensaje);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={iniciarSesion}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Iniciar sesión
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Correo */}
        <label className="block mb-2 font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 ${
            error.includes("Correo") ? "border-red-500 bg-red-100 focus:ring-red-400" : "border-gray-300 focus:ring-pink-400"
          }`}
        />

        {/* Contraseña */}
        <label className="block mt-4 mb-2 font-medium text-gray-700">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={mostrarClave ? "text" : "password"}
            placeholder="••••••••"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 pr-10 ${
              error.toLowerCase().includes("contraseña") ? "border-red-500 bg-red-100 focus:ring-red-400" : "border-gray-300 focus:ring-pink-400"
            }`}
          />
          <button
            type="button"
            onClick={() => setMostrarClave(!mostrarClave)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {mostrarClave ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Entrar
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-pink-600 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
