// src/pages/CrearPerfil.jsx
import React, { useState } from "react";
import { db, auth } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { obtenerUbicacionActual } from "../utils/obtenerUbicacion";

export default function CrearPerfil() {
  const [nombre, setNombre] = useState("");
  const [intereses, setIntereses] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState("");
  const navigate = useNavigate();

  const manejarSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuario = auth.currentUser;
      if (!usuario) throw new Error("No hay usuario autenticado");

      // ✅ Obtener ubicación actual
      const ubicacion = await obtenerUbicacionActual();

      // Guardar perfil
      await setDoc(doc(db, "perfiles", usuario.uid), {
        uid: usuario.uid,
        nombre,
        intereses,
        fotoPerfil,
        ubicacion, // ✅ se guarda aquí
        creadoEn: new Date(),
      });

      alert("✅ Perfil creado con éxito");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al crear el perfil:", error);
      alert("❌ Error al crear el perfil. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Crear Perfil</h1>
      <form onSubmit={manejarSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded-lg p-2"
          required
        />

        <input
          type="text"
          placeholder="Intereses (separa con comas)"
          value={intereses.join(", ")}
          onChange={(e) => setIntereses(e.target.value.split(",").map((i) => i.trim()))}
          className="w-full border rounded-lg p-2"
        />

        <input
          type="text"
          placeholder="URL de tu foto de perfil"
          value={fotoPerfil}
          onChange={(e) => setFotoPerfil(e.target.value)}
          className="w-full border rounded-lg p-2"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Guardar perfil
        </button>
      </form>
    </div>
  );
}
