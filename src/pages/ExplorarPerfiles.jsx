// src/pages/ExplorarPerfiles.jsx
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { darLike } from "../services/likesService";

export default function ExplorarPerfiles() {
  const { user } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [bloqueado, setBloqueado] = useState(false);

  // Cargar perfiles
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "perfiles"));
        const data = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((p) => p.uid !== user?.uid)
          .sort(() => Math.random() - 0.5);

        setPerfiles(data);
      } catch (error) {
        console.error("Error cargando perfiles:", error);
      }
    })();
  }, [user]);

  // Acción de Like / Skip
  const manejarLike = async () => {
    if (!user) {
      setMensaje("Debes iniciar sesión para dar like");
      return;
    }

    const p = perfiles[indiceActual];
    if (!p) return;

    setBloqueado(true);

    const res = await darLike(user.uid, p.uid);

    if (res.ok) {
      if (res.match) {
        setMensaje("💘 ¡Match! Se abrió un chat automáticamente");
      } else {
        setMensaje("👍 ¡Like enviado!");
      }
    } else {
      setMensaje("❌ Error enviando like.");
    }

    setTimeout(() => {
      setMensaje("");
      setBloqueado(false);
      setIndiceActual((i) => i + 1);
    }, 1500);
  };

  const manejarSkip = () => {
    setMensaje("⏭️ Siguiente…");
    setBloqueado(true);

    setTimeout(() => {
      setMensaje("");
      setBloqueado(false);
      setIndiceActual((i) => i + 1);
    }, 800);
  };

  // Renders condicionales
  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Debes iniciar sesión para explorar perfiles 👀
      </p>
    );
  }

  if (perfiles.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">No hay perfiles 😅</p>
    );
  }

  if (indiceActual >= perfiles.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Ya no hay más perfiles 👀
      </p>
    );
  }

  const perfil = perfiles[indiceActual];
  const foto =
    perfil?.foto?.startsWith("http")
      ? perfil.foto
      : "https://placehold.co/400x500?text=Sin+Foto";

  return (
    <div className="flex flex-col items-center mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-600">
        Explorar Perfiles
      </h1>

      <div
        className={`w-80 bg-white rounded-xl shadow-xl overflow-hidden ${
          bloqueado ? "opacity-80 pointer-events-none" : ""
        }`}
      >
        <img
          src={foto}
          alt={perfil.nombre}
          className="w-full h-64 object-cover"
        />

        <div className="p-4">
          <h2 className="text-xl font-semibold">{perfil.nombre}</h2>
          <p className="text-gray-600 mt-1">
            {perfil.bio || "Sin descripción."}
          </p>
        </div>
      </div>

      {mensaje && (
        <div className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg shadow animate-pulse">
          {mensaje}
        </div>
      )}

      <div className="mt-6 flex gap-6">
        <button
          onClick={manejarSkip}
          disabled={bloqueado}
          className="px-7 py-4 text-xl bg-gray-300 rounded-full shadow hover:bg-gray-400 transition active:scale-90 disabled:opacity-50"
        >
          ❌
        </button>

        <button
          onClick={manejarLike}
          disabled={bloqueado}
          className="px-7 py-4 text-xl bg-orange-500 text-white rounded-full shadow hover:bg-orange-600 transition active:scale-90 disabled:opacity-50"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
