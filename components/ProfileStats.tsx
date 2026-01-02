// cita-rd/components/ProfileStats.tsx
import React from 'react';
import { Heart, MessageCircle, Eye, Star, TrendingUp } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    likes: number;
    matches: number;
    views: number;
    rating: number;
    popularity: number;
  };
  className?: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, className = '' }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 80) return 'text-green-600 bg-green-100';
    if (popularity >= 60) return 'text-yellow-600 bg-yellow-100';
    if (popularity >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPopularityLabel = (popularity: number) => {
    if (popularity >= 80) return 'Muy Popular';
    if (popularity >= 60) return 'Popular';
    if (popularity >= 40) return 'Moderado';
    return 'Nuevo';
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 ${className}`}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp size={20} className="text-blue-500" />
        Estadísticas del Perfil
      </h3>

      {/* Grid de estadísticas */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <Heart className="text-red-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-red-600">{formatNumber(stats.likes)}</div>
          <div className="text-xs text-red-500 font-medium">Likes</div>
        </div>

        <div className="text-center p-3 bg-blue-50 rounded-xl">
          <MessageCircle className="text-blue-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-blue-600">{formatNumber(stats.matches)}</div>
          <div className="text-xs text-blue-500 font-medium">Matches</div>
        </div>

        <div className="text-center p-3 bg-purple-50 rounded-xl">
          <Eye className="text-purple-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-purple-600">{formatNumber(stats.views)}</div>
          <div className="text-xs text-purple-500 font-medium">Vistas</div>
        </div>

        <div className="text-center p-3 bg-yellow-50 rounded-xl">
          <Star className="text-yellow-500 mx-auto mb-2" size={24} />
          <div className="text-2xl font-bold text-yellow-600">{stats.rating.toFixed(1)}</div>
          <div className="text-xs text-yellow-500 font-medium">Rating</div>
        </div>
      </div>

      {/* Indicador de popularidad */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Popularidad</span>
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPopularityColor(stats.popularity)}`}>
            {getPopularityLabel(stats.popularity)}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${stats.popularity}%` }}
          ></div>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          {stats.popularity}% más popular que otros usuarios
        </div>
      </div>

      {/* Consejos para mejorar */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Consejo para mejorar</h4>
        <p className="text-xs text-blue-700">
          {stats.popularity < 50 
            ? "Agrega más fotos y completa tu bio para aumentar tu popularidad"
            : stats.popularity < 80
            ? "¡Vas bien! Mantente activo y responde a tus matches"
            : "¡Excelente! Tu perfil es muy atractivo"
          }
        </p>
      </div>
    </div>
  );
};

export default ProfileStats;