// src/pages/Register.jsx
import { useState } from "react";
import { auth, parseFirebaseError } from "../utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Registro exitoso 🎉");
      navigate("/perfil");
    } catch (error) {
      toast.error(parseFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Cuenta</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        ¿Ya tienes cuenta?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-orange-500 font-semibold cursor-pointer"
        >
          Inicia sesión aquí
        </span>
      </p>
    </div>
  );
}

export default Register;
