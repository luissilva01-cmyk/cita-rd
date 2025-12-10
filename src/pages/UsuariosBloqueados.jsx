// src/pages/UsuariosBloqueados.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { obtenerBloqueados, desbloquearUsuario } from "../services/bloqueosService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import toast from "react-hot-toast";
import { UserX } from "lucide-react";

export default function UsuariosBloqueados() {
  const { user } = useAuth();
  const [bloqueados, setBloqueados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      cargarBloqueados();
    }
  }, [user]);

  async function cargarBloqueados() {
    const lista = await obtenerBloqueados(user.uid);
    
    // Obtener información de cada usuario bloqueado
    const bloqueadosConInfo = await Promise.all(
      lista.map(async (bloqueo) => {
        const perfilRef = doc(db, "perfiles", bloqueo.bloqueado);
        const perfilSnap = await getDoc(perfilRef);
        
        return {
          ...bloqueo,
          perfil: perfilSnap.exists() ? perfilSnap.data() : null
        };
      })
    );

    setBloqueados(bloqueadosConInfo);
    setLoading(false);
  }

  async function handleDesbloquear(bloqueadoUid) {
    const resultado = await desbloquearUsuario(user.uid, bloqueadoUid);
    
    if (resultado.ok) {
      toast.success("Usuario desbloqueado");
      cargarBloqueados();
    } else {
      toast.error(resultado.msg);
    }
  }

  if (loading) {
    return <div className="text-center mt-20">Cargando...</div>;
  }

  if (bloqueados.length === 0) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <UserX size={64} className="mx-auto mb-4 text-gray-400" />
        <p className="text-xl">No has bloqueado a nadie</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🚫 Usuarios bloqueados</h1>

      <div className="space-y-4">
        {bloqueados.map((bloqueo) => (
          <div key={bloqueo.id} className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
            <img
              src={bloqueo.perfil?.fotoPerfil || "/default-avatar.png"}
              alt={bloqueo.perfil?.nombre}
              className="w-16 h-16 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {bloqueo.perfil?.nombre || "Usuario eliminado"}
              </h3>
              <p className="text-sm text-gray-500">
                Bloqueado el {bloqueo.timestamp?.toDate().toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => handleDesbloquear(bloqueo.bloqueado)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
            >
              Desbloquear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
