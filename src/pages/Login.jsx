import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase"; // ruta correcta
import { useAuth } from "../context/useAuth"; // ✅ uso del hook correcto
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { usuario, setUsuario } = useAuth();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      navigate("/ver-perfil", { replace: true });
    }
  }, [usuario, navigate]);

  const iniciarSesion = async (e) => {
    e.preventDefault();
    try {
      const cred = await signInWithEmailAndPassword(auth, email, clave);
      setUsuario(cred.user);
      setError("");
      navigate("/ver-perfil");
    } catch (err) {
      let mensaje = "Error al iniciar sesión";
      if (err.code === "auth/user-not-found") mensaje = "Usuario no encontrado";
      else if (err.code === "auth/wrong-password") mensaje = "Contraseña incorrecta";
      else if (err.code === "auth/invalid-email") mensaje = "Correo inválido";
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
          Iniciar Sesión
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
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
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
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 pr-10"
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
          Iniciar Sesión
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
