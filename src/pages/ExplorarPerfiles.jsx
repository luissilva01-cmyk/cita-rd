// src/pages/ExplorarPerfiles.jsx
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  darLike,
  yaLeDioLike,
  hayMatch
} from "../services/likesService";

export default function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function cargarPerfiles() {
      try {
        const querySnapshot = await getDocs(collection(db, "perfiles"));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const filtrados = lista.filter(p => p.uid !== user?.uid);

        setPerfiles(filtrados);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando perfiles:", err);
      }
    }

    cargarPerfiles();
  }, [user]);

  async function handleLike(toUID) {
    if (!user) {
      alert("Debes iniciar sesión para dar like.");
      return;
    }

    const yaExiste = await yaLeDioLike(user.uid, toUID);
    if (yaExiste) {
      alert("Ya le diste like antes.");
      return;
    }

    const btn = document.querySelector(`[data-like="${toUID}"]`);

    if (btn) {
      btn.classList.add("btn-vibrate");

      setTimeout(() => {
        btn.classList.remove("btn-vibrate");
      }, 300);

      const anim = btn.querySelector(".heart-animation");
      anim.classList.remove("hidden");
      anim.classList.add("animate-heart");

      setTimeout(() => {
        anim.classList.remove("animate-heart");
        anim.classList.add("hidden");
      }, 900);
    }

    const resultado = await darLike(user.uid, toUID);

    if (resultado.ok) {
      alert("❤️ ¡Like enviado!");

      const esMatch = await hayMatch(user.uid, toUID);
      if (esMatch) {
        alert("🎉 ¡Match! Ambos se gustaron ❤️");
      }
    }
  }

  if (loading) return <p className="text-center mt-10">Cargando perfiles...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Explorar Perfiles</h1>

      <div className="grid grid-cols-1 gap-6">
        {perfiles.map(perfil => (
          <div
            key={perfil.id}
            className="p-4 bg-white shadow rounded-xl flex flex-col items-center"
          >
            <img
              src={perfil.foto || "https://via.placeholder.com/150"}
              alt="foto"
              className="w-32 h-32 object-cover rounded-full shadow"
            />

            <h2 className="text-xl font-semibold mt-3">
              {perfil.nombre || "Usuario"}
            </h2>

            <p className="text-gray-600">
              {perfil.descripcion || "Sin descripción"}
            </p>

            <div className="flex gap-3 mt-4">
              <Link
                to={`/ver-perfil/${perfil.uid}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow"
              >
                Ver Perfil
              </Link>

              <button
                data-like={perfil.uid}
                onClick={() => handleLike(perfil.uid)}
                className="relative px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:scale-105 transition overflow-hidden"
              >
                ❤️ Like
                <span className="absolute inset-0 pointer-events-none heart-animation hidden"></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
