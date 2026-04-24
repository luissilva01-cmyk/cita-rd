import React, { useState } from 'react';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const isLast = current === 3;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('tapati_onboarding_done', '1');
      onComplete();
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tapati_onboarding_done', '1');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#fff8f7] flex flex-col items-center overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#ff6b6b]/10 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-40 -right-20 w-64 h-64 bg-[#ffc107]/15 rounded-full blur-[80px]"></div>

      {/* Skip */}
      {!isLast && (
        <button onClick={handleSkip} className="absolute top-12 right-6 z-20 text-[#8c706f] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-black/5 transition-colors">
          Saltar
        </button>
      )}

      {/* Slide content */}
      <div className="flex-1 w-full max-w-[480px] flex flex-col px-6 pt-14 pb-4 overflow-hidden" key={current} style={{ animation: 'fadeSlide 0.4s ease-out' }}>

        {/* ═══ SLIDE 0: Bienvenido ═══ */}
        {current === 0 && (
          <>
            <h1 className="text-center text-transparent bg-clip-text font-extrabold text-2xl mb-6" style={{ backgroundImage: 'linear-gradient(90deg, #ff6b6b, #ffc107)' }}>
              Ta' Pa' Ti
            </h1>
            <div className="relative w-full aspect-square max-h-[320px] rounded-[32px] overflow-hidden shadow-xl mx-auto">
              <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=600&fit=crop" alt="Pareja" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 border border-white/30">
                <div className="w-9 h-9 rounded-full bg-[#ff6b6b] flex items-center justify-center text-white text-lg">❤️</div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Nueva conexión</p>
                  <p className="text-[10px] text-slate-500">¡Alguien está interesado!</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center flex-1">
              <h2 className="text-[26px] font-extrabold text-slate-800 leading-tight px-2">
                Bienvenido a <span className="text-[#ff6b6b]">Ta' Pa' Ti</span>
              </h2>
              <p className="mt-3 text-sm text-[#584140] leading-relaxed max-w-[85%] mx-auto">
                La plataforma diseñada para encontrar <strong>conexiones reales</strong> en República Dominicana. Personas que comparten tu vibra.
              </p>
            </div>
          </>
        )}

        {/* ═══ SLIDE 1: Fotos ═══ */}
        {current === 1 && (
          <>
            <div className="mb-6">
              <h2 className="text-[26px] font-extrabold text-slate-800 leading-tight">Sube tus fotos</h2>
              <p className="mt-2 text-sm text-[#584140] leading-relaxed">
                Mostrar quién eres genera <span className="text-[#ff6b6b] font-bold">confianza</span>. Las fotos auténticas aumentan tus matches.
              </p>
            </div>
            <div className="w-full grid grid-cols-3 grid-rows-3 gap-2.5 aspect-square max-h-[300px] mx-auto">
              <div className="col-span-2 row-span-2 rounded-[20px] border-2 border-dashed border-[#ff6b6b] bg-[#fff0ef] flex flex-col items-center justify-center gap-2">
                <div className="w-11 h-11 rounded-full bg-[#ff6b6b] text-white flex items-center justify-center text-xl font-bold">+</div>
                <span className="text-[10px] font-bold text-[#ff6b6b]">Foto principal</span>
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="rounded-[16px] border-2 border-dashed border-[#ff6b6b]/40 bg-[#fff0ef] flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-white/80 text-[#ff6b6b] flex items-center justify-center text-sm shadow-sm">+</div>
                </div>
              ))}
            </div>
            <div className="mt-4 w-full p-4 rounded-xl bg-white border border-[#e0bfbd] flex items-start gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-[#ffdad8] flex items-center justify-center text-lg shrink-0">💡</div>
              <div>
                <p className="text-[10px] font-bold text-slate-800">Consejo pro</p>
                <p className="text-[9px] text-[#584140]">Las sonrisas y el contacto visual aumentan las conexiones hasta un 40%.</p>
              </div>
            </div>
          </>
        )}

        {/* ═══ SLIDE 2: Swipe ═══ */}
        {current === 2 && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-[26px] font-extrabold text-slate-800">Desliza para conectar</h2>
              <p className="mt-2 text-sm text-[#584140] px-4">Encuentra personas increíbles cerca de ti. Es tan fácil como mover un dedo.</p>
            </div>
            <div className="relative w-full flex-1 flex items-center justify-center min-h-[300px]">
              <div className="absolute w-48 h-64 bg-white rounded-[28px] border border-gray-200 shadow-sm rotate-6 scale-90 opacity-30"></div>
              <div className="absolute w-52 h-68 bg-white rounded-[28px] border border-gray-200 shadow-md rotate-3 scale-95 opacity-60"></div>
              <div className="relative w-56 h-72 rounded-[28px] overflow-hidden shadow-2xl border border-gray-100 rotate-6 transition-transform">
                <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face" alt="Perfil" className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 border-[3px] border-green-400 text-green-400 font-extrabold px-3 py-1 rounded-xl -rotate-12 text-sm flex items-center gap-1">
                  ❤️ LIKE
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-white font-bold text-lg">Valentina, 24</p>
                  <p className="text-white/80 text-xs flex items-center gap-1">📍 A 2 km de ti</p>
                </div>
              </div>
              <div className="absolute bottom-2 right-1/4 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white/50 backdrop-blur-md border border-white/60 flex items-center justify-center animate-pulse text-lg">👆</div>
                <span className="text-[#ff6b6b] text-xl mt-0.5">→</span>
              </div>
            </div>
            <div className="flex justify-between w-full px-12 mt-4">
              <div className="flex flex-col items-center gap-1 opacity-50">
                <span className="text-xl">←</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Pasar</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl">→</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff6b6b]">Me gusta</span>
              </div>
            </div>
          </>
        )}

        {/* ═══ SLIDE 3: Listo ═══ */}
        {current === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8">
              <div className="w-40 h-40 rounded-full p-1 shadow-xl mx-auto overflow-hidden" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ffc107)' }}>
                <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop&crop=faces" alt="Celebración" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-lg border-2 border-green-400">
                <span className="text-green-500 text-2xl">✓</span>
              </div>
            </div>
            <h1 className="text-[28px] font-extrabold text-slate-800 mb-2">¡Todo listo!</h1>
            <p className="text-sm text-[#584140] max-w-[260px] mx-auto mb-8">Tu cuenta está lista. Ya puedes empezar a descubrir personas increíbles.</p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <div className="bg-white/85 backdrop-blur-xl border border-[#e0bfbd]/30 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#ffdad8] flex items-center justify-center mb-2 text-lg">✨</div>
                <span className="text-[10px] font-bold text-slate-800">Personalizado</span>
              </div>
              <div className="bg-white/85 backdrop-blur-xl border border-[#e0bfbd]/30 rounded-2xl p-4 flex flex-col items-center shadow-sm">
                <div className="w-9 h-9 rounded-full bg-[#ffe173] flex items-center justify-center mb-2 text-lg">🧭</div>
                <span className="text-[10px] font-bold text-slate-800">Sin límites</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="w-full max-w-[480px] px-6 pb-10 flex flex-col items-center gap-4">
        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-full transition-all duration-300" style={{
              width: i === current ? 24 : 8,
              height: 6,
              background: i === current ? 'linear-gradient(90deg, #ff6b6b, #ffc107)' : '#e0bfbd',
            }} />
          ))}
        </div>
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          style={{ background: isLast ? 'linear-gradient(135deg, #ff6b6b, #ffc107)' : 'linear-gradient(90deg, #ff6b6b, #ffc107)' }}
        >
          {isLast ? 'Empezar ahora' : 'Siguiente'}
          {!isLast && <span>→</span>}
        </button>
        {isLast && (
          <button onClick={handleNext} className="text-xs font-bold text-[#8c706f] hover:underline">
            Completar Perfil Luego
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
