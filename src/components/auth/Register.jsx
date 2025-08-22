import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { usuario, setUsuario } = useAuth();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirección silenciosa si ya está logueado
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
    <div className="auth-container">
      <form className="auth-form" onSubmit={registrarUsuario}>
        <h2>Registro</h2>
        {error && <p className="error-text">{error}</p>}

        <label>Correo electrónico</label>
        <input
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          required
        />

        <button type="submit">Crear cuenta</button>
        <p>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}

