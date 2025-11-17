import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

export default function DescubrirGenteNueva() {
  const [perfiles, setPerfiles] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [match, setMatch] = useState(null);
  const usuarioActual = localStorage.getItem("uid");

  useEffect(() => {
    const obtenerPerfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "perfiles"));
        const lista = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.userId !== usuarioActual);
        setPerfiles(lista);
      } catch (err) {
        console.error("⚠️ Error cargando perfiles:", err);
      }
    };
    obtenerPerfiles();
  }, [usuarioActual]);

  const perfilActual = perfiles[indiceActual];

  const registrarLike = async (perfilLikeado) => {
    try {
      // ✅ 1. Registrar el "like"
      await addDoc(collection(db, "likes"), {
        usuarioActual,
        usuarioLikeado: perfilLikeado.userId,
        timestamp: serverTimestamp(),
      });

      // ✅ 2. Comprobar si el otro usuario también dio "like" antes
      const q = query(
        collection(db, "likes"),
        where("usuarioActual", "==", perfilLikeado.userId),
        where("usuarioLikeado", "==", usuarioActual)
      );

      const resultado = await getDocs(q);

      if (!resultado.empty) {
        console.log("🎯 ¡Match encontrado!");
        // ✅ 3. Guardar match mutuo
        await addDoc(collection(db, "matches"), {
          usuarios: [usuarioActual, perfilLikeado.userId],
          timestamp: serverTimestamp(),
        });

        setMatch(perfilLikeado);
      }
    } catch (err) {
      console.error("⚠️ Error guardando like o match:", err);
    }
  };

  const handleSwipe = (tipo) => {
    if (!perfilActual) return;
    if (tipo === "like") registrarLike(perfilActual);
    setTimeout(() => {
      setIndiceActual((prev) =>
        perfiles.length ? (prev + 1) % perfiles.length : 0
      );
      setMatch(null);
    }, 750);
  };

  if (!perfilActual) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        <p>No hay nuevas personas para descubrir 😅</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">
        🔥 Descubrir Gente Nueva
      </h1>

      <div className="relative w-80 h-[460px]">
        <AnimatePresence>
          <motion.div
            key={perfilActual.id}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.45 }}
            className="absolute w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="h-64 w-full bg-gray-200">
              <img
                src={perfilActual.fotoURL || "/default-avatar.png"}
                alt={perfilActual.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 flex flex-col justify-between flex-grow">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {perfilActual.nombre}{" "}
                  <span className="text-gray-500 text-lg">
                    {perfilActual.edad}
                  </span>
                </h2>
                <p className="text-gray-600 text-sm mt-2">{perfilActual.bio}</p>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                ID: {perfilActual.userId}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-6 mt-6">
        <motion.button
          onClick={() => handleSwipe("skip")}
          whileTap={{ scale: 0.95 }}
          className="bg-gray-200 px-6 py-3 rounded-full shadow hover:bg-gray-300"
        >
          ❌ Pasar
        </motion.button>

        <motion.button
          onClick={() => handleSwipe("like")}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-500 text-white px-6 py-3 rounded-full shadow hover:bg-orange-600"
        >
          💖 Conectar
        </motion.button>
      </div>

      {match && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-white rounded-2xl p-6 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-orange-600 mb-2">
              🎉 ¡Es un match!
            </h3>
            <p className="text-gray-700">
              Tú y <span className="font-semibold">{match.nombre}</span> se
              gustaron mutuamente 💕
            </p>
            <button
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
              onClick={() => setMatch(null)}
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
