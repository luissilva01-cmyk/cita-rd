import React, { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, addDoc, query, where, setDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Heart, MapPin, Calendar } from "lucide-react";

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Cargando perfiles increíbles...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Explora Perfiles
          </h1>
          <p className="text-gray-200 text-lg">
            Descubre personas increíbles cerca de ti
          </p>
        </motion.div>

        {/* Grid de perfiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {perfiles.map((perfil, index) => (
            <motion.div
              key={perfil.uid}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="card-profile group cursor-pointer"
            >
              {/* Imagen */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={perfil.foto || perfil.fotoPerfil || "/default-avatar.png"}
                  alt={perfil.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay con gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Info sobre la imagen */}
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-sm">
                    {perfil.edad && (
                      <>
                        <Calendar size={14} />
                        <span>{perfil.edad} años</span>
                      </>
                    )}
                    {perfil.ubicacion && (
                      <>
                        <MapPin size={14} />
                        <span>{perfil.ubicacion}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {perfil.nombre}
                </h2>
                
                {perfil.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {perfil.bio}
                  </p>
                )}

                {/* Intereses */}
                {perfil.intereses && perfil.intereses.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {perfil.intereses.slice(0, 3).map((interes, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full"
                      >
                        {interes}
                      </span>
                    ))}
                    {perfil.intereses.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{perfil.intereses.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Botón de like */}
                <motion.button
                  onClick={() => darLike(perfil)}
                  animate={animatingId === perfil.uid ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.6 }}
                  disabled={likedIds.includes(perfil.uid)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    likedIds.includes(perfil.uid)
                      ? "bg-pink-500 text-white cursor-not-allowed"
                      : "bg-gradient-primary text-white hover:shadow-glow hover:scale-105"
                  }`}
                >
                  <Heart 
                    size={18} 
                    className={likedIds.includes(perfil.uid) ? "fill-current" : ""} 
                  />
                  {likedIds.includes(perfil.uid) ? "Te gusta" : "Me gusta"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensaje si no hay perfiles */}
        {perfiles.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="card-glass max-w-md mx-auto">
              <Heart className="text-pink-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay perfiles disponibles
              </h3>
              <p className="text-gray-200">
                Vuelve más tarde para descubrir nuevas personas
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
