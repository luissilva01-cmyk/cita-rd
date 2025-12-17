// src/pages/Perfil.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { 
  Edit3, 
  MapPin, 
  Calendar, 
  Mail, 
  Heart, 
  Settings, 
  Camera,
  Shield,
  Star,
  Users
} from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-glass text-center max-w-md"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Acceso Requerido</h2>
            <p className="text-gray-200">Inicia sesión para ver tu perfil</p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="btn-primary w-full"
          >
            Iniciar Sesión
          </button>
        </motion.div>
      </div>
    );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full"
        />
      </div>
    );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {perfilData ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header del perfil */}
            <div className="card-glass mb-8 relative overflow-hidden">
              {/* Fondo decorativo */}
              <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
              
              <div className="relative p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Foto de perfil */}
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-white/30 shadow-2xl">
                      {perfilData.fotoPerfil ? (
                        <img 
                          src={perfilData.fotoPerfil} 
                          alt={perfilData.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                          <Camera className="text-white" size={40} />
                        </div>
                      )}
                    </div>
                    {user.emailVerified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center ring-4 ring-white">
                        <Shield className="text-white" size={16} />
                      </div>
                    )}
                  </div>

                  {/* Info principal */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {perfilData.nombre}
                    </h1>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-gray-200 mb-4">
                      {perfilData.edad && (
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{perfilData.edad} años</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{user.email}</span>
                      </div>
                      {perfilData.ubicacion && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} />
                          <span>{perfilData.ubicacion}</span>
                        </div>
                      )}
                    </div>

                    {perfilData.descripcion && (
                      <p className="text-gray-200 text-lg leading-relaxed mb-6">
                        {perfilData.descripcion}
                      </p>
                    )}

                    {/* Botones de acción */}
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <button
                        onClick={() => navigate("/editar-perfil")}
                        className="btn-primary flex items-center gap-2"
                      >
                        <Edit3 size={18} />
                        Editar Perfil
                      </button>
                      <button
                        onClick={() => navigate("/preferencias")}
                        className="btn-accent flex items-center gap-2"
                      >
                        <Settings size={18} />
                        Preferencias
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de información */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Intereses */}
              {perfilData.intereses && perfilData.intereses.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card-glass"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-secondary rounded-lg">
                      <Heart className="text-white" size={20} />
                    </div>
                    <h3 className="text-xl font-semibold text-white">Mis Intereses</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {perfilData.intereses.map((interes, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="px-4 py-2 bg-gradient-accent rounded-full text-white text-sm font-medium"
                      >
                        {interes}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Estadísticas */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="card-glass"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-warm rounded-lg">
                    <Star className="text-white" size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Estadísticas</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Perfil completado</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-accent rounded-full" style={{width: '85%'}}></div>
                      </div>
                      <span className="text-white font-semibold">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">Verificación</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.emailVerified 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.emailVerified ? 'Verificado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Acciones rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              <button
                onClick={() => navigate("/matches")}
                className="card-glass text-center hover:scale-105 transition-transform"
              >
                <Heart className="text-pink-400 mx-auto mb-2" size={24} />
                <div className="text-white font-semibold">Matches</div>
              </button>
              <button
                onClick={() => navigate("/descubrir")}
                className="card-glass text-center hover:scale-105 transition-transform"
              >
                <Users className="text-blue-400 mx-auto mb-2" size={24} />
                <div className="text-white font-semibold">Descubrir</div>
              </button>
              <button
                onClick={() => navigate("/configuracion")}
                className="card-glass text-center hover:scale-105 transition-transform"
              >
                <Settings className="text-purple-400 mx-auto mb-2" size={24} />
                <div className="text-white font-semibold">Configurar</div>
              </button>
              <button
                onClick={() => navigate("/bloqueados")}
                className="card-glass text-center hover:scale-105 transition-transform"
              >
                <Shield className="text-red-400 mx-auto mb-2" size={24} />
                <div className="text-white font-semibold">Seguridad</div>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Perfil no creado */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-glass text-center max-w-2xl mx-auto"
          >
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="text-white" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                ¡Crea tu perfil!
              </h2>
              <p className="text-gray-200 text-lg leading-relaxed">
                Completa tu perfil para comenzar a conocer personas increíbles. 
                Agrega fotos, describe tus intereses y encuentra tu match perfecto.
              </p>
            </div>
            <button
              onClick={() => navigate("/editar-perfil")}
              className="btn-primary text-xl px-12 py-4"
            >
              Crear Mi Perfil
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
