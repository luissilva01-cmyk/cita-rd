// src/pages/ExplorarPerfilesMejorado.jsx
import React, { useState, useEffect } from "react";
import { db } from "../utils/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { obtenerBloqueados } from "../services/bloqueosService";
import { obtenerPreferencias } from "../services/preferenciasService";
import { filtrarPerfilesAvanzado, ordenarPorRelevancia } from "../utils/filtrarPerfilesAvanzado";
import { darLike } from "../services/likesService";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Heart, X, MapPin, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReportarModal from "../components/ReportarModal";
import MatchModal from "../components/MatchModal";

export default function ExplorarPerfilesMejorado() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [perfiles, setPerfiles] = useState([]);
  const [perfilesFiltrados, setPerfilesFiltrados] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [miPerfil, setMiPerfil] = useState(null);
  const [miUbicacion, setMiUbicacion] = useState(null);
  const [preferencias, setPreferencias] = useState(null);
  const [bloqueados, setBloqueados] = useState([]);
  const [reportarModalOpen, setReportarModalOpen] = useState(false);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (user) {
      cargarDatos();
    }
  }, [user]);

  async function cargarDatos() {
    try {
      // Cargar mi perfil
      const miPerfilRef = doc(db, "perfiles", user.uid);
      const miPerfilSnap = await getDoc(miPerfilRef);
      
      if (miPerfilSnap.exists()) {
        const perfil = miPerfilSnap.data();
        setMiPerfil(perfil);
        setMiUbicacion(perfil.ubicacion);
      }

      // Cargar preferencias
      const prefsResult = await obtenerPreferencias(user.uid);
      if (prefsResult.ok) {
        setPreferencias(prefsResult.data);
      }

      // Cargar bloqueados
      const bloqueadosList = await obtenerBloqueados(user.uid);
      setBloqueados(bloqueadosList.map(b => b.bloqueado));

      // Cargar todos los perfiles
      const perfilesSnap = await getDocs(collection(db, "perfiles"));
      const todosPerfiles = perfilesSnap.docs.map(d => ({
        id: d.id,
        ...d.data()
      }));

      setPerfiles(todosPerfiles);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (perfiles.length > 0 && preferencias && miPerfil) {
      // Filtrar perfiles
      let filtrados = filtrarPerfilesAvanzado(
        perfiles,
        preferencias,
        miUbicacion,
        bloqueados,
        user.uid
      );

      // Ordenar por relevancia
      filtrados = ordenarPorRelevancia(filtrados, miPerfil, miUbicacion);

      setPerfilesFiltrados(filtrados);
    }
  }, [perfiles, preferencias, miPerfil, bloqueados]);

  const perfilActual = perfilesFiltrados[index];

  async function handleLike() {
    if (!perfilActual) return;

    const resultado = await darLike(user.uid, perfilActual.uid);

    if (resultado.ok) {
      if (resultado.match) {
        // Mostrar modal de match
        setMatchData(perfilActual);
        setMatchModalOpen(true);
      } else {
        toast.success("❤️ Like enviado");
      }
      setIndex(i => i + 1);
    } else {
      toast.error(resultado.msg);
    }
  }

  function handleSkip() {
    setIndex(i => i + 1);
  }

  if (loading) {
    return <div className="text-center mt-20">Cargando perfiles...</div>;
  }

  if (!perfilActual) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <p className="text-xl mb-4">No hay más perfiles disponibles 😅</p>
        <button
          onClick={() => navigate("/preferencias")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg"
        >
          Ajustar preferencias
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-10 px-4">
      {/* Botón de filtros */}
      <div className="w-full max-w-md mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Descubrir</h2>
        <button
          onClick={() => navigate("/preferencias")}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition"
        >
          <Sliders size={20} />
          Filtros
        </button>
      </div>

      {/* Card del perfil */}
      <AnimatePresence mode="wait">
        <motion.div
          key={perfilActual.uid}
          initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: 10 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md relative"
        >
          {/* Imagen */}
          <div className="relative h-96">
            <img
              src={perfilActual.fotoPerfil || "/default-avatar.png"}
              alt={perfilActual.nombre}
              className="w-full h-full object-cover"
            />
            
            {/* Gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

            {/* Info sobre la imagen */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-3xl font-bold mb-1">
                {perfilActual.nombre}, {perfilActual.edad || "?"}
              </h3>
              
              {perfilActual.ubicacion && miUbicacion && (
                <div className="flex items-center gap-1 text-sm opacity-90">
                  <MapPin size={16} />
                  <span>
                    {Math.round(
                      calcularDistancia(miUbicacion, perfilActual.ubicacion)
                    )} km de distancia
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="p-6">
            {perfilActual.descripcion && (
              <p className="text-gray-700 mb-4">{perfilActual.descripcion}</p>
            )}

            {perfilActual.intereses && perfilActual.intereses.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {perfilActual.intereses.map((interes, i) => (
                  <span
                    key={i}
                    className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
                  >
                    {interes}
                  </span>
                ))}
              </div>
            )}

            {/* Botón reportar */}
            <button
              onClick={() => setReportarModalOpen(true)}
              className="text-sm text-gray-500 hover:text-red-500 transition"
            >
              Reportar usuario
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Botones de acción */}
      <div className="flex gap-6 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSkip}
          className="bg-white shadow-lg p-5 rounded-full hover:bg-gray-50 transition"
        >
          <X size={32} className="text-gray-600" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLike}
          className="bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg p-5 rounded-full hover:shadow-xl transition"
        >
          <Heart size={32} className="text-white" fill="white" />
        </motion.button>
      </div>

      {/* Contador */}
      <p className="text-gray-500 text-sm mt-4">
        {index + 1} / {perfilesFiltrados.length}
      </p>

      {/* Modales */}
      <ReportarModal
        isOpen={reportarModalOpen}
        onClose={() => setReportarModalOpen(false)}
        usuarioReportado={perfilActual}
      />

      <MatchModal
        visible={matchModalOpen}
        usuario={miPerfil}
        matchUser={matchData}
        onClose={() => setMatchModalOpen(false)}
      />
    </div>
  );
}

// Función auxiliar para calcular distancia
function calcularDistancia(coord1, coord2) {
  if (!coord1 || !coord2) return 0;
  
  const R = 6371;
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(grados) {
  return grados * (Math.PI / 180);
}
