import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
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

  const iniciarSesion = async (e) => {
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
      const cred = await signInWithEmailAndPassword(auth, email, clave);
      setUsuario(cred.user);
      setError("");
      navigate("/ver-perfil");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas.");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={iniciarSesion}>
        <h2>Iniciar Sesión</h2>
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

        <button type="submit">Entrar</button>
        <p>
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}
