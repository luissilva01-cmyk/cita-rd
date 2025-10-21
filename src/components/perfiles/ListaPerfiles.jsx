import React from "react";
import CardPerfil from "./CardPerfil";

export default function ListaPerfiles() {
  const perfiles = [
    { id: 1, nombre: "Ana", edad: 25, imagen: "https://i.pravatar.cc/150?img=1" },
    { id: 2, nombre: "Carlos", edad: 28, imagen: "https://i.pravatar.cc/150?img=2" },
    { id: 3, nombre: "María", edad: 24, imagen: "https://i.pravatar.cc/150?img=3" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {perfiles.map((perfil) => (
        <CardPerfil key={perfil.id} {...perfil} />
      ))}
    </div>
  );
}
