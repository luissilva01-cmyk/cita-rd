import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";

export default function EditarPerfil() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Esperamos hasta que AuthProvider determine si hay usuario
    if (usuario === undefined) {
      console.log("⏳ Esperando estado de autenticación...");
      return;
    }

    if (usuario === null) {
      console.warn("⚠️ No hay usuario logueado, redirigiendo a login...");
      navigate("/login");
      return;
    }

    const fetchPerfil = async () => {
      try {
        const docRef = doc(db, "perfiles", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("✅ Perfil cargado desde Firestore:", data);
          setNombre(data.nombre || "");
          setBio(data.bio || "");
        } else {
          console.log("🆕 No existe perfil previo, empezando vacío.");
        }
      } catch (err) {
        console.error("❌ Error cargando perfil:", err);
        setError("No se pudo cargar tu perfil. Revisa la consola.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [usuario, navigate]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !bio.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Guardando perfil con datos:", { nombre, bio, email: usuario.email });

      const docRef = doc(db, "perfiles", usuario.uid);
      await setDoc(
        docRef,
        {
          nombre,
          bio,
          email: usuario.email,
        },
        { merge: true }
      );

      console.log("✅ Perfil guardado correctamente.");
      navigate("/perfil");
    } catch (err) {
      console.error("❌ Error guardando perfil:", err);
      setError("No se pudo guardar tu perfil. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  if (usuario === undefined) {
    return <p className="p-6 text-center">Cargando autenticación...</p>;
  }

  if (loading) {
    return <p className="p-6 text-center">Cargando perfil...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Editar Perfil</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleGuardar} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold transition-all duration-300"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
