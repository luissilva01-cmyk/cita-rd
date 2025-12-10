// src/pages/ExplorarPerfilesV2.jsx
import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { darLike } from "../services/likesService";
import toast from "react-hot-toast";

export default function ExplorarPerfilesV2() {
  const { user } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [animacion, setAnimacion] = useState("");

  useEffect(() => {
    const obtenerPerfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "perfiles"));
        let lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // Filtrar para no mostrar el perfil propio
        let resultado = lista.filter((p) => p.uid !== user?.uid);

        setPerfiles(resultado);
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      } finally {
        setCargando(false);
      }
    };

    if (user) {
      obtenerPerfiles();
    }
  }, [user]);

  if (cargando) return <p className="text-center mt-10">Cargando perfiles...</p>;
  if (perfiles.length === 0) return <p className="text-center mt-10">No hay más perfiles 😅</p>;

  const perfil = perfiles[index];

  const siguiente = () => {
    setAnimacion("");
    setTimeout(() => {
      setIndex((i) => (i + 1 < perfiles.length ? i + 1 : 0));
    }, 300);
  };

  const handleSkip = () => {
    setAnimacion("translate-x-[-200px] rotate-[-25deg] opacity-0");
    siguiente();
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión.");
      return;
    }

    setAnimacion("translate-x-[200px] rotate-[25deg] opacity-0");

    const resultado = await darLike(user.uid, perfil.uid);

    if (resultado.ok && resultado.match) {
      toast.success("🎉 ¡Match! Ambos se gustaron ❤️");
    } else if (resultado.ok) {
      toast.success("❤️ Like enviado");
    } else {
      toast.error(resultado.msg);
    }

    siguiente();
  };

  return (
    <div className="flex flex-col items-center p-4 mt-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Descubrir personas 💘</h1>

      <div className="relative w-80 h-[460px]">
        <div
          key={perfil.id}
          className={`absolute w-full h-full bg-white shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 ${animacion}`}
        >
          <img
            src={perfil.fotoPerfil || perfil.foto || "/placeholder.png"}
            alt={perfil.nombre}
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
            <h2 className="text-2xl font-bold">{perfil.nombre}</h2>

            {perfil.distancia && (
              <p className="text-sm">📍 A {perfil.distancia.toFixed(1)} km</p>
            )}

            {perfil.similitud && (
              <p className="text-sm">🔗 Coincidencia: {(perfil.similitud * 100).toFixed(0)}%</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-5">
        <button
          onClick={handleSkip}
          className="w-16 h-16 bg-red-500 text-white rounded-full text-2xl shadow-lg active:scale-90 transition flex items-center justify-center"
        >
          ❌
        </button>

        <Link
          to={`/ver-perfil/${perfil.uid}`}
          className="w-16 h-16 bg-blue-500 text-white rounded-full text-2xl shadow-lg active:scale-90 transition flex items-center justify-center"
        >
          👁
        </Link>

        <button
          onClick={handleLike}
          className="w-16 h-16 bg-green-500 text-white rounded-full text-2xl shadow-lg active:scale-90 transition flex items-center justify-center"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
