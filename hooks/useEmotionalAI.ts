// cita-rd/hooks/useEmotionalAI.ts
import { useState, useCallback } from 'react';
import { Message } from '../types';
import { 
  emotionalAI, 
  EmotionAnalysis, 
  ConversationInsights, 
  SmartSuggestion,
  ConversationMetrics 
} from '../services/emotionalAI';

interface UseEmotionalAIReturn {
  // Estados
  currentEmotion: EmotionAnalysis | null;
  conversationInsights: ConversationInsights | null;
  smartSuggestions: SmartSuggestion[];
  conversationMetrics: ConversationMetrics | null;
  isAnalyzing: boolean;
  error: string | null;

  // Funciones
  analyzeMessage: (message: Message) => Promise<EmotionAnalysis | null>;
  analyzeConversation: (chatId: string, messages: Message[]) => Promise<ConversationInsights | null>;
  generateSuggestions: (chatId: string, messages: Message[]) => Promise<SmartSuggestion[]>;
  getInsights: (chatId: string) => ConversationInsights | null;
  calculateMetrics: (messages: Message[]) => ConversationMetrics;
  clearAnalysis: () => void;
}

export const useEmotionalAI = (): UseEmotionalAIReturn => {
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis | null>(null);
  const [conversationInsights, setConversationInsights] = useState<ConversationInsights | null>(null);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [conversationMetrics, setConversationMetrics] = useState<ConversationMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Analizar mensaje individual
  const analyzeMessage = useCallback(async (message: Message): Promise<EmotionAnalysis | null> => {
    console.log('🧠 useEmotionalAI - Analizando mensaje:', message.text?.substring(0, 30));
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await emotionalAI.analyzeMessageEmotion(message);
      setCurrentEmotion(analysis);
      
      console.log('✅ Mensaje analizado:', {
        emotion: analysis.dominantEmotion,
        intensity: Math.round(analysis.intensity * 100) + '%',
        sentiment: analysis.sentiment
      });

      return analysis;
    } catch (err) {
      console.error('❌ Error analizando mensaje:', err);
      setError(err instanceof Error ? err.message : 'Error analizando mensaje');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Analizar conversación completa
  const analyzeConversation = useCallback(async (
    chatId: string, 
    messages: Message[]
  ): Promise<ConversationInsights | null> => {
    console.log('💬 useEmotionalAI - Analizando conversación:', chatId, 'con', messages.length, 'mensajes');
    setIsAnalyzing(true);
    setError(null);

    try {
      const insights = await emotionalAI.analyzeConversation(chatId, messages);
      setConversationInsights(insights);

      console.log('✅ Conversación analizada:', {
        sentiment: insights.overallSentiment,
        compatibility: Math.round(insights.emotionalCompatibility * 100) + '%',
        health: insights.conversationHealth
      });

      return insights;
    } catch (err) {
      console.error('❌ Error analizando conversación:', err);
      setError(err instanceof Error ? err.message : 'Error analizando conversación');
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Generar sugerencias inteligentes
  const generateSuggestions = useCallback(async (
    chatId: string, 
    messages: Message[]
  ): Promise<SmartSuggestion[]> => {
    console.log('💡 useEmotionalAI - Generando sugerencias para:', chatId);
    setIsAnalyzing(true);
    setError(null);

    try {
      const suggestions = await emotionalAI.generateSmartSuggestions(chatId, messages);
      setSmartSuggestions(suggestions);

      console.log('✅ Sugerencias generadas:', suggestions.length);
      suggestions.forEach(s => {
        console.log(`  💡 ${s.type}: "${s.text}" (${Math.round(s.confidence * 100)}%)`);
      });

      return suggestions;
    } catch (err) {
      console.error('❌ Error generando sugerencias:', err);
      setError(err instanceof Error ? err.message : 'Error generando sugerencias');
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Obtener insights existentes
  const getInsights = useCallback((chatId: string): ConversationInsights | null => {
    const insights = emotionalAI.getConversationInsights(chatId);
    if (insights) {
      setConversationInsights(insights);
    }
    return insights;
  }, []);

  // Calcular métricas de conversación
  const calculateMetrics = useCallback((messages: Message[]): ConversationMetrics => {
    console.log('📊 useEmotionalAI - Calculando métricas para', messages.length, 'mensajes');
    
    try {
      const metrics = emotionalAI.calculateConversationMetrics(messages);
      setConversationMetrics(metrics);

      console.log('✅ Métricas calculadas:', {
        messageCount: metrics.messageCount,
        trend: metrics.emotionalTrend,
        momentum: Math.round(metrics.conversationMomentum * 100) + '%'
      });

      return metrics;
    } catch (err) {
      console.error('❌ Error calculando métricas:', err);
      setError(err instanceof Error ? err.message : 'Error calculando métricas');
      
      // Retornar métricas por defecto
      const defaultMetrics: ConversationMetrics = {
        messageCount: messages.length,
        averageResponseTime: 300000,
        emotionalTrend: 'stable',
        lastMessageSentiment: 'neutral',
        mutualInterestScore: 0.5,
        conversationMomentum: 0.5
      };
      
      setConversationMetrics(defaultMetrics);
      return defaultMetrics;
    }
  }, []);

  // Limpiar análisis
  const clearAnalysis = useCallback(() => {
    console.log('🧹 useEmotionalAI - Limpiando análisis');
    setCurrentEmotion(null);
    setConversationInsights(null);
    setSmartSuggestions([]);
    setConversationMetrics(null);
    setError(null);
  }, []);

  return {
    // Estados
    currentEmotion,
    conversationInsights,
    smartSuggestions,
    conversationMetrics,
    isAnalyzing,
    error,

    // Funciones
    analyzeMessage,
    analyzeConversation,
    generateSuggestions,
    getInsights,
    calculateMetrics,
    clearAnalysis
  };
};

export default useEmotionalAI;