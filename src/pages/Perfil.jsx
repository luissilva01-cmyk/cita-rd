// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import { db, auth } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const ref = doc(db, "perfiles", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPerfil(snap.data());
        } else {
          toast.error("No tienes perfil creado aún");
          navigate("/");
        }
      } catch (error) {
        toast.error("Error al cargar perfil: " + error.message);
      }
    };

    fetchPerfil();
  }, [navigate]);

  if (!perfil) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi Perfil</h2>
      <p><strong>Nombre:</strong> {perfil.nombre}</p>
      <p><strong>Bio:</strong> {perfil.bio}</p>
      <p><strong>Email:</strong> {perfil.email}</p>
      <button
        onClick={() => navigate("/editar-perfil")}
        className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold"
      >
        Editar Perfil
      </button>
    </div>
  );
}

export default Perfil;
