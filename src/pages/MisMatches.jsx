import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MisMatches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.uid) return;

    async function obtenerMatches() {
      try {
        const q = query(
          collection(db, "matches"),
          where("usuarios", "array-contains", user.uid)
        );
        const snap = await getDocs(q);

        const lista = [];
        for (let m of snap.docs) {
          const data = m.data();
          const otroUID = data.usuarios.find(u => u !== user.uid);

          const perfilRef = doc(db, "perfiles", otroUID);
          const perfil = await getDoc(perfilRef);

          if (perfil.exists()) {
            lista.push({
              id: otroUID,
              ...perfil.data(),
              fecha: data.timestamp
            });
          }
        }

        setMatches(lista);
      } catch (err) {
        console.log("Error obteniendo matches:", err);
      }
      setLoading(false);
    }

    obtenerMatches();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Cargando matches...</p>;

  if (matches.length === 0)
    return (
      <div className="text-center mt-20 text-gray-600">
        <p className="text-xl">Aún no tienes matches 💔</p>
        <p>¡Sigue dando likes para encontrar uno!</p>
      </div>
    );

  return (
    <div className="p-6 pt-10">
      <h1 className="text-3xl font-bold text-center text-orange-600 mb-8">
        💞 Mis Matches
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map(m => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img src={m.foto} className="w-full h-52 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-bold">{m.nombre}</h2>

              <button
                onClick={() => navigate(`/chat/${m.id}`)}
                className="mt-3 bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded-full"
              >
                💬 Abrir Chat
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
