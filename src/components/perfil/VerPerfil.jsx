import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";

export default function VerPerfil({ user }) {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const obtenerPerfil = async () => {
      setLoading(true);
      setError("");
      try {
        const docRef = doc(db, "perfiles", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPerfil(docSnap.data());
        } else {
          // Si no hay perfil, redirigir a crear perfil
          navigate("/crear-perfil");
        }
      } catch (error) {
        setError("Error al cargar el perfil: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPerfil();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate("/crear-perfil")}
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-200"
        >
          Crear Perfil
        </button>
      </div>
    );
  }

  if (!perfil) {
    return null;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200 px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6 text-center">
        {perfil.imagenUrl ? (
          <img
            src={perfil.imagenUrl}
            alt={`${perfil.nombre} - Foto de perfil`}
            className="w-32 h-32 rounded-full mx-auto object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto bg-gray-300 flex items-center justify-center text-gray-600">
            Sin foto
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-800">{perfil.nombre}</h2>
        <p className="text-gray-600">Edad: {perfil.edad}</p>
        <p className="text-gray-600">Género: {perfil.genero}</p>
        <p className="text-gray-600">Intereses: {perfil.intereses}</p>

        <button
          onClick={() => navigate("/crear-perfil")}
          className="mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg font-semibold transition duration-200"
          aria-label="Editar perfil"
        >
          Editar perfil
        </button>
      </section>
    </main>
  );
}
