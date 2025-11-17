import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

export default function Navbar() {
  const { usuario, setUsuario } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarioLocal, setUsuarioLocal] = useState(null);

  // 🔄 Sincroniza con localStorage en caso de recargar la página
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser) {
      setUsuarioLocal(JSON.parse(storedUser));
    } else {
      setUsuarioLocal(null);
    }
  }, [usuario]);

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
      localStorage.removeItem("usuario");
      localStorage.removeItem("uid");
      navigate("/login");
    } catch (err) {
      console.error("❌ Error al cerrar sesión:", err);
    }
  };

  // ✅ Si no hay usuario, mostramos versión pública del navbar
  const user = usuario || usuarioLocal;

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          CitaRD 💘
        </Link>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className={`${
                  location.pathname === "/login"
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                } hover:text-orange-600`}
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/register"
                className={`${
                  location.pathname === "/register"
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                } hover:text-orange-600`}
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/perfil"
                className={`${
                  location.pathname === "/perfil"
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                } hover:text-orange-600`}
              >
                Mi Perfil
              </Link>

              <Link
                to="/explorar"
                className={`${
                  location.pathname === "/explorar"
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                } hover:text-orange-600`}
              >
                Explorar
              </Link>

              <Link
                to="/descubrir"
                className={`${
                  location.pathname === "/descubrir"
                    ? "text-orange-600 font-semibold"
                    : "text-gray-700"
                } hover:text-orange-600`}
              >
                🔥 Descubrir Gente Nueva
              </Link>

              <button
                onClick={cerrarSesion}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
