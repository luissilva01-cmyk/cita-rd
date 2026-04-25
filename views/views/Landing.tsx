import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Shield, MessageCircle, ChevronRight, MapPin, Check, Star } from 'lucide-react';
import Logo from '../../components/Logo';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf8f6] overflow-x-hidden">

      {/* ═══ HERO — Mobile-first, above the fold ═══ */}
      <div className="relative min-h-[100dvh] flex flex-col">
        {/* Background — gradient with warm tones */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, #1a0a05 0%, #2d1810 30%, #ff805240 70%, #ffc10730 100%)'
        }}>
          {/* Decorative blurred circles */}
          <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full blur-[100px] opacity-40" style={{ background: '#ff8052' }} />
          <div className="absolute bottom-1/3 left-0 w-64 h-64 rounded-full blur-[80px] opacity-30" style={{ background: '#ffc107' }} />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6">
          <div className="flex items-center gap-2">
            <Logo size={32} useImage={true} />
            <span className="text-white font-bold text-xl tracking-tight">Ta' Pa' Ti</span>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="text-white/90 text-sm font-semibold px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-all"
          >
            Entrar
          </button>
        </nav>

        {/* Hero content — 2 columns on desktop */}
        <div className="relative z-10 mt-auto lg:mt-0 lg:flex-1 flex items-end lg:items-center px-5 pb-8 sm:px-8 sm:pb-12 lg:pb-0 lg:max-w-7xl lg:mx-auto lg:w-full lg:gap-12">
          {/* Left: Text */}
          <div className="lg:flex-1 lg:py-20">
            {/* Honest tagline pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 mb-5">
              <span className="text-lg">🇩🇴</span>
              <span className="text-white/90 text-sm font-medium">
                La nueva app de citas dominicana
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-4">
              Encuentra quien<br />
              <span style={{
                background: 'linear-gradient(90deg, #ff8052, #ffc107)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>ta' pa' ti</span>
            </h1>

            <p className="text-white/80 text-lg sm:text-xl max-w-lg mb-8 leading-relaxed">
              La app de citas hecha para República Dominicana. Personas reales, cerca de ti, buscando lo mismo que tú.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/register')}
                className="group flex items-center justify-center gap-2 px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)',
                  boxShadow: '0 12px 40px rgba(255, 128, 82, 0.4)'
                }}
              >
                Crear mi perfil gratis
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
              >
                Ya tengo cuenta
              </button>
            </div>
          </div>

          {/* Right: Phone mockup — only on desktop inside hero */}
          <div className="hidden lg:block lg:flex-shrink-0">
            <div className="relative">
              <div className="rounded-[2.5rem] overflow-hidden border-[6px] border-gray-800 bg-gray-900 shadow-2xl" style={{ width: 280 }}>
                <div className="aspect-[9/19] bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col">
                    {/* Mini header */}
                    <div className="p-3 flex items-center justify-center">
                      <span className="text-sm font-bold" style={{
                        background: 'linear-gradient(to right, #f97316, #eab308)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      }}>Ta' Pa' Ti</span>
                    </div>
                    {/* Card */}
                    <div className="flex-1 flex items-center justify-center px-4 pb-2">
                      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                        <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face" alt="" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                          <p className="text-white font-bold text-lg">María, 24</p>
                          <p className="text-white/80 text-xs flex items-center gap-1"><MapPin className="w-3 h-3" /> Santo Domingo • 2 km</p>
                        </div>
                      </div>
                    </div>
                    {/* Action buttons */}
                    <div className="pb-4 flex justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                        <span className="text-red-400 text-lg">✕</span>
                      </div>
                      <div className="w-14 h-14 rounded-full shadow-md flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff8052, #ffc107)'}}>
                        <Heart className="w-6 h-6 text-white" fill="white" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center">
                        <Star className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating match notification */}
              <div className="absolute -left-6 top-1/3 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 border border-gray-100" style={{ animation: 'float 3s ease-in-out infinite' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff8052, #ffc107)'}}>
                  <Heart className="w-4 h-4 text-white" fill="white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">¡Nuevo match!</p>
                  <p className="text-[10px] text-gray-500">Ahora mismo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>

      {/* ═══ MOBILE MOCKUP — only visible on small screens ═══ */}
      <div className="lg:hidden flex justify-center py-10 -mt-4" style={{
        background: 'linear-gradient(180deg, #1a0a05 0%, #faf8f6 100%)'
      }}>
        <div className="relative" style={{ width: 180 }}>
          <div className="rounded-[2rem] overflow-hidden border-4 border-gray-800 bg-gray-900 shadow-2xl">
            <div className="aspect-[9/19] bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
              <div className="absolute inset-0 flex flex-col">
                <div className="p-2 flex items-center justify-center">
                  <span className="text-[10px] font-bold" style={{
                    background: 'linear-gradient(to right, #f97316, #eab308)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>Ta' Pa' Ti</span>
                </div>
                <div className="flex-1 flex items-center justify-center px-2.5 pb-1">
                  <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-md">
                    <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=450&fit=crop&crop=face" alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/70 to-transparent">
                      <p className="text-white font-bold text-sm">María, 24</p>
                      <p className="text-white/80 text-[9px] flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> Santo Domingo</p>
                    </div>
                  </div>
                </div>
                <div className="pb-2.5 flex justify-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-red-400 text-xs">✕</div>
                  <div className="w-10 h-10 rounded-full shadow flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff8052, #ffc107)'}}>
                    <Heart className="w-4 h-4 text-white" fill="white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Floating notification */}
          <div className="absolute -right-3 top-1/4 bg-white rounded-xl shadow-lg p-2 flex items-center gap-1.5 border border-gray-100" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff8052, #ffc107)'}}>
              <Heart className="w-3 h-3 text-white" fill="white" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-900">¡Match!</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TRUST STRIP ═══ */}
      <div className="bg-white border-y border-gray-100 py-5">
        <div className="max-w-5xl mx-auto px-5 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            { icon: Shield, text: 'Perfiles verificados' },
            { icon: MapPin, text: '100% dominicano' },
            { icon: Heart, text: 'Matches reales' },
            { icon: MessageCircle, text: 'Chat seguro' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
              <item.icon className="w-4 h-4" style={{ color: '#ff8052' }} />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HOW IT WORKS — 3 steps visual ═══ */}
      <div className="py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Así de fácil es
            </h2>
            <p className="text-gray-500 text-lg">En 2 minutos ya estás conectando</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                emoji: '📸',
                title: 'Crea tu perfil',
                desc: 'Sube tus fotos, di qué buscas y listo. Tu perfil se verifica automáticamente.'
              },
              {
                step: '2',
                emoji: '🔥',
                title: 'Desliza y conecta',
                desc: 'Explora perfiles cerca de ti. Desliza a la derecha si te gusta, a la izquierda si no.'
              },
              {
                step: '3',
                emoji: '💬',
                title: 'Habla y queda',
                desc: 'Cuando hay match mutuo, se abre el chat. Mensajes, fotos, notas de voz.'
              }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 text-4xl transition-transform group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(255,128,82,0.1), rgba(255,193,7,0.1))' }}
                >
                  {item.emoji}
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #ff8052, #ffc107)' }}
                  >
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FEATURES — Text with checks ═══ */}
      <div className="py-16 sm:py-20 px-5 sm:px-8 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Hecha para dominicanos que buscan algo real
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              No es otra app gringa traducida. Ta' Pa' Ti entiende cómo conectamos aquí — con sabor, con flow, con respeto.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              'IA que entiende tu tipo',
              'Personas verificadas, sin catfish',
              'Filtros por provincia, edad, intención',
              'Chat con fotos, voz y video',
              'Stories para compartir momentos',
              'Gratis para empezar'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'linear-gradient(135deg, #ff8052, #ffc107)'}}>
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
                <span className="text-gray-700 font-medium text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-white rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #ff8052, #ffc107)',
                boxShadow: '0 8px 30px rgba(255,128,82,0.3)'
              }}
            >
              Únete ahora — es gratis
            </button>
          </div>
        </div>
      </div>

      {/* ═══ WHY TA PA TI ═══ */}
      {/* ═══ WHY TA PA TI ═══ */}
      <div className="py-16 sm:py-20 px-5 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-12">
            ¿Por qué Ta' Pa' Ti?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { emoji: '🇩🇴', title: 'Hecha aquí', desc: 'No es una app gringa traducida. Está diseñada para cómo conectamos en RD — con sabor y con respeto.' },
              { emoji: '🛡️', title: 'Sin perfiles falsos', desc: 'Sistema de verificación de fotos. Cada perfil es una persona real, no un bot ni un catfish.' },
              { emoji: '📍', title: 'Gente cerca', desc: 'Filtros por provincia, distancia real por GPS. Conoce personas que están a minutos de ti.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ FINAL CTA ═══ */}
      <div className="py-16 sm:py-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl p-10 sm:p-14 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)' }}
          >
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                Tu próximo match te está esperando
              </h2>
              <p className="text-white/85 text-lg mb-8 max-w-md mx-auto">
                Crea tu perfil en 2 minutos y empieza a conocer personas increíbles cerca de ti.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-10 py-4 bg-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center gap-2"
                style={{ color: '#ff8052' }}
              >
                Comenzar Gratis
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-white/60 text-xs mt-4">Sin tarjeta de crédito. Sin compromisos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-5 sm:px-8 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo size={20} useImage={true} />
              <span className="font-bold" style={{
                background: 'linear-gradient(90deg, #ff6b35, #fdc830)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Ta' Pa' Ti</span>
              <span className="text-gray-400 text-sm ml-2">© 2026</span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Términos</a>
              <a href="/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">Privacidad</a>
              <a href="mailto:tapapatisoporte@gmail.com" className="hover:text-gray-900 transition-colors">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
