import { Link } from "react-router-dom";

export default function CardPerfil({ perfil }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center">
      <img
        src={perfil.foto || "https://via.placeholder.com/150"}
        alt={perfil.nombre}
        className="w-32 h-32 object-cover rounded-full border-2 border-blue-500"
      />
      <h2 className="text-lg font-bold mt-3">{perfil.nombre}, {perfil.edad}</h2>
      <p className="text-gray-500">{perfil.ubicacion}</p>

      {/* Botón para abrir perfil real */}
      <Link
        to={`/perfil/${perfil.id}`}
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Ver Perfil
      </Link>
    </div>
  );
}
