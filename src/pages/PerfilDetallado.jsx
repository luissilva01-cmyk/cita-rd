import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PerfilDetallado() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de perfil detallado
    const loadProfile = () => {
      // Demo profile data
      const demoProfile = {
        id: profileId,
        nombre: 'Ana',
        edad: 24,
        ciudad: 'Santo Domingo',
        fotoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9LYl-u9IENbs_smhBieLwBp-mFgCtBtLJbagtVhJH89pfRHN_6YKxQ2PhSOTtC2cMhhBE2JkhbrxPaXJxdn2a8tpxoXMxeGXl1MINUKhHHHNH4_J3NTMVs5h8RF8nFlMH45VFne2tCuBiL378S4kOOFGP9x-Qmnm82Yeh2CKzcTQX5YKaq6yYiEuQteW0YTyemnC2WCWvuuTErf1qYtQoyIiO9Cb0CzTcng_5rgadY-1-sEuAJNJVvskDg_ZMzJjtYN8XSxeuIeUI',
        fotos: [
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB9LYl-u9IENbs_smhBieLwBp-mFgCtBtLJbagtVhJH89pfRHN_6YKxQ2PhSOTtC2cMhhBE2JkhbrxPaXJxdn2a8tpxoXMxeGXl1MINUKhHHHNH4_J3NTMVs5h8RF8nFlMH45VFne2tCuBiL378S4kOOFGP9x-Qmnm82Yeh2CKzcTQX5YKaq6yYiEuQteW0YTyemnC2WCWvuuTErf1qYtQoyIiO9Cb0CzTcng_5rgadY-1-sEuAJNJVvskDg_ZMzJjtYN8XSxeuIeUI',
          'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=500&h=500&fit=crop&crop=face',
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop&crop=face'
        ],
        intereses: ['Viajar', 'Café', 'Fotografía', 'Senderismo'],
        descripcion: 'Amante de la naturaleza y la buena comida. Siempre con la cámara lista para capturar momentos únicos. Me encanta explorar nuevos lugares y conocer personas interesantes.',
        verificado: true,
        enLinea: true,
        distance: 5,
        trabajo: 'Fotógrafa',
        educacion: 'Universidad Autónoma de Santo Domingo'
      };
      
      setProfile(demoProfile);
      setLoading(false);
    };

    loadProfile();
  }, [profileId]);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Perfil no encontrado
          </h2>
          <button
            onClick={() => navigate('/ultra-explore')}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Volver a explorar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-display">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="relative">
          <button
            onClick={() => navigate('/ultra-explore')}
            className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="material-symbols-outlined text-gray-900 dark:text-white">arrow_back</span>
          </button>
          
          <div className="relative h-96 bg-gray-200 dark:bg-gray-800">
            <img
              src={profile.fotoUrl}
              alt={profile.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 -mt-16 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.nombre}, {profile.edad}
                  </h1>
                  {profile.verificado && (
                    <span className="material-symbols-outlined text-blue-500 text-xl">verified</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{profile.ciudad}</span>
                  {profile.distance && <span>• {profile.distance} km</span>}
                </div>
              </div>
              {profile.enLinea && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium">En línea</span>
                </div>
              )}
            </div>

            {/* Description */}
            {profile.descripcion && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sobre mí</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.descripcion}
                </p>
              </div>
            )}

            {/* Work & Education */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {profile.trabajo && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">work</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trabajo</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.trabajo}</p>
                  </div>
                </div>
              )}
              {profile.educacion && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">school</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Educación</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.educacion}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Interests */}
            {profile.intereses && profile.intereses.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Intereses</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.intereses.map((interes, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium"
                    >
                      {interes}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Photos */}
            {profile.fotos && profile.fotos.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Más fotos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {profile.fotos.slice(1).map((foto, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <img
                        src={foto}
                        alt={`${profile.nombre} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="max-w-md mx-auto flex justify-center gap-4">
            <button className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-red-500 text-2xl">close</span>
            </button>
            <button className="w-14 h-14 bg-gray-900 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-2xl">favorite</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}