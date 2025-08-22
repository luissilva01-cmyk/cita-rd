import React from "react";
import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";

export default function Home({ usuario, setUsuario }) {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await auth.signOut();
    setUsuario(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-4">Bienvenido a CitaRD</h1>
      {usuario ? (
        <>
          <p className="text-lg text-gray-700">
            Hola, {usuario.email}! Explora perfiles o crea el tuyo.
          </p>
          <button
            onClick={cerrarSesion}
            className="mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold"
          >
            Cerrar sesión
          </button>
        </>
      ) : (
        <>
          <p className="text-lg text-gray-700">Por favor inicia sesión o regístrate para comenzar.</p>
          <div className="mt-4 space-x-4">
            <button onClick={() => navigate("/login")} className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold">
              Iniciar sesión
            </button>
            <button onClick={() => navigate("/registro")} className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-lg font-semibold">
              Registrarse
            </button>
          </div>
        </>
      )}
    </div>
  );
}
