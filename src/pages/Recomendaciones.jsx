// src/pages/Recomendaciones.jsx
import { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { darLike, yaLeDioLike, hayMatch } from "../services/likesService";
import TinderCard from "react-tinder-card";

export default function Recomendaciones() {
  const { user } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [index, setIndex] = useState(0); // índice tarjeta actual

  useEffect(() => {
    async function cargar() {
      try {
        const snapshot = await getDocs(collection(db, "perfiles"));
        let lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // excluir usuario actual
        lista = lista.filter((p) => p.uid !== user?.uid);

        // calcular compatibilidad
        lista = lista.map((p) => ({
          ...p,
          similitud: Math.random(), // ejemplo: luego reemplazamos por calculadora real
          distancia: (Math.random() * 20 + 1).toFixed(1), // distancia random 1-20 km
        }));

        setPerfiles(lista);
      } catch (err) {
        console.error("Error cargando perfiles:", err);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [user]);

  async function manejarLike(targetUID) {
    if (!user) return;

    const ya = await yaLeDioLike(user.uid, targetUID);
    if (!ya) {
      await darLike(user.uid, targetUID);
      const match = await hayMatch(user.uid, targetUID);
      if (match) alert("🎉 ¡Match! Ambos se gustaron ❤️");
    }

    setIndex((prev) => prev + 1);
  }

  function manejarNope() {
    setIndex((prev) => prev + 1);
  }

  if (cargando) return <p className="text-center mt-10">Cargando...</p>;
  if (index >= perfiles.length)
    return <p className="text-center mt-10">No hay más recomendaciones 😅</p>;

  return (
    <div className="flex flex-col items-center p-4 select-none">
      <h1 className="text-3xl font-bold mb-6">Recomendaciones ✨</h1>

      <div className="relative w-80 h-[450px]">
        {perfiles
          .slice(index, index + 3) // mostrar stack de 3 tarjetas
          .reverse()
          .map((perfil, i) => (
            <TinderCard
              key={perfil.uid}
              onSwipe={(dir) => {
                if (dir === "right") manejarLike(perfil.uid);
                if (dir === "left") manejarNope();
              }}
              preventSwipe={["up", "down"]}
              className="absolute w-full h-full"
            >
              <div
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border transform transition-all duration-300 ${
                  i === 0 ? "scale-100" : i === 1 ? "scale-95" : "scale-90"
                }`}
              >
                <img
                  src={perfil.foto || "/placeholder.png"}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {perfil.nombre}
                    <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                      {(perfil.similitud * 100).toFixed(0)}% match
                    </span>
                  </h2>

                  <p className="text-gray-600 text-sm mt-1">
                    A {perfil.distancia} km de distancia
                  </p>

                  <p className="text-gray-700 mt-3">
                    {perfil.descripcion || "Sin descripción"}
                  </p>
                </div>
              </div>
            </TinderCard>
          ))}
      </div>

      {/* Botones estilo Tinder */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={manejarNope}
          className="w-16 h-16 bg-gray-200 hover:bg-gray-300 text-3xl rounded-full shadow flex items-center justify-center"
        >
          ❌
        </button>

        <button
          onClick={() => manejarLike(perfiles[index].uid)}
          className="w-16 h-16 bg-pink-500 hover:bg-pink-600 text-3xl text-white rounded-full shadow flex items-center justify-center"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}
