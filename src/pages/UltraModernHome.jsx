import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, MessageCircle, User, Sparkles } from 'lucide-react';

export default function UltraModernHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center py-20 px-6">
          <div className="w-20 h-20 bg-gradient-to-r from-coral-500 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{background: 'linear-gradient(to right, #FF6B6B, #FFD93D)'}}>
            <Heart className="text-white" size={32} />
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4">
            ¡Bienvenido a Ta' Pa' Ti!
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Cuando alguien sí te elige. La app de citas #1 en República Dominicana donde encuentras quien ta' pa' ti.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              style={{background: 'linear-gradient(to right, #FF6B6B, #FFD93D)'}}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #FF5252, #FFC107)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #FF6B6B, #FFD93D)'}
            >
              <Sparkles className="inline mr-2" size={20} />
              Comenzar ahora
            </Link>
            
            <Link
              to="/login"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            ¿Por qué elegir Ta' Pa' Ti?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(to right, #FF6B6B, #FF8A80)'}}>
                <Heart className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Matches Reales</h3>
              <p className="text-gray-300">
                Algoritmo inteligente que te conecta con personas que sí ta' pa' ti en tu área.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(to right, #FFD93D, #FFC107)'}}>
                <MessageCircle className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Chat Seguro</h3>
              <p className="text-gray-300">
                Mensajes encriptados y funciones de seguridad para proteger tu privacidad.
              </p>
            </div>
            
            <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(to right, #FF6B6B, #FFD93D)'}}>
                <Users className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Comunidad Activa</h3>
              <p className="text-gray-300">
                Miles de dominicanos buscando quien sí los elige y conexiones genuinas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para encontrar quien ta' pa' ti?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Únete a miles de dominicanos que ya encontraron quien sí los elige en Ta' Pa' Ti.
          </p>
          
          <Link
            to="/register"
            className="inline-flex items-center text-white px-12 py-5 rounded-2xl font-semibold text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{background: 'linear-gradient(to right, #FF6B6B, #FFD93D)'}}
            onMouseEnter={(e) => e.target.style.background = 'linear-gradient(to right, #FF5252, #FFC107)'}
            onMouseLeave={(e) => e.target.style.background = 'linear-gradient(to right, #FF6B6B, #FFD93D)'}
          >
            <Heart className="mr-3" size={24} />
            Crear cuenta gratis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/20 py-8 px-6 text-center">
        <p className="text-gray-300">
          © 2024 Ta' Pa' Ti. Hecho con ❤️ en República Dominicana.
        </p>
      </div>
    </div>
  );
}