import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function MisMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const obtenerMatches = async () => {
      try {
        // 1️⃣ Buscar matches donde el usuario actual participa
        const q = query(
          collection(db, "matches"),
          where("usuarios", "array-contains", user.uid)
        );
        const snap = await getDocs(q);

        if (snap.empty) {
          setMatches([]);
          return;
        }

        // 2️⃣ De cada match, obtener el UID del otro usuario
        const otrosUids = snap.docs
          .map((doc) => doc.data().usuarios.find((uid) => uid !== user.uid))
          .filter(Boolean);

        // 3️⃣ Descargar SOLO los perfiles necesarios (optimizado)
        const perfiles = [];
        for (let uid of otrosUids) {
          const perfilRef = doc(db, "perfiles", uid);
          const perfilSnap = await getDoc(perfilRef);

          if (perfilSnap.exists()) {
            perfiles.push({
              id: uid,
              ...perfilSnap.data(),
              fechaMatch: snap.docs.find((d) =>
                d.data().usuarios.includes(uid)
              )?.data().timestamp,
            });
          }
        }

        setMatches(perfiles);
      } catch (error) {
        console.error("❌ Error al obtener los matches:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerMatches();
  }, [user]);

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
              src={match.foto || "/default-avatar.png"}
              alt={match.nombre}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {match.nombre}
              </h2>
              <p className="text-sm text-gray-600 mt-1">{match.bio}</p>

              <p className="text-xs text-gray-400 mt-1">
                💞 Desde:{" "}
                {match.fechaMatch
                  ? new Date(match.fechaMatch.toDate()).toLocaleDateString()
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
