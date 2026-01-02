// cita-rd/services/matchingAI.ts
import { UserProfile } from '../types';

// Tipos para el sistema de IA
export interface UserBehavior {
  userId: string;
  swipeHistory: SwipeAction[];
  chatEngagement: ChatMetrics;
  profileViews: ProfileView[];
  timeSpentOnProfiles: Record<string, number>;
  preferencePatterns: PreferencePattern[];
  lastActive: Date;
  sessionDuration: number;
  averageResponseTime: number;
}

export interface SwipeAction {
  targetUserId: string;
  action: 'like' | 'pass' | 'superlike';
  timestamp: Date;
  timeSpentViewing: number;
  profileCompleteness: number;
  targetUserFeatures: UserFeatures;
}

export interface ChatMetrics {
  totalChats: number;
  averageMessageLength: number;
  responseRate: number;
  conversationDuration: number;
  successfulDates: number;
  ghostingRate: number;
}

export interface ProfileView {
  targetUserId: string;
  viewDuration: number;
  photosViewed: number;
  timestamp: Date;
  scrollDepth: number;
}

export interface PreferencePattern {
  feature: string;
  importance: number;
  preferredRange: [number, number] | string[];
  confidence: number;
}

export interface UserFeatures {
  age: number;
  location: string;
  education?: string;
  profession?: string;
  interests: string[];
  photoQuality: number;
  profileCompleteness: number;
  verificationStatus: boolean;
  activityLevel: number;
  responseRate: number;
}

export interface CompatibilityScore {
  overall: number;
  breakdown: {
    interests: number;
    lifestyle: number;
    communication: number;
    values: number;
    physical: number;
    location: number;
  };
  confidence: number;
  reasons: string[];
}

export interface MatchPrediction {
  userId: string;
  targetUserId: string;
  compatibilityScore: CompatibilityScore;
  likelihoodOfMatch: number;
  likelihoodOfConversation: number;
  likelihoodOfMeeting: number;
  recommendationReason: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
}

class MatchingAIService {
  private userBehaviors: Map<string, UserBehavior> = new Map();
  private matchHistory: Map<string, MatchPrediction[]> = new Map();

  // Analizar comportamiento del usuario
  async analyzeUserBehavior(userId: string): Promise<UserBehavior> {
    console.log('🧠 Analizando comportamiento del usuario:', userId);
    
    try {
      // Obtener datos existentes o crear nuevos
      let behavior = this.userBehaviors.get(userId);
      
      if (!behavior) {
        behavior = {
          userId,
          swipeHistory: [],
          chatEngagement: {
            totalChats: 0,
            averageMessageLength: 0,
            responseRate: 0,
            conversationDuration: 0,
            successfulDates: 0,
            ghostingRate: 0
          },
          profileViews: [],
          timeSpentOnProfiles: {},
          preferencePatterns: [],
          lastActive: new Date(),
          sessionDuration: 0,
          averageResponseTime: 0
        };
        
        this.userBehaviors.set(userId, behavior);
      }
      
      return behavior;
    } catch (error) {
      console.error('Error analizando comportamiento:', error);
      throw error;
    }
  }

  // Registrar acción de swipe
  async recordSwipeAction(userId: string, action: SwipeAction): Promise<void> {
    console.log('📱 Registrando swipe:', userId, action.action, action.targetUserId);
    
    try {
      const behavior = await this.analyzeUserBehavior(userId);
      behavior.swipeHistory.push(action);
      
      // Mantener solo los últimos 1000 swipes para performance
      if (behavior.swipeHistory.length > 1000) {
        behavior.swipeHistory = behavior.swipeHistory.slice(-1000);
      }
      
      // Actualizar patrones de preferencia
      await this.updatePreferencePatterns(userId, action);
      
      this.userBehaviors.set(userId, behavior);
    } catch (error) {
      console.error('Error registrando swipe:', error);
    }
  }

  // Actualizar patrones de preferencia basados en swipes
  private async updatePreferencePatterns(userId: string, action: SwipeAction): Promise<void> {
    const behavior = this.userBehaviors.get(userId);
    if (!behavior) return;

    const { targetUserFeatures, action: swipeAction } = action;
    const weight = swipeAction === 'superlike' ? 3 : swipeAction === 'like' ? 1 : -0.5;

    // Analizar edad preferida
    this.updatePreferencePattern(behavior, 'age', targetUserFeatures.age, weight);
    
    // Analizar intereses
    targetUserFeatures.interests.forEach(interest => {
      this.updatePreferencePattern(behavior, `interest_${interest}`, 1, weight);
    });
    
    // Analizar calidad de fotos
    this.updatePreferencePattern(behavior, 'photoQuality', targetUserFeatures.photoQuality, weight);
    
    // Analizar completitud del perfil
    this.updatePreferencePattern(behavior, 'profileCompleteness', targetUserFeatures.profileCompleteness, weight);
    
    // Analizar verificación
    this.updatePreferencePattern(behavior, 'verification', targetUserFeatures.verificationStatus ? 1 : 0, weight);
  }

  private updatePreferencePattern(behavior: UserBehavior, feature: string, value: number, weight: number): void {
    let pattern = behavior.preferencePatterns.find(p => p.feature === feature);
    
    if (!pattern) {
      pattern = {
        feature,
        importance: 0,
        preferredRange: [value, value],
        confidence: 0
      };
      behavior.preferencePatterns.push(pattern);
    }
    
    // Actualizar importancia
    pattern.importance += Math.abs(weight);
    
    // Actualizar rango preferido
    if (Array.isArray(pattern.preferredRange)) {
      const [min, max] = pattern.preferredRange as [number, number];
      if (weight > 0) {
        // Expandir rango hacia valores que gustan
        pattern.preferredRange = [
          Math.min(min, value - 2),
          Math.max(max, value + 2)
        ];
      }
    }
    
    // Actualizar confianza
    pattern.confidence = Math.min(1, pattern.confidence + 0.1);
  }

  // Calcular compatibilidad entre dos usuarios
  async calculateCompatibility(user1: UserProfile, user2: UserProfile): Promise<CompatibilityScore> {
    console.log('💕 Calculando compatibilidad entre:', user1.name, 'y', user2.name);
    
    try {
      const user1Behavior = await this.analyzeUserBehavior(user1.id);
      
      // Calcular scores individuales
      const interestsScore = this.calculateInterestsCompatibility(user1, user2);
      const lifestyleScore = this.calculateLifestyleCompatibility(user1, user2);
      const communicationScore = await this.calculateCommunicationCompatibility(user1.id, user2.id);
      const valuesScore = this.calculateValuesCompatibility(user1, user2);
      const physicalScore = this.calculatePhysicalCompatibility(user1, user2, user1Behavior);
      const locationScore = this.calculateLocationCompatibility(user1, user2);
      
      // Calcular score general ponderado
      const overall = (
        interestsScore * 0.25 +
        lifestyleScore * 0.20 +
        communicationScore * 0.15 +
        valuesScore * 0.15 +
        physicalScore * 0.15 +
        locationScore * 0.10
      );
      
      const reasons = this.generateCompatibilityReasons(
        interestsScore, lifestyleScore, communicationScore, 
        valuesScore, physicalScore, locationScore, user1, user2
      );
      
      return {
        overall: Math.round(overall * 100) / 100,
        breakdown: {
          interests: Math.round(interestsScore * 100) / 100,
          lifestyle: Math.round(lifestyleScore * 100) / 100,
          communication: Math.round(communicationScore * 100) / 100,
          values: Math.round(valuesScore * 100) / 100,
          physical: Math.round(physicalScore * 100) / 100,
          location: Math.round(locationScore * 100) / 100
        },
        confidence: 0.85,
        reasons
      };
    } catch (error) {
      console.error('Error calculando compatibilidad:', error);
      return {
        overall: 0.5,
        breakdown: {
          interests: 0.5,
          lifestyle: 0.5,
          communication: 0.5,
          values: 0.5,
          physical: 0.5,
          location: 0.5
        },
        confidence: 0.1,
        reasons: ['Error en el cálculo de compatibilidad']
      };
    }
  }

  private calculateInterestsCompatibility(user1: UserProfile, user2: UserProfile): number {
    const interests1 = new Set(user1.interests);
    const interests2 = new Set(user2.interests);
    
    const intersection = new Set([...interests1].filter(x => interests2.has(x)));
    const union = new Set([...interests1, ...interests2]);
    
    if (union.size === 0) return 0.5;
    
    // Jaccard similarity con bonus por intereses compartidos
    const jaccardSimilarity = intersection.size / union.size;
    const sharedInterestsBonus = Math.min(intersection.size * 0.1, 0.3);
    
    return Math.min(jaccardSimilarity + sharedInterestsBonus, 1);
  }

  private calculateLifestyleCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0.5; // Base score
    
    // Diferencia de edad (preferencia por rangos similares)
    const ageDiff = Math.abs(user1.age - user2.age);
    const ageScore = Math.max(0, 1 - (ageDiff / 10));
    score = (score + ageScore) / 2;
    
    // Ubicación (bonus por proximidad)
    if (user1.location === user2.location) {
      score += 0.2;
    }
    
    // Trabajo/profesión (si está disponible)
    if (user1.job && user2.job) {
      const jobCompatibility = user1.job === user2.job ? 0.15 : 0;
      score += jobCompatibility;
    }
    
    return Math.min(score, 1);
  }

  private async calculateCommunicationCompatibility(userId1: string, userId2: string): Promise<number> {
    // Por ahora retornamos un score base, pero aquí se analizaría:
    // - Estilo de comunicación
    // - Frecuencia de respuesta
    // - Longitud de mensajes
    // - Uso de emojis, etc.
    
    const behavior1 = this.userBehaviors.get(userId1);
    const behavior2 = this.userBehaviors.get(userId2);
    
    if (!behavior1 || !behavior2) return 0.6;
    
    // Comparar tiempos de respuesta
    const responseTimeDiff = Math.abs(behavior1.averageResponseTime - behavior2.averageResponseTime);
    const responseScore = Math.max(0, 1 - (responseTimeDiff / 3600000)); // 1 hora = score 0
    
    return responseScore;
  }

  private calculateValuesCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0.5;
    
    // Verificación (usuarios verificados tienden a valorar la autenticidad)
    if (user1.isVerified && user2.isVerified) {
      score += 0.2;
    } else if (user1.isVerified !== user2.isVerified) {
      score -= 0.1;
    }
    
    // Completitud del perfil (indica seriedad)
    const completeness1 = this.calculateProfileCompleteness(user1);
    const completeness2 = this.calculateProfileCompleteness(user2);
    const completenessScore = 1 - Math.abs(completeness1 - completeness2);
    score = (score + completenessScore) / 2;
    
    return Math.min(Math.max(score, 0), 1);
  }

  private calculatePhysicalCompatibility(user1: UserProfile, user2: UserProfile, behavior: UserBehavior): number {
    // Analizar patrones de preferencia física basados en comportamiento pasado
    let score = 0.5;
    
    // Buscar patrones de edad preferida
    const agePattern = behavior.preferencePatterns.find(p => p.feature === 'age');
    if (agePattern && Array.isArray(agePattern.preferredRange)) {
      const [minAge, maxAge] = agePattern.preferredRange as [number, number];
      if (user2.age >= minAge && user2.age <= maxAge) {
        score += 0.3 * agePattern.confidence;
      }
    }
    
    // Buscar patrones de calidad de foto
    const photoQualityPattern = behavior.preferencePatterns.find(p => p.feature === 'photoQuality');
    if (photoQualityPattern) {
      const user2PhotoQuality = this.estimatePhotoQuality(user2);
      if (Array.isArray(photoQualityPattern.preferredRange)) {
        const [minQuality, maxQuality] = photoQualityPattern.preferredRange as [number, number];
        if (user2PhotoQuality >= minQuality && user2PhotoQuality <= maxQuality) {
          score += 0.2 * photoQualityPattern.confidence;
        }
      }
    }
    
    return Math.min(score, 1);
  }

  private calculateLocationCompatibility(user1: UserProfile, user2: UserProfile): number {
    // Extraer distancia del string de distancia (ej: "5km" -> 5)
    const distance = parseFloat(user2.distance?.replace(/[^\d.]/g, '') || '0');
    
    if (distance === 0) return 1; // Misma ubicación
    if (distance <= 5) return 0.9;
    if (distance <= 10) return 0.7;
    if (distance <= 25) return 0.5;
    if (distance <= 50) return 0.3;
    return 0.1;
  }

  private calculateProfileCompleteness(user: UserProfile): number {
    let completeness = 0;
    
    if (user.name) completeness += 0.1;
    if (user.age) completeness += 0.1;
    if (user.bio && user.bio.length > 20) completeness += 0.2;
    if (user.location) completeness += 0.1;
    if (user.images && user.images.length >= 3) completeness += 0.3;
    if (user.interests && user.interests.length >= 3) completeness += 0.1;
    if (user.job) completeness += 0.1;
    
    return completeness;
  }

  private estimatePhotoQuality(user: UserProfile): number {
    // Estimación básica de calidad de fotos
    // En una implementación real, esto usaría análisis de imagen con IA
    let quality = 0.5;
    
    if (user.images && user.images.length >= 3) quality += 0.2;
    if (user.images && user.images.length >= 5) quality += 0.1;
    if (user.isVerified) quality += 0.2; // Fotos verificadas tienden a ser de mejor calidad
    
    return Math.min(quality, 1);
  }

  private generateCompatibilityReasons(
    interests: number, lifestyle: number, communication: number,
    values: number, physical: number, location: number,
    user1: UserProfile, user2: UserProfile
  ): string[] {
    const reasons: string[] = [];
    
    if (interests > 0.7) {
      const sharedInterests = user1.interests.filter(i => user2.interests.includes(i));
      reasons.push(`Comparten intereses en ${sharedInterests.slice(0, 2).join(' y ')}`);
    }
    
    if (lifestyle > 0.7) {
      const ageDiff = Math.abs(user1.age - user2.age);
      if (ageDiff <= 3) {
        reasons.push('Edades muy compatibles');
      }
    }
    
    if (location > 0.8) {
      reasons.push('Viven cerca el uno del otro');
    }
    
    if (values > 0.7) {
      if (user1.isVerified && user2.isVerified) {
        reasons.push('Ambos tienen perfiles verificados');
      }
    }
    
    if (reasons.length === 0) {
      reasons.push('Potencial de buena conexión');
    }
    
    return reasons;
  }

  // Generar predicciones de match
  async generateMatchPredictions(userId: string, candidates: UserProfile[]): Promise<MatchPrediction[]> {
    console.log('🎯 Generando predicciones para:', userId, 'con', candidates.length, 'candidatos');
    
    try {
      const user = candidates.find(c => c.id === userId);
      if (!user) throw new Error('Usuario no encontrado');
      
      const predictions: MatchPrediction[] = [];
      
      for (const candidate of candidates) {
        if (candidate.id === userId) continue;
        
        const compatibility = await this.calculateCompatibility(user, candidate);
        const behavior = await this.analyzeUserBehavior(userId);
        
        // Calcular probabilidades basadas en comportamiento histórico
        const likelihoodOfMatch = this.calculateMatchLikelihood(compatibility, behavior);
        const likelihoodOfConversation = this.calculateConversationLikelihood(compatibility, behavior);
        const likelihoodOfMeeting = this.calculateMeetingLikelihood(compatibility, behavior);
        
        const prediction: MatchPrediction = {
          userId,
          targetUserId: candidate.id,
          compatibilityScore: compatibility,
          likelihoodOfMatch,
          likelihoodOfConversation,
          likelihoodOfMeeting,
          recommendationReason: this.generateRecommendationReason(compatibility),
          priority: this.calculatePriority(compatibility, likelihoodOfMatch),
          timestamp: new Date()
        };
        
        predictions.push(prediction);
      }
      
      // Ordenar por score de compatibilidad y probabilidad de match
      predictions.sort((a, b) => {
        const scoreA = a.compatibilityScore.overall * a.likelihoodOfMatch;
        const scoreB = b.compatibilityScore.overall * b.likelihoodOfMatch;
        return scoreB - scoreA;
      });
      
      // Guardar predicciones
      this.matchHistory.set(userId, predictions);
      
      return predictions;
    } catch (error) {
      console.error('Error generando predicciones:', error);
      return [];
    }
  }

  private calculateMatchLikelihood(compatibility: CompatibilityScore, behavior: UserBehavior): number {
    let likelihood = compatibility.overall;
    
    // Ajustar basado en historial de swipes
    const recentLikes = behavior.swipeHistory
      .filter(s => s.action === 'like' || s.action === 'superlike')
      .slice(-50);
    
    if (recentLikes.length > 0) {
      const likeRate = recentLikes.length / Math.min(behavior.swipeHistory.length, 50);
      likelihood = (likelihood + likeRate) / 2;
    }
    
    return Math.min(likelihood, 0.95);
  }

  private calculateConversationLikelihood(compatibility: CompatibilityScore, behavior: UserBehavior): number {
    let likelihood = compatibility.breakdown.communication * 0.7 + compatibility.overall * 0.3;
    
    // Ajustar basado en engagement en chats
    if (behavior.chatEngagement.responseRate > 0) {
      likelihood = (likelihood + behavior.chatEngagement.responseRate) / 2;
    }
    
    return Math.min(likelihood, 0.9);
  }

  private calculateMeetingLikelihood(compatibility: CompatibilityScore, behavior: UserBehavior): number {
    let likelihood = compatibility.overall * 0.5 + compatibility.breakdown.location * 0.3 + compatibility.breakdown.values * 0.2;
    
    // Ajustar basado en historial de citas exitosas
    if (behavior.chatEngagement.successfulDates > 0) {
      const meetingRate = behavior.chatEngagement.successfulDates / Math.max(behavior.chatEngagement.totalChats, 1);
      likelihood = (likelihood + meetingRate) / 2;
    }
    
    return Math.min(likelihood, 0.8);
  }

  private generateRecommendationReason(compatibility: CompatibilityScore): string {
    const topReason = compatibility.reasons[0];
    const score = Math.round(compatibility.overall * 100);
    
    return `${score}% compatible - ${topReason}`;
  }

  private calculatePriority(compatibility: CompatibilityScore, matchLikelihood: number): 'high' | 'medium' | 'low' {
    const combinedScore = compatibility.overall * matchLikelihood;
    
    if (combinedScore >= 0.7) return 'high';
    if (combinedScore >= 0.5) return 'medium';
    return 'low';
  }

  // Obtener mejores matches para un usuario
  async getBestMatches(userId: string, limit: number = 10): Promise<MatchPrediction[]> {
    const predictions = this.matchHistory.get(userId) || [];
    return predictions.slice(0, limit);
  }

  // Actualizar comportamiento después de una interacción
  async updateUserEngagement(userId: string, targetUserId: string, engagementType: 'message' | 'date' | 'ghost'): Promise<void> {
    const behavior = await this.analyzeUserBehavior(userId);
    
    switch (engagementType) {
      case 'message':
        behavior.chatEngagement.totalChats++;
        break;
      case 'date':
        behavior.chatEngagement.successfulDates++;
        break;
      case 'ghost':
        behavior.chatEngagement.ghostingRate = 
          (behavior.chatEngagement.ghostingRate * behavior.chatEngagement.totalChats + 1) / 
          (behavior.chatEngagement.totalChats + 1);
        break;
    }
    
    this.userBehaviors.set(userId, behavior);
  }
}

// Instancia singleton
export const matchingAI = new MatchingAIService();
export default matchingAI;