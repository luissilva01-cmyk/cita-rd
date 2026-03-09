import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'color' | 'white' | 'black';
  version?: 'v1' | 'v2' | 'simple'; // Nueva prop para elegir versión
  className?: string;
  showText?: boolean; // Mostrar "Ta' Pa' Ti" debajo
  useImage?: boolean; // Usar imagen PNG directamente
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 40, 
  variant = 'color',
  version = 'v2', // v2 es la versión más limpia (segunda imagen)
  className = '',
  showText = false,
  useImage = true // Por defecto usar la imagen real
}) => {
  
  // Si useImage es true, usar la imagen PNG directamente
  if (useImage) {
    return (
      <div className={`inline-flex flex-col items-center ${className}`}>
        <img 
          src="/logo-tpt.png" 
          alt="Ta' Pa' Ti" 
          style={{ 
            display: 'block',
            width: size,
            height: 'auto',
            background: 'transparent',
            mixBlendMode: 'normal'
          }}
        />
        {showText && (
          <span 
            className="mt-4 font-semibold text-center"
            style={{ 
              fontSize: size * 0.35,
              background: 'linear-gradient(90deg, #FF6B47 0%, #FF8BA8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.05em'
            }}
          >
            Ta' Pa' Ti
          </span>
        )}
      </div>
    );
  }
  const getColor = () => {
    switch (variant) {
      case 'white':
        return '#FFFFFF';
      case 'black':
        return '#1B110D';
      case 'color':
      default:
        return 'url(#logoGradient)';
    }
  };

  // Versión 2: Logo exacto de la imagen (TP conectadas con gradiente)
  const renderV2 = () => (
    <svg 
      width={size} 
      height={showText ? size * 1.5 : size} 
      viewBox="0 0 440 280" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ta' Pa' Ti Logo"
    >
      {variant === 'color' && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FF6B47', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF8BA8', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}
      
      {/* Logo TP conectado - recreación exacta de la imagen */}
      <g transform="translate(40, 40)">
        {/* T - parte superior horizontal redondeada */}
        <path 
          d="M 0 0 L 140 0 C 160 0 170 10 170 30 C 170 50 160 60 140 60 L 100 60 L 100 160 C 100 180 90 190 70 190 C 50 190 40 180 40 160 L 40 60 L 0 60 C -10 60 -10 50 -10 30 C -10 10 0 0 0 0 Z" 
          fill={getColor()} 
          stroke="none"
        />
        
        {/* P - conectada con la T, con curva interior característica */}
        <path 
          d="M 140 30 L 180 30 C 240 30 280 60 280 110 C 280 160 240 190 180 190 L 160 190 L 160 160 C 160 180 150 190 130 190 C 110 190 100 180 100 160 L 100 50 C 100 40 110 30 120 30 L 140 30 Z M 160 80 L 160 140 L 180 140 C 210 140 230 130 230 110 C 230 90 210 80 180 80 L 160 80 Z" 
          fill={getColor()} 
          stroke="none"
        />
      </g>
      
      {showText && (
        <text 
          x="220" 
          y="250" 
          fontFamily="'Poppins', 'Inter', 'Segoe UI', Arial, sans-serif" 
          fontSize="48" 
          fontWeight="600" 
          textAnchor="middle" 
          fill={getColor()}
          letterSpacing="2"
        >
          Ta' Pa' Ti
        </text>
      )}
    </svg>
  );

  // Versión 1: Logo grande con gradiente (primera imagen)
  const renderV1 = () => (
    <svg 
      width={size * 1.5} 
      height={size} 
      viewBox="0 0 300 200" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ta' Pa' Ti Logo"
    >
      {variant === 'color' && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#EC4913', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FF8052', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}
      
      <g transform="translate(50, 30)">
        {/* T redondeada */}
        <path 
          d="M 0 0 L 80 0 C 90 0 90 5 90 15 L 90 20 L 60 20 L 60 120 C 60 130 55 135 45 135 L 35 135 C 25 135 20 130 20 120 L 20 20 L 0 20 C -5 20 -5 15 -5 10 C -5 5 -5 0 0 0 Z" 
          fill={getColor()} 
          stroke="none"
        />
        
        {/* P conectada con curva suave */}
        <path 
          d="M 90 10 L 120 10 C 170 10 190 30 190 60 C 190 90 170 110 120 110 L 100 110 L 100 120 C 100 130 95 135 85 135 C 75 135 70 130 70 120 L 70 20 C 70 15 75 10 80 10 L 90 10 Z M 100 40 L 100 80 L 120 80 C 145 80 155 70 155 60 C 155 50 145 40 120 40 L 100 40 Z" 
          fill={getColor()} 
          stroke="none"
        />
      </g>
      
      {showText && (
        <text 
          x="150" 
          y="180" 
          fontFamily="Arial, sans-serif" 
          fontSize="32" 
          fontWeight="bold" 
          textAnchor="middle" 
          fill={getColor()}
        >
          Ta' Pa' Ti
        </text>
      )}
    </svg>
  );

  // Versión simple: Minimalista
  const renderSimple = () => (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 160 160" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ta' Pa' Ti Logo"
    >
      {variant === 'color' && (
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#EC4913', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FF6B9D', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      )}
      
      <g transform="translate(10, 20)">
        {/* T minimalista */}
        <rect x="0" y="0" width="60" height="15" rx="7.5" fill={getColor()}/>
        <rect x="22.5" y="0" width="15" height="100" rx="7.5" fill={getColor()}/>
        
        {/* P conectado */}
        <path 
          d="M 60 7.5 L 90 7.5 C 115 7.5 125 17.5 125 35 C 125 52.5 115 62.5 90 62.5 L 75 62.5 L 75 100 C 75 105 72.5 107.5 67.5 107.5 C 62.5 107.5 60 105 60 100 Z M 75 22.5 L 75 47.5 L 90 47.5 C 100 47.5 105 42.5 105 35 C 105 27.5 100 22.5 90 22.5 Z" 
          fill={getColor()}
        />
      </g>
    </svg>
  );

  // Renderizar según la versión seleccionada
  switch (version) {
    case 'v1':
      return renderV1();
    case 'simple':
      return renderSimple();
    case 'v2':
    default:
      return renderV2();
  }
};

export default Logo;
