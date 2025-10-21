// src/components/perfil/VerPerfil.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../../utils/firebase"; // ← CORREGIDO
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function VerPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login"); // redirigir si no está logueado
        return;
      }

      const docRef = doc(db, "perfiles", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPerfil(docSnap.data());
      } else {
        setPerfil(null);
      }
      setLoading(false);
    };

    fetchPerfil();
  }, [navigate]);

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  if (!perfil)
    return (
      <div className="text-center mt-10">
        <p>No tienes perfil creado.</p>
        <button
          onClick={() => navigate("/perfil/crear")}
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Crear perfil
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-4">{perfil.nombre}</h2>
        <p className="text-gray-700 mb-2">{perfil.email}</p>
        <p className="text-gray-600 mb-6">{perfil.bio}</p>

        <button
          onClick={() => navigate("/perfil/crear")}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
        >
          Editar perfil
        </button>
      </div>
    </div>
  );
}
