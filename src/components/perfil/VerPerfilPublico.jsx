import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

export default function VerPerfilPublico() {
  const { id } = useParams(); // 👈 ID de la URL
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const docRef = doc(db, "perfiles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPerfil(docSnap.data());
        } else {
          setPerfil(null);
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [id]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Cargando perfil...</p>;
  }

  if (!perfil) {
    return <p className="text-center mt-10 text-red-500">Perfil no encontrado</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 mt-10">
      {/* Foto */}
      {perfil.foto ? (
        <img
          src={perfil.foto}
          alt={perfil.nombre}
          className="w-full h-64 object-cover rounded-xl"
        />
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-xl">
          Sin foto
        </div>
      )}

      {/* Info */}
      <h2 className="text-2xl font-bold mt-4">
        {perfil.nombre} {perfil.edad && `, ${perfil.edad}`}
      </h2>
      <p className="text-gray-600">{perfil.ubicacion || "Ubicación no especificada"}</p>

      <h3 className="mt-4 font-semibold text-lg">Sobre mí</h3>
      <p className="mt-2 text-gray-700">{perfil.descripcion || "Sin descripción"}</p>
    </div>
  );
}
