// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Perfil() {
  const { user } = useAuth();
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "perfiles", user.uid);
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
  }, [user]);

  if (!user)
    return (
      <div className="p-6 text-center mt-20">
        <p className="text-xl mb-4">Inicia sesión para ver tu perfil.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
        >
          Ir a iniciar sesión
        </button>
      </div>
    );

  if (loading)
    return <p className="p-6 text-center mt-20">Cargando perfil...</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center mt-20">
      <h2 className="text-2xl font-bold mb-4">Mi Perfil</h2>
      {perfilData ? (
        <>
          {perfilData.fotoPerfil && (
            <img 
              src={perfilData.fotoPerfil} 
              alt={perfilData.nombre}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <p className="mb-2">
            <strong>Nombre:</strong> {perfilData.nombre}
          </p>
          <p className="mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          {perfilData.edad && (
            <p className="mb-2">
              <strong>Edad:</strong> {perfilData.edad}
            </p>
          )}
          {perfilData.descripcion && (
            <p className="mb-2">
              <strong>Bio:</strong> {perfilData.descripcion}
            </p>
          )}
          {perfilData.intereses && perfilData.intereses.length > 0 && (
            <div className="mb-4">
              <strong>Intereses:</strong>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {perfilData.intereses.map((interes, i) => (
                  <span key={i} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm">
                    {interes}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => navigate("/editar-perfil")}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            Editar perfil
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">No tienes un perfil creado aún.</p>
          <button
            onClick={() => navigate("/editar-perfil")}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            Crear perfil
          </button>
        </>
      )}
    </div>
  );
}
