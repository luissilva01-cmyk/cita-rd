import React from 'react';
import { Heart, Sparkles, Shield, MessageCircle, Users, Zap, ChevronRight, Star, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onGetStarted: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const Landing: React.FC<LandingProps> = ({ onGetStarted, onShowLogin, onShowRegister }) => {
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
                onClick={onShowRegister}
                className="group px-8 py-4 text-white rounded-full font-semibold text-lg shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
                style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)', boxShadow: '0 20px 60px rgba(255, 128, 82, 0.3)'}}
              >
                Comenzar Gratis
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onShowLogin}
                className="px-8 py-4 bg-white text-gray-900 rounded-full font-semibold text-lg border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                Iniciar Sesión
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

      {/* App Preview Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{backgroundColor: '#ff8052'}}></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20" style={{backgroundColor: '#ffc107'}}></div>
            
            {/* Image container with gradient border */}
            <div className="relative rounded-3xl p-1" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
              <div className="bg-white rounded-3xl p-8 sm:p-12">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  {/* Text content */}
                  <div className="order-2 md:order-1">
                    <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                      Diseñada para conectar
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Una experiencia intuitiva y moderna que hace que encontrar tu match perfecto sea natural y divertido.
                    </p>
                    <ul className="space-y-4">
                      {[
                        'Interfaz limpia y fácil de usar',
                        'Swipe inteligente con IA',
                        'Chat en tiempo real',
                        'Stories para compartir momentos'
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Image mockup */}
                  <div className="order-1 md:order-2 relative">
                    <div className="relative mx-auto max-w-sm">
                      {/* Phone frame */}
                      <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-gray-900 bg-gray-900">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-10"></div>
                        
                        {/* Screen content - Placeholder gradient */}
                        <div className="aspect-[9/19.5] bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                          {/* Simulated app interface */}
                          <div className="absolute inset-0 flex flex-col">
                            {/* Header */}
                            <div className="p-4 flex items-center justify-between">
                              <div className="w-10 h-10 rounded-full" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}></div>
                              <div className="text-xl font-bold text-gray-900">Ta' Pa' Ti</div>
                              <div className="w-10 h-10"></div>
                            </div>
                            
                            {/* Card stack simulation */}
                            <div className="flex-1 flex items-center justify-center p-6">
                              <div className="relative w-full max-w-xs aspect-[3/4]">
                                {/* Background cards */}
                                <div className="absolute inset-0 rounded-3xl bg-gray-200 transform rotate-6 scale-95 opacity-30"></div>
                                <div className="absolute inset-0 rounded-3xl bg-gray-300 transform rotate-3 scale-97 opacity-50"></div>
                                
                                {/* Main card */}
                                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Heart className="w-20 h-20 text-white opacity-20" />
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <div className="text-white">
                                      <div className="text-2xl font-bold mb-1">Tu Match</div>
                                      <div className="text-sm opacity-90">Encuentra conexiones reales</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Bottom actions */}
                            <div className="p-6 flex justify-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <X className="w-6 h-6 text-red-500" />
                              </div>
                              <div className="w-16 h-16 rounded-full shadow-lg flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}>
                                <Heart className="w-7 h-7 text-white" fill="currentColor" />
                              </div>
                              <div className="w-14 h-14 rounded-full bg-white shadow-lg flex items-center justify-center">
                                <Star className="w-6 h-6 text-blue-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Floating elements */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center"
                        style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}
                      >
                        <Sparkles className="w-8 h-8 text-white" />
                      </motion.div>
                      
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center"
                      >
                        <MessageCircle className="w-8 h-8" style={{color: '#ff8052'}} />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
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
                <li><a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Términos de Servicio</a></li>
                <li><a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Política de Privacidad</a></li>
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
