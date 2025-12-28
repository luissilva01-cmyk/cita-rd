import React, { useState, useEffect } from 'react';
import { Star, Award, Eye, TrendingUp, CheckCircle, AlertCircle, Zap } from 'lucide-react';
import { calculateProfileScore, getProfileRecommendations, ProfileScore as ProfileScoreType } from '../services/photoAnalysisService';

interface ProfileScoreProps {
  photos: string[];
  userId: string;
}

const ProfileScore: React.FC<ProfileScoreProps> = ({ photos, userId }) => {
  const [score, setScore] = useState<ProfileScoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    const analyzeProfile = async () => {
      setLoading(true);
      try {
        const profileScore = await calculateProfileScore(photos);
        const recs = getProfileRecommendations(profileScore);
        
        setScore(profileScore);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error analizando perfil:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeProfile();
  }, [photos]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-500"></div>
          <span className="text-slate-600">Analizando tu perfil...</span>
        </div>
      </div>
    );
  }

  if (!score) {
    return (
      <div className="bg-red-50 rounded-lg p-6 border border-red-200">
        <div className="flex items-center gap-2 text-red-700">
          <AlertCircle size={20} />
          <span>Error analizando el perfil</span>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      {/* Score Principal */}
      <div className={`rounded-lg p-6 border ${getScoreBackground(score.totalScore)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${score.totalScore >= 80 ? 'bg-green-500' : score.totalScore >= 60 ? 'bg-yellow-500' : score.totalScore >= 40 ? 'bg-orange-500' : 'bg-red-500'}`}>
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Score del Perfil</h3>
              <p className="text-sm text-slate-600">Tu atractivo en la plataforma</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${getScoreColor(score.totalScore)}`}>
              {score.totalScore}
            </div>
            <div className="text-sm text-slate-500">/ 100</div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              score.totalScore >= 80 ? 'bg-green-500' : 
              score.totalScore >= 60 ? 'bg-yellow-500' : 
              score.totalScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${score.totalScore}%` }}
          ></div>
        </div>

        {/* Boost de visibilidad */}
        <div className="flex items-center gap-2 text-sm">
          <Eye size={16} className="text-slate-500" />
          <span className="text-slate-600">
            Visibilidad: <span className="font-semibold text-rose-600">
              {score.visibilityBoost.toFixed(1)}x
            </span>
          </span>
          {score.visibilityBoost > 1.5 && (
            <Zap size={14} className="text-yellow-500" />
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-slate-700">Fotos</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{score.photoCount}</div>
          <div className="text-xs text-slate-500">
            {score.verifiedPhotos} con cara visible
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Award size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-slate-700">Calidad</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{score.qualityAverage}%</div>
          <div className="text-xs text-slate-500">Promedio de fotos</div>
        </div>
      </div>

      {/* Badges */}
      {score.badges.length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
            <Award size={16} className="text-yellow-500" />
            Logros Desbloqueados
          </h4>
          <div className="flex flex-wrap gap-2">
            {score.badges.map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-medium rounded-full"
              >
                <CheckCircle size={12} />
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
            <TrendingUp size={16} />
            Cómo Mejorar tu Perfil
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-blue-700">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mensaje motivacional */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border border-rose-200">
        <div className="text-center">
          {score.totalScore >= 80 ? (
            <div>
              <div className="text-2xl mb-2">🎉</div>
              <p className="text-sm font-medium text-rose-800">
                ¡Perfil excelente! Estás en el top 20% de usuarios.
              </p>
            </div>
          ) : score.totalScore >= 60 ? (
            <div>
              <div className="text-2xl mb-2">👍</div>
              <p className="text-sm font-medium text-rose-800">
                ¡Buen perfil! Sigue las recomendaciones para llegar al top.
              </p>
            </div>
          ) : score.totalScore >= 40 ? (
            <div>
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm font-medium text-rose-800">
                Perfil en desarrollo. ¡Unas mejoras y estarás listo!
              </p>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-2">🚀</div>
              <p className="text-sm font-medium text-rose-800">
                ¡Empecemos! Sigue los consejos para crear un perfil atractivo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScore;