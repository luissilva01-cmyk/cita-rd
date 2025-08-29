import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { usuario, setUsuario } = useAuth();
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirección si ya está logueado
  useEffect(() => {
    if (usuario) {
      navigate("/ver-perfil", { replace: true });
    }
  }, [usuario, navigate]);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const registrarUsuario = async (e) => {
    e.preventDefault();
    const correo = email.trim();

    if (!validarEmail(correo)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    if (clave.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (clave !== confirmarClave) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, correo, clave);
      setUsuario(cred.user);
      setError("");
      navigate("/crear-perfil");
    } catch (err) {
      // Traducción de errores comunes de Firebase
      let mensaje = "Error al registrar usuario.";
      if (err.code === "auth/email-already-in-use") {
        mensaje = "Este correo ya está registrado.";
      } else if (err.code === "auth/invalid-email") {
        mensaje = "El correo ingresado no es válido.";
      } else if (err.code === "auth/weak-password") {
        mensaje = "La contraseña es demasiado débil.";
      }
      setError(mensaje);
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
          className={error.includes("correo") ? "input-error" : ""}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          placeholder="••••••••"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className={error.includes("contraseña") ? "input-error" : ""}
          required
        />

        <label>Confirmar contraseña</label>
        <input
          type="password"
          placeholder="Repite la contraseña"
          value={confirmarClave}
          onChange={(e) => setConfirmarClave(e.target.value)}
          className={error.includes("coinciden") ? "input-error" : ""}
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
