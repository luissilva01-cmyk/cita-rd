// src/pages/EditarPerfil.jsx
import { useState, useEffect } from "react";
import { db, auth } from "../utils/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function EditarPerfil() {
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "perfiles", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setNombre(data.nombre || "");
          setBio(data.bio || "");
        }
      } catch (error) {
        toast.error("Error al cargar perfil: " + error.message);
      }
    };

    fetchPerfil();
  }, []);

  const handleEditarPerfil = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "perfiles", user.uid);
      await updateDoc(ref, { nombre, bio });

      toast.success("Perfil actualizado ✅");
      navigate("/perfil");
    } catch (error) {
      toast.error("Error al actualizar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Perfil</h2>
      <form onSubmit={handleEditarPerfil} className="space-y-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-400"
        />
        <textarea
          placeholder="Tu bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full border rounded-lg p-2 h-24 focus:ring-2 focus:ring-orange-400"
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

export default EditarPerfil;
