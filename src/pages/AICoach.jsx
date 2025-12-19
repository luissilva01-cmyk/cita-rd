// src/pages/AICoach.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAIProfileFeedback } from '../services/geminiService';
import { obtenerPerfil } from '../services/perfilesService';

export default function AICoach() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    profileAnalysis: null,
    bioSuggestions: null,
    datingTips: null
  });

  // Cargar perfil del usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user?.uid) {
        try {
          const profile = await obtenerPerfil(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error loading profile:', error);
          // Usar datos de demo si no se puede cargar el perfil
          setUserProfile({
            nombre: user.displayName || 'Usuario',
            edad: 25,
            descripcion: 'Amante de la vida y nuevas aventuras',
            intereses: ['Música', 'Viajes', 'Fotografía'],
            fotos: [user.photoURL]
          });
        }
      }
    };

    loadUserProfile();
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleAnalyzeProfile = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const analysis = await getAIProfileFeedback(
        userProfile.descripcion || '',
        userProfile.intereses || []
      );
      setResults(prev => ({ ...prev, profileAnalysis: analysis.feedback }));
    } catch (error) {
      console.error('Error analyzing profile:', error);
      alert('Error al analizar el perfil. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeBio = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const suggestions = await getAIProfileFeedback(
        userProfile.descripcion || '',
        userProfile.intereses || []
      );
      setResults(prev => ({ ...prev, bioSuggestions: suggestions.improvedBio }));
    } catch (error) {
      console.error('Error optimizing bio:', error);
      alert('Error al optimizar la bio. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetDatingTips = async () => {
    if (!userProfile) return;
    
    setLoading(true);
    try {
      const tips = await getAIProfileFeedback(
        userProfile.descripcion || '',
        userProfile.intereses || []
      );
      setResults(prev => ({ ...prev, datingTips: tips.feedback }));
    } catch (error) {
      console.error('Error getting dating tips:', error);
      alert('Error al obtener consejos. Verifica tu conexión a internet.');
    } finally {
      setLoading(false);
    }
  };

  const formatAIResponse = (text) => {
    if (!text) return null;
    
    return text.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      
      // Detectar títulos (líneas que terminan con :)
      if (line.trim().endsWith(':')) {
        return (
          <h4 key={index} className="font-semibold text-gray-900 dark:text-white mt-4 mb-2">
            {line.trim()}
          </h4>
        );
      }
      
      // Detectar listas numeradas
      if (line.match(/^\d+\./)) {
        return (
          <div key={index} className="mb-2 pl-4">
            <span className="font-medium text-pink-600">{line.match(/^\d+\./)[0]}</span>
            <span className="ml-2">{line.replace(/^\d+\.\s*/, '')}</span>
          </div>
        );
      }
      
      return (
        <p key={index} className="mb-2 text-gray-700 dark:text-gray-300">
          {line}
        </p>
      );
    });
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/ultra-profile')}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">arrow_back</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">psychology</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Coach</h1>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Powered by Gemini AI
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-2">person</span>
            Análisis de Perfil
          </button>
          <button
            onClick={() => setActiveTab('bio')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bio'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-2">edit</span>
            Optimizar Bio
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'tips'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-sm mr-2">lightbulb</span>
            Consejos
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Profile Analysis Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">analytics</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Análisis de Perfil
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Obtén feedback personalizado sobre tu perfil
                  </p>
                </div>
              </div>

              {/* Current Profile Preview */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Tu perfil actual:</h3>
                <div className="flex items-start gap-3">
                  <img 
                    src={userProfile.fotos?.[0] || user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {userProfile.nombre}, {userProfile.edad}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {userProfile.descripcion || 'Sin descripción'}
                    </p>
                    {userProfile.intereses && userProfile.intereses.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {userProfile.intereses.map((interes, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-xs rounded-full"
                          >
                            {interes}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAnalyzeProfile}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Analizando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">psychology</span>
                    Analizar mi perfil
                  </>
                )}
              </button>

              {results.profileAnalysis && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    Análisis completado
                  </h3>
                  <div className="text-sm">
                    {formatAIResponse(results.profileAnalysis)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bio Optimization Tab */}
          {activeTab === 'bio' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">edit</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Optimizar Bio
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mejora tu descripción para atraer más matches
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Bio actual:</h3>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{userProfile.descripcion || 'Sin descripción'}"
                </p>
              </div>

              <button
                onClick={handleOptimizeBio}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Optimizando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">auto_fix_high</span>
                    Optimizar mi bio
                  </>
                )}
              </button>

              {results.bioSuggestions && (
                <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">auto_fix_high</span>
                    Sugerencias de bio
                  </h3>
                  <div className="text-sm">
                    {formatAIResponse(results.bioSuggestions)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dating Tips Tab */}
          {activeTab === 'tips' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">lightbulb</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Consejos de Citas
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tips personalizados para tener éxito en las citas
                  </p>
                </div>
              </div>

              <button
                onClick={handleGetDatingTips}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generando consejos...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">tips_and_updates</span>
                    Obtener consejos personalizados
                  </>
                )}
              </button>

              {results.datingTips && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined">tips_and_updates</span>
                    Consejos personalizados
                  </h3>
                  <div className="text-sm">
                    {formatAIResponse(results.datingTips)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* API Key Notice */}
        {!import.meta.env.VITE_GEMINI_API_KEY && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-0.5">warning</span>
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                  API Key requerida
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Para usar el AI Coach, necesitas configurar tu API key de Gemini en las variables de entorno.
                  Agrega <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">VITE_GEMINI_API_KEY</code> a tu archivo .env.local
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}