// src/pages/ExplorarPerfilesV2.jsx
import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../utils/firebase";
import { filtrarPerfiles } from "../utils/filtrarPerfiles";
import { useAuth } from "../context/AuthContext";

export default function ExplorarPerfilesV2() {
  const { usuario } = useAuth();
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPerfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "perfiles"));
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        if (usuario) {
          const filtrados = filtrarPerfiles({
            usuarioActual: {
              uid: usuario.uid,
              intereses: usuario.intereses || [],
              ubicacion: usuario.ubicacion || null,
            },
            perfiles: lista,
          });

          setPerfiles(filtrados);
        } else {
          setPerfiles(lista);
        }
      } catch (error) {
        console.error("Error al cargar perfiles:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPerfiles();
  }, [usuario]);

  if (cargando) return <p className="text-center mt-10">Cargando perfiles...</p>;
  if (perfiles.length === 0) return <p className="text-center mt-10">No hay coincidencias aún 😅</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Descubrir gente nueva 💫</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {perfiles.map((p) => (
          <div key={p.id} className="p-4 border rounded-xl shadow hover:shadow-lg transition">
            <img
              src={p.fotoPerfil || "/placeholder.png"}
              alt={p.nombre}
              className="w-full h-48 object-cover rounded-lg mb-2"
            />
            <h2 className="text-lg font-semibold">{p.nombre}</h2>
            {p.similitud && (
              <p className="text-sm text-gray-600">
                Coincidencia: {(p.similitud * 100).toFixed(0)}%
              </p>
            )}
            {p.distancia && (
              <p className="text-sm text-gray-600">A {(p.distancia).toFixed(1)} km de distancia</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
