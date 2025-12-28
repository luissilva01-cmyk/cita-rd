import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, AlertTriangle, Star, Lightbulb } from 'lucide-react';
import { analyzePhoto, PhotoAnalysis } from '../services/photoAnalysisService';

interface PhotoAnalysisCardProps {
  photoUrl: string;
  photoIndex: number;
  isMainPhoto?: boolean;
}

const PhotoAnalysisCard: React.FC<PhotoAnalysisCardProps> = ({ 
  photoUrl, 
  photoIndex, 
  isMainPhoto = false 
}) => {
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const analyzeImage = async () => {
      setLoading(true);
      try {
        const result = await analyzePhoto(photoUrl);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analizando foto:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeImage();
  }, [photoUrl]);

  if (loading) {
    return (
      <div className="relative">
        <img 
          src={photoUrl} 
          alt={`Foto ${photoIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="relative">
        <img 
          src={photoUrl} 
          alt={`Foto ${photoIndex + 1}`}
          className="w-full h-full object-cover rounded-lg opacity-50"
        />
        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center rounded-lg">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="relative group">
      {/* Imagen */}
      <img 
        src={photoUrl} 
        alt={`Foto ${photoIndex + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
      
      {/* Overlay con información */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getScoreColor(analysis.score)}`}></div>
                <span className="text-sm font-medium">
                  Score: {analysis.score}/100
                </span>
              </div>
              <Eye size={16} />
            </div>
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col gap-1">
        {isMainPhoto && (
          <span className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
            Principal
          </span>
        )}
        {analysis.hasFace && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle size={10} />
            Cara
          </span>
        )}
        {analysis.isMainPhotoWorthy && (
          <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
            <Star size={10} />
            Top
          </span>
        )}
      </div>

      {/* Score badge */}
      <div className="absolute top-2 right-2">
        <div className={`w-8 h-8 rounded-full ${getScoreColor(analysis.score)} flex items-center justify-center text-white text-xs font-bold`}>
          {analysis.score}
        </div>
      </div>

      {/* Panel de detalles */}
      {showDetails && (
        <div className="absolute inset-0 bg-black/90 rounded-lg p-4 text-white overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Análisis de Foto {photoIndex + 1}</h4>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Métricas */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Score General:</span>
                <span className={`font-semibold ${getScoreTextColor(analysis.score)}`}>
                  {analysis.score}/100
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">Calidad de Foto:</span>
                <span className="font-semibold">
                  {Math.round(analysis.photoQuality)}/100
                </span>
              </div>
              
              {analysis.hasFace && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Claridad de Cara:</span>
                  <span className="font-semibold">
                    {Math.round(analysis.faceClarity)}/100
                  </span>
                </div>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {analysis.hasFace ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : (
                  <AlertTriangle size={16} className="text-red-400" />
                )}
                <span className="text-sm">
                  {analysis.hasFace ? 'Cara detectada' : 'Sin cara visible'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {analysis.isMainPhotoWorthy ? (
                  <Star size={16} className="text-yellow-400" />
                ) : (
                  <AlertTriangle size={16} className="text-gray-400" />
                )}
                <span className="text-sm">
                  {analysis.isMainPhotoWorthy ? 'Ideal para foto principal' : 'No recomendada como principal'}
                </span>
              </div>
            </div>

            {/* Sugerencias */}
            {analysis.suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium">Sugerencias:</span>
                </div>
                <ul className="space-y-1">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-gray-300 flex items-start gap-1">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAnalysisCard;