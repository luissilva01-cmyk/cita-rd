import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import CardPerfil from "./CardPerfil";

export default function ExplorarPerfiles() {
  const [perfiles, setPerfiles] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerPerfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "perfiles"));
        const lista = querySnapshot.docs.map((doc) => ({
          id: doc.id, // 👈 Importante para el Link
          ...doc.data(),
        }));
        setPerfiles(lista);
      } catch (error) {
        console.error("Error al obtener perfiles:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerPerfiles();
  }, []);

  if (cargando) {
    return <p className="text-center text-gray-500 mt-10">Cargando perfiles...</p>;
  }

  if (perfiles.length === 0) {
    return <p className="text-center text-gray-500 mt-10">No hay perfiles aún.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Explorar Perfiles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {perfiles.map((perfil) => (
          <CardPerfil key={perfil.id} perfil={perfil} />
        ))}
      </div>
    </div>
  );
}
