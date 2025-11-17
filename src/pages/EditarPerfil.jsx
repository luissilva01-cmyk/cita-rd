import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthContext } from "../context/AuthContext";

export default function EditarPerfil() {
  const { usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [edad, setEdad] = useState("");
  const [intereses, setIntereses] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (usuario === undefined) return;
    if (usuario === null) {
      navigate("/login");
      return;
    }

    const fetchPerfil = async () => {
      try {
        const docRef = doc(db, "perfiles", usuario.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("✅ Perfil cargado:", data);
          setNombre(data.nombre || "");
          setBio(data.bio || "");
          setEdad(data.edad || "");
          setIntereses(data.intereses?.join(", ") || "");
          setUbicacion(data.ubicacion || "");
        }
      } catch (err) {
        console.error("❌ Error cargando perfil:", err);
        setError("No se pudo cargar tu perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [usuario, navigate]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre.trim() || !bio.trim() || !edad.trim() || !intereses.trim()) {
      setError("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const interesesArray = intereses
        .split(",")
        .map((i) => i.trim().toLowerCase())
        .filter((i) => i.length > 0);

      const docRef = doc(db, "perfiles", usuario.uid);
      await setDoc(
        docRef,
        {
          nombre,
          bio,
          edad,
          intereses: interesesArray,
          ubicacion,
          email: usuario.email,
        },
        { merge: true }
      );

      console.log("✅ Perfil actualizado correctamente.");
      navigate("/perfil");
    } catch (err) {
      console.error("❌ Error guardando perfil:", err);
      setError("No se pudo guardar tu perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (usuario === undefined || loading)
    return <p className="p-6 text-center">Cargando perfil...</p>;

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
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-purple-400"
          />

          <textarea
            placeholder="Biografía"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="text"
            placeholder="Intereses (separados por comas: cine, viajes, música)"
            value={intereses}
            onChange={(e) => setIntereses(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-purple-400"
          />

          <input
            type="text"
            placeholder="Ciudad o ubicación (opcional)"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-purple-400"
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
