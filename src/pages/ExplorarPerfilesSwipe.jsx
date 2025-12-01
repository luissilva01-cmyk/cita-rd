// src/pages/ExplorarPerfilesSwipe.jsx
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

import { darLike } from "../services/likesService";

export default function ExplorarPerfilesSwipe() {
  // Hooks: siempre se llaman (no condicionales)
  const { user } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  // Cargar perfiles (hook)
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "perfiles"));
        const data = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.uid !== user?.uid)
          .sort(() => Math.random() - 0.5); // ordenar aleatorio opcional

        setPerfiles(data);
      } catch (e) {
        console.error("Error cargando perfiles:", e);
      }
    })();
  }, [user]);

  // Manejo del swipe (debe definirse antes de useSwipeable)
  const manejarSwipe = async (dir) => {
    const perfil = perfiles[indiceActual];
    if (!perfil || bloqueado) return;

    setBloqueado(true);

    if (dir === "right") {
      if (!user) {
        setMensaje("Debes iniciar sesión para dar like.");
      } else {
        const res = await darLike(user.uid, perfil.uid);
        if (res.ok) {
          if (res.match) {
            setMensaje("💘 ¡Match! Se abrió un chat automáticamente");
          } else {
            setMensaje("👍 ¡Like enviado!");
          }
        } else if (res.msg) {
          setMensaje(res.msg);
        }
      }
    } else {
      setMensaje("⏭️ Siguiente…");
    }

    // Avanzar al siguiente perfil
    setIndiceActual((i) => i + 1);

    // Limpiar mensaje y desbloquear
    setTimeout(() => {
      setMensaje("");
      setBloqueado(false);
    }, 1200);
  };

  // Handlers de swipe (hook)
  const handlers = useSwipeable({
    onSwipedLeft: () => manejarSwipe("left"),
    onSwipedRight: () => manejarSwipe("right"),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  // --- Renders condicionales (después de declarar todos los hooks) ---

  // Usuario no autenticado
  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Debes iniciar sesión para explorar perfiles 👀
      </p>
    );
  }

  // No hay perfiles cargados aún
  if (perfiles.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No hay perfiles para mostrar 😅
      </p>
    );
  }

  // Si ya alcanzamos el final
  if (indiceActual >= perfiles.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Ya no hay más perfiles 👀
      </p>
    );
  }

  const perfil = perfiles[indiceActual];

  // Foto segura
  const foto =
    perfil?.foto && perfil.foto.startsWith("http")
      ? perfil.foto
      : "https://placehold.co/400x500?text=Sin+Foto";

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Explorar Perfiles (Swipe)
      </h1>

      <div className="relative w-80 h-[430px] select-none">
        <AnimatePresence>
          <motion.div
            key={perfil.id}
            {...handlers}
            className={`absolute top-0 left-0 w-full h-full bg-white rounded-xl shadow-xl overflow-hidden ${
              bloqueado ? "pointer-events-none opacity-90" : ""
            }`}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: mensaje.includes("Match")
                ? 250
                : mensaje.includes("Like")
                ? 200
                : -200,
              rotate: mensaje.includes("Match")
                ? 25
                : mensaje.includes("Like")
                ? 20
                : -20,
            }}
            transition={{ duration: 0.25 }}
          >
            <img src={foto} alt={perfil.nombre} className="w-full h-64 object-cover" />

            <div className="p-4">
              <h2 className="text-xl font-semibold">{perfil.nombre}</h2>
              <p className="text-gray-600 mt-1">{perfil.bio || "Sin descripción."}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {mensaje && (
        <div
          className={`mt-5 px-4 py-2 font-semibold rounded-lg shadow-lg animate-pulse text-center ${
            mensaje.includes("Match")
              ? "bg-purple-600 text-white"
              : mensaje.includes("Like")
              ? "bg-green-500 text-white"
              : "bg-gray-400 text-black"
          }`}
        >
          {mensaje}
        </div>
      )}

      <div className="mt-6 flex gap-6">
        <button
          onClick={() => manejarSwipe("left")}
          disabled={bloqueado}
          className="px-7 py-4 text-xl bg-gray-300 rounded-full shadow hover:bg-gray-400 transition active:scale-90 disabled:opacity-50"
        >
          ❌
        </button>

        <button
          onClick={() => manejarSwipe("right")}
          disabled={bloqueado}
          className="px-7 py-4 text-xl bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition active:scale-90 disabled:opacity-50"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
