import React, { useState, useEffect } from 'react';
import { Heart, Star, MessageCircle, Clock, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { obtenerMatches, obtenerLikesRecibidos } from '../services/likesService';
import BottomNavigation from '../components/comunes/BottomNavigation';

export default function MatchesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      cargarDatos();
    }
  }, [user?.uid]);

  const cargarDatos = async () => {
    if (!user?.uid) return;
    
    try {
      setLoading(true);
      const [matchesData, likesData] = await Promise.all([
        obtenerMatches(user.uid),
        obtenerLikesRecibidos(user.uid)
      ]);
      setMatches(matchesData);
      setLikes(likesData);
    } catch (error) {
      console.error('Error cargando matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="text-white" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para ver tus matches
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas una cuenta para ver tus likes y matches
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = timestamp.toDate();
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    return `Hace ${Math.floor(diffInHours / 24)}d`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Matches</h1>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'matches'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'likes'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Likes ({likes.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'matches' ? (
          <div>
            {matches.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="text-gray-300 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aún no tienes matches
                </h3>
                <p className="text-gray-600">
                  Sigue deslizando para encontrar tu match perfecto
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {matches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={match.fotoUrl}
                        alt={match.nombre}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        {match.tipo === 'superlike' && (
                          <div className="bg-blue-500 rounded-full p-1">
                            <Star className="text-white" size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {match.nombre}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                        <Clock size={14} />
                        {formatTimeAgo(match.fechaMatch)}
                      </div>
                      <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-xl font-medium flex items-center justify-center gap-2">
                        <MessageCircle size={16} />
                        Enviar mensaje
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {likes.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="text-gray-300 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No tienes likes nuevos
                </h3>
                <p className="text-gray-600">
                  Mejora tu perfil para recibir más likes
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {likes.map((like) => (
                  <div
                    key={like.id}
                    className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4"
                  >
                    <div className="relative">
                      <img
                        src={like.fotoUrl}
                        alt={like.nombre}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {like.tipo === 'superlike' && (
                        <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                          <Star className="text-white" size={12} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {like.nombre}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock size={14} />
                        {formatTimeAgo(like.fecha)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <X className="text-gray-600" size={20} />
                      </button>
                      <button className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Heart className="text-white" size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}