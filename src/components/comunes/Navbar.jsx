import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast"; // 👈 Importamos

export default function Navbar() {
  const { usuario, setUsuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
      toast.success("Sesión cerrada correctamente 👋"); // ✅ Toast de éxito
      navigate("/login");
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      toast.error("No se pudo cerrar sesión ❌"); // ❌ Toast de error
    }
  };

  return (
    <nav className="bg-pink-500 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl">
        CitaRD
      </Link>

      <div className="flex items-center gap-4">
        {usuario ? (
          <>
            <Link to="/explorar-perfiles" className="hover:underline">
              Explorar
            </Link>
            <Link to="/ver-perfil" className="hover:underline">
              Mi Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-pink-500 px-3 py-1 rounded hover:bg-gray-100 transition"
            >
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Iniciar Sesión
            </Link>
            <Link to="/registro" className="hover:underline">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

