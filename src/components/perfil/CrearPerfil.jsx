import React from "react";

export default function CardPerfil({ perfil, onVerPerfil }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition transform hover:scale-105 hover:shadow-xl">
      {/* Imagen de perfil */}
      <div className="relative w-full h-56 bg-gray-200">
        {perfil.foto ? (
          <img
            src={perfil.foto}
            alt={`${perfil.nombre}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold">
            Sin foto
          </div>
        )}
      </div>

      {/* Información */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          {perfil.nombre}, {perfil.edad}
        </h3>
        <p className="text-gray-500">{perfil.ubicacion}</p>

        {/* Botón acción */}
        <button
          onClick={() => onVerPerfil(perfil)}
          className="mt-3 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition"
        >
          Ver Perfil
        </button>
      </div>
    </div>
  );
}
