// src/pages/EditarPerfil.jsx
import { useState, useEffect } from "react";
import { db, auth, parseFirebaseError } from "../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EditarPerfil() {
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "perfiles", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setNombre(data.nombre || "");
            setBio(data.bio || "");
          }
        } catch (err) {
          setError(parseFirebaseError(err));
        }
      }
    };
    fetchPerfil();
  }, []);

  const handleActualizarPerfil = async (e) => {
    e.preventDefault();
    if (!nombre || !bio) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "perfiles", user.uid);
        await updateDoc(docRef, { nombre, bio });
        navigate("/ver-perfil");
      }
    } catch (err) {
      setError(parseFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Editar Perfil
        </h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleActualizarPerfil} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={`border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
              error.includes("campos") ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={`border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
              error.includes("campos") ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-purple-400"
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300 flex justify-center items-center"
          >
            {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span> : null}
            {loading ? "Guardando..." : "Actualizar"}
          </button>
        </form>
      </div>
    </div>
  );
}
