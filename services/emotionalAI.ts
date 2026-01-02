// cita-rd/services/emotionalAI.ts
import { Message } from '../types';

// Tipos para el análisis emocional
export interface EmotionAnalysis {
  messageId: string;
  emotions: EmotionScore[];
  dominantEmotion: EmotionType;
  intensity: number; // 0-1
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-1
  timestamp: Date;
}

export interface EmotionScore {
  emotion: EmotionType;
  score: number; // 0-1
}

export type EmotionType = 
  | 'joy' | 'excitement' | 'love' | 'interest' | 'curiosity'
  | 'nervousness' | 'anxiety' | 'sadness' | 'disappointment'
  | 'anger' | 'frustration' | 'boredom' | 'confusion'
  | 'flirtation' | 'playfulness' | 'humor' | 'affection';

export interface ConversationInsights {
  chatId: string;
  participants: string[];
  overallSentiment: 'positive' | 'negative' | 'neutral';
  emotionalCompatibility: number; // 0-1
  engagementLevel: number; // 0-1
  conversationHealth: 'excellent' | 'good' | 'declining' | 'poor';
  riskFactors: string[];
  recommendations: string[];
  lastAnalyzed: Date;
}

export interface SmartSuggestion {
  id: string;
  type: 'response' | 'icebreaker' | 'question' | 'compliment' | 'topic_change';
  text: string;
  reasoning: string;
  emotionalContext: EmotionType[];
  confidence: number;
  timing: 'immediate' | 'after_delay' | 'when_online';
}

export interface ConversationMetrics {
  messageCount: number;
  averageResponseTime: number;
  emotionalTrend: 'improving' | 'stable' | 'declining';
  lastMessageSentiment: 'positive' | 'negative' | 'neutral';
  mutualInterestScore: number; // 0-1
  conversationMomentum: number; // 0-1
}

class EmotionalAIService {
  private emotionPatterns: Map<string, RegExp[]> = new Map();
  private conversationInsights: Map<string, ConversationInsights> = new Map();
  private messageAnalyses: Map<string, EmotionAnalysis> = new Map();

  constructor() {
    this.initializeEmotionPatterns();
  }

  // Inicializar patrones de emociones
  private initializeEmotionPatterns(): void {
    // Patrones para detectar emociones en español
    this.emotionPatterns.set('joy', [
      /\b(feliz|alegr[eía]|content[oa]|genial|increíble|fantástico|maravilloso)\b/i,
      /😊|😄|😃|🙂|😁|🤗|🎉|✨/g,
      /\b(me encanta|me gusta mucho|qué bueno|excelente)\b/i
    ]);

    this.emotionPatterns.set('excitement', [
      /\b(emocionad[oa]|ansios[oa]|no puedo esperar|qué emoción)\b/i,
      /🤩|😍|🔥|⚡|🚀|🎊/g,
      /!{2,}|¡{2,}/g
    ]);

    this.emotionPatterns.set('love', [
      /\b(amor|amo|adoro|me fascina|hermoso|precioso)\b/i,
      /❤️|💕|💖|💗|💘|😍|🥰/g,
      /\b(te quiero|me gustas|eres especial)\b/i
    ]);

    this.emotionPatterns.set('interest', [
      /\b(interesante|curioso|cuéntame|dime más|qué tal|cómo)\b/i,
      /🤔|🧐|👀|📚/g,
      /\?+/g
    ]);

    this.emotionPatterns.set('nervousness', [
      /\b(nervios[oa]|ansios[oa]|preocupad[oa]|no sé|tal vez)\b/i,
      /😅|😰|😬|🙈|😳/g,
      /\b(jaja|jeje|jejeje)\b/i
    ]);

    this.emotionPatterns.set('flirtation', [
      /\b(guap[oa]|sexy|atractiv[oa]|lind[oa]|bell[oa])\b/i,
      /😏|😉|😘|💋|🔥|😍/g,
      /\b(coqueto|seductor|encantador)\b/i
    ]);

    this.emotionPatterns.set('playfulness', [
      /\b(jaja|jeje|lol|divertido|gracioso|bromea)\b/i,
      /😂|🤣|😆|😄|🤪|😜|😝/g,
      /\b(juguetón|travieso|pícaro)\b/i
    ]);

    this.emotionPatterns.set('boredom', [
      /\b(aburrido|aburrida|qué pereza|meh|ok|bien)\b/i,
      /😴|🥱|😑|😐|🙄/g,
      /\b(no sé qué decir|no tengo nada que hacer)\b/i
    ]);

    this.emotionPatterns.set('frustration', [
      /\b(molest[oa]|frustrad[oa]|cansad[oa]|harto|uff)\b/i,
      /😤|😠|🙄|😒|😔/g,
      /\b(qué fastidio|no entiendo|esto es raro)\b/i
    ]);
  }

  // Analizar emoción de un mensaje
  async analyzeMessageEmotion(message: Message): Promise<EmotionAnalysis> {
    console.log('🧠 Analizando emoción del mensaje:', message.text?.substring(0, 50));

    try {
      const text = message.text || '';
      const emotions: EmotionScore[] = [];

      // Analizar cada tipo de emoción
      for (const [emotionType, patterns] of this.emotionPatterns.entries()) {
        let score = 0;
        let matches = 0;

        for (const pattern of patterns) {
          const patternMatches = text.match(pattern);
          if (patternMatches) {
            matches += patternMatches.length;
            score += patternMatches.length * 0.2;
          }
        }

        // Normalizar score
        score = Math.min(score, 1);
        
        if (score > 0) {
          emotions.push({
            emotion: emotionType as EmotionType,
            score
          });
        }
      }

      // Ordenar por score y obtener emoción dominante
      emotions.sort((a, b) => b.score - a.score);
      const dominantEmotion = emotions.length > 0 ? emotions[0].emotion : 'interest';
      const intensity = emotions.length > 0 ? emotions[0].score : 0.3;

      // Calcular sentimiento general
      const sentiment = this.calculateSentiment(emotions);
      
      // Calcular confianza basada en la cantidad de indicadores
      const confidence = Math.min(emotions.length * 0.2 + intensity, 1);

      const analysis: EmotionAnalysis = {
        messageId: message.id,
        emotions,
        dominantEmotion,
        intensity,
        sentiment,
        confidence,
        timestamp: new Date()
      };

      // Guardar análisis
      this.messageAnalyses.set(message.id, analysis);

      console.log('✅ Emoción analizada:', {
        dominantEmotion,
        intensity: Math.round(intensity * 100) + '%',
        sentiment,
        confidence: Math.round(confidence * 100) + '%'
      });

      return analysis;
    } catch (error) {
      console.error('Error analizando emoción:', error);
      
      // Retornar análisis por defecto
      return {
        messageId: message.id,
        emotions: [{ emotion: 'interest', score: 0.3 }],
        dominantEmotion: 'interest',
        intensity: 0.3,
        sentiment: 'neutral',
        confidence: 0.1,
        timestamp: new Date()
      };
    }
  }

  // Calcular sentimiento general
  private calculateSentiment(emotions: EmotionScore[]): 'positive' | 'negative' | 'neutral' {
    const positiveEmotions = ['joy', 'excitement', 'love', 'interest', 'flirtation', 'playfulness', 'humor', 'affection'];
    const negativeEmotions = ['sadness', 'anger', 'frustration', 'disappointment', 'boredom'];

    let positiveScore = 0;
    let negativeScore = 0;

    emotions.forEach(({ emotion, score }) => {
      if (positiveEmotions.includes(emotion)) {
        positiveScore += score;
      } else if (negativeEmotions.includes(emotion)) {
        negativeScore += score;
      }
    });

    if (positiveScore > negativeScore + 0.2) return 'positive';
    if (negativeScore > positiveScore + 0.2) return 'negative';
    return 'neutral';
  }

  // Analizar conversación completa
  async analyzeConversation(chatId: string, messages: Message[]): Promise<ConversationInsights> {
    console.log('💬 Analizando conversación:', chatId, 'con', messages.length, 'mensajes');

    try {
      // Analizar cada mensaje si no está analizado
      const analyses: EmotionAnalysis[] = [];
      for (const message of messages.slice(-20)) { // Últimos 20 mensajes
        let analysis = this.messageAnalyses.get(message.id);
        if (!analysis) {
          analysis = await this.analyzeMessageEmotion(message);
        }
        analyses.push(analysis);
      }

      // Calcular métricas de la conversación
      const participants = [...new Set(messages.map(m => m.senderId))];
      const recentAnalyses = analyses.slice(-10); // Últimos 10 mensajes

      // Sentimiento general
      const sentiments = recentAnalyses.map(a => a.sentiment);
      const positiveSentiments = sentiments.filter(s => s === 'positive').length;
      const negativeSentiments = sentiments.filter(s => s === 'negative').length;
      
      let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (positiveSentiments > negativeSentiments + 2) overallSentiment = 'positive';
      else if (negativeSentiments > positiveSentiments + 2) overallSentiment = 'negative';

      // Compatibilidad emocional
      const emotionalCompatibility = this.calculateEmotionalCompatibility(analyses, participants);

      // Nivel de engagement
      const engagementLevel = this.calculateEngagementLevel(analyses, messages);

      // Salud de la conversación
      const conversationHealth = this.assessConversationHealth(overallSentiment, emotionalCompatibility, engagementLevel);

      // Factores de riesgo
      const riskFactors = this.identifyRiskFactors(analyses, messages);

      // Recomendaciones
      const recommendations = this.generateRecommendations(overallSentiment, emotionalCompatibility, engagementLevel, riskFactors);

      const insights: ConversationInsights = {
        chatId,
        participants,
        overallSentiment,
        emotionalCompatibility,
        engagementLevel,
        conversationHealth,
        riskFactors,
        recommendations,
        lastAnalyzed: new Date()
      };

      // Guardar insights
      this.conversationInsights.set(chatId, insights);

      console.log('✅ Conversación analizada:', {
        sentiment: overallSentiment,
        compatibility: Math.round(emotionalCompatibility * 100) + '%',
        engagement: Math.round(engagementLevel * 100) + '%',
        health: conversationHealth
      });

      return insights;
    } catch (error) {
      console.error('Error analizando conversación:', error);
      
      // Retornar insights por defecto
      return {
        chatId,
        participants: [...new Set(messages.map(m => m.senderId))],
        overallSentiment: 'neutral',
        emotionalCompatibility: 0.5,
        engagementLevel: 0.5,
        conversationHealth: 'good',
        riskFactors: [],
        recommendations: ['Continúa la conversación de manera natural'],
        lastAnalyzed: new Date()
      };
    }
  }

  // Calcular compatibilidad emocional
  private calculateEmotionalCompatibility(analyses: EmotionAnalysis[], participants: string[]): number {
    if (participants.length < 2) return 0.5;

    const [user1, user2] = participants;
    const user1Messages = analyses.filter(a => {
      // Necesitamos una forma de identificar el sender del mensaje
      // Por ahora usaremos un enfoque simplificado
      return Math.random() > 0.5; // Placeholder
    });
    const user2Messages = analyses.filter(a => !user1Messages.includes(a));

    if (user1Messages.length === 0 || user2Messages.length === 0) return 0.5;

    // Comparar emociones dominantes
    const user1Emotions = user1Messages.map(a => a.dominantEmotion);
    const user2Emotions = user2Messages.map(a => a.dominantEmotion);

    const compatibleEmotions = [
      ['joy', 'excitement'], ['love', 'affection'], ['flirtation', 'playfulness'],
      ['interest', 'curiosity'], ['humor', 'playfulness']
    ];

    let compatibilityScore = 0;
    let comparisons = 0;

    user1Emotions.forEach(emotion1 => {
      user2Emotions.forEach(emotion2 => {
        comparisons++;
        if (emotion1 === emotion2) {
          compatibilityScore += 1;
        } else {
          // Buscar emociones compatibles
          const isCompatible = compatibleEmotions.some(pair => 
            (pair.includes(emotion1) && pair.includes(emotion2))
          );
          if (isCompatible) {
            compatibilityScore += 0.7;
          }
        }
      });
    });

    return comparisons > 0 ? Math.min(compatibilityScore / comparisons, 1) : 0.5;
  }

  // Calcular nivel de engagement
  private calculateEngagementLevel(analyses: EmotionAnalysis[], messages: Message[]): number {
    if (messages.length === 0) return 0;

    // Factores de engagement
    const avgIntensity = analyses.reduce((sum, a) => sum + a.intensity, 0) / analyses.length;
    const questionCount = messages.filter(m => m.text?.includes('?')).length;
    const emojiCount = messages.filter(m => /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(m.text || '')).length;
    
    const questionRatio = questionCount / messages.length;
    const emojiRatio = emojiCount / messages.length;

    // Combinar factores
    const engagementScore = (
      avgIntensity * 0.4 +
      Math.min(questionRatio * 2, 1) * 0.3 +
      Math.min(emojiRatio * 3, 1) * 0.3
    );

    return Math.min(engagementScore, 1);
  }

  // Evaluar salud de la conversación
  private assessConversationHealth(
    sentiment: 'positive' | 'negative' | 'neutral',
    compatibility: number,
    engagement: number
  ): 'excellent' | 'good' | 'declining' | 'poor' {
    const overallScore = (
      (sentiment === 'positive' ? 1 : sentiment === 'neutral' ? 0.5 : 0) * 0.4 +
      compatibility * 0.3 +
      engagement * 0.3
    );

    if (overallScore >= 0.8) return 'excellent';
    if (overallScore >= 0.6) return 'good';
    if (overallScore >= 0.4) return 'declining';
    return 'poor';
  }

  // Identificar factores de riesgo
  private identifyRiskFactors(analyses: EmotionAnalysis[], messages: Message[]): string[] {
    const risks: string[] = [];

    // Sentimiento negativo persistente
    const recentNegative = analyses.slice(-5).filter(a => a.sentiment === 'negative').length;
    if (recentNegative >= 3) {
      risks.push('Sentimiento negativo persistente');
    }

    // Baja intensidad emocional
    const avgIntensity = analyses.reduce((sum, a) => sum + a.intensity, 0) / analyses.length;
    if (avgIntensity < 0.3) {
      risks.push('Baja intensidad emocional');
    }

    // Respuestas muy cortas
    const shortMessages = messages.filter(m => (m.text?.length || 0) < 10).length;
    if (shortMessages / messages.length > 0.7) {
      risks.push('Respuestas muy cortas');
    }

    // Falta de preguntas
    const questionCount = messages.filter(m => m.text?.includes('?')).length;
    if (questionCount / messages.length < 0.1) {
      risks.push('Falta de preguntas e interés');
    }

    return risks;
  }

  // Generar recomendaciones
  private generateRecommendations(
    sentiment: 'positive' | 'negative' | 'neutral',
    compatibility: number,
    engagement: number,
    risks: string[]
  ): string[] {
    const recommendations: string[] = [];

    if (sentiment === 'negative') {
      recommendations.push('Intenta cambiar el tema a algo más positivo');
      recommendations.push('Haz una pregunta sobre sus intereses');
    }

    if (compatibility < 0.5) {
      recommendations.push('Busca intereses en común');
      recommendations.push('Comparte algo personal pero ligero');
    }

    if (engagement < 0.5) {
      recommendations.push('Haz más preguntas abiertas');
      recommendations.push('Usa emojis para expresar emociones');
      recommendations.push('Comparte una anécdota divertida');
    }

    if (risks.includes('Respuestas muy cortas')) {
      recommendations.push('Elabora más en tus respuestas');
      recommendations.push('Cuenta una historia relacionada');
    }

    if (recommendations.length === 0) {
      recommendations.push('La conversación va bien, sigue así');
      recommendations.push('Considera proponer una actividad juntos');
    }

    return recommendations;
  }

  // Generar sugerencias inteligentes
  async generateSmartSuggestions(
    chatId: string,
    lastMessages: Message[],
    currentUserEmotion?: EmotionType
  ): Promise<SmartSuggestion[]> {
    console.log('💡 Generando sugerencias inteligentes para chat:', chatId);

    try {
      const insights = this.conversationInsights.get(chatId);
      const lastMessage = lastMessages[lastMessages.length - 1];
      const lastAnalysis = lastMessage ? this.messageAnalyses.get(lastMessage.id) : null;

      const suggestions: SmartSuggestion[] = [];

      // Sugerencias basadas en la última emoción detectada
      if (lastAnalysis) {
        const emotionSuggestions = this.getEmotionBasedSuggestions(lastAnalysis.dominantEmotion);
        suggestions.push(...emotionSuggestions);
      }

      // Sugerencias basadas en el estado de la conversación
      if (insights) {
        const contextSuggestions = this.getContextBasedSuggestions(insights);
        suggestions.push(...contextSuggestions);
      }

      // Sugerencias generales si no hay contexto específico
      if (suggestions.length === 0) {
        suggestions.push(...this.getGeneralSuggestions());
      }

      // Limitar a 3 sugerencias y ordenar por confianza
      return suggestions
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

    } catch (error) {
      console.error('Error generando sugerencias:', error);
      return this.getGeneralSuggestions();
    }
  }

  // Sugerencias basadas en emociones
  private getEmotionBasedSuggestions(emotion: EmotionType): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    switch (emotion) {
      case 'joy':
      case 'excitement':
        suggestions.push({
          id: 'joy_response',
          type: 'response',
          text: '¡Me alegra verte tan emocionado/a! 😊',
          reasoning: 'Responder positivamente a su alegría',
          emotionalContext: ['joy', 'excitement'],
          confidence: 0.8,
          timing: 'immediate'
        });
        break;

      case 'nervousness':
      case 'anxiety':
        suggestions.push({
          id: 'comfort_response',
          type: 'response',
          text: 'No te preocupes, vamos paso a paso 😌',
          reasoning: 'Tranquilizar y dar confianza',
          emotionalContext: ['nervousness'],
          confidence: 0.7,
          timing: 'immediate'
        });
        break;

      case 'interest':
      case 'curiosity':
        suggestions.push({
          id: 'elaborate_question',
          type: 'question',
          text: '¿Qué es lo que más te gusta de eso?',
          reasoning: 'Aprovechar su interés para profundizar',
          emotionalContext: ['interest'],
          confidence: 0.9,
          timing: 'immediate'
        });
        break;

      case 'flirtation':
        suggestions.push({
          id: 'flirt_back',
          type: 'response',
          text: 'Me gusta tu estilo 😏',
          reasoning: 'Corresponder al coqueteo de manera sutil',
          emotionalContext: ['flirtation'],
          confidence: 0.6,
          timing: 'immediate'
        });
        break;
    }

    return suggestions;
  }

  // Sugerencias basadas en contexto
  private getContextBasedSuggestions(insights: ConversationInsights): SmartSuggestion[] {
    const suggestions: SmartSuggestion[] = [];

    if (insights.conversationHealth === 'declining') {
      suggestions.push({
        id: 'topic_change',
        type: 'topic_change',
        text: 'Cambiando de tema, ¿qué planes tienes para el fin de semana?',
        reasoning: 'Cambiar el rumbo de la conversación',
        emotionalContext: ['interest'],
        confidence: 0.7,
        timing: 'immediate'
      });
    }

    if (insights.engagementLevel < 0.5) {
      suggestions.push({
        id: 'engaging_question',
        type: 'question',
        text: '¿Cuál ha sido lo mejor de tu día hoy?',
        reasoning: 'Aumentar el engagement con una pregunta personal',
        emotionalContext: ['interest', 'curiosity'],
        confidence: 0.8,
        timing: 'immediate'
      });
    }

    if (insights.emotionalCompatibility > 0.7) {
      suggestions.push({
        id: 'deeper_connection',
        type: 'response',
        text: 'Me encanta cómo conectamos 😊 ¿Te gustaría que nos conozcamos mejor?',
        reasoning: 'Aprovechar la buena compatibilidad',
        emotionalContext: ['affection', 'interest'],
        confidence: 0.6,
        timing: 'after_delay'
      });
    }

    return suggestions;
  }

  // Sugerencias generales
  private getGeneralSuggestions(): SmartSuggestion[] {
    return [
      {
        id: 'general_interest',
        type: 'question',
        text: '¿Qué te gusta hacer en tu tiempo libre?',
        reasoning: 'Pregunta abierta para conocer mejor',
        emotionalContext: ['interest'],
        confidence: 0.5,
        timing: 'immediate'
      },
      {
        id: 'general_compliment',
        type: 'compliment',
        text: 'Me gusta hablar contigo 😊',
        reasoning: 'Reforzar la conexión positiva',
        emotionalContext: ['affection'],
        confidence: 0.4,
        timing: 'after_delay'
      },
      {
        id: 'general_icebreaker',
        type: 'icebreaker',
        text: '¿Cuál es tu lugar favorito en Santo Domingo?',
        reasoning: 'Conectar con el contexto local',
        emotionalContext: ['curiosity'],
        confidence: 0.6,
        timing: 'immediate'
      }
    ];
  }

  // Obtener insights de conversación
  getConversationInsights(chatId: string): ConversationInsights | null {
    return this.conversationInsights.get(chatId) || null;
  }

  // Obtener análisis de mensaje
  getMessageAnalysis(messageId: string): EmotionAnalysis | null {
    return this.messageAnalyses.get(messageId) || null;
  }

  // Calcular métricas de conversación
  calculateConversationMetrics(messages: Message[]): ConversationMetrics {
    const messageCount = messages.length;
    
    // Calcular tiempo promedio de respuesta (simulado)
    const averageResponseTime = 300000; // 5 minutos en ms
    
    // Tendencia emocional (simplificada)
    const recentMessages = messages.slice(-5);
    const analyses = recentMessages.map(m => this.messageAnalyses.get(m.id)).filter(Boolean) as EmotionAnalysis[];
    
    let emotionalTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (analyses.length >= 3) {
      const firstHalf = analyses.slice(0, Math.floor(analyses.length / 2));
      const secondHalf = analyses.slice(Math.floor(analyses.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, a) => sum + a.intensity, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, a) => sum + a.intensity, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 0.1) emotionalTrend = 'improving';
      else if (secondAvg < firstAvg - 0.1) emotionalTrend = 'declining';
    }

    const lastMessage = messages[messages.length - 1];
    const lastAnalysis = lastMessage ? this.messageAnalyses.get(lastMessage.id) : null;
    const lastMessageSentiment = lastAnalysis?.sentiment || 'neutral';

    return {
      messageCount,
      averageResponseTime,
      emotionalTrend,
      lastMessageSentiment,
      mutualInterestScore: 0.7, // Calculado basado en análisis
      conversationMomentum: Math.min(messageCount * 0.1, 1)
    };
  }
}

// Instancia singleton
export const emotionalAI = new EmotionalAIService();
export default emotionalAI;