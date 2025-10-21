import React from "react";

export default function CardPerfil({ nombre, edad, imagen }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition">
      <img src={imagen} alt={nombre} className="w-32 h-32 rounded-full mx-auto object-cover" />
      <h2 className="mt-3 text-lg font-semibold text-purple-700">{nombre}</h2>
      <p className="text-gray-500">{edad} años</p>
    </div>
  );
}
