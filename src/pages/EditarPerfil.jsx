import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { useAuth } from "../context/AuthContext";
import GaleriaFotos from "../components/GaleriaFotos";
import Icebreakers from "../components/Icebreakers";
import SpotifyIntegracion from "../components/SpotifyIntegracion";

export default function EditarPerfil() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [edad, setEdad] = useState("");
  const [intereses, setIntereses] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [fotos, setFotos] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [datosSpotify, setDatosSpotify] = useState({ artistas: [], canciones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      navigate("/login");
      return;
    }

    const fetchPerfil = async () => {
      try {
        const docRef = doc(db, "perfiles", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("✅ Perfil cargado:", data);
          setNombre(data.nombre || "");
          setBio(data.bio || data.descripcion || "");
          setEdad(data.edad || "");
          setIntereses(data.intereses?.join(", ") || "");
          setUbicacion(data.ubicacion || "");
          setFotos(data.fotos || [data.fotoPerfil].filter(Boolean) || []);
          setPrompts(data.prompts || []);
          setDatosSpotify(data.spotify || { artistas: [], canciones: [] });
        }
      } catch (err) {
        console.error("❌ Error cargando perfil:", err);
        setError("No se pudo cargar tu perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerfil();
  }, [user, navigate]);

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

      const docRef = doc(db, "perfiles", user.uid);
      await setDoc(
        docRef,
        {
          uid: user.uid,
          nombre,
          bio,
          descripcion: bio,
          edad: parseInt(edad),
          intereses: interesesArray,
          ubicacion,
          email: user.email,
          fotos,
          fotoPerfil: fotos[0] || null, // Primera foto como principal
          prompts,
          spotify: datosSpotify,
          fechaActualizacion: new Date(),
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

  if (user === undefined || loading)
    return <p className="p-6 text-center mt-20">Cargando perfil...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 pt-20">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Editar Perfil</h2>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleGuardar} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400"
            required
          />

          <textarea
            placeholder="Biografía"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400 h-24"
            required
          />

          <input
            type="number"
            placeholder="Edad"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400"
            min="18"
            max="99"
            required
          />

          <input
            type="text"
            placeholder="Intereses (separados por comas: cine, viajes, música)"
            value={intereses}
            onChange={(e) => setIntereses(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400"
            required
          />

          <input
            type="text"
            placeholder="Ciudad o ubicación (opcional)"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="border px-4 py-2 rounded focus:ring-2 focus:ring-orange-400"
          />

          {/* Galería de Fotos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos de perfil
            </label>
            <GaleriaFotos 
              fotos={fotos}
              onFotosChange={setFotos}
              editable={true}
              maxFotos={6}
            />
          </div>

          {/* Icebreakers */}
          <div>
            <Icebreakers
              prompts={prompts}
              onPromptsChange={setPrompts}
              editable={true}
              maxPrompts={3}
            />
          </div>

          {/* Integración Spotify */}
          <div>
            <SpotifyIntegracion onDatosActualizados={handleSpotifyData} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}

  const handleSpotifyData = (datos) => {
    setDatosSpotify(datos);
  };