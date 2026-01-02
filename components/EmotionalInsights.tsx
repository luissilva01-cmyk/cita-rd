// cita-rd/components/EmotionalInsights.tsx
import React, { useState } from 'react';
import { Brain, Heart, TrendingUp, MessageCircle, Lightbulb, X, BarChart3 } from 'lucide-react';
import { EmotionAnalysis, ConversationInsights, SmartSuggestion, ConversationMetrics } from '../services/emotionalAI';

interface EmotionalInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmotion?: EmotionAnalysis | null;
  conversationInsights?: ConversationInsights | null;
  smartSuggestions?: SmartSuggestion[];
  conversationMetrics?: ConversationMetrics | null;
  onSuggestionSelect?: (suggestion: SmartSuggestion) => void;
}

const EmotionalInsights: React.FC<EmotionalInsightsProps> = ({
  isOpen,
  onClose,
  currentEmotion,
  conversationInsights,
  smartSuggestions = [],
  conversationMetrics,
  onSuggestionSelect
}) => {
  const [activeTab, setActiveTab] = useState<'emotion' | 'insights' | 'suggestions' | 'metrics'>('emotion');

  if (!isOpen) return null;

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      joy: 'text-yellow-500',
      excitement: 'text-orange-500',
      love: 'text-red-500',
      interest: 'text-blue-500',
      nervousness: 'text-purple-500',
      flirtation: 'text-pink-500',
      playfulness: 'text-green-500',
      boredom: 'text-gray-500',
      frustration: 'text-red-600'
    };
    return colors[emotion] || 'text-gray-500';
  };

  const getEmotionEmoji = (emotion: string): string => {
    const emojis: Record<string, string> = {
      joy: '😊',
      excitement: '🤩',
      love: '❤️',
      interest: '🤔',
      nervousness: '😅',
      flirtation: '😏',
      playfulness: '😄',
      boredom: '😐',
      frustration: '😤',
      curiosity: '🧐',
      affection: '🥰',
      humor: '😂'
    };
    return emojis[emotion] || '🙂';
  };

  const getSentimentColor = (sentiment: string): string => {
    switch (sentiment) {
      case 'positive': return 'text-green-500';
      case 'negative': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthColor = (health: string): string => {
    switch (health) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'declining': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Brain className="text-purple-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">IA Emocional</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('emotion')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'emotion'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Emoción Actual
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'insights'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Análisis Chat
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Lightbulb className="w-4 h-4 inline mr-2" />
            Sugerencias
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === 'metrics'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Métricas
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          
          {/* Emoción Actual */}
          {activeTab === 'emotion' && (
            <div className="space-y-4">
              {currentEmotion ? (
                <>
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {getEmotionEmoji(currentEmotion.dominantEmotion)}
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${getEmotionColor(currentEmotion.dominantEmotion)}`}>
                      {currentEmotion.dominantEmotion.charAt(0).toUpperCase() + currentEmotion.dominantEmotion.slice(1)}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Intensidad: {Math.round(currentEmotion.intensity * 100)}% | 
                      Confianza: {Math.round(currentEmotion.confidence * 100)}%
                    </p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      currentEmotion.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                      currentEmotion.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Sentimiento: {currentEmotion.sentiment}
                    </div>
                  </div>

                  {/* Todas las emociones detectadas */}
                  {currentEmotion.emotions.length > 1 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Emociones Detectadas</h4>
                      <div className="space-y-2">
                        {currentEmotion.emotions.slice(0, 5).map((emotion, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getEmotionEmoji(emotion.emotion)}</span>
                              <span className={`font-medium ${getEmotionColor(emotion.emotion)}`}>
                                {emotion.emotion}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${emotion.score * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-500 w-8">
                                {Math.round(emotion.score * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay análisis emocional disponible</p>
                  <p className="text-sm text-gray-400 mt-2">Envía un mensaje para ver el análisis</p>
                </div>
              )}
            </div>
          )}

          {/* Análisis de Conversación */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {conversationInsights ? (
                <>
                  {/* Estado General */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Sentimiento General</h4>
                      <div className={`text-lg font-bold ${getSentimentColor(conversationInsights.overallSentiment)}`}>
                        {conversationInsights.overallSentiment === 'positive' ? '😊 Positivo' :
                         conversationInsights.overallSentiment === 'negative' ? '😔 Negativo' :
                         '😐 Neutral'}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Salud del Chat</h4>
                      <div className={`text-lg font-bold ${getHealthColor(conversationInsights.conversationHealth)}`}>
                        {conversationInsights.conversationHealth === 'excellent' ? '🌟 Excelente' :
                         conversationInsights.conversationHealth === 'good' ? '👍 Bueno' :
                         conversationInsights.conversationHealth === 'declining' ? '📉 Declinando' :
                         '⚠️ Pobre'}
                      </div>
                    </div>
                  </div>

                  {/* Métricas */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Compatibilidad y Engagement</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Compatibilidad Emocional</span>
                          <span className="text-sm font-medium">{Math.round(conversationInsights.emotionalCompatibility * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${conversationInsights.emotionalCompatibility * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600">Nivel de Engagement</span>
                          <span className="text-sm font-medium">{Math.round(conversationInsights.engagementLevel * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${conversationInsights.engagementLevel * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Factores de Riesgo */}
                  {conversationInsights.riskFactors.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">⚠️ Factores de Riesgo</h4>
                      <div className="space-y-2">
                        {conversationInsights.riskFactors.map((risk, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-red-700">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recomendaciones */}
                  {conversationInsights.recommendations.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">💡 Recomendaciones</h4>
                      <div className="space-y-2">
                        {conversationInsights.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-blue-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay análisis de conversación disponible</p>
                  <p className="text-sm text-gray-400 mt-2">Intercambia algunos mensajes para ver el análisis</p>
                </div>
              )}
            </div>
          )}

          {/* Sugerencias Inteligentes */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {smartSuggestions.length > 0 ? (
                <>
                  <h4 className="font-semibold text-gray-900">💡 Sugerencias Inteligentes</h4>
                  <div className="space-y-3">
                    {smartSuggestions.map((suggestion) => (
                      <div 
                        key={suggestion.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => onSuggestionSelect?.(suggestion)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-purple-600 capitalize">
                              {suggestion.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-gray-500">
                              {Math.round(suggestion.confidence * 100)}% confianza
                            </span>
                          </div>
                          <div className="flex gap-1">
                            {suggestion.emotionalContext.map((emotion, index) => (
                              <span key={index} className="text-sm">
                                {getEmotionEmoji(emotion)}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-900 mb-2 font-medium">"{suggestion.text}"</p>
                        <p className="text-sm text-gray-600">{suggestion.reasoning}</p>
                        
                        {suggestion.timing !== 'immediate' && (
                          <div className="mt-2 text-xs text-gray-500">
                            ⏰ Timing: {suggestion.timing === 'after_delay' ? 'Después de un momento' : 'Cuando esté en línea'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay sugerencias disponibles</p>
                  <p className="text-sm text-gray-400 mt-2">Continúa la conversación para recibir sugerencias</p>
                </div>
              )}
            </div>
          )}

          {/* Métricas */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {conversationMetrics ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{conversationMetrics.messageCount}</div>
                      <div className="text-sm text-gray-600">Mensajes</div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(conversationMetrics.averageResponseTime / 60000)}m
                      </div>
                      <div className="text-sm text-gray-600">Tiempo Respuesta</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Interés Mutuo</span>
                        <span className="text-sm font-medium">{Math.round(conversationMetrics.mutualInterestScore * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full"
                          style={{ width: `${conversationMetrics.mutualInterestScore * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">Momentum de Conversación</span>
                        <span className="text-sm font-medium">{Math.round(conversationMetrics.conversationMomentum * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-600 h-3 rounded-full"
                          style={{ width: `${conversationMetrics.conversationMomentum * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className={`w-5 h-5 ${
                        conversationMetrics.emotionalTrend === 'improving' ? 'text-green-500' :
                        conversationMetrics.emotionalTrend === 'declining' ? 'text-red-500' :
                        'text-gray-500'
                      }`} />
                      <span className="font-medium text-gray-900">Tendencia Emocional</span>
                    </div>
                    <span className={`font-medium capitalize ${
                      conversationMetrics.emotionalTrend === 'improving' ? 'text-green-600' :
                      conversationMetrics.emotionalTrend === 'declining' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {conversationMetrics.emotionalTrend === 'improving' ? '📈 Mejorando' :
                       conversationMetrics.emotionalTrend === 'declining' ? '📉 Declinando' :
                       '➡️ Estable'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay métricas disponibles</p>
                  <p className="text-sm text-gray-400 mt-2">Intercambia mensajes para ver las métricas</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionalInsights;