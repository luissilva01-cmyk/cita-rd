import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useNavigate, Link } from "react-router-dom";
import { Mail } from "lucide-react";

export default function Recuperar() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");

    try {
      await sendPasswordResetEmail(auth, email);
      // ✅ Redirige a la pantalla de confirmación
      navigate("/correo-enviado");
    } catch {
      setMensaje("❌ No pudimos enviar el correo. Verifica tu dirección e intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Icono principal */}
        <div className="flex justify-center mb-4">
          <Mail className="text-purple-500 w-16 h-16" />
        </div>

        <h2 className="text-3xl font-bold text-purple-700 mb-2">Recuperar Contraseña</h2>
        <p className="text-gray-600 mb-6">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form onSubmit={handleRecuperar} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {mensaje && <p className="text-red-500 text-sm">{mensaje}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 shadow-lg hover:shadow-xl"
            }`}
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        {/* 🔗 Botón de volver al inicio de sesión */}
        <div className="mt-6">
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200"
          >
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
