import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar() {
  const { usuario } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-extrabold text-purple-600 hover:text-purple-700 transition">
        💜 CitaRD
      </Link>

      <div className="flex gap-4">
        <Link to="/" className="text-gray-700 hover:text-purple-600">Inicio</Link>
        <Link to="/explorar" className="text-gray-700 hover:text-purple-600">Explorar</Link>

        {usuario ? (
          <>
            <Link to="/perfil" className="text-gray-700 hover:text-purple-600">Mi Perfil</Link>
            <Link to="/editar-perfil" className="text-gray-700 hover:text-purple-600">Editar</Link>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-purple-600">Entrar</Link>
            <Link
              to="/register"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
