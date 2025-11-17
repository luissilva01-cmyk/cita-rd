import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function MisMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const usuarioActual = localStorage.getItem("uid");

  useEffect(() => {
    const obtenerMatches = async () => {
      try {
        const q = query(
          collection(db, "matches"),
          where("usuarios", "array-contains", usuarioActual)
        );
        const snapshot = await getDocs(q);

        const idsOtrosUsuarios = snapshot.docs
          .map((doc) =>
            doc.data().usuarios.find((id) => id !== usuarioActual)
          )
          .filter(Boolean);

        if (idsOtrosUsuarios.length > 0) {
          const perfilesSnap = await getDocs(collection(db, "perfiles"));
          const perfilesFiltrados = perfilesSnap.docs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .filter((perfil) => idsOtrosUsuarios.includes(perfil.userId));

          setMatches(perfilesFiltrados);
        }
      } catch (error) {
        console.error("❌ Error al obtener los matches:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerMatches();
  }, [usuarioActual]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Cargando tus matches...
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p className="text-xl font-medium">Aún no tienes matches 💔</p>
        <p className="text-sm mt-2">
          ¡Explora más perfiles para encontrar tu pareja ideal!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white p-6">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        💖 Mis Matches
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={match.fotoURL || "/default-avatar.png"}
              alt={match.nombre}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {match.nombre},{" "}
                <span className="text-gray-500">{match.edad}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">{match.bio}</p>

              <p className="text-xs text-gray-400 mt-1">
                💞 Desde:{" "}
                {match.timestamp
                  ? new Date(match.timestamp.toDate()).toLocaleDateString()
                  : "Reciente"}
              </p>

              <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition w-full">
                💬 Enviar mensaje
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
