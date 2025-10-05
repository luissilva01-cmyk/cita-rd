import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-100 via-white to-orange-200 px-6">
      {/* Contenido principal */}
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 drop-shadow-lg">
          ¡Bienvenido a CitaRD! 💙
        </h1>

        <p className="mt-6 text-lg md:text-2xl text-gray-700">
          Conoce nuevas personas y conecta con tu media naranja.
        </p>
      </div>

      {/* Botón más abajo, con espacio limpio antes del fondo */}
      <div className="mt-20 mb-24">
        <button
          onClick={() => navigate("/login")}
          className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-semibold rounded-md shadow-lg hover:scale-105 hover:shadow-xl transition-transform"
        >
          Comenzar ahora 🚀
        </button>
      </div>
    </div>
  );
}
