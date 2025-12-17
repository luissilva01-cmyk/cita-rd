import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Shield, Sparkles, ArrowRight, Star, Users2, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir usuarios logueados a la app principal
  useEffect(() => {
    if (user) {
      navigate("/swipe");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Heart,
      title: "Matches Inteligentes",
      description: "Algoritmo avanzado que encuentra tu pareja perfecta basado en compatibilidad real"
    },
    {
      icon: MessageCircle,
      title: "Chat en Tiempo Real",
      description: "Conversaciones fluidas con mensajes, fotos, stickers y videollamadas"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Verificación de perfiles, reportes y herramientas de seguridad avanzadas"
    },
    {
      icon: Sparkles,
      title: "Experiencia Premium",
      description: "Funciones exclusivas, filtros avanzados y prioridad en matches"
    }
  ];

  const stats = [
    { number: "15K+", label: "Usuarios Activos", icon: Users2 },
    { number: "800+", label: "Matches Diarios", icon: Heart },
    { number: "4.8", label: "Calificación", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex justify-center items-center gap-3 mb-6">
                <Heart className="text-pink-500" size={40} />
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900">
                  Cita<span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">RD</span>
                </h1>
                <Heart className="text-pink-500" size={40} />
              </div>
              
              <p className="text-xl md:text-2xl text-gray-600 font-medium mb-4">
                Encuentra tu amor verdadero en República Dominicana
              </p>
              
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                La plataforma de citas más confiable del país. Conecta con personas auténticas 
                y construye relaciones significativas con nuestra tecnología de matching inteligente.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group flex items-center gap-3"
              >
                Comenzar Gratis
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              
              <button
                onClick={() => navigate("/login")}
                className="bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold border-2 border-gray-200 hover:border-pink-300 hover:text-pink-600 transition-all duration-300"
              >
                Ya tengo cuenta
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="text-pink-500" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir CitaRD?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre las características que nos hacen la mejor opción para encontrar el amor
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <feature.icon size={32} className="text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <Zap className="text-white mx-auto mb-6" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ¿Listo para encontrar el amor?
            </h2>
            <p className="text-xl text-pink-100 mb-8 leading-relaxed">
              Únete a miles de dominicanos que ya encontraron su pareja ideal. 
              Tu historia de amor comienza con un simple clic.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="bg-white text-pink-600 px-10 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-3"
            >
              Crear mi perfil gratis
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-center">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="text-pink-500" size={24} />
            <span className="text-2xl font-bold text-white">
              Cita<span className="text-pink-500">RD</span>
            </span>
          </div>
          <p className="text-gray-400">
            © 2024 CitaRD. Hecho con ❤️ en República Dominicana
          </p>
        </div>
      </footer>
    </div>
  );
}
