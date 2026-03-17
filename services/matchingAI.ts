// cita-rd/services/matchingAI.ts
import { UserProfile } from '../types';
import { doc, getDoc, setDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { logger } from '../utils/logger';

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

// ========== MAPA DE LOCALIDADES DE REPÚBLICA DOMINICANA ==========
// Coordenadas aproximadas para calcular distancia real entre ciudades
const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  'santo domingo': { lat: 18.4861, lng: -69.9312 },
  'santiago': { lat: 19.4517, lng: -70.6970 },
  'la vega': { lat: 19.2210, lng: -70.5298 },
  'san cristóbal': { lat: 18.4170, lng: -70.1067 },
  'san cristobal': { lat: 18.4170, lng: -70.1067 },
  'la romana': { lat: 18.4274, lng: -68.9728 },
  'san pedro de macorís': { lat: 18.4539, lng: -69.3086 },
  'san pedro de macoris': { lat: 18.4539, lng: -69.3086 },
  'puerto plata': { lat: 19.7934, lng: -70.6884 },
  'higüey': { lat: 18.6152, lng: -68.7080 },
  'higuey': { lat: 18.6152, lng: -68.7080 },
  'san francisco de macorís': { lat: 19.3008, lng: -70.2527 },
  'san francisco de macoris': { lat: 19.3008, lng: -70.2527 },
  'moca': { lat: 19.3951, lng: -70.5234 },
  'bonao': { lat: 18.9419, lng: -70.4092 },
  'baní': { lat: 18.2847, lng: -70.3314 },
  'bani': { lat: 18.2847, lng: -70.3314 },
  'azua': { lat: 18.4533, lng: -70.7290 },
  'barahona': { lat: 18.2085, lng: -71.1045 },
  'mao': { lat: 19.5561, lng: -71.0785 },
  'nagua': { lat: 19.3764, lng: -69.8474 },
  'cotuí': { lat: 19.0588, lng: -70.1530 },
  'cotui': { lat: 19.0588, lng: -70.1530 },
  'monte plata': { lat: 18.8072, lng: -69.7849 },
  'punta cana': { lat: 18.5601, lng: -68.3725 },
  'boca chica': { lat: 18.4488, lng: -69.6063 },
  'los alcarrizos': { lat: 18.5131, lng: -70.0131 },
  'santo domingo este': { lat: 18.4883, lng: -69.8571 },
  'santo domingo norte': { lat: 18.5500, lng: -69.9500 },
  'santo domingo oeste': { lat: 18.4900, lng: -70.0100 },
  'distrito nacional': { lat: 18.4861, lng: -69.9312 },
};

// Calcular distancia en km entre dos coordenadas (Haversine)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Buscar coordenadas de una ubicación (fuzzy match)
function findLocationCoords(location: string): { lat: number; lng: number } | null {
  if (!location) return null;
  const normalized = location.toLowerCase().trim();
  
  // Búsqueda exacta
  if (LOCATION_COORDS[normalized]) return LOCATION_COORDS[normalized];
  
  // Búsqueda parcial: si el string contiene alguna ciudad conocida
  for (const [city, coords] of Object.entries(LOCATION_COORDS)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      return coords;
    }
  }
  return null;
}

class MatchingAIService {
  private userBehaviors: Map<string, UserBehavior> = new Map();
  private matchHistory: Map<string, MatchPrediction[]> = new Map();
  private persistenceLoaded: Set<string> = new Set();

  // ========== PERSISTENCIA EN FIRESTORE ==========

  // Cargar comportamiento del usuario desde Firestore
  private async loadBehaviorFromFirestore(userId: string): Promise<UserBehavior | null> {
    try {
      const docRef = doc(db, 'userBehaviors', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Reconstruir fechas desde timestamps
        const behavior: UserBehavior = {
          ...data,
          lastActive: data.lastActive?.toDate?.() || new Date(data.lastActive),
          swipeHistory: (data.swipeHistory || []).map((s: any) => ({
            ...s,
            timestamp: s.timestamp?.toDate?.() || new Date(s.timestamp)
          })),
          profileViews: (data.profileViews || []).map((v: any) => ({
            ...v,
            timestamp: v.timestamp?.toDate?.() || new Date(v.timestamp)
          })),
        } as UserBehavior;
        logger.match.info('📦 Comportamiento cargado de Firestore', { userId, swipes: behavior.swipeHistory.length });
        return behavior;
      }
      return null;
    } catch (error) {
      logger.match.warn('⚠️ Error cargando comportamiento de Firestore', { userId, error });
      return null;
    }
  }

  // Eliminar valores undefined recursivamente (Firestore no los acepta)
  private stripUndefined(obj: any): any {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(item => this.stripUndefined(item));
    const cleaned: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = this.stripUndefined(value);
      }
    }
    return cleaned;
  }

  // Guardar comportamiento en Firestore (debounced, solo últimos 200 swipes)
  private async saveBehaviorToFirestore(userId: string, behavior: UserBehavior): Promise<void> {
    try {
      const docRef = doc(db, 'userBehaviors', userId);
      // Solo guardar los últimos 200 swipes para no exceder límites de Firestore
      const trimmedBehavior = {
        ...behavior,
        swipeHistory: behavior.swipeHistory.slice(-200).map(s => ({
          ...s,
          timestamp: s.timestamp instanceof Date ? s.timestamp.getTime() : s.timestamp
        })),
        profileViews: behavior.profileViews.slice(-50).map(v => ({
          ...v,
          timestamp: v.timestamp instanceof Date ? v.timestamp.getTime() : v.timestamp
        })),
        lastActive: Date.now(),
        updatedAt: Date.now()
      };
      // Limpiar undefined antes de enviar a Firestore
      const cleanData = this.stripUndefined(trimmedBehavior);
      await setDoc(docRef, cleanData, { merge: true });
    } catch (error) {
      logger.match.warn('⚠️ Error guardando comportamiento en Firestore', { userId, error });
    }
  }

  // Analizar comportamiento del usuario (con carga desde Firestore)
  async analyzeUserBehavior(userId: string): Promise<UserBehavior> {
    // Si ya está en memoria, retornar
    let behavior = this.userBehaviors.get(userId);
    
    // Si no está en memoria y no hemos intentado cargar de Firestore, intentar
    if (!behavior && !this.persistenceLoaded.has(userId)) {
      this.persistenceLoaded.add(userId);
      behavior = await this.loadBehaviorFromFirestore(userId) || undefined;
      if (behavior) {
        this.userBehaviors.set(userId, behavior);
        return behavior;
      }
    }
    
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
  }

  // Registrar acción de swipe (con persistencia)
  async recordSwipeAction(userId: string, action: SwipeAction): Promise<void> {
    try {
      const behavior = await this.analyzeUserBehavior(userId);
      behavior.swipeHistory.push(action);
      
      // Mantener solo los últimos 500 swipes en memoria
      if (behavior.swipeHistory.length > 500) {
        behavior.swipeHistory = behavior.swipeHistory.slice(-500);
      }
      
      // Actualizar patrones de preferencia
      this.updatePreferencePatterns(behavior, action);
      this.userBehaviors.set(userId, behavior);
      
      // Persistir en Firestore cada 5 swipes para no hacer demasiadas escrituras
      if (behavior.swipeHistory.length % 5 === 0) {
        this.saveBehaviorToFirestore(userId, behavior);
      }
    } catch (error) {
      logger.match.error('Error registrando swipe', { error });
    }
  }

  // Actualizar patrones de preferencia basados en swipes
  private updatePreferencePatterns(behavior: UserBehavior, action: SwipeAction): void {
    const { targetUserFeatures, action: swipeAction } = action;
    const weight = swipeAction === 'superlike' ? 3 : swipeAction === 'like' ? 1 : -0.5;

    this.updateSinglePattern(behavior, 'age', targetUserFeatures.age, weight);
    
    targetUserFeatures.interests.forEach(interest => {
      this.updateSinglePattern(behavior, `interest_${interest}`, 1, weight);
    });
    
    this.updateSinglePattern(behavior, 'photoQuality', targetUserFeatures.photoQuality, weight);
    this.updateSinglePattern(behavior, 'profileCompleteness', targetUserFeatures.profileCompleteness, weight);
    this.updateSinglePattern(behavior, 'verification', targetUserFeatures.verificationStatus ? 1 : 0, weight);
  }

  private updateSinglePattern(behavior: UserBehavior, feature: string, value: number, weight: number): void {
    let pattern = behavior.preferencePatterns.find(p => p.feature === feature);
    
    if (!pattern) {
      pattern = { feature, importance: 0, preferredRange: [value, value], confidence: 0 };
      behavior.preferencePatterns.push(pattern);
    }
    
    pattern.importance += Math.abs(weight);
    
    if (Array.isArray(pattern.preferredRange) && typeof pattern.preferredRange[0] === 'number') {
      const [min, max] = pattern.preferredRange as [number, number];
      if (weight > 0) {
        pattern.preferredRange = [Math.min(min, value - 2), Math.max(max, value + 2)];
      }
    }
    
    pattern.confidence = Math.min(1, pattern.confidence + 0.05);
  }

  // ========== CÁLCULO DE COMPATIBILIDAD ==========

  async calculateCompatibility(user1: UserProfile, user2: UserProfile): Promise<CompatibilityScore> {
    try {
      const user1Behavior = await this.analyzeUserBehavior(user1.id);
      
      const interestsScore = this.calculateInterestsCompatibility(user1, user2);
      const lifestyleScore = this.calculateLifestyleCompatibility(user1, user2);
      const communicationScore = this.calculateCommunicationCompatibility(user1Behavior, user2.id);
      const valuesScore = this.calculateValuesCompatibility(user1, user2);
      const physicalScore = this.calculatePhysicalCompatibility(user2, user1Behavior);
      const locationScore = this.calculateLocationCompatibility(user1, user2);
      
      // Score general ponderado
      const overall = (
        interestsScore * 0.25 +
        lifestyleScore * 0.20 +
        communicationScore * 0.15 +
        valuesScore * 0.15 +
        physicalScore * 0.15 +
        locationScore * 0.10
      );
      
      // Confianza dinámica basada en datos disponibles
      const confidence = this.calculateDynamicConfidence(user1, user2, user1Behavior);
      
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
        confidence,
        reasons
      };
    } catch (error) {
      logger.match.error('Error calculando compatibilidad', { error });
      return {
        overall: 0.5,
        breakdown: { interests: 0.5, lifestyle: 0.5, communication: 0.5, values: 0.5, physical: 0.5, location: 0.5 },
        confidence: 0.1,
        reasons: ['Error en el cálculo de compatibilidad']
      };
    }
  }

  // ========== CONFIANZA DINÁMICA ==========
  // La confianza refleja cuántos datos reales tenemos para hacer el cálculo
  private calculateDynamicConfidence(user1: UserProfile, user2: UserProfile, behavior: UserBehavior): number {
    let confidenceFactors = 0;
    let totalFactors = 0;

    // Factor 1: ¿Ambos perfiles tienen intereses? (peso 0.2)
    totalFactors++;
    if (user1.interests?.length >= 2 && user2.interests?.length >= 2) confidenceFactors += 1;
    else if (user1.interests?.length >= 1 || user2.interests?.length >= 1) confidenceFactors += 0.5;

    // Factor 2: ¿Ambos tienen bio completa? (peso 0.1)
    totalFactors++;
    if (user1.bio?.length > 20 && user2.bio?.length > 20) confidenceFactors += 1;
    else if (user1.bio?.length > 5 || user2.bio?.length > 5) confidenceFactors += 0.4;

    // Factor 3: ¿Tenemos historial de swipes del usuario? (peso 0.25)
    totalFactors++;
    const swipeCount = behavior.swipeHistory.length;
    if (swipeCount >= 50) confidenceFactors += 1;
    else if (swipeCount >= 20) confidenceFactors += 0.7;
    else if (swipeCount >= 5) confidenceFactors += 0.4;
    else confidenceFactors += 0.1;

    // Factor 4: ¿Ambos tienen ubicación? (peso 0.15)
    totalFactors++;
    if (user1.location && user2.location) confidenceFactors += 1;
    else if (user1.location || user2.location) confidenceFactors += 0.3;

    // Factor 5: ¿Ambos tienen fotos? (peso 0.15)
    totalFactors++;
    if (user1.images?.length >= 3 && user2.images?.length >= 3) confidenceFactors += 1;
    else if (user1.images?.length >= 1 && user2.images?.length >= 1) confidenceFactors += 0.5;

    // Factor 6: ¿Hay datos de engagement en chat? (peso 0.15)
    totalFactors++;
    if (behavior.chatEngagement.totalChats > 0) confidenceFactors += 1;
    else confidenceFactors += 0.1;

    const rawConfidence = confidenceFactors / totalFactors;
    // Escalar entre 0.15 (mínimo) y 0.95 (máximo)
    return Math.round((0.15 + rawConfidence * 0.80) * 100) / 100;
  }

  // ========== DIMENSIONES DE COMPATIBILIDAD ==========

  private calculateInterestsCompatibility(user1: UserProfile, user2: UserProfile): number {
    const interests1 = new Set(user1.interests || []);
    const interests2 = new Set(user2.interests || []);
    
    if (interests1.size === 0 && interests2.size === 0) return 0.5;
    
    const intersection = new Set([...interests1].filter(x => interests2.has(x)));
    const union = new Set([...interests1, ...interests2]);
    
    if (union.size === 0) return 0.5;
    
    const jaccardSimilarity = intersection.size / union.size;
    const sharedInterestsBonus = Math.min(intersection.size * 0.1, 0.3);
    
    return Math.min(jaccardSimilarity + sharedInterestsBonus, 1);
  }

  private calculateLifestyleCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0.5;
    
    // Diferencia de edad
    const ageDiff = Math.abs(user1.age - user2.age);
    const ageScore = Math.max(0, 1 - (ageDiff / 10));
    score = (score + ageScore) / 2;
    
    // Ubicación (usa geolocalización real)
    const coords1 = findLocationCoords(user1.location);
    const coords2 = findLocationCoords(user2.location);
    if (coords1 && coords2) {
      const dist = haversineDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
      if (dist <= 10) score += 0.2;
      else if (dist <= 30) score += 0.1;
    } else if (user1.location && user2.location && 
               user1.location.toLowerCase().trim() === user2.location.toLowerCase().trim()) {
      score += 0.2;
    }
    
    // Profesión
    if (user1.job && user2.job && user1.job.toLowerCase() === user2.job.toLowerCase()) {
      score += 0.1;
    }
    
    // Educación
    if (user1.education && user2.education && user1.education.toLowerCase() === user2.education.toLowerCase()) {
      score += 0.05;
    }
    
    return Math.min(score, 1);
  }

  private calculateCommunicationCompatibility(behavior: UserBehavior, targetUserId: string): number {
    // Si hay datos de chat reales, usarlos
    if (behavior.chatEngagement.totalChats > 0 && behavior.chatEngagement.responseRate > 0) {
      return Math.min(behavior.chatEngagement.responseRate, 1);
    }
    
    // Si no hay datos de chat, usar un score base moderado
    // Usuarios activos (más swipes) tienden a ser mejores comunicadores
    const activityBonus = Math.min(behavior.swipeHistory.length * 0.005, 0.15);
    return 0.5 + activityBonus;
  }

  private calculateValuesCompatibility(user1: UserProfile, user2: UserProfile): number {
    let score = 0.5;
    
    if (user1.isVerified && user2.isVerified) {
      score += 0.2;
    } else if (user1.isVerified !== user2.isVerified) {
      score -= 0.05;
    }
    
    const completeness1 = this.calculateProfileCompleteness(user1);
    const completeness2 = this.calculateProfileCompleteness(user2);
    const completenessScore = 1 - Math.abs(completeness1 - completeness2);
    score = (score + completenessScore) / 2;
    
    // Objetivo de relación (si ambos lo tienen)
    if (user1.relationshipGoal && user2.relationshipGoal) {
      if (user1.relationshipGoal === user2.relationshipGoal) score += 0.15;
      else score -= 0.05;
    }
    
    return Math.min(Math.max(score, 0), 1);
  }

  private calculatePhysicalCompatibility(targetUser: UserProfile, behavior: UserBehavior): number {
    let score = 0.5;
    
    const agePattern = behavior.preferencePatterns.find(p => p.feature === 'age');
    if (agePattern && Array.isArray(agePattern.preferredRange)) {
      const [minAge, maxAge] = agePattern.preferredRange as [number, number];
      if (targetUser.age >= minAge && targetUser.age <= maxAge) {
        score += 0.3 * agePattern.confidence;
      }
    }
    
    const photoQualityPattern = behavior.preferencePatterns.find(p => p.feature === 'photoQuality');
    if (photoQualityPattern && Array.isArray(photoQualityPattern.preferredRange)) {
      const quality = this.estimatePhotoQuality(targetUser);
      const [minQ, maxQ] = photoQualityPattern.preferredRange as [number, number];
      if (quality >= minQ && quality <= maxQ) {
        score += 0.2 * photoQualityPattern.confidence;
      }
    }
    
    return Math.min(score, 1);
  }

  // Ubicación con geolocalización real
  private calculateLocationCompatibility(user1: UserProfile, user2: UserProfile): number {
    // Intentar usar el campo distance si existe
    if (user2.distance) {
      const distance = parseFloat(user2.distance.replace(/[^\d.]/g, '') || '0');
      if (distance === 0) return 1;
      if (distance <= 5) return 0.9;
      if (distance <= 10) return 0.7;
      if (distance <= 25) return 0.5;
      if (distance <= 50) return 0.3;
      return 0.1;
    }
    
    // Calcular distancia real entre ubicaciones
    const coords1 = findLocationCoords(user1.location);
    const coords2 = findLocationCoords(user2.location);
    
    if (coords1 && coords2) {
      const dist = haversineDistance(coords1.lat, coords1.lng, coords2.lat, coords2.lng);
      if (dist <= 5) return 0.95;
      if (dist <= 15) return 0.8;
      if (dist <= 30) return 0.6;
      if (dist <= 60) return 0.4;
      if (dist <= 100) return 0.25;
      return 0.1;
    }
    
    // Fallback: comparación de strings
    if (user1.location && user2.location) {
      if (user1.location.toLowerCase().trim() === user2.location.toLowerCase().trim()) return 0.9;
      // Misma provincia/zona
      const zone1 = user1.location.toLowerCase().split(',')[0]?.trim();
      const zone2 = user2.location.toLowerCase().split(',')[0]?.trim();
      if (zone1 && zone2 && zone1 === zone2) return 0.7;
    }
    
    return 0.4; // Sin datos de ubicación
  }

  // ========== UTILIDADES ==========

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
    let quality = 0.5;
    if (user.images && user.images.length >= 3) quality += 0.2;
    if (user.images && user.images.length >= 5) quality += 0.1;
    if (user.isVerified) quality += 0.2;
    return Math.min(quality, 1);
  }

  private generateCompatibilityReasons(
    interests: number, lifestyle: number, communication: number,
    values: number, physical: number, location: number,
    user1: UserProfile, user2: UserProfile
  ): string[] {
    const reasons: string[] = [];
    
    if (interests > 0.7) {
      const shared = (user1.interests || []).filter(i => (user2.interests || []).includes(i));
      if (shared.length > 0) reasons.push(`Comparten intereses en ${shared.slice(0, 2).join(' y ')}`);
    }
    
    if (lifestyle > 0.7) {
      const ageDiff = Math.abs(user1.age - user2.age);
      if (ageDiff <= 3) reasons.push('Edades muy compatibles');
    }
    
    if (location > 0.8) reasons.push('Viven cerca el uno del otro');
    
    if (values > 0.7 && user1.isVerified && user2.isVerified) {
      reasons.push('Ambos tienen perfiles verificados');
    }
    
    if (reasons.length === 0) reasons.push('Potencial de buena conexión');
    
    return reasons;
  }

  // ========== PREDICCIONES DE MATCH ==========

  async generateMatchPredictions(userId: string, candidates: UserProfile[]): Promise<MatchPrediction[]> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      let user: UserProfile;
      
      if (userDoc.exists()) {
        user = { id: userDoc.id, ...userDoc.data() } as UserProfile;
      } else {
        // Intentar en colección 'perfiles'
        const perfilDoc = await getDoc(doc(db, 'perfiles', userId));
        if (!perfilDoc.exists()) {
          logger.match.warn('Usuario no encontrado en Firestore', { userId });
          return [];
        }
        user = { id: perfilDoc.id, ...perfilDoc.data() } as UserProfile;
      }
      
      if (!user.name || !user.age || !user.interests) {
        logger.match.warn('Perfil incompleto', { userId });
        return [];
      }
      
      const predictions: MatchPrediction[] = [];
      
      for (const candidate of candidates) {
        if (candidate.id === userId) continue;
        if (!candidate.name || !candidate.age || !candidate.interests) continue;
        
        const compatibility = await this.calculateCompatibility(user, candidate);
        const behavior = await this.analyzeUserBehavior(userId);
        
        const likelihoodOfMatch = this.calculateMatchLikelihood(compatibility, behavior);
        const likelihoodOfConversation = this.calculateConversationLikelihood(compatibility, behavior);
        const likelihoodOfMeeting = this.calculateMeetingLikelihood(compatibility, behavior);
        
        predictions.push({
          userId,
          targetUserId: candidate.id,
          compatibilityScore: compatibility,
          likelihoodOfMatch,
          likelihoodOfConversation,
          likelihoodOfMeeting,
          recommendationReason: `${Math.round(compatibility.overall * 100)}% compatible - ${compatibility.reasons[0]}`,
          priority: this.calculatePriority(compatibility, likelihoodOfMatch),
          timestamp: new Date()
        });
      }
      
      // Ordenar por score combinado
      predictions.sort((a, b) => {
        const scoreA = a.compatibilityScore.overall * a.likelihoodOfMatch;
        const scoreB = b.compatibilityScore.overall * b.likelihoodOfMatch;
        return scoreB - scoreA;
      });
      
      this.matchHistory.set(userId, predictions);
      logger.match.info(`${predictions.length} predicciones generadas`);
      return predictions;
    } catch (error) {
      logger.match.error('Error generando predicciones', { error });
      return [];
    }
  }

  private calculateMatchLikelihood(compatibility: CompatibilityScore, behavior: UserBehavior): number {
    let likelihood = compatibility.overall;
    
    const recentLikes = behavior.swipeHistory
      .filter(s => s.action === 'like' || s.action === 'superlike')
      .slice(-50);
    
    if (recentLikes.length > 0 && behavior.swipeHistory.length > 0) {
      const likeRate = recentLikes.length / Math.min(behavior.swipeHistory.length, 50);
      likelihood = (likelihood + likeRate) / 2;
    }
    
    return Math.min(likelihood, 0.95);
  }

  private calculateConversationLikelihood(compatibility: CompatibilityScore, behavior: UserBehavior): number {
    let likelihood = compatibility.breakdown.communication * 0.7 + compatibility.overall * 0.3;
    
    if (behavior.chatEngagement.responseRate > 0) {
      likelihood = (likelihood + behavior.chatEngagement.responseRate) / 2;
    }
    
    return Math.min(likelihood, 0.9);
  }

  private calculateMeetingLikelihood(compatibility: CompatibilityScore, behavior: UserBehavior): number {
    let likelihood = compatibility.overall * 0.5 + compatibility.breakdown.location * 0.3 + compatibility.breakdown.values * 0.2;
    
    if (behavior.chatEngagement.successfulDates > 0) {
      const meetingRate = behavior.chatEngagement.successfulDates / Math.max(behavior.chatEngagement.totalChats, 1);
      likelihood = (likelihood + meetingRate) / 2;
    }
    
    return Math.min(likelihood, 0.8);
  }

  private calculatePriority(compatibility: CompatibilityScore, matchLikelihood: number): 'high' | 'medium' | 'low' {
    const combinedScore = compatibility.overall * matchLikelihood;
    if (combinedScore >= 0.7) return 'high';
    if (combinedScore >= 0.5) return 'medium';
    return 'low';
  }

  // Obtener mejores matches
  async getBestMatches(userId: string, limit: number = 10): Promise<MatchPrediction[]> {
    return (this.matchHistory.get(userId) || []).slice(0, limit);
  }

  // Actualizar engagement
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
    // Persistir cambios de engagement
    this.saveBehaviorToFirestore(userId, behavior);
  }
}

// Instancia singleton
export const matchingAI = new MatchingAIService();
export default matchingAI;
