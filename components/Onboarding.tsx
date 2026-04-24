import React, { useState } from 'react';

const SLIDES = [
  {
    emoji: '🔥',
    title: "Bienvenido a Ta' Pa' Ti",
    subtitle: 'La app de citas dominicana con IA',
    description: 'Conexiones reales con personas cerca de ti. Verificadas, auténticas, que ta\' pa\' ti.',
    bg: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)',
  },
  {
    emoji: '📸',
    title: 'Sube tus mejores fotos',
    subtitle: 'Tu primera impresión importa',
    description: 'Perfiles con fotos reales reciben 10x más matches. Sube al menos 2 fotos donde se vea tu cara.',
    bg: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
  },
  {
    emoji: '👆',
    title: 'Desliza para conectar',
    subtitle: 'Derecha = Like, Izquierda = Pasar',
    description: 'Cuando ambos se dan like, ¡es un match! Pueden chatear, enviar fotos, notas de voz y más.',
    bg: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
  },
  {
    emoji: '🚀',
    title: '¡Estás listo!',
    subtitle: 'Completa tu perfil y empieza',
    description: 'Mientras más completo tu perfil, más matches recibirás. ¡Buena suerte!',
    bg: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
  },
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

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
    <div className="fixed inset-0 z-[9999] flex flex-col" style={{ background: slide.bg, transition: 'background 0.4s ease' }}>

      {/* Skip button */}
      {!isLast && (
        <button
          onClick={handleSkip}
          className="absolute top-12 right-6 text-white/70 text-sm font-medium z-10 px-3 py-1 rounded-full hover:bg-white/10 transition-colors"
        >
          Saltar
        </button>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center text-white">
        <div 
          className="text-8xl mb-6"
          style={{ animation: 'bounceIn 0.5s ease-out' }}
          key={current}
        >
          {slide.emoji}
        </div>
        <h1 className="text-3xl font-extrabold mb-2 leading-tight">{slide.title}</h1>
        <p className="text-lg font-semibold opacity-90 mb-4">{slide.subtitle}</p>
        <p className="text-sm opacity-75 max-w-xs leading-relaxed">{slide.description}</p>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-12 flex flex-col items-center gap-5">
        {/* Dots */}
        <div className="flex gap-2">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleNext}
          className="w-full max-w-xs py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95"
          style={{
            background: 'white',
            color: isLast ? '#22c55e' : '#ff8052',
          }}
        >
          {isLast ? '¡Empezar!' : 'Siguiente'}
        </button>
      </div>

      <style>{`
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
