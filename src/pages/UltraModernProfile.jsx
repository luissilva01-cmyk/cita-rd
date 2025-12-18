import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UltraModernProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de perfil
    const loadProfile = () => {
      // Demo profile data
      const demoProfile = {
        id: user?.uid || 'demo-user',
        nombre: 'Maria',
        edad: 24,
        ciudad: 'Santiago',
        pais: 'República Dominicana',
        fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoxTxArJOUojhyCBeVL1VM9EuVL6WOevfAsMqIjWME3htgyQ0EQM2-af5UStrhNj3ZFOPKlu9nh1voHTjfkXgy5tBAPp3DSpuArF81SXY28g0a3lSiLwzF0JMHArU7K5wG_NTqN-ruX5CSDZrSNE9GiRB_yMAseiI0G-1TdX7gyHKfcLAK-yfbPOv5j5ZrK8cburg4i9w35yuZILcb5WYw3JkvZ-vCiCxULhOQv5xH1EgDTdeGhGWyziySmC5SQ84sIXu6p5DoCaU-',
        bio: 'Amante del café, los atardeceres en el malecón y el dembow los fines de semana. Buscando alguien real para compartir buenos momentos. 🇩🇴✨',
        intereses: [
          { emoji: '🎵', nombre: 'Música' },
          { emoji: '🏖️', nombre: 'Playa' },
          { emoji: '🍣', nombre: 'Sushi' },
          { emoji: '💪', nombre: 'Fitness' },
          { emoji: '✈️', nombre: 'Viajes' }
        ],
        fotos: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA525uXELMAFsaZvtb7-HxATmgiLqIXePI-lPgwHO0VS_pS7GQ88BvlY-EHCEovm-DsCyityn50N5AEa5jfIXhhlEqIQHZjDLf4QTUT7YRPhjEIwyToUvVY0dpZ4iLwUaBMDzH4_255mhkLCJkzFsnBv8KzcxbA59yUv04bwGWwwIoJHi4egF-bbUu99fmFd_Q7T_vwpw7zM06bK1pBbmDl87WQUlZFxARMGO0UvbcoqavCeHPJuOZNGwiRo8ESzFzIqHRsG7PakVvV',
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCs8iDI9PQ_6_8UaF8TBpx5nMXS4-sZiFyd-NEgoWbJisvzwIdTUUZuaB3YkBMsSTPd8DnoIP1nmULGDOT4FvbS0h_oNwPL41bsmZN55HyxdBEEVXc-DLxPy1K24qC8jGx_E4xXVyQCaTrTMXWCAuW_OYBg7wc4nbjG4oe_uRZBxzVarkYk-u_78ebMwg0d4C5MXXxo6Mc2Pd8DgMcWcL7YcTSrcvwxNsknJgydgM7euV2Zn8-Gyx8dfviY09YcjVMt0Kex_Y-pPlZa'
        ],
        verificado: true
      };
      
      setProfileData(demoProfile);
      setLoading(false);
    };

    loadProfile();
  }, [user?.uid]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  const handleEditProfile = () => {
    navigate('/editar-perfil');
  };

  const handleEditBio = () => {
    // Implementar edición de bio
    console.log('Editar bio');
  };

  const handleEditInterests = () => {
    // Implementar edición de intereses
    console.log('Editar intereses');
  };

  const handleAddPhoto = () => {
    // Implementar agregar foto
    console.log('Agregar foto');
  };

  const handleViewGallery = () => {
    // Implementar ver galería completa
    console.log('Ver galería completa');
  };

  const handleSettings = () => {
    navigate('/configuracion');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-display antialiased text-gray-900 dark:text-white h-screen flex flex-col overflow-hidden selection:bg-gray-900/20">
      
      {/* Top App Bar */}
      <header className="flex-none flex items-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md p-4 pt-12 pb-3 justify-between sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors">
        {/* Spacer to balance center title */}
        <div className="w-12"></div>
        <h2 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">
          Mi Perfil
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/ai-coach')}
            className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors text-pink-600 dark:text-pink-400"
            title="AI Coach"
          >
            <span className="material-symbols-outlined text-2xl">psychology</span>
          </button>
          <button 
            onClick={handleSettings}
            className="flex items-center justify-center rounded-full w-10 h-10 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-white"
          >
            <span className="material-symbols-outlined text-2xl">settings</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 no-scrollbar">
        
        {/* Profile Header & Hero Image */}
        <div className="flex flex-col gap-6 px-4 pt-4">
          
          {/* Hero Card */}
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group">
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            <img 
              alt="Main profile photo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={profileData?.fotoUrl}
            />
            {/* Image Edit Overlay Button */}
            <button 
              onClick={handleAddPhoto}
              className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>

          {/* Identity Info */}
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2 w-full">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {profileData?.nombre}, {profileData?.edad}
              </h1>
              {profileData?.verificado && (
                <span className="material-symbols-outlined text-blue-500 text-2xl" title="Perfil Verificado">
                  verified
                </span>
              )}
            </div>
            <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
              <span className="material-symbols-outlined text-[18px] mr-1">location_on</span>
              <span>{profileData?.ciudad}, {profileData?.pais}</span>
            </div>
          </div>

          {/* Bio Section */}
          <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative group cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-gray-600">
            <button 
              onClick={handleEditBio}
              className="absolute top-4 right-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              Sobre mí
            </h3>
            <p className="text-gray-900/90 dark:text-white/90 text-base font-normal leading-relaxed">
              {profileData?.bio}
            </p>
          </div>

          {/* Interests Chips */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
                Mis Intereses
              </h3>
              <button 
                onClick={handleEditInterests}
                className="text-sm font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Editar
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {profileData?.intereses?.map((interes, index) => (
                <div 
                  key={index}
                  className="flex h-9 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 px-4 transition-colors cursor-pointer"
                >
                  <span className="text-lg">{interes.emoji}</span>
                  <p className="text-gray-900 dark:text-white text-sm font-medium">
                    {interes.nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight">
                Mi Galería
              </h3>
              <button 
                onClick={handleViewGallery}
                className="text-sm font-semibold text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                Ver todo
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {profileData?.fotos?.map((foto, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-800 group"
                >
                  <img 
                    alt={`Gallery photo ${index + 1}`}
                    className="w-full h-full object-cover transition-opacity hover:opacity-90"
                    src={foto}
                  />
                </div>
              ))}
              
              {/* Add Photo Button */}
              <button 
                onClick={handleAddPhoto}
                className="aspect-square rounded-xl overflow-hidden relative bg-gray-200 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-400 text-[32px]">
                  add_a_photo
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons Area */}
          <div className="pt-4 pb-6 space-y-3">
            {/* AI Coach Button */}
            <button 
              onClick={() => navigate('/ai-coach')}
              className="w-full flex cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-base font-bold tracking-wide shadow-lg shadow-pink-500/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined mr-2">psychology</span>
              AI Coach
            </button>
            
            {/* Edit Profile Button */}
            <button 
              onClick={handleEditProfile}
              className="w-full flex cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-base font-bold tracking-wide shadow-lg shadow-gray-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all"
            >
              Editar Perfil
            </button>
            
            <div className="text-center mt-4">
              <button className="text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                Ver vista previa de perfil
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="flex-none bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pb-6 pt-2 px-6">
        <ul className="flex justify-between items-center w-full max-w-md mx-auto">
          <li className="flex-1 flex justify-center">
            <button 
              onClick={() => navigate('/ultra-home')}
              className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                style
              </span>
            </button>
          </li>
          <li className="flex-1 flex justify-center">
            <button 
              onClick={() => navigate('/ultra-matches')}
              className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                favorite
              </span>
            </button>
          </li>
          <li className="flex-1 flex justify-center">
            <button 
              onClick={() => navigate('/ultra-chats')}
              className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <span className="material-symbols-outlined group-hover:scale-110 transition-transform">
                chat_bubble
              </span>
            </button>
          </li>
          <li className="flex-1 flex justify-center">
            <button className="flex flex-col items-center gap-1 p-2 text-gray-900 dark:text-white transition-colors group relative">
              <span className="material-symbols-outlined scale-110 filled">
                person
              </span>
              <span className="absolute -bottom-2 w-1 h-1 bg-gray-900 dark:bg-white rounded-full"></span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}