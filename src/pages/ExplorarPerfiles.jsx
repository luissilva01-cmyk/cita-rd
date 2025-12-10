import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, addDoc, query, where, setDoc, doc } from "firebase/firestore"; // ← getDoc removido
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function ExplorarPerfiles() {
  const { user } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState([]);
  const [animatingId, setAnimatingId] = useState(null);

  useEffect(() => {
    const obtenerPerfiles = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "perfiles"), where("uid", "!=", user.uid));
        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPerfiles(data);

        // Obtener likes previos del usuario
        const likesSnap = await getDocs(
          query(collection(db, "likes"), where("from", "==", user.uid))
        );

        setLikedIds(likesSnap.docs.map((d) => d.data().to));
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfiles();
  }, [user]);

  const darLike = async (perfil) => {
    if (likedIds.includes(perfil.uid)) return;

    setAnimatingId(perfil.uid);
    setTimeout(() => setAnimatingId(null), 700);

    await addDoc(collection(db, "likes"), {
      from: user.uid,
      to: perfil.uid,
      timestamp: new Date(),
    });

    setLikedIds((prev) => [...prev, perfil.uid]);

    // MATCH VERIFICATION
    const reverseLike = await getDocs(
      query(collection(db, "likes"), where("from", "==", perfil.uid), where("to", "==", user.uid))
    );

    if (!reverseLike.empty) {
      const matchRef = doc(collection(db, "matches"));
      await setDoc(matchRef, {
        usuarios: [user.uid, perfil.uid],
        timestamp: new Date(),
      });
      alert(`🔥 ¡Match con ${perfil.nombre}!`);
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando perfiles...</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-white to-orange-50">
      <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">Explorar perfiles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {perfiles.map((perfil) => (
          <motion.div
            key={perfil.uid}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl"
          >
            <img
              src={perfil.foto || "/default-avatar.png"}
              alt={perfil.nombre}
              className="w-full h-56 object-cover"
            />

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">{perfil.nombre}</h2>
              <p className="text-sm text-gray-600">{perfil.bio}</p>

              <motion.button
                onClick={() => darLike(perfil)}
                animate={animatingId === perfil.uid ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.6 }}
                className={`mt-4 w-full py-2 rounded-full font-semibold text-white ${
                  likedIds.includes(perfil.uid)
                    ? "bg-pink-500 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {likedIds.includes(perfil.uid) ? "❤ Ya te gusta" : "🤍 Me gusta"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
