import React, { useState } from 'react';
import { Heart, Sparkles, Shield, MessageCircle, Users, Zap, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const [email, setEmail] = useState('');

  const features = [
    {
      icon: Sparkles,
      title: 'IA de Compatibilidad',
      description: 'Algoritmo inteligente que encuentra tu match perfecto basado en intereses y personalidad',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Verificación Real',
      description: 'Perfiles verificados con fotos reales. Sin catfish, sin sorpresas',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageCircle,
      title: 'Chat en Tiempo Real',
      description: 'Mensajes instantáneos, fotos, videos y mensajes de voz',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Users,
      title: 'Stories Privadas',
      description: 'Comparte momentos especiales solo con tus matches',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Usuarios Activos' },
    { value: '50K+', label: 'Matches Creados' },
    { value: '95%', label: 'Satisfacción' },
    { value: '24/7', label: 'Soporte' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4">
              Ta' Pa' Ti
            </h1>
            <p className="text-xl sm:text-2xl text-purple-200 font-light">
              Cuando alguien sí te elige
            </p>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              La app de citas que usa inteligencia artificial para encontrar tu match perfecto. 
              Conexiones reales, personas verificadas, matches que importan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold text-lg shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Comenzar Gratis
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Ver Características
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm sm:text-base text-purple-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ¿Por qué Ta' Pa' Ti?
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Tecnología de punta para ayudarte a encontrar conexiones reales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-purple-200">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Cómo Funciona
            </h2>
            <p className="text-xl text-purple-200">
              Tres simples pasos para encontrar tu match perfecto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Crea tu Perfil',
                description: 'Sube tus mejores fotos y cuéntanos sobre ti. Nuestro sistema de verificación asegura perfiles reales.',
                icon: Users
              },
              {
                step: '2',
                title: 'Descubre Matches',
                description: 'Nuestra IA analiza compatibilidad y te muestra personas que realmente encajan contigo.',
                icon: Sparkles
              },
              {
                step: '3',
                title: 'Conecta y Chatea',
                description: 'Cuando hay match mutuo, comienza la conversación. Chat, fotos, videos y más.',
                icon: MessageCircle
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 h-full">
                  <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className="mt-8">
                    <item.icon className="w-12 h-12 text-purple-300 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-purple-200">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Historias de Éxito
            </h2>
            <p className="text-xl text-purple-200">
              Miles de personas han encontrado su match perfecto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'María & Carlos',
                text: 'Nos conocimos en Ta\' Pa\' Ti hace 6 meses. La compatibilidad que mostró la app era del 92% y tenían razón!',
                rating: 5
              },
              {
                name: 'Ana',
                text: 'Después de probar otras apps, Ta\' Pa\' Ti fue diferente. Perfiles reales, personas genuinas. Encontré a mi persona especial.',
                rating: 5
              },
              {
                name: 'Roberto',
                text: 'El sistema de IA realmente funciona. Los matches que recibo son mucho más compatibles que en otras apps.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-white mb-4 italic">"{testimonial.text}"</p>
                <p className="text-purple-300 font-semibold">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 shadow-2xl"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ¿Listo para encontrar tu match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Únete a miles de personas que ya encontraron conexiones reales
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              Comenzar Ahora - Es Gratis
              <Zap className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
                <span className="text-white font-bold text-xl">Ta' Pa' Ti</span>
              </div>
              <p className="text-purple-200 text-sm">
                Cuando alguien sí te elige
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Compañía</h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-purple-200 text-sm">
                <li><a href="/terms-of-service.html" className="hover:text-white transition-colors">Términos de Servicio</a></li>
                <li><a href="/privacy-policy.html" className="hover:text-white transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-purple-200 text-sm">
            <p>&copy; 2026 Ta' Pa' Ti. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
