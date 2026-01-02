// cita-rd/hooks/useMatchingAI.ts
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { matchingAI, MatchPrediction, UserBehavior, SwipeAction, CompatibilityScore } from '../services/matchingAI';

interface UseMatchingAIReturn {
  predictions: MatchPrediction[];
  userBehavior: UserBehavior | null;
  isAnalyzing: boolean;
  error: string | null;
  
  // Funciones
  generatePredictions: (userId: string, candidates: UserProfile[]) => Promise<void>;
  recordSwipe: (userId: string, targetUserId: string, action: 'like' | 'pass' | 'superlike', targetUser: UserProfile, timeSpent: number) => Promise<void>;
  calculateCompatibility: (user1: UserProfile, user2: UserProfile) => Promise<CompatibilityScore | null>;
  getBestMatches: (userId: string, limit?: number) => Promise<MatchPrediction[]>;
  updateEngagement: (userId: string, targetUserId: string, type: 'message' | 'date' | 'ghost') => Promise<void>;
  refreshAnalysis: (userId: string) => Promise<void>;
}

export const useMatchingAI = (): UseMatchingAIReturn => {
  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generar predicciones de match
  const generatePredictions = useCallback(async (userId: string, candidates: UserProfile[]) => {
    console.log('🎯 useMatchingAI - Generando predicciones para:', userId);
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const newPredictions = await matchingAI.generateMatchPredictions(userId, candidates);
      setPredictions(newPredictions);
      
      console.log('✅ Predicciones generadas:', newPredictions.length);
    } catch (err) {
      console.error('❌ Error generando predicciones:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Registrar acción de swipe
  const recordSwipe = useCallback(async (
    userId: string, 
    targetUserId: string, 
    action: 'like' | 'pass' | 'superlike',
    targetUser: UserProfile,
    timeSpent: number
  ) => {
    console.log('📱 useMatchingAI - Registrando swipe:', action, 'en', targetUser.name);
    
    try {
      const swipeAction: SwipeAction = {
        targetUserId,
        action,
        timestamp: new Date(),
        timeSpentViewing: timeSpent,
        profileCompleteness: calculateProfileCompleteness(targetUser),
        targetUserFeatures: {
          age: targetUser.age,
          location: targetUser.location,
          education: undefined, // Se puede agregar después
          profession: targetUser.job,
          interests: targetUser.interests,
          photoQuality: estimatePhotoQuality(targetUser),
          profileCompleteness: calculateProfileCompleteness(targetUser),
          verificationStatus: targetUser.isVerified || false,
          activityLevel: 0.5, // Se puede calcular basado en última actividad
          responseRate: 0.7 // Se puede obtener de métricas reales
        }
      };
      
      await matchingAI.recordSwipeAction(userId, swipeAction);
      
      // Actualizar comportamiento del usuario
      const updatedBehavior = await matchingAI.analyzeUserBehavior(userId);
      setUserBehavior(updatedBehavior);
      
    } catch (err) {
      console.error('❌ Error registrando swipe:', err);
      setError(err instanceof Error ? err.message : 'Error registrando swipe');
    }
  }, []);

  // Calcular compatibilidad entre dos usuarios
  const calculateCompatibility = useCallback(async (user1: UserProfile, user2: UserProfile): Promise<CompatibilityScore | null> => {
    console.log('💕 useMatchingAI - Calculando compatibilidad entre:', user1.name, 'y', user2.name);
    
    try {
      const compatibility = await matchingAI.calculateCompatibility(user1, user2);
      return compatibility;
    } catch (err) {
      console.error('❌ Error calculando compatibilidad:', err);
      setError(err instanceof Error ? err.message : 'Error calculando compatibilidad');
      return null;
    }
  }, []);

  // Obtener mejores matches
  const getBestMatches = useCallback(async (userId: string, limit: number = 10): Promise<MatchPrediction[]> => {
    console.log('🏆 useMatchingAI - Obteniendo mejores matches para:', userId);
    
    try {
      const bestMatches = await matchingAI.getBestMatches(userId, limit);
      return bestMatches;
    } catch (err) {
      console.error('❌ Error obteniendo mejores matches:', err);
      setError(err instanceof Error ? err.message : 'Error obteniendo matches');
      return [];
    }
  }, []);

  // Actualizar engagement
  const updateEngagement = useCallback(async (userId: string, targetUserId: string, type: 'message' | 'date' | 'ghost') => {
    console.log('📈 useMatchingAI - Actualizando engagement:', type, 'para', userId);
    
    try {
      await matchingAI.updateUserEngagement(userId, targetUserId, type);
      
      // Actualizar comportamiento del usuario
      const updatedBehavior = await matchingAI.analyzeUserBehavior(userId);
      setUserBehavior(updatedBehavior);
      
    } catch (err) {
      console.error('❌ Error actualizando engagement:', err);
      setError(err instanceof Error ? err.message : 'Error actualizando engagement');
    }
  }, []);

  // Refrescar análisis del usuario
  const refreshAnalysis = useCallback(async (userId: string) => {
    console.log('🔄 useMatchingAI - Refrescando análisis para:', userId);
    setIsAnalyzing(true);
    
    try {
      const behavior = await matchingAI.analyzeUserBehavior(userId);
      setUserBehavior(behavior);
    } catch (err) {
      console.error('❌ Error refrescando análisis:', err);
      setError(err instanceof Error ? err.message : 'Error refrescando análisis');
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    predictions,
    userBehavior,
    isAnalyzing,
    error,
    generatePredictions,
    recordSwipe,
    calculateCompatibility,
    getBestMatches,
    updateEngagement,
    refreshAnalysis
  };
};

// Funciones auxiliares
function calculateProfileCompleteness(user: UserProfile): number {
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

function estimatePhotoQuality(user: UserProfile): number {
  let quality = 0.5;
  
  if (user.images && user.images.length >= 3) quality += 0.2;
  if (user.images && user.images.length >= 5) quality += 0.1;
  if (user.isVerified) quality += 0.2;
  
  return Math.min(quality, 1);
}

export default useMatchingAI;