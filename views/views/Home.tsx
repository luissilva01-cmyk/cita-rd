import React from 'react';
import { UserProfile } from '../../types';

interface HomeProps {
  currentUser: UserProfile;
  recentMatches: UserProfile[];
  onNavigateToDiscovery: () => void;
  onNavigateToMessages: () => void;
  onNavigateToProfile: () => void;
  availableProfilesCount?: number; // Nuevo prop para el conteo real
}

const Home: React.FC<HomeProps> = ({ 
  currentUser, 
  recentMatches, 
  onNavigateToDiscovery, 
  onNavigateToMessages,
  onNavigateToProfile,
  availableProfilesCount = 0 // Default a 0 si no se proporciona
}) => {
  const todayDate = new Date().toLocaleDateString('es-DO', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  });

  const location = currentUser.location || 'Santo Domingo';
  const newProfilesCount = availableProfilesCount; // ✅ Usar el conteo real
  const unreadMessages = recentMatches.length; // ✅ Calcular desde matches reales

  return (
    <div className="w-full min-h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-white pb-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-10 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full border-2 p-0.5 shadow-sm" style={{borderColor: '#ff8052'}}>
            <div 
              className="w-full h-full rounded-full bg-cover bg-center bg-image-smart md:bg-image-tablet lg:bg-image-desktop" 
              style={{
                backgroundImage: `url('${currentUser.images?.[0] || 'https://picsum.photos/seed/user/200/200'}')`
              }}
            />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">¡Hola, {currentUser.name}! 👋</h2>
            <p className="text-sm md:text-base font-medium opacity-70" style={{color: '#a15d45'}}>
              {todayDate} • {location}
            </p>
          </div>
        </div>
        <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-black/5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
          </svg>
        </button>
      </div>

      {/* Banner Motivacional */}
      <div className="px-4 md:px-10 py-2">
        <div 
          className="rounded-xl p-4 text-white relative overflow-hidden shadow-lg"
          style={{background: 'linear-gradient(135deg, #ff8052 0%, #ffc107 100%)'}}
        >
          <div className="relative z-10">
            <p className="text-xl md:text-2xl font-bold leading-tight mb-1">
              ¿Listo para encontrar quien ta' pa' ti?
            </p>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <p className="text-sm md:text-base font-medium opacity-90">
                {newProfilesCount} personas nuevas hoy
              </p>
            </div>
            <button 
              onClick={onNavigateToDiscovery}
              className="bg-white text-orange-600 px-4 py-2 rounded-lg font-bold text-sm md:text-base transition-transform active:scale-95 shadow-lg"
            >
              Ver perfiles
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-white/20 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="px-4 md:px-10 py-3">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6 max-w-2xl mx-auto">
          <button
            onClick={onNavigateToMessages}
            className="p-4 rounded-xl text-white flex flex-col justify-between h-22 shadow-lg transition-transform active:scale-95"
            style={{background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', height: '88px'}}
          >
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm">Matches Recientes</h3>
              <p className="text-xs opacity-80">Ver tus conexiones</p>
            </div>
          </button>

          <button
            onClick={onNavigateToDiscovery}
            className="p-4 rounded-xl text-white flex flex-col justify-between h-22 shadow-lg transition-transform active:scale-95"
            style={{background: 'linear-gradient(135deg, #0ea5e9 0%, #22d3ee 100%)', height: '88px'}}
          >
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center relative">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm">Descubrir</h3>
              <p className="text-xs opacity-80">Encuentra nuevos perfiles</p>
            </div>
          </button>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold tracking-tight">Actividad Reciente</h3>
          <button className="text-sm font-bold" style={{color: '#ff8052'}}>
            Ver todo
          </button>
        </div>

        {recentMatches.length > 0 ? (
          <div className="space-y-2">
            {recentMatches.slice(0, 2).map((match) => (
              <div key={match.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-black/5 shadow-sm">
                <div className="w-11 h-11 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-full shrink-0 profile-image-container">
                  <div 
                    className="w-full h-full rounded-full bg-image-smart md:bg-image-tablet lg:bg-image-desktop"
                    style={{backgroundImage: `url('${match.images?.[0] || 'https://picsum.photos/seed/' + match.id + '/200/200'}')`}}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm truncate">{match.name}, {match.age}</span>
                    {match.isVerified && (
                      <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-0.5">
                    <svg className="w-3 h-3 mr-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span className="truncate">{match.distance || '2.5 km'} de ti • {match.location}</span>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{backgroundColor: '#ff805210', color: '#ff8052'}}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center" style={{background: 'linear-gradient(135deg, #ff805220, #ffc10720)'}}>
              <svg className="w-7 h-7" style={{color: '#ff8052'}} fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v-5.5c0-1.38-1.12-2.5-2.5-2.5H13V9.5c0-1.38-1.12-2.5-2.5-2.5S8 8.12 8 9.5V18H4z"/>
              </svg>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">¡Comienza a explorar!</h4>
            <p className="text-sm text-gray-600 mb-3">
              Descubre personas increíbles que ta' pa' ti
            </p>
            <button
              onClick={onNavigateToDiscovery}
              className="px-5 py-2 rounded-full text-white font-semibold text-sm shadow-lg transition-all hover:shadow-xl"
              style={{background: 'linear-gradient(135deg, #ff8052, #ffc107)'}}
            >
              Empezar a explorar
            </button>
          </div>
        )}
      </div>

      {/* Progreso del Perfil */}
      <div className="px-4 pb-4">
        <div className="border rounded-xl p-4" style={{backgroundColor: '#ff805205', borderColor: '#ff805220'}}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Perfil Completado</h3>
            <span className="font-bold text-sm" style={{color: '#ff8052'}}>85%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mb-3 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300" 
              style={{background: 'linear-gradient(90deg, #ff8052, #ffc107)', width: '85%'}}
            />
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Agrega 2 fotos más para destacar y recibir más matches este fin de semana.
          </p>
          <button
            onClick={onNavigateToProfile}
            className="w-full border-2 font-bold py-2 rounded-lg text-sm transition-colors hover:text-white"
            style={{
              borderColor: '#ff8052', 
              color: '#ff8052'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff8052';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff8052';
            }}
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;