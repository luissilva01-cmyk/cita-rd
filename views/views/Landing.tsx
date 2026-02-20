import React from 'react';
import { Heart, Sparkles, Shield, MessageCircle, Users, Zap, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onGetStarted: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted }) => {
  const features = [
    {
      icon: Sparkles,
      title: 'IA de Compatibilidad',
      description: 'Algoritmo inteligente que encuentra tu match perfecto basado en intereses y personalidad',
      color: '#ff8052'
    },
    {
      icon: Shield,
      title: 'Verificación Real',
      description: 'Perfiles verificados con fotos reales. Sin catfish, sin sorpresas',
      color: '#ffc107'
    },
    {
      icon: MessageCircle,
      title: 'Chat en Tiempo Real',
      description: 'Mensajes instantáneos, fotos, videos y mensajes de voz',
      color: '#ff8052'
    },
    {
      icon: Users,
      title: 'Stories Privadas',
      description: 'Comparte momentos especiales solo con tus matches',
      color: '#ffc107'
    }
  ];

  const stats = [
    { icon: Users, label: 'Conexiones Auténticas', description: 'Personas reales buscando relaciones genuinas' },
    { icon: Shield, label: 'Perfiles Verificados', description: 'Sistema de verificación para tu seguridad' },
    { icon: Heart, label: 'Comunidad Segura', description: 'Ambiente respetuoso y protegido' },
    { icon: MessageCircle, label: 'Soporte Dedicado', description: 'Estamos aquí para ayudarte' }
  ];

  const howItWorks = [
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
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white overflow-x-hidden">
      {/* Hero Section Mejorado */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{backgroundColor: 'rgba(255, 128, 82, 0.15)'}}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000" style={{backgroundColor: 'rgba(255, 193, 7, 0.15)'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 shadow-2xl" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4">
              Ta' Pa' Ti
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light">
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
            <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              La app de citas que usa inteligencia artificial para encontrar tu match perfecto. 
              Conexiones reales, personas verificadas, matches que importan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group px-8 py-4 text-white rounded-full font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)', boxShadow: '0 20px 60px rgba(255, 128, 82, 0.3)'}}
              >
                Comenzar Gratis
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
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
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-xs sm:text-sm text-gray-600">{stat.description}</div>
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
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </div>

      {/* Features Section Mejorado */}
      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              ¿Por qué Ta' Pa' Ti?
            </h2>
            <div className="w-24 h-1.5 rounded-full mx-auto mb-4" style={{background: 'linear-gradient(90deg, #ff8052 0%, #ffc107 100%)'}}></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                className="bg-white rounded-3xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{backgroundColor: feature.color}}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works - Versión Vertical Mejorada */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-center">
            Cómo Funciona
          </h2>
          <div className="w-24 h-1.5 rounded-full mx-auto mb-4" style={{background: 'linear-gradient(90deg, #ff8052 0%, #ffc107 100%)'}}></div>
          <p className="text-xl text-gray-600 text-center mb-16">
            Tres simples pasos para encontrar tu match perfecto
          </p>

          <div className="relative flex flex-col gap-12">
            {/* Vertical Line */}
            <div className="absolute left-7 top-0 bottom-0 w-0.5 -z-10 hidden sm:block" style={{background: 'linear-gradient(180deg, #ff8052 0%, #ffc107 100%)'}}></div>

            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-black text-xl shadow-lg" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
                  {item.step}
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-200 flex-1 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <item.icon className="w-6 h-6" style={{color: '#ff8052'}} />
                    <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials - Horizontal Scroll */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Historias de Éxito
            </h2>
            <div className="w-24 h-1.5 rounded-full mx-auto mb-4" style={{background: 'linear-gradient(90deg, #ff8052 0%, #ffc107 100%)'}}></div>
            <p className="text-xl text-gray-600">
              Miles de personas han encontrado su match perfecto
            </p>
          </div>

          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
            {[
              {
                name: 'María & Carlos',
                location: 'Santo Domingo',
                text: 'Nos conocimos en Ta\' Pa\' Ti hace 6 meses. La compatibilidad que mostró la app era del 92% y tenían razón!',
                rating: 5
              },
              {
                name: 'Ana',
                location: 'Santiago',
                text: 'Después de probar otras apps, Ta\' Pa\' Ti fue diferente. Perfiles reales, personas genuinas. Encontré a mi persona especial.',
                rating: 5
              },
              {
                name: 'Roberto',
                location: 'La Vega',
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
                className="flex-shrink-0 w-80 bg-white rounded-3xl p-6 border border-gray-200 snap-center shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-900 font-semibold">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12 shadow-2xl"
            style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              ¿Listo para encontrar tu match?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Únete a miles de personas que ya encontraron conexiones reales
            </p>
            <button
              onClick={onGetStarted}
              className="px-10 py-5 bg-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              style={{color: '#ff8052'}}
            >
              Comenzar Ahora - Es Gratis
              <Zap className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6" style={{color: '#ff8052'}} fill="currentColor" />
                <span className="text-gray-900 font-bold text-xl">Ta' Pa' Ti</span>
              </div>
              <p className="text-gray-600 text-sm">
                Cuando alguien sí te elige
              </p>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#features" className="hover:text-gray-900 transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Compañía</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><a href="/terms-of-service.html" className="hover:text-gray-900 transition-colors">Términos de Servicio</a></li>
                <li><a href="/privacy-policy.html" className="hover:text-gray-900 transition-colors">Política de Privacidad</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2026 Ta' Pa' Ti. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
