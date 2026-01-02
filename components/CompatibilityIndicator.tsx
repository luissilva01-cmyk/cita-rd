// cita-rd/components/CompatibilityIndicator.tsx
import React from 'react';
import { Heart, Brain, MessageCircle, MapPin, Star, Users } from 'lucide-react';
import { CompatibilityScore } from '../services/matchingAI';

interface CompatibilityIndicatorProps {
  compatibility: CompatibilityScore;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompatibilityIndicator: React.FC<CompatibilityIndicatorProps> = ({
  compatibility,
  showDetails = false,
  size = 'md',
  className = ''
}) => {
  const getScoreColor = (score: number): string => {
    if (score >= 0.8) return 'text-green-500';
    if (score >= 0.6) return 'text-yellow-500';
    if (score >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getScoreGradient = (score: number): string => {
    if (score >= 0.8) return 'from-green-400 to-green-600';
    if (score >= 0.6) return 'from-yellow-400 to-yellow-600';
    if (score >= 0.4) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };

  const percentage = Math.round(compatibility.overall * 100);

  return (
    <div className={`${className}`}>
      {/* Indicador principal */}
      <div className="flex items-center gap-3">
        {/* Círculo de compatibilidad */}
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
          {/* Fondo del círculo */}
          <div className="absolute inset-0 rounded-full bg-gray-200"></div>
          
          {/* Progreso del círculo */}
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.83} 283`}
              className={`${getScoreColor(compatibility.overall)} transition-all duration-1000`}
            />
          </svg>
          
          {/* Porcentaje */}
          <div className={`relative z-10 font-bold ${getScoreColor(compatibility.overall)}`}>
            {percentage}%
          </div>
        </div>

        {/* Información básica */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Heart className={`w-4 h-4 ${getScoreColor(compatibility.overall)}`} />
            <span className="font-semibold text-gray-900">
              {percentage >= 80 ? 'Excelente Match' :
               percentage >= 60 ? 'Buen Match' :
               percentage >= 40 ? 'Match Promedio' :
               'Match Bajo'}
            </span>
          </div>
          
          {compatibility.reasons.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {compatibility.reasons[0]}
            </p>
          )}
          
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-gray-500">
              {Math.round(compatibility.confidence * 100)}% confianza
            </span>
          </div>
        </div>
      </div>

      {/* Detalles expandidos */}
      {showDetails && (
        <div className="mt-4 space-y-3">
          <h4 className="font-semibold text-gray-900 text-sm">Desglose de Compatibilidad</h4>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Intereses */}
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Intereses</span>
                  <span className="text-xs font-medium">{Math.round(compatibility.breakdown.interests * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(compatibility.breakdown.interests)}`}
                    style={{ width: `${compatibility.breakdown.interests * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Estilo de vida */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Estilo de vida</span>
                  <span className="text-xs font-medium">{Math.round(compatibility.breakdown.lifestyle * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(compatibility.breakdown.lifestyle)}`}
                    style={{ width: `${compatibility.breakdown.lifestyle * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Comunicación */}
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Comunicación</span>
                  <span className="text-xs font-medium">{Math.round(compatibility.breakdown.communication * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(compatibility.breakdown.communication)}`}
                    style={{ width: `${compatibility.breakdown.communication * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Ubicación</span>
                  <span className="text-xs font-medium">{Math.round(compatibility.breakdown.location * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(compatibility.breakdown.location)}`}
                    style={{ width: `${compatibility.breakdown.location * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Valores */}
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Valores</span>
                  <span className="text-xs font-medium">{Math.round(compatibility.breakdown.values * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(compatibility.breakdown.values)}`}
                    style={{ width: `${compatibility.breakdown.values * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Atracción física */}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Atracción</span>
                  <span className="text-xs font-medium">{Math.round(compatibility.breakdown.physical * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full bg-gradient-to-r ${getScoreGradient(compatibility.breakdown.physical)}`}
                    style={{ width: `${compatibility.breakdown.physical * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Razones adicionales */}
          {compatibility.reasons.length > 1 && (
            <div className="mt-3">
              <h5 className="text-xs font-medium text-gray-700 mb-2">¿Por qué son compatibles?</h5>
              <div className="space-y-1">
                {compatibility.reasons.slice(1).map((reason, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompatibilityIndicator;