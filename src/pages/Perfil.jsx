// src/pages/Perfil.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Perfil() {
  const { usuario } = useContext(AuthContext);
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!usuario) return;
      try {
        const docRef = doc(db, "perfiles", usuario.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPerfilData(docSnap.data());
        } else {
          setPerfilData(null);
        }
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, [usuario]);

  if (!usuario)
    return (
      <div className="p-6 text-center">
        <p>Inicia sesión para ver tu perfil.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );

  if (loading)
    return <p className="p-6 text-center">Cargando perfil...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
      {perfilData ? (
        <>
          <p>
            <strong>Nombre:</strong> {perfilData.nombre}
          </p>
          <p>
            <strong>Email:</strong> {usuario.email}
          </p>
          <p>
            <strong>Bio:</strong> {perfilData.bio}
          </p>

          <button
            onClick={() => navigate("/editar-perfil")}
            className="mt-6 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Editar perfil
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">No tienes un perfil creado aún.</p>
          <button
            onClick={() => navigate("/editar-perfil")}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Crear perfil
          </button>
        </>
      )}
    </div>
  );
}
