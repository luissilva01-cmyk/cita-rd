import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { subirImagenACloudinary } from "../../utils/cloudinary";
import { useAuth } from "../../context/AuthContext"; // ✅

function CrearPerfil() {
  const { user } = useAuth(); // obtenemos usuario desde contexto
  const [nombre, setNombre] = useState("");
  const [bio, setBio] = useState("");
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const manejarArchivo = (e) => {
    if (e.target.files[0]) setFoto(e.target.files[0]);
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();

    if (!user) return alert("Debes iniciar sesión");

    if (!nombre.trim() || !bio.trim()) {
      alert("Completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      let urlFoto = "";
      if (foto) urlFoto = await subirImagenACloudinary(foto);

      await setDoc(doc(db, "perfiles", user.uid), {
        uid: user.uid,
        nombre,
        bio,
        foto: urlFoto,
        email: user.email,
        creadoEn: new Date(),
      });

      navigate("/perfil");
    } catch (error) {
      console.error("Error guardando perfil:", error);
      alert("Hubo un error al guardar tu perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Crear Perfil</h2>
      <form onSubmit={guardarPerfil} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Escribe algo sobre ti..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input type="file" onChange={manejarArchivo} className="border p-2" />
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
        >
          {loading ? "Guardando..." : "Guardar Perfil"}
        </button>
      </form>
    </div>
  );
}

export default CrearPerfil;
