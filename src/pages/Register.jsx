import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase"; // ruta correcta
import { useAuth } from "../context/useAuth"; // ✅ cambio aquí
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { usuario, setUsuario } = useAuth();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [error, setError] = useState("");
  const [mostrarClave, setMostrarClave] = useState(false);
  const [mostrarConfirmarClave, setMostrarConfirmarClave] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (usuario) {
      navigate("/ver-perfil", { replace: true });
    }
  }, [usuario, navigate]);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const registrarUsuario = async (e) => {
    e.preventDefault();

    if (!validarEmail(email)) {
      setError("Correo electrónico inválido");
      return;
    }
    if (clave.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (clave !== confirmarClave) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, clave);
      setUsuario(cred.user);
      setError("");
      navigate("/crear-perfil");
    } catch (err) {
      setError(err.message || "Error al registrar usuario.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={registrarUsuario}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Registro
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
            error.includes("Correo")
              ? "border-red-500 bg-red-100 focus:ring-red-400"
              : "border-gray-300 focus:ring-pink-400"
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
              error.includes("contraseña") || error.includes("Contraseña")
                ? "border-red-500 bg-red-100 focus:ring-red-400"
                : "border-gray-300 focus:ring-pink-400"
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

        {/* Confirmar contraseña */}
        <label className="block mt-4 mb-2 font-medium text-gray-700">
          Confirmar contraseña
        </label>
        <div className="relative">
          <input
            type={mostrarConfirmarClave ? "text" : "password"}
            placeholder="••••••••"
            value={confirmarClave}
            onChange={(e) => setConfirmarClave(e.target.value)}
            required
            className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 pr-10 ${
              error.includes("coinciden")
                ? "border-red-500 bg-red-100 focus:ring-red-400"
                : "border-gray-300 focus:ring-pink-400"
            }`}
          />
          <button
            type="button"
            onClick={() =>
              setMostrarConfirmarClave(!mostrarConfirmarClave)
            }
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {mostrarConfirmarClave ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Crear cuenta
        </button>

        <p className="mt-4 text-sm text-gray-600 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-pink-600 font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
